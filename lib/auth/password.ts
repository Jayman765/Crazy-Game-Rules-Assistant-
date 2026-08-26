import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

/**
 * scrypt password hashing for the single shared admin password.
 *
 * Kept free of `server-only` and of any Next.js import so the
 * `npm run hash-password` CLI script can reuse it directly. It holds no
 * secrets and reads no environment variables — `lib/auth/admin.ts` is the
 * server-only wrapper that does.
 */

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
) => Promise<Buffer>;

const SCRYPT_PARAMS = { N: 16_384, r: 8, p: 1 } as const;
const KEY_LENGTH = 32;

/**
 * Format: `scrypt:N:r:p:<salt base64url>:<derived key base64url>`
 *
 * Colons and base64url (rather than `$` and standard base64) keep the value
 * safe to paste anywhere: `.env` files run through dotenv variable expansion,
 * which would eat a `$` followed by letters.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH, SCRYPT_PARAMS);
  return [
    "scrypt",
    SCRYPT_PARAMS.N,
    SCRYPT_PARAMS.r,
    SCRYPT_PARAMS.p,
    salt.toString("base64url"),
    derived.toString("base64url"),
  ].join(":");
}

export class MalformedPasswordHashError extends Error {
  constructor() {
    super(
      "ADMIN_PASSWORD_HASH is malformed. Regenerate it with `npm run hash-password`.",
    );
    this.name = "MalformedPasswordHashError";
  }
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const parts = storedHash.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") {
    throw new MalformedPasswordHashError();
  }

  const [, rawN, rawR, rawP, saltB64, hashB64] = parts;
  const options = {
    N: Number.parseInt(rawN, 10),
    r: Number.parseInt(rawR, 10),
    p: Number.parseInt(rawP, 10),
  };
  if (
    !Number.isFinite(options.N) ||
    !Number.isFinite(options.r) ||
    !Number.isFinite(options.p)
  ) {
    throw new MalformedPasswordHashError();
  }

  const expected = Buffer.from(hashB64, "base64url");
  if (expected.length === 0) {
    throw new MalformedPasswordHashError();
  }

  const actual = await scrypt(
    password,
    Buffer.from(saltB64, "base64url"),
    expected.length,
    options,
  );
  // Constant-time comparison — both buffers are the same length by construction.
  return timingSafeEqual(actual, expected);
}
