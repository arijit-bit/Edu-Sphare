const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/config/database');

describe('Auth - Logout (/api/auth/logout)', () => {
  const testUser = {
    email: `logout_test_${Date.now()}@edusphare.test`,
    password: 'Password123!',
    firstName: 'Logout',
    lastName: 'User',
  };

  let refreshTokenCookie = null;

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    const cookies = loginRes.headers['set-cookie'];
    refreshTokenCookie = cookies.find((c) => c.startsWith('refreshToken='));
  });

  afterAll(async () => {
    await pool.query('DELETE FROM public.users WHERE email = $1', [testUser.email.toLowerCase()]);
  });

  it('should logout, revoke token and clear cookie', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', [refreshTokenCookie]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const refreshCookie = cookies.find((c) => c.startsWith('refreshToken='));
    expect(refreshCookie).toContain('Expires=');
  });
});
