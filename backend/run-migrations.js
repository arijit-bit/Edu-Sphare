const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres.xsbtrzjsdvbwoyxeehxr:rB%3Fg4.GUMbMw3hN@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

const migrationFiles = [
  '002_schools_schema.sql',
  '003_user_extensions.sql',
  '004_academic_years.sql',
  '005_fee_structures.sql',
  '006_fee_records.sql',
  '007_fee_payments.sql',
  '008_salary_structures.sql',
  '009_salary_payments.sql',
  '010_expenses.sql',
  '011_other_income.sql',
  '012_finance_reports.sql',
  '013_finance_settings.sql',
  '014_audit_log.sql',
  '015_rls_policies.sql'
];

async function runMigrations() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to database.');

    for (const file of migrationFiles) {
      const filePath = path.join(__dirname, 'migrations', file);
      console.log(`Running migration: ${file}...`);
      
      const sql = fs.readFileSync(filePath, 'utf8');
      
      try {
        await client.query(sql);
        console.log(`✅ Success: ${file}`);
      } catch (err) {
        console.error(`❌ Error in ${file}:`, err.message);
        // Break on first error
        process.exit(1);
      }
    }
    
    console.log('All migrations completed successfully.');
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await client.end();
  }
}

runMigrations();
