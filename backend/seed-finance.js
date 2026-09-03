const { Client } = require('pg');
const fs = require('fs');

const connectionString = 'postgresql://postgres.xsbtrzjsdvbwoyxeehxr:rB%3Fg4.GUMbMw3hN@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

async function seed() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log("Connected to database...");

    const schoolId = '00000000-0000-0000-0000-000000000001';

    console.log("Cleaning up old dummy data...");
    await client.query(`DELETE FROM public.expenses WHERE school_id = $1`, [schoolId]);
    await client.query(`DELETE FROM public.other_income WHERE school_id = $1`, [schoolId]);
    await client.query(`DELETE FROM public.salary_structures WHERE school_id = $1`, [schoolId]);
    await client.query(`DELETE FROM public.fee_structures WHERE school_id = $1`, [schoolId]);
    await client.query(`DELETE FROM public.users WHERE email LIKE '%@test.com'`);

    // 1. Ensure 10 Students and 5 Teachers exist
    console.log("Seeding Users...");
    const students = [];
    for (let i = 1; i <= 10; i++) {
      const email = `student${i}_${Date.now()}@test.com`;
      const res = await client.query(`
        INSERT INTO public.users (name, email, password_hash, role, school_id)
        VALUES ($1, $2, 'hashed_password_dummy', 'student', $3)
        RETURNING id;
      `, [`Student ${i}`, email, schoolId]);
      students.push(res.rows[0].id);
    }

    const teachers = [];
    for (let i = 1; i <= 5; i++) {
      const email = `teacher${i}_${Date.now()}@test.com`;
      const res = await client.query(`
        INSERT INTO public.users (name, email, password_hash, role, school_id)
        VALUES ($1, $2, 'hashed_password_dummy', 'teacher', $3)
        RETURNING id;
      `, [`Teacher ${i}`, email, schoolId]);
      teachers.push(res.rows[0].id);
    }

    // 2. Academic Year
    console.log("Fetching Active Academic Year...");
    let yearRes = await client.query(`
      SELECT id FROM public.academic_years WHERE is_active = true AND school_id = $1 LIMIT 1;
    `, [schoolId]);
    
    if (yearRes.rows.length === 0) {
      console.log("No active academic year found. Creating one...");
      yearRes = await client.query(`
        INSERT INTO public.academic_years (school_id, name, starts_on, ends_on, status, label, start_date, end_date, is_active)
        VALUES ($1, '2025-2026', '2025-04-01', '2026-03-31', 'active', '2025-2026', '2025-04-01', '2026-03-31', true)
        RETURNING id;
      `, [schoolId]);
    }
    const academicYearId = yearRes.rows[0].id;

    // 3. Fee Structures
    console.log("Seeding Fee Structures...");
    const classNames = ['Class 8', 'Class 9', 'Class 10'];
    const feeStructures = [];
    for (const [index, c] of classNames.entries()) {
      const amount = 10000 + (index * 2000); // 10k, 12k, 14k
      const res = await client.query(`
        INSERT INTO public.fee_structures (school_id, academic_year_id, class_name, fee_type, amount, frequency)
        VALUES ($1, $2, $3, 'tuition', $4, 'monthly')
        RETURNING id, amount;
      `, [schoolId, academicYearId, c, amount]);
      feeStructures.push(res.rows[0]);
    }

    // 4. Salary Structures
    console.log("Seeding Salary Structures...");
    const salaryStructures = [];
    for (const teacherId of teachers) {
      const basic = 40000 + Math.floor(Math.random() * 20000);
      const res = await client.query(`
        INSERT INTO public.salary_structures (school_id, employee_id, academic_year_id, basic_salary, hra, da, pf_employee, effective_from)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING id, basic_salary, hra, da, pf_employee;
      `, [schoolId, teacherId, academicYearId, basic, basic * 0.2, basic * 0.1, basic * 0.05]);
      salaryStructures.push({ userId: teacherId, ...res.rows[0] });
    }

    // 5. Monthly Records (Last 4 months)
    const months = ['2026-01-01', '2026-02-01', '2026-03-01', '2026-04-01'];
    console.log("Seeding Monthly Fee Records and Payments...");

    for (const [sIdx, studentId] of students.entries()) {
      const struct = feeStructures[sIdx % feeStructures.length];
      
      for (const month of months) {
        const isPaid = Math.random() > 0.2;
        const paidAmount = isPaid ? struct.amount : 0;
        const status = isPaid ? 'paid' : 'pending';

        const recRes = await client.query(`
          INSERT INTO public.fee_records (school_id, academic_year_id, student_id, fee_structure_id, fee_month, fee_amount, amount_paid, status, due_date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $5::DATE + INTERVAL '10 days')
          RETURNING id;
        `, [schoolId, academicYearId, studentId, struct.id, month, struct.amount, paidAmount, status]);

        if (isPaid) {
          // The trigger will auto-update the status and amount_paid
          await client.query(`
            INSERT INTO public.fee_payments (school_id, fee_record_id, student_id, amount, payment_mode, payment_date)
            VALUES ($1, $2, $3, $4, 'online', NOW() - (random() * interval '30 days'))
          `, [schoolId, recRes.rows[0].id, studentId, paidAmount]);
        }
      }
    }

    console.log("Seeding Salary Payments...");
    for (const salStruct of salaryStructures) {
      for (const month of months) {
        await client.query(`
          INSERT INTO public.salary_payments (school_id, employee_id, salary_structure_id, pay_month, basic_salary, allowances, total_deductions, status, payment_date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid', NOW() - (random() * interval '30 days'))
        `, [schoolId, salStruct.userId, salStruct.id, month, salStruct.basic_salary, Number(salStruct.hra) + Number(salStruct.da), salStruct.pf_employee]);
      }
    }

    console.log("Seeding Expenses...");
    const expenseCategories = ['electricity', 'maintenance', 'miscellaneous', 'internet', 'stationery'];
    for (let i = 0; i < 20; i++) {
      const cat = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      const amt = 2000 + Math.floor(Math.random() * 8000);
      await client.query(`
        INSERT INTO public.expenses (school_id, academic_year_id, category, description, amount, expense_date, recorded_by)
        VALUES ($1, $2, $3, 'Monthly bill', $4, NOW() - (random() * interval '120 days'), $5)
      `, [schoolId, academicYearId, cat, amt, teachers[0]]);
    }

    console.log("Seeding Other Income...");
    const incomeCategories = ['hostel', 'admission', 'donation', 'events'];
    for (let i = 0; i < 15; i++) {
      const cat = incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
      const amt = 5000 + Math.floor(Math.random() * 15000);
      await client.query(`
        INSERT INTO public.other_income (school_id, academic_year_id, category, description, amount, income_date, recorded_by)
        VALUES ($1, $2, $3, 'Misc Income', $4, NOW() - (random() * interval '120 days'), $5)
      `, [schoolId, academicYearId, cat, amt, teachers[0]]);
    }

    console.log("✅ Database successfully seeded with dummy data!");

  } catch (err) {
    console.error("❌ Seed Error:", err);
  } finally {
    await client.end();
  }
}

seed();
