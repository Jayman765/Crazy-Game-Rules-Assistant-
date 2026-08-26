import "server-only";

import { env } from "@/lib/env";

/**
 * Deliberately simple, in-memory, fixed-window rate limiting.
 *
 * Scope: one serverless instance. Vercel may run several concurrently, so the
 * effective ceiling is the configured limit multiplied by the number of warm
 * instances. That is fine for the goal here — stopping a runaway client loop or
 * casual abuse of a public QR URL and capping Anthropic spend — and it avoids
 * pulling Redis into a lean playtesting app. If real distributed limiting is
 * ever needed, swap this module's implementation; the interface stays the same.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Keeps the map from growing without bound on a long-lived warm instance. */
function sweep(now: number): void {
  if (buckets.size < 5_000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the caller may retry. Only meaningful when blocked. */
  retryAfterSeconds: number;
};

function hit(key: string, limit: number, windowMs: number, now: number): boolean {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

function retryAfter(key: string, now: number): number {
  const bucket = buckets.get(key);
  if (!bucket) return 1;
  return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
}

/**
 * Applies both a per-IP and a per-anonymous-session limit. The session limit
 * keeps one tab from looping; the IP limit covers a client that rotates its
 * session ID.
 */
export function checkChatRateLimit(
  ip: string,
  sessionId: string,
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const windowMs = env.rateLimitWindowSeconds() * 1000;
  const ipKey = `ip:${ip}`;
  const sessionKey = `session:${sessionId}`;

  const ipAllowed = hit(ipKey, env.rateLimitPerIp(), windowMs, now);
  const sessionAllowed = hit(sessionKey, env.rateLimitPerSession(), windowMs, now);

  if (ipAllowed && sessionAllowed) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const blockedKey = ipAllowed ? sessionKey : ipKey;
  return { allowed: false, retryAfterSeconds: retryAfter(blockedKey, now) };
}

/**
 * A separate, tighter limit for admin login attempts, keyed on IP only.
 */
export function checkAdminLoginRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const key = `admin-login:${ip}`;
  const allowed = hit(key, 8, 5 * 60 * 1000, now);
  return allowed
    ? { allowed: true, retryAfterSeconds: 0 }
    : { allowed: false, retryAfterSeconds: retryAfter(key, now) };
}

/**
 * Best-effort client IP. Vercel sets `x-forwarded-for`; the left-most entry is
 * the original client. Only used transiently for rate limiting — never logged
 * to the database.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}
