import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import csrf from "@fastify/csrf-protection";
import fjwt from "@fastify/jwt";
import { z } from "zod";
import { config } from "./config.js";
import { createDb } from "./db.js";
import { authenticate, rotateRefreshToken, revokeTokenFamily } from "./auth.js";
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

// ── JWT ───────────────────────────────────────────────────────────────────────
await app.register(fjwt, {
  secret: appConfig.jwtAccessSecret,
  cookie: {
    cookieName: "access_token",
    signed: false, // Don't sign JWT cookie with @fastify/cookie since JWT is already cryptographically signed
  },
  sign: {
    issuer: appConfig.jwtIssuer,
    audience: appConfig.jwtAudience,
    expiresIn: appConfig.accessTokenExpiresIn,
  },
  verify: {
    issuer: appConfig.jwtIssuer,
    audience: appConfig.jwtAudience,
  },
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
    sameSite: isProd ? "none" : "lax",
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
    { schoolSlug, login, password, remember, ip, userAgent: request.headers["user-agent"], logger: request.log },
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

  // ⑥ Generate Access JWT
  const jwtPayload = {
    sub: session.user.id,
    school: session.school.id,
    slug: session.school.slug,
  };
  const accessToken = await reply.jwtSign(jwtPayload);

  // ⑦ Set Cookies
  const cookieOpts = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  };

  reply.setCookie("access_token", accessToken, cookieOpts);
  reply.setCookie("refresh_token", session.refreshToken, {
    ...cookieOpts,
    expires: session.expiresAt,
    signed: true, // Use fastify-cookie signature for the opaque token
  });

  return reply.send({
    data: {
      schoolSlug: session.school.slug,
      userId: session.user.id,
      roles: session.user.roles,
    },
  });
});

// ── Refresh Token ─────────────────────────────────────────────────────────────
app.post("/v1/auth/refresh", async (request, reply) => {
  const signedRefreshToken = request.cookies["refresh_token"];
  if (!signedRefreshToken) return reply.code(401).send({ error: { code: "UNAUTHENTICATED", message: "No refresh token provided." } });

  const result = reply.unsignCookie(signedRefreshToken);
  if (!result.valid || !result.value) return reply.code(401).send({ error: { code: "UNAUTHENTICATED", message: "Invalid refresh token signature." } });

  const session = await app.db.getSession(result.value);
  if (!session) return reply.code(401).send({ error: { code: "UNAUTHENTICATED", message: "Invalid or expired session." } });

  // Theft / reuse detection
  if (session.replaced_by || session.revoked_at) {
    await revokeTokenFamily(app.db, session.school_id, session.family_id);
    request.log.warn({ event: "token_reuse_detected", familyId: session.family_id }, "Revoked compromised token family");
    reply.clearCookie("access_token", { path: "/" });
    reply.clearCookie("refresh_token", { path: "/" });
    return reply.code(401).send({ error: { code: "UNAUTHENTICATED", message: "Session compromised and revoked." } });
  }

  // Rotate refresh token
  const newSession = await rotateRefreshToken(
    app.db,
    session.id,
    session.family_id,
    session.school_id,
    session.user_id,
    request.ip,
    request.headers["user-agent"],
    appConfig
  );

  // Generate new Access JWT
  const jwtPayload = {
    sub: session.user_id,
    school: session.school_id,
    slug: session.slug,
  };
  const accessToken = await reply.jwtSign(jwtPayload);

  const cookieOpts = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  };

  reply.setCookie("access_token", accessToken, cookieOpts);
  reply.setCookie("refresh_token", newSession.refreshToken, {
    ...cookieOpts,
    expires: newSession.expiresAt,
    signed: true,
  });

  return reply.code(200).send({ data: { refreshed: true } });
});

// ── Logout ────────────────────────────────────────────────────────────────────
app.post("/v1/auth/logout", async (request, reply) => {
  // If we have a refresh token, revoke its family to be safe
  const signedRefreshToken = request.cookies["refresh_token"];
  if (signedRefreshToken) {
    const result = reply.unsignCookie(signedRefreshToken);
    if (result.valid && result.value) {
      const session = await app.db.getSession(result.value);
      if (session) {
        await revokeTokenFamily(app.db, session.school_id, session.family_id);
      }
    }
  }

  const cookieOpts = { path: "/", secure: isProd, sameSite: isProd ? "none" : "lax" };
  reply.clearCookie("access_token", cookieOpts);
  reply.clearCookie("refresh_token", cookieOpts);
  
  return reply.code(204).send();
});

// ── Current user ──────────────────────────────────────────────────────────────
app.get(
  "/v1/schools/:schoolSlug/me",
  { preHandler: [requireSession(app), requireSchoolParam] },
  async (request) => ({
    data: {
      userId: request.user.sub,
      schoolSlug: request.user.slug,
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
