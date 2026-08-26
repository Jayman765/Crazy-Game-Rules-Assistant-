import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { verifyPassword } from "@/lib/auth/password";
import { env } from "@/lib/env";

export const ADMIN_COOKIE_NAME = "tcg_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 12 * 60 * 60; // 12 hours

/* -------------------------------------------------------------------------- */
/* Password                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Checks a submitted password against `ADMIN_PASSWORD_HASH`. There is no
 * plaintext password anywhere in the source tree or in the environment — only
 * the scrypt hash, generated with `npm run hash-password`.
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  return verifyPassword(password, env.adminPasswordHash());
}

/* -------------------------------------------------------------------------- */
/* Session token                                                               */
/* -------------------------------------------------------------------------- */

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(payload: string): string {
  return base64url(
    createHmac("sha256", env.adminSessionSecret()).update(payload).digest(),
  );
}

/**
 * A stateless, HMAC-signed session token. It carries only an expiry — there is
 * one shared admin identity, so there is nothing else to encode, and no
 * password material ever travels in the cookie.
 */
export function createAdminSessionToken(): string {
  const payload = base64url(
    JSON.stringify({ exp: Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000 }),
  );
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return false;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  const expected = Buffer.from(sign(payload));
  const provided = Buffer.from(signature);
  if (
    expected.length !== provided.length ||
    !timingSafeEqual(expected, provided)
  ) {
    return false;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { exp?: unknown };
    return typeof decoded.exp === "number" && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

/** Reads and validates the admin session from the incoming request cookies. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyAdminSessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}

export function adminCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: env.isProduction(),
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
