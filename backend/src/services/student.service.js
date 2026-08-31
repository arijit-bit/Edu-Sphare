const db = require('../config/database');

class StudentService {
  async getDashboardData(userId) {
    const user = await db.query(
      'SELECT id, email, first_name, last_name, role FROM public.users WHERE id = $1',
      [userId]
    );

    return {
      message: 'Student dashboard data loaded successfully',
      user: user.rows[0] || null,
      courses: [],
      upcomingAssignments: [],
    };
  }

  async updateProfile(userId, { firstName, lastName, phone }) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (firstName) {
      fields.push(`first_name = $${idx++}`);
      values.push(firstName);
    }
    if (lastName) {
      fields.push(`last_name = $${idx++}`);
      values.push(lastName);
    }
    if (phone) {
      fields.push(`phone = $${idx++}`);
      values.push(phone);
    }

    if (fields.length === 0) {
      return { message: 'No changes provided' };
    }

    fields.push(`updated_at = now()`);
    values.push(userId);

    const updateQuery = `
      UPDATE public.users 
      SET ${fields.join(', ')} 
      WHERE id = $${idx}
      RETURNING id, email, first_name, last_name, phone, role
    `;

    const result = await db.query(updateQuery, values);
    return result.rows[0];
  }
}

module.exports = new StudentService();
