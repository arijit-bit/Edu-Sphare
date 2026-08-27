import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import csrf from "@fastify/csrf-protection";
import { z } from "zod";
import { config } from "./config.js";
import { createDb } from "./db.js";
import { authenticate } from "./auth.js";
import { requirePermission, requireSchoolParam, requireSession } from "./guards.js";
import { isLockedOut, recordFailure, clearFailures } from "./lockout.js";

const appConfig = config();
const isProd = appConfig.environment === "production";

// ── Fastify instance ──────────────────────────────────────────────────────────
const app = Fastify({
  trustProxy: true,
  // Scrub PII from logs: never log request body (contains passwords), never log
  // response body, and redact the session cookie from request headers.
  logger: {
    level: isProd ? "info" : "debug",
    redact: {
      paths: [
        "req.headers.cookie",
        "req.headers.authorization",
        "req.body.password",
        "req.body.token",
      ],
      censor: "[REDACTED]",
    },
  },
  // Attach a unique request-id to every request for traceability
  genReqId: () => crypto.randomUUID(),
});

// ── Decorate ──────────────────────────────────────────────────────────────────
app.decorate("config", appConfig);
app.decorate("db", createDb(appConfig.databaseUrl));

// ── Security headers (helmet) ─────────────────────────────────────────────────
// Sets: X-DNS-Prefetch-Control, X-Frame-Options, X-Content-Type-Options,
//       X-Permitted-Cross-Domain-Policies, Referrer-Policy, HSTS (prod only)
await app.register(helmet, {
  // HSTS: only in production (dev uses HTTP)
  hsts: isProd ? { maxAge: 31_536_000, includeSubDomains: true, preload: true } : false,
  // CSP is handled by Next.js for HTML pages; the API only serves JSON.
  // Set a strict deny-all CSP on API responses to prevent any HTML rendering.
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // not needed for pure JSON API
});

// ── CORS ──────────────────────────────────────────────────────────────────────
await app.register(cors, {
  origin: appConfig.webOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-csrf-token"],
});

// ── Cookie ────────────────────────────────────────────────────────────────────
await app.register(cookie, {
  secret: appConfig.passwordPepper, // sign cookies with pepper (reuses existing secret)
});

// ── Global rate limit ─────────────────────────────────────────────────────────
// Protects all routes from DDoS / scraping. Per-route stricter limits below.
await app.register(rateLimit, {
  global: true,
  max: appConfig.rateLimitGlobalMax,           // default: 200 req/min
  timeWindow: appConfig.rateLimitGlobalWindowMs,
  keyGenerator: (request) => request.ip,
});

// ── CSRF protection ───────────────────────────────────────────────────────────
// Uses the Double-Submit Cookie pattern. GET/HEAD/OPTIONS are exempt.
// Mutating routes must include the X-CSRF-Token header.
await app.register(csrf, {
  cookieOpts: {
    httpOnly: false,   // must be readable by JS to submit in header
    secure: isProd,
    sameSite: "lax",
    path: "/",
  },
  getToken: (request) => request.headers["x-csrf-token"],
});

// ── Add X-Request-Id to every response ───────────────────────────────────────
app.addHook("onSend", async (request, reply) => {
  reply.header("X-Request-Id", request.id);
});

// ─────────────────────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────────────────────

// ── Health check (no auth, no rate limit override) ────────────────────────────
app.get("/health", async () => ({ status: "ok" }));

// ── CSRF token endpoint (used by the frontend to fetch a token) ───────────────
app.get("/v1/csrf-token", async (request, reply) => {
  // generateCsrf() sets the __Host-csrf cookie and returns the HMAC token string
  const token = await reply.generateCsrf();
  return reply.send({ csrfToken: token });
});

// ── Login ─────────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  schoolSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  login: z.string().email().max(320),
  password: z.string().min(8).max(256),
  remember: z.boolean().default(false),
});

