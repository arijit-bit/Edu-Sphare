import { tokenHash, verifyPassword, hashPassword, newOpaqueToken } from "./crypto.js";

export const PERMISSIONS = {
  student: ["profile:read", "grade:read", "attendance:read"],
  guardian: ["student:read", "invoice:read", "payment:create"],
  teacher: ["student:read", "attendance:write", "grade:write"],
  finance: ["invoice:read", "invoice:write", "payment:write", "payroll:write", "report:read"],
  admin: ["school:manage", "user:manage", "student:manage", "grade:approve", "attendance:approve", "report:read"],
  platform_support: ["support:access"],
};

export function hasPermission(session, permission) {
  return session.roles.some((role) => PERMISSIONS[role]?.includes(permission));
}

export async function authenticate(db, { schoolSlug, login, password, remember = false, ip, userAgent }, appConfig) {
  const schoolResult = await db.query("SELECT id, slug FROM schools WHERE slug = $1 AND status = 'active'", [schoolSlug]);
  const school = schoolResult.rows[0];
  if (!school) return null;
  return db.withTenant(school.id, async (client) => {
    const result = await client.query(
    `SELECT $1::uuid AS school_id, $2::text AS slug, u.id AS user_id, u.password_hash, u.status,
       array_agg(m.role) AS roles
     FROM memberships m
     JOIN users u ON u.id = m.user_id
     WHERE m.school_id = $1 AND lower(u.email) = lower($3) AND m.status = 'active'
     GROUP BY u.id`, [school.id, school.slug, login]
    );
  const user = result.rows[0];
  if (!user || user.status !== "active" || !(await verifyPassword(password, user.password_hash, appConfig.passwordPepper))) return null;

  // Transparently upgrade legacy scrypt passwords to bcrypt
  if (user.password_hash.startsWith("scrypt$")) {
    const newHash = await hashPassword(password, appConfig.passwordPepper);
    await client.query("UPDATE users SET password_hash = $1 WHERE id = $2", [newHash, user.user_id]);
  }

  const token = newOpaqueToken();
  const ttlDays = appConfig.refreshTokenExpiresInDays || 30;
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
  
  // Issue a new refresh token family
  const session = await client.query(
    `INSERT INTO sessions (user_id, school_id, token_hash, expires_at, ip_address, user_agent, family_id)
     VALUES ($1, $2, $3, $4, $5, $6, gen_random_uuid()) RETURNING id, family_id`,
    [user.user_id, user.school_id, tokenHash(token), expiresAt, ip, userAgent]
  );
  
  return { 
    refreshToken: `${school.id}.${session.rows[0].id}.${token}`, 
    expiresAt, 
    school: { id: user.school_id, slug: user.slug }, 
    user: { id: user.user_id, roles: user.roles } 
  };
  });
}

// getSession is now primarily used for refresh token validation/rotation
export async function getSession(db, value) {
  const [schoolId, sessionId, token] = String(value ?? "").split(".");
  if (!schoolId || !sessionId || !token) return null;
  return db.withTenant(schoolId, async (client) => {
    const result = await client.query(
      `SELECT se.id, se.user_id, se.school_id, se.family_id, se.replaced_by, se.revoked_at, s.slug, array_agg(m.role) AS roles
       FROM sessions se JOIN schools s ON s.id = se.school_id
       JOIN memberships m ON m.school_id = se.school_id AND m.user_id = se.user_id AND m.status = 'active'
       WHERE se.id = $1 AND se.token_hash = $2 AND se.expires_at > now()
       GROUP BY se.id, s.slug`, [sessionId, tokenHash(token)]
    );
    return result.rows[0] ?? null;
  });
}

// Rotates the refresh token (issues a new one, invalidates the old one)
export async function rotateRefreshToken(db, oldSessionId, familyId, schoolId, userId, ip, userAgent, appConfig) {
  return db.withTenant(schoolId, async (client) => {
    const token = newOpaqueToken();
    const ttlDays = appConfig.refreshTokenExpiresInDays || 30;
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
    
    const newSession = await client.query(
      `INSERT INTO sessions (user_id, school_id, token_hash, expires_at, ip_address, user_agent, family_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [userId, schoolId, tokenHash(token), expiresAt, ip, userAgent, familyId]
    );

    await client.query(
      `UPDATE sessions SET replaced_by = $1 WHERE id = $2`,
      [newSession.rows[0].id, oldSessionId]
    );

    return { 
      refreshToken: `${schoolId}.${newSession.rows[0].id}.${token}`,
      expiresAt
    };
  });
}

// Revokes an entire token family (used during theft detection or logout)
export async function revokeTokenFamily(db, schoolId, familyId) {
  return db.withTenant(schoolId, async (client) => {
    await client.query(
      `UPDATE sessions SET revoked_at = now() WHERE family_id = $1`,
      [familyId]
    );
  });
}
