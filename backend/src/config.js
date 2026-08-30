const required = ["DATABASE_URL", "PASSWORD_PEPPER", "JWT_ACCESS_SECRET"];

export function config() {
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  return {
    environment: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 4000),
    databaseUrl: process.env.DATABASE_URL,
    // CORS: WEB_ORIGIN supports a comma-separated list for multi-origin setups
    // e.g. "http://localhost:3000,https://edu-sphare.vercel.app"
    webOrigin: (() => {
      const raw = process.env.WEB_ORIGIN ?? "http://localhost:3000";
      const origins = raw.split(",").map((o) => o.trim()).filter(Boolean);
      return origins.length === 1 ? origins[0] : origins;
    })(),
    cookieName: process.env.SESSION_COOKIE_NAME ?? "edu_sphare_session",
    sessionTtlHours: Number(process.env.SESSION_TTL_HOURS ?? 12),
    rememberSessionTtlHours: Number(process.env.REMEMBER_SESSION_TTL_HOURS ?? 720),
    passwordPepper: process.env.PASSWORD_PEPPER,

    // Rate limiting
    rateLimitLoginMax: Number(process.env.RATE_LIMIT_LOGIN_MAX ?? 10),       // per window
    rateLimitLoginWindowMs: Number(process.env.RATE_LIMIT_LOGIN_WINDOW_MS ?? 60_000), // 1 min
    rateLimitGlobalMax: Number(process.env.RATE_LIMIT_GLOBAL_MAX ?? 200),
    rateLimitGlobalWindowMs: Number(process.env.RATE_LIMIT_GLOBAL_WINDOW_MS ?? 60_000),

    // Login lockout
    loginMaxFailures: Number(process.env.LOGIN_MAX_FAILURES ?? 5),
    loginLockoutMinutes: Number(process.env.LOGIN_LOCKOUT_MINUTES ?? 15),

    // CSRF
    csrfSecret: process.env.CSRF_SECRET,   // optional in dev; required in prod

    // JWT Auth
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtIssuer: process.env.JWT_ISSUER ?? "edu-sphare",
    jwtAudience: process.env.JWT_AUDIENCE ?? "edu-sphare-clients",
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m",
    refreshTokenExpiresInDays: Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS ?? 30),
  };
}
