/**
 * In-memory brute-force lockout tracker.
 *
 * Tracks failed login attempts per IP and per account (email+schoolSlug).
 * On lockout, all attempts are rejected for `lockoutMinutes` regardless of
 * whether the password would be correct — this prevents timing-based enumeration.
 *
 * This is intentionally in-memory for simplicity. For multi-instance deployments,
 * replace with a Redis-backed store (ioredis + sliding-window counter).
 */

const ipAttempts = new Map();     // key: ip → { count, lockedUntil }
const accountAttempts = new Map(); // key: "email:schoolSlug" → { count, lockedUntil }

function getEntry(map, key) {
  if (!map.has(key)) map.set(key, { count: 0, lockedUntil: null });
  return map.get(key);
}

export function isLockedOut(ip, email, schoolSlug) {
  const now = Date.now();
  const ipEntry = getEntry(ipAttempts, ip);
  const accEntry = getEntry(accountAttempts, `${email.toLowerCase()}:${schoolSlug}`);

  if (ipEntry.lockedUntil && now < ipEntry.lockedUntil) return true;
  if (accEntry.lockedUntil && now < accEntry.lockedUntil) return true;

  // Clear expired lockouts
  if (ipEntry.lockedUntil && now >= ipEntry.lockedUntil) {
    ipEntry.count = 0;
    ipEntry.lockedUntil = null;
  }
  if (accEntry.lockedUntil && now >= accEntry.lockedUntil) {
    accEntry.count = 0;
    accEntry.lockedUntil = null;
  }

  return false;
}

export function recordFailure(ip, email, schoolSlug, maxFailures, lockoutMinutes) {
  const now = Date.now();
  const lockoutMs = lockoutMinutes * 60_000;

  const ipEntry = getEntry(ipAttempts, ip);
  ipEntry.count += 1;
  if (ipEntry.count >= maxFailures) {
    ipEntry.lockedUntil = now + lockoutMs;
  }

  const key = `${email.toLowerCase()}:${schoolSlug}`;
  const accEntry = getEntry(accountAttempts, key);
  accEntry.count += 1;
  if (accEntry.count >= maxFailures) {
    accEntry.lockedUntil = now + lockoutMs;
  }
}

export function clearFailures(ip, email, schoolSlug) {
  ipAttempts.delete(ip);
  accountAttempts.delete(`${email.toLowerCase()}:${schoolSlug}`);
}

// Evict stale entries every 10 minutes to prevent memory bloat
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of ipAttempts) {
    if (!entry.lockedUntil || now >= entry.lockedUntil) ipAttempts.delete(key);
  }
  for (const [key, entry] of accountAttempts) {
    if (!entry.lockedUntil || now >= entry.lockedUntil) accountAttempts.delete(key);
  }
}, 10 * 60_000).unref();
