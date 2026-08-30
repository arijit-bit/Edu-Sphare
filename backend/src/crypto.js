import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import bcrypt from "bcrypt";

const scrypt = promisify(scryptCallback);
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export async function hashPassword(password, pepper) {
  // Use bcrypt with a work factor of 10
  // Note: we still append the pepper before hashing for parity with existing setup
  return bcrypt.hash(`${password}${pepper}`, 10);
}

export async function verifyPassword(password, stored, pepper) {
  // Handle legacy scrypt passwords
  if (stored.startsWith("scrypt$")) {
    const [, salt, encoded] = stored.split("$");
    if (!salt || !encoded) return false;
    const expected = Buffer.from(encoded, "base64url");
    const actual = Buffer.from(await scrypt(`${password}${pepper}`, salt, expected.length, SCRYPT_OPTIONS));
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }
  
  // Verify bcrypt hash
  return bcrypt.compare(`${password}${pepper}`, stored);
}

export function newOpaqueToken() { return randomBytes(32).toString("base64url"); }
export function tokenHash(token) { return createHash("sha256").update(token).digest("hex"); }
