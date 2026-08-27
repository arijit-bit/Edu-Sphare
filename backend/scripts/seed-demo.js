import { config } from "../src/config.js";
import { createDb } from "../src/db.js";
import { hashPassword } from "../src/crypto.js";

if (process.env.NODE_ENV === "production") {
  throw new Error("The demo seed is blocked in production.");
}

const appConfig = config();
const db = createDb(appConfig.databaseUrl);
const password = "DemoOnly!2026";
const accounts = [
  { email: "admin@demo.edusphare.test", name: "Demo Administrator", role: "admin" },
  { email: "finance@demo.edusphare.test", name: "Demo Finance Officer", role: "finance" },
  { email: "teacher@demo.edusphare.test", name: "Demo Teacher", role: "teacher" },
  { email: "student@demo.edusphare.test", name: "Demo Student", role: "student" },
];

try {
  const schoolResult = await db.query(
    `INSERT INTO schools (slug, name, timezone, status)
     VALUES ('demo-school', 'Edu Sphare Demo School', 'Asia/Kolkata', 'active')
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
  );
  const schoolId = schoolResult.rows[0].id;
  const passwordHash = await hashPassword(password, appConfig.passwordPepper);

  await db.withTenant(schoolId, async (client) => {
    for (const account of accounts) {
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, name, status, email_verified_at)
         VALUES ($1, $2, $3, 'active', now())
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, status = 'active'
         RETURNING id`,
        [account.email, passwordHash, account.name],
      );
      await client.query(
        `INSERT INTO memberships (school_id, user_id, role, status)
         VALUES ($1, $2, $3, 'active') ON CONFLICT (school_id, user_id, role) DO NOTHING`,
        [schoolId, userResult.rows[0].id, account.role],
      );
    }
  });
  console.log("Demo school and accounts seeded successfully.");
} finally {
  await db.close();
}
