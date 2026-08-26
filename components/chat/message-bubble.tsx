import { LifeBuoy } from "lucide-react";

import { AnswerMarkdown } from "@/components/chat/answer-markdown";
import { cn } from "@/lib/utils";

export type ChatRole = "user" | "assistant";

export function MessageBubble({
  role,
  content,
}: {
  role: ChatRole;
  content: string;
}) {
  const isPlayer = role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-2.5 sm:gap-3",
        isPlayer ? "justify-end" : "justify-start",
      )}
    >
      {!isPlayer && (
        <div
          aria-hidden
          className="mt-0.5 hidden size-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary ring-1 ring-primary/20 sm:flex"
        >
          <LifeBuoy className="size-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-4 py-3 text-[0.9375rem] leading-relaxed shadow-sm sm:max-w-[75%]",
          isPlayer
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-border/70 bg-card text-card-foreground",
        )}
      >
        <span className="sr-only">{isPlayer ? "You asked:" : "Rules assistant:"}</span>
        {isPlayer ? (
          <p className="whitespace-pre-wrap break-words">{content}</p>
        ) : (
          <AnswerMarkdown text={content} />
        )}
      </div>
    </div>
  );
}
