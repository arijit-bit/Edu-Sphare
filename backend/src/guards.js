import { hasPermission } from "./auth.js";

export function requireSession(app) {
  return async (request, reply) => {
    const session = await app.db.getSession(request.cookies[app.config.cookieName]);
    if (!session) return reply.code(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in is required." } });
    request.session = session;
  };
}

export function requirePermission(permission) {
  return async (request, reply) => {
    if (!hasPermission(request.session, permission)) return reply.code(403).send({ error: { code: "FORBIDDEN", message: "You do not have permission for this action." } });
  };
}

export function requireSchoolParam(request, reply) {
  if (request.params.schoolSlug !== request.session.slug) return reply.code(404).send({ error: { code: "NOT_FOUND", message: "School not found." } });
}
