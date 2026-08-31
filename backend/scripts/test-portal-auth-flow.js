/**
 * Comprehensive Portal Authentication & RBAC Verification Script
 */
const BASE_URL = process.env.API_URL || 'http://localhost:4000';

async function runTest() {
  console.log('🚀 Starting EduSphere Portal-Based Auth & RBAC Verification...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Student Login & Permissions Test
  console.log('--- 1. Testing Student Account & RBAC ---');
  let studentRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student@demo.edusphare.test', password: 'DemoOnly!2026' }),
  });
  let studentData = await studentRes.json();
  assert(studentRes.status === 200, 'Student login returned 200 OK');
  assert(studentData.user.role === 'student', 'User role is student');
  const studentToken = studentData.accessToken;

  // Student -> Student API
  let sToS = await fetch(`${BASE_URL}/api/student/dashboard`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(sToS.status === 200, 'Student JWT -> GET /api/student/dashboard returns 200');

  // Student -> Admin API
  let sToA = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(sToA.status === 403, 'Student JWT -> GET /api/admin/dashboard returns 403 Forbidden');

  // Student -> Finance API
  let sToF = await fetch(`${BASE_URL}/api/finance/dashboard`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(sToF.status === 403, 'Student JWT -> GET /api/finance/dashboard returns 403 Forbidden');

  // 2. Teacher Login & Permissions Test
  console.log('\n--- 2. Testing Teacher Account & RBAC ---');
  let teacherRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'teacher@demo.edusphare.test', password: 'DemoOnly!2026' }),
  });
  let teacherData = await teacherRes.json();
  assert(teacherRes.status === 200, 'Teacher login returned 200 OK');
  assert(teacherData.user.role === 'teacher', 'User role is teacher');
  const teacherToken = teacherData.accessToken;

  // Teacher -> Teacher API
  let tToT = await fetch(`${BASE_URL}/api/teacher/dashboard`, {
    headers: { Authorization: `Bearer ${teacherToken}` },
  });
  assert(tToT.status === 200, 'Teacher JWT -> GET /api/teacher/dashboard returns 200');

  // Teacher -> Admin API
  let tToA = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${teacherToken}` },
  });
  assert(tToA.status === 403, 'Teacher JWT -> GET /api/admin/dashboard returns 403 Forbidden');

  // 3. Finance Manager Login & Permissions Test
  console.log('\n--- 3. Testing Finance Manager Account & RBAC ---');
  let financeRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'finance@demo.edusphare.test', password: 'DemoOnly!2026' }),
  });
  let financeData = await financeRes.json();
  assert(financeRes.status === 200, 'Finance login returned 200 OK');
  assert(financeData.user.role === 'finance_manager', 'User role is finance_manager');
  const financeToken = financeData.accessToken;

  // Finance -> Finance API
  let fToF = await fetch(`${BASE_URL}/api/finance/dashboard`, {
    headers: { Authorization: `Bearer ${financeToken}` },
  });
  assert(fToF.status === 200, 'Finance JWT -> GET /api/finance/dashboard returns 200');

  // Finance -> Admin API
  let fToA = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${financeToken}` },
  });
  assert(fToA.status === 403, 'Finance JWT -> GET /api/admin/dashboard returns 403 Forbidden');

  // 4. Admin Login & Permissions Test
  console.log('\n--- 4. Testing Admin Account & RBAC ---');
  let adminRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@demo.edusphare.test', password: 'DemoOnly!2026' }),
  });
  let adminData = await adminRes.json();
  assert(adminRes.status === 200, 'Admin login returned 200 OK');
  assert(adminData.user.role === 'admin', 'User role is admin');
  const adminToken = adminData.accessToken;

  // Admin -> Admin API
  let aToA = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(aToA.status === 200, 'Admin JWT -> GET /api/admin/dashboard returns 200');

  // Admin -> Student API (Admin has supervisor role)
  let aToS = await fetch(`${BASE_URL}/api/student/dashboard`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(aToS.status === 200, 'Admin JWT -> GET /api/student/dashboard returns 200');

  // 5. Invalid Credentials Test
  console.log('\n--- 5. Testing Invalid Credentials ---');
  let badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student@demo.edusphare.test', password: 'WrongPassword!' }),
  });
  assert(badLoginRes.status === 401, 'Invalid password returns 401');

  // 6. Token Refresh Rotation & Cookie Test
  console.log('\n--- 6. Testing Token Refresh & Logout Flow ---');
  const cookieHeader = adminRes.headers.get('set-cookie');
  assert(!!cookieHeader && cookieHeader.includes('refreshToken='), 'Login sets HttpOnly refreshToken cookie');

  const matchCookie = cookieHeader ? cookieHeader.split(';')[0] : '';
  let refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: matchCookie,
    },
  });
  let refreshData = await refreshRes.json();
  assert(refreshRes.status === 200, 'Refresh endpoint with cookie returns 200 OK');
  assert(!!refreshData.accessToken, 'Refresh endpoint issues new accessToken');

  // Logout
  const newCookieHeader = refreshRes.headers.get('set-cookie') || cookieHeader;
  const newCookie = newCookieHeader ? newCookieHeader.split(';')[0] : matchCookie;
  let logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: newCookie,
    },
  });
  assert(logoutRes.status === 200, 'Logout endpoint returns 200 OK');

  // Try to use revoked refresh token
  let revokedRefreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: newCookie,
    },
  });
  assert(revokedRefreshRes.status === 401, 'Revoked refresh token correctly rejected with 401');

  console.log(`\n========================================`);
  console.log(`Total tests passed: ${passed} | Failed: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTest().catch((err) => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
