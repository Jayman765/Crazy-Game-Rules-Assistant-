import "server-only";

/**
 * Central, server-only access to configuration.
 *
 * Nothing in this module may be imported from a Client Component — the
 * `server-only` import above turns that into a build-time error.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const env = {
  anthropicApiKey: () => required("ANTHROPIC_API_KEY"),

  /**
   * The project specification requires Claude Sonnet 5 because the rules
   * contain multi-step conditional logic (bump sequencing, direction-dependent
   * outcomes, portal exceptions). The variable exists so the client can pin a
   * different model later — it is not a cost-saving fallback.
   */
  anthropicModel: () => process.env.ANTHROPIC_MODEL || "claude-sonnet-5",

  mongoUri: () => required("MONGODB_URI"),
  mongoDbName: () => process.env.MONGODB_DB_NAME || "tcg_rules_assistant",
  mongoCollection: () => process.env.MONGODB_COLLECTION || "interactions",

  adminPasswordHash: () => required("ADMIN_PASSWORD_HASH"),
  adminSessionSecret: () => required("ADMIN_SESSION_SECRET"),

  rateLimitPerIp: () => optionalInt("RATE_LIMIT_PER_IP", 15),
  rateLimitPerSession: () => optionalInt("RATE_LIMIT_PER_SESSION", 10),
  rateLimitWindowSeconds: () => optionalInt("RATE_LIMIT_WINDOW_SECONDS", 60),

  isProduction: () => process.env.NODE_ENV === "production",
} as const;
