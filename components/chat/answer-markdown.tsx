import { Fragment, type ReactNode } from "react";

/**
 * A very small Markdown renderer for Claude's answers.
 *
 * Answers use only a narrow slice of Markdown — paragraphs, bullet and
 * numbered lists, bold, italics and inline code — so a ~70-line renderer
 * covers it and keeps a full Markdown parser out of the client bundle.
 * Everything is rendered as React elements, so no HTML is ever injected.
 */

const INLINE_PATTERN = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*\n]+\*)/g;

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE_PATTERN).map((part, index) => {
    if (!part) return null;
    const key = `${index}-${part.slice(0, 8)}`;

    if (
      (part.startsWith("**") && part.endsWith("**") && part.length > 4) ||
      (part.startsWith("__") && part.endsWith("__") && part.length > 4)
    ) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return <code key={key}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}

const BULLET = /^\s*[-*•]\s+/;
const NUMBERED = /^\s*\d+[.)]\s+/;

type Block =
  | { kind: "paragraph"; lines: string[] }
  | { kind: "bullets"; items: string[] }
  | { kind: "numbers"; items: string[] };

function toBlocks(source: string): Block[] {
  const blocks: Block[] = [];

  for (const chunk of source.trim().split(/\n{2,}/)) {
    const lines = chunk.split("\n").filter((line) => line.trim());
    if (lines.length === 0) continue;

    let current: Block | null = null;
    for (const line of lines) {
      if (BULLET.test(line)) {
        if (current?.kind !== "bullets") {
          current = { kind: "bullets", items: [] };
          blocks.push(current);
        }
        current.items.push(line.replace(BULLET, ""));
      } else if (NUMBERED.test(line)) {
        if (current?.kind !== "numbers") {
          current = { kind: "numbers", items: [] };
          blocks.push(current);
        }
        current.items.push(line.replace(NUMBERED, ""));
      } else if (current?.kind === "paragraph") {
        current.lines.push(line);
      } else {
        current = { kind: "paragraph", lines: [line] };
        blocks.push(current);
      }
    }
  }

  return blocks;
}

export function AnswerMarkdown({ text }: { text: string }) {
  const blocks = toBlocks(text);

  return (
    <div className="tcg-answer">
      {blocks.map((block, index) => {
        if (block.kind === "paragraph") {
          return <p key={index}>{renderInline(block.lines.join(" "))}</p>;
        }

        const ListTag = block.kind === "bullets" ? "ul" : "ol";
        return (
          <ListTag key={index}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInline(item)}</li>
            ))}
          </ListTag>
        );
      })}
    </div>
  );
}
