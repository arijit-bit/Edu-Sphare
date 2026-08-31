const { pool } = require('../src/config/database');
const { hashPassword } = require('../src/utils/password');

async function seedDemoUsers() {
  console.log('Seeding / verifying demo users...');
  const passwordHash = await hashPassword('DemoOnly!2026');

  const demoAccounts = [
    {
      email: 'student@demo.edusphare.test',
      firstName: 'Demo',
      lastName: 'Student',
      role: 'student',
    },
    {
      email: 'teacher@demo.edusphare.test',
      firstName: 'Demo',
      lastName: 'Teacher',
      role: 'teacher',
    },
    {
      email: 'finance@demo.edusphare.test',
      firstName: 'Demo',
      lastName: 'Finance',
      role: 'finance_manager',
    },
    {
      email: 'admin@demo.edusphare.test',
      firstName: 'Demo',
      lastName: 'Admin',
      role: 'admin',
    },
  ];

  for (const acc of demoAccounts) {
    const existing = await pool.query('SELECT id FROM public.users WHERE email = $1', [acc.email]);
    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE public.users 
         SET password_hash = $1, role = $2, first_name = $3, last_name = $4, is_active = true, status = 'active' 
         WHERE email = $5`,
        [passwordHash, acc.role, acc.firstName, acc.lastName, acc.email]
      );
      console.log(`Updated demo account: ${acc.email} -> Role: ${acc.role}`);
    } else {
      await pool.query(
        `INSERT INTO public.users (email, password_hash, first_name, last_name, name, role, is_active, status)
         VALUES ($1, $2, $3, $4, $5, $6, true, 'active')`,
        [acc.email, passwordHash, acc.firstName, acc.lastName, `${acc.firstName} ${acc.lastName}`, acc.role]
      );
      console.log(`Created demo account: ${acc.email} -> Role: ${acc.role}`);
    }
  }

  const result = await pool.query(
    'SELECT id, email, first_name, last_name, role, is_active FROM public.users WHERE email LIKE $1',
    ['%@demo.edusphare.test']
  );
  console.log('\nVerified demo users in Supabase:');
  console.table(result.rows);

  await pool.end();
}

seedDemoUsers().catch(console.error);
