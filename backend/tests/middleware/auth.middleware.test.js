const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const { pool } = require('../../src/config/database');
const env = require('../../src/config/env');

describe('Middleware - Authentication (JWT)', () => {
  const testUser = {
    email: `jwt_test_${Date.now()}@edusphare.test`,
    password: 'Password123!',
    firstName: 'JWT',
    lastName: 'Tester',
  };

  let validAccessToken = null;
  let userId = null;

  beforeAll(async () => {
    const regRes = await request(app).post('/api/auth/register').send(testUser);
    userId = regRes.body.user.id;

    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    validAccessToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM public.users WHERE email = $1', [testUser.email.toLowerCase()]);
  });

  it('should accept valid access token and return user profile at /api/auth/me', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${validAccessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.id).toBe(userId);
    expect(res.body.user.email).toBe(testUser.email.toLowerCase());
  });

  it('should reject request when Authorization header is missing', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject malformed Bearer token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer not-a-valid-jwt-token');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject token signed with invalid / wrong secret', async () => {
    const forgedToken = jwt.sign({ sub: userId }, 'wrong_secret_key_1234567890', {
      expiresIn: '1h',
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${forgedToken}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject expired access token', async () => {
    const expiredToken = jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
      expiresIn: '-10s',
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('expired');
  });
});
