import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export async function hashPassword(password, pepper) {
  const salt = randomBytes(16).toString("base64url");
  const value = await scrypt(`${password}${pepper}`, salt, 64, SCRYPT_OPTIONS);
  return `scrypt$${salt}$${Buffer.from(value).toString("base64url")}`;
}

export async function verifyPassword(password, stored, pepper) {
  const [algorithm, salt, encoded] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !encoded) return false;
  const expected = Buffer.from(encoded, "base64url");
  const actual = Buffer.from(await scrypt(`${password}${pepper}`, salt, expected.length, SCRYPT_OPTIONS));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function newOpaqueToken() { return randomBytes(32).toString("base64url"); }
export function tokenHash(token) { return createHash("sha256").update(token).digest("hex"); }
