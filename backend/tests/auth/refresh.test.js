const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/config/database');

describe('Auth - Refresh Token Rotation & Reuse Detection (/api/auth/refresh)', () => {
  const testUser = {
    email: `refresh_test_${Date.now()}@edusphare.test`,
    password: 'Password123!',
    firstName: 'Refresh',
    lastName: 'Tester',
  };

  let initialRefreshTokenCookie = null;

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    const cookies = loginRes.headers['set-cookie'];
    initialRefreshTokenCookie = cookies.find((c) => c.startsWith('refreshToken='));
  });

  afterAll(async () => {
    await pool.query('DELETE FROM public.users WHERE email = $1', [testUser.email.toLowerCase()]);
  });

  it('should successfully rotate refresh token and issue a new access token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', [initialRefreshTokenCookie]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.accessToken).toBeDefined();

    const newCookies = res.headers['set-cookie'];
    const newRefreshCookie = newCookies.find((c) => c.startsWith('refreshToken='));
    expect(newRefreshCookie).toBeDefined();
    expect(newRefreshCookie).not.toBe(initialRefreshTokenCookie);
  });

  it('should detect token theft on reused revoked refresh token and revoke the family', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', [initialRefreshTokenCookie]);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject refresh request with missing cookie', async () => {
    const res = await request(app).post('/api/auth/refresh');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
