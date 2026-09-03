const { Client } = require('pg');

const connectionString = 'postgresql://postgres.xsbtrzjsdvbwoyxeehxr:rB%3Fg4.GUMbMw3hN@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

async function checkSchema() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);
    console.log("Current users columns:");
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
checkSchema();
