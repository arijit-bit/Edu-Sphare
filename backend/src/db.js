import pg from "pg";
import { getSession } from "./auth.js";

export function createDb(connectionString) {
  const isSupabase = connectionString?.includes("supabase");
  // Supabase pooler uses a self-signed cert chain; rejectUnauthorized:false keeps TLS but skips strict chain validation.
  const ssl = (process.env.NODE_ENV === "production" || isSupabase) ? { rejectUnauthorized: false } : undefined;
  const pool = new pg.Pool({ connectionString, max: 15, ssl });

  async function withTenant(schoolId, callback) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SELECT set_config('app.tenant_id', $1, true)", [schoolId]);
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) { await client.query("ROLLBACK"); throw error; }
    finally { client.release(); }
  }

  const db = {
    query: (text, values) => pool.query(text, values),
    withTenant,
    getSession: (value) => getSession(db, value),
    close: () => pool.end(),
  };

  return db;
}
