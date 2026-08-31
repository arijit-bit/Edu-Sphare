const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/config/database');
const { hashPassword } = require('../../src/utils/password');

describe('Middleware - Role-Based Access Control (RBAC)', () => {
  let studentToken, teacherToken, financeToken, adminToken;

  const users = {
    student: { email: `rb_student_${Date.now()}@edusphare.test`, role: 'student' },
    teacher: { email: `rb_teacher_${Date.now()}@edusphare.test`, role: 'teacher' },
    finance: { email: `rb_finance_${Date.now()}@edusphare.test`, role: 'finance_manager' },
    admin: { email: `rb_admin_${Date.now()}@edusphare.test`, role: 'admin' },
  };

  beforeAll(async () => {
    const passwordHash = await hashPassword('Password123!');

    // Seed users directly into DB with specific roles for testing
    for (const [key, user] of Object.entries(users)) {
      const res = await pool.query(
        `INSERT INTO public.users (email, password_hash, first_name, last_name, name, role, status, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, 'active', true)
         RETURNING id`,
        [user.email, passwordHash, key, 'Test', `${key} Test`, user.role]
      );
      user.id = res.rows[0].id;

      // Login to obtain JWT
      const loginRes = await request(app).post('/api/auth/login').send({
        email: user.email,
        password: 'Password123!',
      });
      user.token = loginRes.body.accessToken;
    }

    studentToken = users.student.token;
    teacherToken = users.teacher.token;
    financeToken = users.finance.token;
    adminToken = users.admin.token;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM public.users WHERE email LIKE $1', ['%@edusphare.test']);
  });

  describe('Student Role Permissions', () => {
    it('student can access student dashboard', async () => {
      const res = await request(app)
        .get('/api/student/dashboard')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('student CANNOT access teacher routes (403)', async () => {
      const res = await request(app)
        .get('/api/teacher/dashboard')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('student CANNOT access finance routes (403)', async () => {
      const res = await request(app)
        .get('/api/finance/dashboard')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('student CANNOT access admin routes (403)', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Teacher Role Permissions', () => {
    it('teacher can access teacher dashboard', async () => {
      const res = await request(app)
        .get('/api/teacher/dashboard')
        .set('Authorization', `Bearer ${teacherToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('teacher CANNOT access admin routes (403)', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${teacherToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Finance Manager Role Permissions', () => {
    it('finance manager can access finance dashboard', async () => {
      const res = await request(app)
        .get('/api/finance/dashboard')
        .set('Authorization', `Bearer ${financeToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('finance manager CANNOT access admin routes (403)', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${financeToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Admin Role Permissions', () => {
    it('admin can access admin routes', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('admin can create users with any role (POST /api/admin/users)', async () => {
      const newTeacherEmail = `admin_created_${Date.now()}@edusphare.test`;
      const res = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: newTeacherEmail,
          password: 'Password123!',
          firstName: 'New',
          lastName: 'Teacher',
          role: 'teacher',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('teacher');
    });
  });
});
