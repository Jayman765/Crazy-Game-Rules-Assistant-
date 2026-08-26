import { NextResponse } from "next/server";

import { askRulesAssistant } from "@/lib/anthropic/chat";
import { recordInteraction } from "@/lib/mongodb/logs";
import { checkChatRateLimit, getClientIp } from "@/lib/rate-limit";
import { LIMITS, validateChatRequest } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type ErrorCode =
  | "invalid_request"
  | "rate_limited"
  | "ai_unavailable"
  | "server_error";

function fail(status: number, code: ErrorCode, message: string, headers?: HeadersInit) {
  return NextResponse.json({ error: { code, message } }, { status, headers });
}

export async function POST(request: Request) {
  // 1. Parse the body, with a size guard applied before JSON parsing.
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > LIMITS.maxBodyBytes) {
    return fail(413, "invalid_request", "That request was too large.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "invalid_request", "Could not read that request.");
  }

  // 2 & 3. Validate the session ID, the message and the history structure.
  const validated = validateChatRequest(body);
  if (!validated.ok) {
    return fail(400, "invalid_request", validated.error);
  }
  const { sessionId, messages, message } = validated.data;

  // 4. Basic abuse / cost protection.
  const rateLimit = checkChatRateLimit(getClientIp(request.headers), sessionId);
  if (!rateLimit.allowed) {
    return fail(
      429,
      "rate_limited",
      "You're asking questions faster than I can answer. Give it a few seconds and try again.",
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  // 5, 6 & 7. Load the references, build the cached system prompt, call Claude.
  const startedAt = Date.now();
  let result;
  try {
    result = await askRulesAssistant(messages, message);
  } catch (error) {
    // Log server-side only — no key material, credentials or stack traces are
    // ever sent to the browser.
    console.error("[chat] Anthropic request failed:", error);
    return fail(
      502,
      "ai_unavailable",
      "I couldn't reach the rules assistant just then. Please try that question again.",
    );
  }
  const latencyMs = Date.now() - startedAt;

  // One line per answer in the Vercel function logs, so prompt-cache health is
  // visible without opening the database. `cache_read` should dominate after
  // the first question — see README §8.
  console.log(
    `[chat] ${latencyMs}ms model=${result.model} cache_read=${result.usage.cacheReadInputTokens} cache_write=${result.usage.cacheCreationInputTokens} uncached_in=${result.usage.inputTokens} out=${result.usage.outputTokens}`,
  );

  // 9. Log the completed exchange. A logging failure must not cost the player
  // their answer, so it is caught and reported server-side only.
  try {
    await recordInteraction({
      sessionId,
      question: message,
      answer: result.answer,
      timestamp: new Date(),
      model: result.model,
      latencyMs,
      turnIndex: messages.length / 2 + 1,
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      cacheReadInputTokens: result.usage.cacheReadInputTokens,
      cacheCreationInputTokens: result.usage.cacheCreationInputTokens,
    });
  } catch (error) {
    console.error("[chat] MongoDB logging failed:", error);
  }

  // 8. Return the answer.
  return NextResponse.json({ answer: result.answer });
}
