import "server-only";

import Anthropic from "@anthropic-ai/sdk";

import { env } from "@/lib/env";

let client: Anthropic | null = null;

/**
 * The Anthropic client is created lazily and reused across requests on a warm
 * serverless instance. The API key is read from a server-side environment
 * variable and never leaves this process.
 */
export function getAnthropicClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: env.anthropicApiKey() });
  }
  return client;
}
