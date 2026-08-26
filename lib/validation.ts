/**
 * Request validation for the public chat endpoint. Kept dependency-free and
 * deliberately strict — this endpoint is reachable by anyone who scans the QR
 * code, so every field is checked for type, shape and size before it reaches
 * Anthropic or MongoDB.
 */

export const LIMITS = {
  /** A single player question. Rules questions are short by nature. */
  maxQuestionLength: 1_000,
  /** A single history entry (an earlier answer can be longer than a question). */
  maxHistoryMessageLength: 8_000,
  /** Turns kept from the client-supplied history. */
  maxHistoryMessages: 40,
  /** Whole-body guard, applied before parsing. */
  maxBodyBytes: 128 * 1024,
} as const;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatRequest = {
  sessionId: string;
  messages: ChatMessage[];
  message: string;
};

export type ValidationResult =
  | { ok: true; data: ChatRequest }
  | { ok: false; error: string };

/** RFC 4122 UUID, as produced by `crypto.randomUUID()`. */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidSessionId(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateChatRequest(body: unknown): ValidationResult {
  if (!isRecord(body)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  if (!isValidSessionId(body.sessionId)) {
    return { ok: false, error: "A valid session ID is required." };
  }

  if (typeof body.message !== "string") {
    return { ok: false, error: "A question is required." };
  }

  const message = body.message.trim();
  if (!message) {
    return { ok: false, error: "Please type a question first." };
  }
  if (message.length > LIMITS.maxQuestionLength) {
    return {
      ok: false,
      error: `That question is too long. Please keep it under ${LIMITS.maxQuestionLength} characters.`,
    };
  }

  const rawMessages = body.messages ?? [];
  if (!Array.isArray(rawMessages)) {
    return { ok: false, error: "Conversation history must be a list." };
  }
  if (rawMessages.length > LIMITS.maxHistoryMessages) {
    return {
      ok: false,
      error:
        "This conversation has grown too long. Please reload the page to start a fresh chat.",
    };
  }

  const messages: ChatMessage[] = [];
  for (const entry of rawMessages) {
    if (!isRecord(entry)) {
      return { ok: false, error: "Conversation history is malformed." };
    }
    if (entry.role !== "user" && entry.role !== "assistant") {
      return { ok: false, error: "Conversation history is malformed." };
    }
    if (
      typeof entry.content !== "string" ||
      !entry.content.trim() ||
      entry.content.length > LIMITS.maxHistoryMessageLength
    ) {
      return { ok: false, error: "Conversation history is malformed." };
    }
    messages.push({ role: entry.role, content: entry.content });
  }

  // The Messages API requires strictly alternating roles starting with `user`.
  // The new question is appended as a `user` turn, so history must end on
  // `assistant` if it is non-empty.
  for (let i = 0; i < messages.length; i += 1) {
    const expected = i % 2 === 0 ? "user" : "assistant";
    if (messages[i].role !== expected) {
      return { ok: false, error: "Conversation history is malformed." };
    }
  }
  if (messages.length % 2 !== 0) {
    return { ok: false, error: "Conversation history is malformed." };
  }

  return { ok: true, data: { sessionId: body.sessionId, messages, message } };
}
