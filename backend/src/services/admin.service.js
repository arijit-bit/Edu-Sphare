const db = require('../config/database');
const { hashPassword } = require('../utils/password');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

class AdminService {
  async getDashboardStats() {
    const totalUsers = await db.query('SELECT COUNT(*) FROM public.users');
    const activeUsers = await db.query('SELECT COUNT(*) FROM public.users WHERE is_active = true');
    const rolesDistribution = await db.query(
      'SELECT role, COUNT(*) as count FROM public.users GROUP BY role'
    );

    return {
      stats: {
        totalUsers: parseInt(totalUsers.rows[0].count, 10),
        activeUsers: parseInt(activeUsers.rows[0].count, 10),
        roles: rolesDistribution.rows,
      },
    };
  }

  async getAllUsers({ page = 1, limit = 20, role, search }) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let idx = 1;

    if (role) {
      conditions.push(`role = $${idx++}`);
      values.push(role);
    }

    if (search) {
      conditions.push(`(email ILIKE $${idx} OR first_name ILIKE $${idx} OR last_name ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const usersQuery = `
      SELECT id, email, first_name, middle_name, last_name, uid, class_name, monthly_fee, role, is_active, status, last_login_at, created_at
      FROM public.users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;

    values.push(limit, offset);

    const countQuery = `SELECT COUNT(*) FROM public.users ${whereClause}`;
    const countValues = values.slice(0, values.length - 2);

    const [usersResult, countResult] = await Promise.all([
      db.query(usersQuery, values),
      db.query(countQuery, countValues),
    ]);

    return {
      users: usersResult.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count, 10),
        page,
        limit,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count, 10) / limit),
      },
    };
  }

  async createUser({ email, password, firstName, middleName, lastName, className, monthlyFee, role, schoolId = '00000000-0000-0000-0000-000000000001' }) {
    const existing = await db.query('SELECT id FROM public.users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      throw ApiError.conflict('An account with this email already exists');
    }

    let actualPassword = password;
    let uid = null;

    if (role === 'student') {
      // 1. Password auto-generation
      if (!actualPassword) {
        const emailParts = email.split('@');
        if (emailParts.length === 2) {
          const namePart = emailParts[0];
          const domainPart = emailParts[1];
          const numberMatch = namePart.match(/(\d+)$/);
          const numbersBeforeAt = numberMatch ? numberMatch[1] : '';
          const nextLetterCaps = domainPart.charAt(0).toUpperCase();
          actualPassword = `${lastName.toLowerCase()}${numbersBeforeAt}@${nextLetterCaps}`;
        } else {
          actualPassword = `${lastName.toLowerCase()}123@A`;
        }
      }

      // 2. UID generation
      const schoolRes = await db.query('SELECT slug FROM public.schools WHERE id = $1', [schoolId]);
      let schoolPrefix = 'DEMO';
      if (schoolRes.rows.length > 0) {
        const slug = schoolRes.rows[0].slug.toUpperCase();
        schoolPrefix = slug.split('-')[0].substring(0, 4);
      }

      const classVal = parseInt((className || '').replace(/[^0-9]/g, ''), 10) || 10;
      const passYear = new Date().getFullYear() + (10 - classVal);
      const shortYear = passYear % 100;
      const cohortPrefix = `${shortYear}${schoolPrefix}`;

      const maxUidRes = await db.query(
        "SELECT uid FROM public.users WHERE uid LIKE $1 ORDER BY uid DESC LIMIT 1",
        [`${cohortPrefix}%`]
      );

      let seqVal = 10001;
      if (maxUidRes.rows.length > 0) {
        const lastUid = maxUidRes.rows[0].uid;
        const lastSeq = parseInt(lastUid.substring(lastUid.length - 5), 10);
        if (!isNaN(lastSeq)) {
          seqVal = lastSeq + 1;
        }
      }

      uid = `${cohortPrefix}${seqVal}`;
    }

    if (!actualPassword) {
      throw ApiError.badRequest('Password is required for non-student roles');
    }

    const passwordHash = await hashPassword(actualPassword);
    
    const fullNameParts = [firstName];
    if (middleName) fullNameParts.push(middleName);
    fullNameParts.push(lastName);
    const fullName = fullNameParts.join(' ').trim();

    const insertResult = await db.query(
      `INSERT INTO public.users (
        email, 
        password_hash, 
        first_name, 
        middle_name,
        last_name, 
        name, 
        role, 
        status, 
        is_active, 
        created_at, 
        updated_at,
        school_id,
        uid,
        class_name,
        monthly_fee
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', true, now(), now(), $8, $9, $10, $11)
      RETURNING id, email, first_name, middle_name, last_name, uid, class_name, monthly_fee, role, is_active, created_at, school_id`,
      [email, passwordHash, firstName, middleName, lastName, fullName, role, schoolId, uid, className, monthlyFee || 0]
    );

    logger.info(`Admin created user: ${email} with role: ${role}`);
    return insertResult.rows[0];
  }

  async updateUserRole(userId, newRole) {
    const result = await db.query(
      `UPDATE public.users 
       SET role = $1, updated_at = now() 
       WHERE id = $2 
       RETURNING id, email, first_name, last_name, role, is_active`,
      [newRole, userId]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('User not found');
    }

    return result.rows[0];
  }

  async updateUserStatus(userId, isActive) {
    const status = isActive ? 'active' : 'inactive';
    const result = await db.query(
      `UPDATE public.users 
       SET is_active = $1, status = $2, updated_at = now() 
       WHERE id = $3 
       RETURNING id, email, first_name, last_name, role, is_active, status`,
      [isActive, status, userId]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('User not found');
    }

    // If deactivated, revoke all refresh tokens for this user immediately
    if (!isActive) {
      await db.query(
        'UPDATE public.refresh_tokens SET revoked_at = now() WHERE user_id = $1',
        [userId]
      );
    }

    return result.rows[0];
  }
}

module.exports = new AdminService();
