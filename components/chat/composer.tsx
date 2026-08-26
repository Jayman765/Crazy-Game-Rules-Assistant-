"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, type KeyboardEvent } from "react";

import { LIMITS } from "@/lib/validation";
import { cn } from "@/lib/utils";

const MAX_ROWS_HEIGHT = 140;

export function Composer({
  value,
  onChange,
  onSend,
  pending,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  pending: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Grow with the question, up to a cap, then scroll internally.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_ROWS_HEIGHT)}px`;
  }, [value]);

  const trimmed = value.trim();
  const tooLong = trimmed.length > LIMITS.maxQuestionLength;
  const canSend = trimmed.length > 0 && !tooLong && !pending;

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift+Enter (and the mobile newline key) adds a line.
    // `isComposing` guards IME input on languages that compose characters.
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      if (canSend) onSend();
    }
  }

  const remaining = LIMITS.maxQuestionLength - trimmed.length;

  return (
    <div className="border-t border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto w-full max-w-3xl px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4">
        <div
          className={cn(
            "flex items-end gap-2 rounded-2xl border bg-card p-1.5 shadow-sm transition-colors",
            tooLong
              ? "border-destructive/60"
              : "border-border/80 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/25",
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={pending}
            enterKeyHint="send"
            autoComplete="off"
            autoCorrect="on"
            spellCheck
            aria-label="Ask a question about The Crazy Game"
            placeholder="Ask a rules question…"
            /* text-base keeps iOS from zooming the viewport on focus. */
            className="scrollbar-slim max-h-[140px] flex-1 resize-none bg-transparent px-2.5 py-2 text-base leading-relaxed placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
          />

          <button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            aria-label="Send question"
            className="mb-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            <ArrowUp className="size-5" />
          </button>
        </div>

        <p className="mt-2 px-1 text-center text-[0.6875rem] leading-tight text-muted-foreground">
          {tooLong ? (
            <span className="text-destructive">
              That question is {trimmed.length - LIMITS.maxQuestionLength} characters
              too long — please shorten it.
            </span>
          ) : remaining < 120 ? (
            <span>{remaining} characters left</span>
          ) : (
            <span>Answers come from the official rules. Press Enter to send.</span>
          )}
        </p>
      </div>
    </div>
  );
}
