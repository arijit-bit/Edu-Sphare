const { Client } = require('pg');

const connectionString = 'postgresql://postgres.xsbtrzjsdvbwoyxeehxr:rB%3Fg4.GUMbMw3hN@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

async function checkData() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    const queries = {
      Users: "SELECT COUNT(*) FROM users",
      Students: "SELECT COUNT(*) FROM users WHERE role = 'student'",
      Teachers: "SELECT COUNT(*) FROM users WHERE role = 'teacher'",
      FeeRecords: "SELECT COUNT(*) FROM fee_records",
      FeePayments: "SELECT COUNT(*) FROM fee_payments",
      SalaryPayments: "SELECT COUNT(*) FROM salary_payments",
      Expenses: "SELECT COUNT(*) FROM expenses",
      OtherIncome: "SELECT COUNT(*) FROM other_income"
    };

    console.log("Current Table Row Counts:");
    for (const [table, query] of Object.entries(queries)) {
      try {
        const res = await client.query(query);
        console.log(`- ${table}: ${res.rows[0].count}`);
      } catch (err) {
        console.log(`- ${table}: Error - ${err.message}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
checkData();
