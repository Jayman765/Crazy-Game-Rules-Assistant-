"use client";

import { ChevronDown, LifeBuoy, MessageSquare } from "lucide-react";
import { useState } from "react";

import { AnswerMarkdown } from "@/components/chat/answer-markdown";
import { cn } from "@/lib/utils";

export type SessionTurn = {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  latencyMs?: number;
};

export type SessionThread = {
  sessionId: string;
  startedAt: string;
  lastAt: string;
  turns: SessionTurn[];
};

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** How long the tester stayed in the conversation. */
function formatSpan(startedAt: string, lastAt: string): string | null {
  const start = new Date(startedAt).getTime();
  const end = new Date(lastAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;

  const seconds = Math.round((end - start) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function Thread({ session }: { session: SessionThread }) {
  const [open, setOpen] = useState(true);
  const span = formatSpan(session.startedAt, session.lastAt);
  const turnCount = session.turns.length;

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:px-5"
      >
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            !open && "-rotate-90",
          )}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-mono text-sm font-medium">
              {session.sessionId.slice(0, 8)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDateTime(session.startedAt)}
            </span>
          </div>

          {!open && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {session.turns[0]?.question}
            </p>
          )}
        </div>

        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
          <MessageSquare className="size-3" />
          {turnCount}
          {span && <span className="hidden sm:inline"> · {span}</span>}
        </span>
      </button>

      {/*
        The transcript is capped and centred rather than filling the card. On a
        wide screen, left/right bubbles pinned to the full width sit so far
        apart they stop reading as a conversation. The border and tint stay on
        the outer element so they still span the whole card.
      */}
      {open && (
        <div className="border-t border-border/70 bg-background/40 px-4 py-5 sm:px-5">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
            {session.turns.map((turn, index) => (
              <div key={turn.id} className="flex flex-col gap-3">
                {/* The tester's question */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground shadow-sm">
                    <p className="break-words whitespace-pre-wrap">
                      {turn.question}
                    </p>
                  </div>
                </div>

                {/* The assistant's answer */}
                <div className="flex gap-2.5">
                  <div
                    aria-hidden
                    className="mt-0.5 hidden size-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary ring-1 ring-primary/20 sm:flex"
                  >
                    <LifeBuoy className="size-3.5" />
                  </div>

                  <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-border/70 bg-card px-4 py-2.5 text-sm leading-relaxed shadow-sm">
                    <AnswerMarkdown text={turn.answer} />
                  </div>
                </div>

                <p className="text-center text-[0.6875rem] text-muted-foreground tabular-nums">
                  Q{index + 1} · {formatTime(turn.timestamp)}
                  {turn.latencyMs
                    ? ` · ${(turn.latencyMs / 1000).toFixed(1)}s`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export function SessionThreads({
  sessions,
  loading,
}: {
  sessions: SessionThread[];
  loading: boolean;
}) {
  if (sessions.length === 0 && !loading) {
    return (
      <p className="rounded-2xl border border-border/70 bg-card px-4 py-16 text-center text-sm text-muted-foreground shadow-sm">
        No conversations logged yet. They appear here as soon as playtesters
        start asking.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sessions.map((session) => (
        <Thread key={session.sessionId} session={session} />
      ))}
    </div>
  );
}
