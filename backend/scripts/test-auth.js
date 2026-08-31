const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/database');

async function runAuthVerification() {
  console.log('\n=============================================');
  console.log('🚀 Starting EduSphere Auth Verification Suite');
  console.log('=============================================\n');

  const timestamp = Date.now();
  const testStudent = {
    email: `student_${timestamp}@edusphare.test`,
    password: 'SecurePassword123!',
    firstName: 'Alice',
    lastName: 'Smith',
  };

  try {
    // 1. Health Check
    console.log('1. Checking /health...');
    const health = await request(app).get('/health');
    console.log(`   Status: ${health.status} (${health.body.status})`);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. Public Registration (Student)
    console.log('\n2. Testing Public Registration (Student)...');
    const regRes = await request(app)
      .post('/api/auth/register')
      .send(testStudent);
    console.log(`   Status: ${regRes.status}`);
    console.log(`   Created User:`, regRes.body.user);
    if (regRes.status !== 201 || regRes.body.user.role !== 'student') {
      throw new Error('Registration failed or role not student');
    }

    // 3. Privilege Escalation Prevention
    console.log('\n3. Testing Privilege Escalation Prevention (attempting to register as admin)...');
    const hackAttempt = await request(app)
      .post('/api/auth/register')
      .send({
        email: `fake_admin_${timestamp}@edusphare.test`,
        password: 'SecurePassword123!',
        firstName: 'Fake',
        lastName: 'Admin',
        role: 'admin', // Attack attempt
      });
    console.log(`   Assigned Role: ${hackAttempt.body.user.role} (Expected: student)`);
    if (hackAttempt.body.user.role !== 'student') {
      throw new Error('Privilege escalation vulnerability detected!');
    }

    // 4. Login (Student)
    console.log('\n4. Testing Login...');
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testStudent.email,
        password: testStudent.password,
      });
    console.log(`   Status: ${loginRes.status}`);
    console.log(`   Received AccessToken: ${loginRes.body.accessToken ? 'YES' : 'NO'}`);
    const cookies = loginRes.headers['set-cookie'];
    const refreshCookie = cookies ? cookies.find((c) => c.startsWith('refreshToken=')) : null;
    console.log(`   Received HttpOnly Refresh Cookie: ${refreshCookie ? 'YES' : 'NO'}`);
    if (loginRes.status !== 200 || !loginRes.body.accessToken || !refreshCookie) {
      throw new Error('Login failed or cookies missing');
    }

    const accessToken = loginRes.body.accessToken;

    // 5. Get Current User (/api/auth/me)
    console.log('\n5. Testing /api/auth/me with Access Token...');
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);
    console.log(`   Status: ${meRes.status}`);
    console.log(`   Current User:`, meRes.body.user);
    if (meRes.status !== 200) throw new Error('/api/auth/me failed');

    // 6. Role Authorization Matrix
    console.log('\n6. Testing RBAC Route Access...');
    const studentRoute = await request(app)
      .get('/api/student/dashboard')
      .set('Authorization', `Bearer ${accessToken}`);
    console.log(`   Student accessing /api/student/dashboard: ${studentRoute.status} (Expected: 200)`);

    const adminRoute = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${accessToken}`);
    console.log(`   Student accessing /api/admin/stats: ${adminRoute.status} (Expected: 403)`);

    if (studentRoute.status !== 200 || adminRoute.status !== 403) {
      throw new Error('RBAC route protection failed');
    }

    // 7. Refresh Token Rotation
    console.log('\n7. Testing Refresh Token Rotation...');
    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', [refreshCookie]);
    console.log(`   Status: ${refreshRes.status}`);
    console.log(`   New Access Token: ${refreshRes.body.accessToken ? 'YES' : 'NO'}`);
    const newCookies = refreshRes.headers['set-cookie'];
    const newRefreshCookie = newCookies ? newCookies.find((c) => c.startsWith('refreshToken=')) : null;
    console.log(`   New Refresh Cookie: ${newRefreshCookie ? 'YES' : 'NO'}`);
    if (refreshRes.status !== 200 || !refreshRes.body.accessToken || !newRefreshCookie) {
      throw new Error('Refresh token rotation failed');
    }

    // 8. Refresh Token Reuse / Theft Detection
    console.log('\n8. Testing Refresh Token Theft Detection (Reusing old rotated cookie)...');
    const reuseAttempt = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', [refreshCookie]); // old token
    console.log(`   Reused Old Token Status: ${reuseAttempt.status} (Expected: 401)`);
    if (reuseAttempt.status !== 401) {
      throw new Error('Refresh token reuse detection failed');
    }

    // 9. Logout
    console.log('\n9. Testing Logout...');
    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', [newRefreshCookie]);
    console.log(`   Status: ${logoutRes.status}`);
    if (logoutRes.status !== 200) throw new Error('Logout failed');

    console.log('\n=============================================');
    console.log('✅ ALL AUTHENTICATION TESTS PASSED SUCCESSFULLY');
    console.log('=============================================\n');
  } catch (err) {
    console.error('\n❌ Verification Failed:', err.message);
  } finally {
    // Cleanup test records
    await pool.query('DELETE FROM public.users WHERE email LIKE $1', ['%@edusphare.test']);
    await pool.end();
  }
}

runAuthVerification();
