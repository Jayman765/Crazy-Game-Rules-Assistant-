import "server-only";

import type Anthropic from "@anthropic-ai/sdk";

import { getAnthropicClient } from "@/lib/anthropic/client";
import { buildSystemPrompt } from "@/lib/anthropic/system-prompt";
import { env } from "@/lib/env";
import type { ChatMessage } from "@/lib/validation";

export type AskResult = {
  answer: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    cacheReadInputTokens: number;
    cacheCreationInputTokens: number;
  };
};

/**
 * Generous headroom. Answers are short by instruction, but adaptive thinking
 * tokens also count against this ceiling — a tight limit would truncate the
 * answer to a hard conditional-logic question. Unused budget costs nothing.
 */
const MAX_TOKENS = 8192;

export async function askRulesAssistant(
  history: ChatMessage[],
  question: string,
): Promise<AskResult> {
  const client = getAnthropicClient();
  const model = env.anthropicModel();

  const messages: Anthropic.MessageParam[] = [
    ...history.map((message) => ({
      role: message.role,
      content: message.content,
    })),
    { role: "user" as const, content: question },
  ];

  const response = await client.messages.create({
    model,
    max_tokens: MAX_TOKENS,
    // The cached, static reference context. See system-prompt.ts.
    system: await buildSystemPrompt(),
    messages,
    // Rules questions involve real multi-step conditional reasoning, but a
    // player is waiting mid-game — "medium" balances accuracy against latency.
    output_config: { effort: "medium" },
  });

  const answer = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  if (!answer) {
    throw new Error(`Empty response from Anthropic (stop_reason: ${response.stop_reason})`);
  }

  return {
    answer,
    model,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cacheReadInputTokens: response.usage.cache_read_input_tokens ?? 0,
      cacheCreationInputTokens: response.usage.cache_creation_input_tokens ?? 0,
    },
  };
}
