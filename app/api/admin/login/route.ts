import { NextResponse } from "next/server";

import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  adminCookieOptions,
  createAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/auth/admin";
import { checkAdminLoginRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rateLimit = checkAdminLoginRateLimit(getClientIp(request.headers));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  let password: unknown;
  try {
    const body = (await request.json()) as { password?: unknown };
    password = body?.password;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof password !== "string" || !password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  let valid = false;
  try {
    valid = await verifyAdminPassword(password);
  } catch (error) {
    console.error("[admin/login] Password verification failed:", error);
    return NextResponse.json(
      { error: "Admin sign-in is not configured correctly." },
      { status: 500 },
    );
  }

  if (!valid) {
    // Deliberately generic — no hint about whether the hash is configured.
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    ADMIN_COOKIE_NAME,
    createAdminSessionToken(),
    adminCookieOptions(ADMIN_SESSION_MAX_AGE_SECONDS),
  );
  return response;
}
