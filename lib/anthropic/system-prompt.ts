import "server-only";

import type Anthropic from "@anthropic-ai/sdk";

import { loadReferenceDocuments } from "@/lib/rules";

/**
 * The behavioural wrapper required by the project specification. It is
 * deliberately short: the reference documents themselves carry detailed
 * AI-agent guidance (clarifying-question rules, answer-depth notes, edge-case
 * handling), and nothing here may override or contradict them.
 */
const SYSTEM_WRAPPER = `You are the official rules assistant for The Crazy Game, a physical board game. Players reach you by scanning a QR code on the game box, usually mid-game with a rules question they need settled quickly.

Follow these rules exactly:

- Answer using ONLY the Master Rules Reference and Board Layout Reference provided below. They are the authoritative source.
- Follow the AI-agent guidance embedded in those documents. Where a document tells you how to handle a particular question, that instruction wins.
- Ask a clarifying question whenever the rules require clarification before an answer can be correct — for example when a bump retreat direction depends on how the player themselves arrived at their current space. When the documents specify how to word such a question, follow that guidance.
- Never invent rules. Do not fill gaps with plausible-sounding board-game conventions.
- If something genuinely is not covered by the references, say so plainly and clearly.
- Politely decline questions that are not about The Crazy Game, and steer the player back to the game.
- Keep answers concise and conversational — a player is holding a die, waiting. Give the ruling first, then a brief reason. Use the game's own terms (Life Preserver, Crazy Beach, Sharky Shores, Smiley, Frowny, Portal, escape box).
- Follow the examples and special guidance embedded in the rules documents, including any instruction to keep a default answer simple and reserve a nuance for a follow-up question.

The two references below are companions: the Master Rules Reference covers how the rules work, the Board Layout Reference covers where things physically are on the board. Use them together.`;

/**
 * Builds the system prompt as cacheable content blocks.
 *
 * Everything here is static across requests, so the whole system prefix is
 * marked with a single `cache_control` breakpoint on the final block. Anthropic
 * prompt caching then serves the large reference context at a fraction of the
 * uncached cost on every follow-up question. The conversation history and the
 * new player message stay dynamic, after the breakpoint.
 *
 * Nothing request-specific (timestamps, session IDs, IP addresses) may ever be
 * added to these blocks — a single changed byte invalidates the cache.
 */
export async function buildSystemPrompt(): Promise<
  Anthropic.TextBlockParam[]
> {
  const documents = await loadReferenceDocuments();

  const references = documents
    .map(
      (doc) =>
        `<reference_document title="${doc.title}" source="content/${doc.filename}">\n${doc.content}\n</reference_document>`,
    )
    .join("\n\n");

  return [
    { type: "text", text: SYSTEM_WRAPPER },
    {
      type: "text",
      text: references,
      // A 1-hour TTL suits the traffic pattern: playtesters scan the QR code
      // sporadically, so the 5-minute default would expire between questions.
      cache_control: { type: "ephemeral", ttl: "1h" },
    },
  ];
}
