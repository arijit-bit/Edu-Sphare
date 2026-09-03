require('dotenv').config();
const { Pool } = require('pg');
const { hashPassword } = require('../src/utils/password');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const randomNames = [
  "Aarav Sharma", "Vivaan Gupta", "Aditya Singh", "Vihaan Verma", "Arjun Reddy",
  "Sai Kumar", "Ananya Das", "Saanvi Patel", "Aadhya Joshi", "Diya Kapoor",
  "Priya Nair", "Ishaan Malhotra", "Rohan Mehra", "Neha Agarwal", "Kavya Menon"
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    console.log("Fetching existing students...");
    const res = await client.query(`
      SELECT u.id, u.email, u.name, u.first_name, u.last_name, u.class_name, u.monthly_fee, s.slug 
      FROM public.users u
      JOIN public.schools s ON u.school_id = s.id
      WHERE u.role = 'student'
      ORDER BY u.created_at ASC
    `);

    const students = res.rows;
    console.log(`Found ${students.length} students to process.`);

    // To track UID sequences per cohort
    const cohortSeq = {};

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      let { id, email, first_name, last_name, class_name, slug, monthly_fee, name: fullName } = student;

      // 1. Assign random name if it's generic ("Student X" or "Demo Student")
      if (!first_name || first_name.toLowerCase().includes("student") || first_name.toLowerCase().includes("demo")) {
        const randomName = getRandomItem(randomNames);
        const nameParts = randomName.split(' ');
        first_name = nameParts[0];
        last_name = nameParts[1];
        fullName = randomName;
        console.log(`Assigning random name ${randomName} to ${email}`);
      }

      // 2. Assign class if missing
      if (!class_name) {
        class_name = Math.floor(Math.random() * 6 + 5).toString(); // Class 5 to 10
      }

      // 3. Generate Password Hash
      const emailParts = email.split('@');
      let actualPassword = '';
      if (emailParts.length === 2) {
        const namePart = emailParts[0];
        const domainPart = emailParts[1];
        const numberMatch = namePart.match(/(\d+)$/);
        const numbersBeforeAt = numberMatch ? numberMatch[1] : '';
        const nextLetterCaps = domainPart.charAt(0).toUpperCase();
        actualPassword = `${last_name.toLowerCase()}${numbersBeforeAt}@${nextLetterCaps}`;
      } else {
        actualPassword = `${last_name.toLowerCase()}123@A`;
      }
      const passwordHash = await hashPassword(actualPassword);

      // 4. Generate UID correctly (Resetting per cohort)
      const classVal = parseInt(class_name.replace(/[^0-9]/g, ''), 10) || 10;
      const passYear = new Date().getFullYear() + (10 - classVal);
      const shortYear = passYear % 100;

      let schoolPrefix = 'DEMO';
      if (slug) {
        schoolPrefix = slug.toUpperCase().split('-')[0].substring(0, 4);
      }
      const cohortPrefix = `${shortYear}${schoolPrefix}`;

      if (!cohortSeq[cohortPrefix]) {
        cohortSeq[cohortPrefix] = 10001;
      } else {
        cohortSeq[cohortPrefix]++;
      }
      const newUid = `${cohortPrefix}${cohortSeq[cohortPrefix]}`;

      // 5. Random Monthly Fee if not set or 0
      let newFee = parseFloat(monthly_fee || 0);
      if (newFee === 0) {
        newFee = (Math.floor(Math.random() * 40) * 100) + 1000; // 1000 to 5000 in steps of 100
      }

      // Update Database
      await client.query(`
        UPDATE public.users 
        SET 
          first_name = $1, 
          last_name = $2, 
          name = $3, 
          class_name = $4, 
          password_hash = $5, 
          uid = $6,
          monthly_fee = $7
        WHERE id = $8
      `, [first_name, last_name, fullName, class_name, passwordHash, newUid, newFee, id]);
    }

    await client.query('COMMIT');
    console.log("Cleanup completed successfully!");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error during cleanup:", error);
  } finally {
    client.release();
    pool.end();
  }
}

run();
