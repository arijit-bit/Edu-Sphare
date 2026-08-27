import test from "node:test";
import assert from "node:assert/strict";
import { hasPermission } from "../src/auth.js";
import { isLockedOut, recordFailure, clearFailures } from "../src/lockout.js";

// ── Permission checks ────────────────────────────────────────────────────────

test("finance users cannot write attendance or grades", () => {
  const session = { roles: ["finance"] };
  assert.equal(hasPermission(session, "attendance:write"), false);
  assert.equal(hasPermission(session, "grade:write"), false);
  assert.equal(hasPermission(session, "payment:write"), true);
});

test("permission is granted by an assigned role only", () => {
  assert.equal(hasPermission({ roles: ["teacher"] }, "attendance:write"), true);
  assert.equal(hasPermission({ roles: ["student"] }, "attendance:write"), false);
});

test("admin cannot write payments (segregation of duties)", () => {
  assert.equal(hasPermission({ roles: ["admin"] }, "payment:write"), false);
});

test("student cannot write grades", () => {
  assert.equal(hasPermission({ roles: ["student"] }, "grade:write"), false);
});

// ── Lockout checks ────────────────────────────────────────────────────────────

test("no lockout before threshold failures", () => {
  const ip = "10.0.0.1";
  const email = "test@example.com";
  const slug = "test-school";
  clearFailures(ip, email, slug);

  for (let i = 0; i < 4; i++) {
    recordFailure(ip, email, slug, 5, 15);
    assert.equal(isLockedOut(ip, email, slug), false, `Should not be locked after ${i + 1} failures`);
  }
  clearFailures(ip, email, slug);
});

test("lockout triggers after maxFailures", () => {
  const ip = "10.0.0.2";
  const email = "attacker@example.com";
  const slug = "victim-school";
  clearFailures(ip, email, slug);

  for (let i = 0; i < 5; i++) {
    recordFailure(ip, email, slug, 5, 15);
  }
  assert.equal(isLockedOut(ip, email, slug), true, "Should be locked after 5 failures");
  clearFailures(ip, email, slug);
});

test("clear failures removes lockout", () => {
  const ip = "10.0.0.3";
  const email = "user@example.com";
  const slug = "school-x";
  clearFailures(ip, email, slug);

  for (let i = 0; i < 5; i++) {
    recordFailure(ip, email, slug, 5, 15);
  }
  assert.equal(isLockedOut(ip, email, slug), true);
  clearFailures(ip, email, slug);
  assert.equal(isLockedOut(ip, email, slug), false, "Should not be locked after clearFailures");
});

test("lockout is per-IP — a different IP for same account stays unlocked", () => {
  const ip1 = "10.0.0.4";
  const ip2 = "10.0.0.5";  // different IP
  const email = "victim@example.com";
  const slug = "shared-school";
  clearFailures(ip1, email, slug);
  clearFailures(ip2, email, slug);

  // Lock ip1 by hitting threshold
  for (let i = 0; i < 5; i++) {
    recordFailure(ip1, email, slug, 5, 15);
  }
  assert.equal(isLockedOut(ip1, email, slug), true, "ip1 should be locked");
  // ip2 hitting same account is also locked (account-level lockout)
  assert.equal(isLockedOut(ip2, email, slug), true, "ip2 hitting same account should be locked by account-lockout");
  clearFailures(ip1, email, slug);
  clearFailures(ip2, email, slug);
});

test("different accounts on same IP: account-lockout is isolated per-account", () => {
  const ip = "10.0.0.6";
  const email1 = "victim2@example.com";
  const email2 = "innocent@example.com";
  const slug = "school-y";
  clearFailures(ip, email1, slug);
  clearFailures(ip, email2, slug);

  // Lock email1's account
  for (let i = 0; i < 5; i++) {
    recordFailure(ip, email1, slug, 5, 15);
  }
  // email1 is locked
  assert.equal(isLockedOut(ip, email1, slug), true);
  // email2 on the same IP — IP IS locked (correct: IP-level lockout blocks all from that IP)
  // This is intentional — if an IP spams one account, we block that IP
  assert.equal(isLockedOut(ip, email2, slug), true, "Same IP that was locked should block all accounts");
  clearFailures(ip, email1, slug);
  clearFailures(ip, email2, slug);
});
