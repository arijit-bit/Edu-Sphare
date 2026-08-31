const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/config/database');

describe('Auth - Login (/api/auth/login)', () => {
  const loginUser = {
    email: `login_test_${Date.now()}@edusphare.test`,
    password: 'CorrectPassword123!',
    firstName: 'Login',
    lastName: 'User',
  };

  beforeAll(async () => {
    await request(app)
      .post('/api/auth/register')
      .send(loginUser);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM public.users WHERE email = $1', [loginUser.email.toLowerCase()]);
  });

  it('should successfully log in with valid credentials and return JWT & HttpOnly cookie', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: loginUser.email,
        password: loginUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(loginUser.email.toLowerCase());

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const refreshCookie = cookies.find((c) => c.startsWith('refreshToken='));
    expect(refreshCookie).toBeDefined();
    expect(refreshCookie).toContain('HttpOnly');
  });

  it('should reject login with incorrect password with generic error message', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: loginUser.email,
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('should reject login with non-existent email with identical generic error message (prevent account enumeration)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'does_not_exist@edusphare.test',
        password: 'SomePassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid email or password');
  });
});
