const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/config/database');

describe('Auth - Registration (/api/auth/register)', () => {
  const testEmail = `test_student_${Date.now()}@edusphare.test`;

  afterAll(async () => {
    await pool.query('DELETE FROM public.users WHERE email LIKE $1', ['%@edusphare.test']);
  });

  it('should successfully register a student user with valid inputs', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: 'StrongPassword123!',
        firstName: 'Jane',
        lastName: 'Doe',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testEmail.toLowerCase());
    expect(res.body.user.role).toBe('student');
    expect(res.body.user.password_hash).toBeUndefined();
  });

  it('should reject registration if email is already taken', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: 'AnotherPassword123!',
        firstName: 'Duplicate',
        lastName: 'User',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should reject registration with invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email-format',
        password: 'StrongPassword123!',
        firstName: 'Jane',
        lastName: 'Doe',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject registration with weak password (under 8 chars)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: `short_pw_${Date.now()}@edusphare.test`,
        password: 'short',
        firstName: 'Jane',
        lastName: 'Doe',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should ignore client-supplied role and force role to student (prevent privilege escalation)', async () => {
    const adminAttemptEmail = `escalation_${Date.now()}@edusphare.test`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: adminAttemptEmail,
        password: 'StrongPassword123!',
        firstName: 'Hacker',
        lastName: 'Admin',
        role: 'admin',
      });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('student');
  });
});
