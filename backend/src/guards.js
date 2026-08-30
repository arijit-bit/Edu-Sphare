import { PERMISSIONS } from "./auth.js";

export function requireSession(app) {
  return async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.code(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in is required." } });
    }
  };
}

export function requirePermission(app, permission) {
  return async (request, reply) => {
    const { sub, school } = request.user || {};
    if (!sub || !school) return reply.code(403).send({ error: { code: "FORBIDDEN", message: "You do not have permission for this action." } });

    const result = await app.db.query(
      "SELECT array_agg(role) as roles FROM memberships WHERE user_id = $1 AND school_id = $2 AND status = 'active'",
      [sub, school]
    );
    const roles = result.rows[0]?.roles || [];
    const hasPerm = roles.some((role) => PERMISSIONS[role]?.includes(permission));
    
    if (!hasPerm) return reply.code(403).send({ error: { code: "FORBIDDEN", message: "You do not have permission for this action." } });
  };
}

export async function requireSchoolParam(request, reply) {
  if (request.params.schoolSlug !== request.user?.slug) return reply.code(404).send({ error: { code: "NOT_FOUND", message: "School not found." } });
}