app.post("/v1/auth/login", {
  config: {
    rateLimit: {
      max: appConfig.rateLimitLoginMax,           // default: 10 req/min
      timeWindow: appConfig.rateLimitLoginWindowMs,
    },
  },
}, async (request, reply) => {
  // ① Validate shape
  const body = loginSchema.safeParse(request.body);
  if (!body.success) {
    return reply.code(422).send({
      error: { code: "VALIDATION_ERROR", message: "Invalid sign-in details." },
    });
  }

  const { schoolSlug, login, password, remember } = body.data;
  const ip = request.ip;

  // ② Check brute-force lockout (per-IP and per-account)
  if (isLockedOut(ip, login, schoolSlug)) {
    // Log security event (no PII in message)
    request.log.warn({ event: "login_locked_out", ip, schoolSlug }, "Login blocked — lockout active");
    // Return generic error — do not reveal lockout state to attacker
    return reply.code(401).send({
      error: { code: "INVALID_CREDENTIALS", message: "Invalid sign-in details." },
    });
  }

  // ③ Attempt authentication
  const session = await authenticate(
    app.db,
    { schoolSlug, login, password, remember, ip, userAgent: request.headers["user-agent"] },
    appConfig,
  );

  // ④ Failed login: record failure, check for lockout
  if (!session) {
    recordFailure(ip, login, schoolSlug, appConfig.loginMaxFailures, appConfig.loginLockoutMinutes);
    request.log.warn({ event: "login_failed", ip, schoolSlug }, "Failed login attempt");
    return reply.code(401).send({
      error: { code: "INVALID_CREDENTIALS", message: "Invalid sign-in details." },
    });
  }

  // ⑤ Success: clear failure counter
  clearFailures(ip, login, schoolSlug);
  request.log.info({ event: "login_success", schoolSlug, userId: session.user.id }, "Login successful");

  reply.setCookie(appConfig.cookieName, session.token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    expires: session.expiresAt,
  });

  return reply.send({
    data: {
      schoolSlug: session.school.slug,
      userId: session.user.id,
      roles: session.user.roles,
    },
  });
});

// ── Logout ────────────────────────────────────────────────────────────────────
app.post("/v1/auth/logout", { preHandler: requireSession(app) }, async (request, reply) => {
  await app.db.query("UPDATE sessions SET revoked_at = now() WHERE id = $1", [request.session.id]);
  reply.clearCookie(appConfig.cookieName, { path: "/" });
  request.log.info({ event: "logout", userId: request.session.user_id }, "User logged out");
  return reply.code(204).send();
});

// ── Current user ──────────────────────────────────────────────────────────────
app.get(
  "/v1/schools/:schoolSlug/me",
  { preHandler: [requireSession(app), requireSchoolParam] },
  async (request) => ({
    data: {
      userId: request.session.user_id,
      schoolSlug: request.session.slug,
      roles: request.session.roles,
    },
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// Error handler — never leak internal details or stack traces
// ─────────────────────────────────────────────────────────────────────────────
app.setErrorHandler((error, request, reply) => {
  const statusCode = error.statusCode ?? 500;

  // Log full error internally (server-side only)
  if (statusCode === 429) {
    request.log.warn({ err: error, requestId: request.id }, "Rate limit exceeded");
  } else {
    request.log.error({ err: error, requestId: request.id }, "Unhandled error");
  }

  // Send generic response to client — no stack trace, no internal message
  reply.code(statusCode).send({
    error: {
      code: statusCode === 429 ? "TOO_MANY_REQUESTS" : "INTERNAL_ERROR",
      message: statusCode === 429
        ? "Too many requests. Please slow down and try again in a minute."
        : "An unexpected error occurred.",
      requestId: request.id, // safe to expose — useful for support
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Startup
// ─────────────────────────────────────────────────────────────────────────────
app.addHook("onClose", async () => app.db.close());
await app.listen({ port: appConfig.port, host: "0.0.0.0" });
