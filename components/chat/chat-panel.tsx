"use client";

import { LifeBuoy, RotateCcw, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Composer } from "@/components/chat/composer";
import { MessageBubble, type ChatRole } from "@/components/chat/message-bubble";
import { ThinkingBubble } from "@/components/chat/thinking-bubble";
import { Welcome } from "@/components/chat/welcome";
import { createSessionId } from "@/lib/session-id";

type Message = { role: ChatRole; content: string };

const GENERIC_ERROR =
  "Something went wrong reaching the rules assistant. Please try again in a moment.";

export function ChatPanel() {
  /**
   * `messages` only ever holds completed question/answer pairs, so it is always
   * a valid alternating history to send to the API. The question currently in
   * flight (or the one that just failed) is tracked separately.
   */
  const [messages, setMessages] = useState<Message[]>([]);
  const [inFlight, setInFlight] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const pending = inFlight !== null && error === null;

  // Created lazily on the first send so it never runs during server rendering.
  const sessionIdRef = useRef<string | null>(null);
  const getSessionId = () => {
    sessionIdRef.current ??= createSessionId();
    return sessionIdRef.current;
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, inFlight, error]);

  const ask = useCallback(
    async (question: string, history: Message[]) => {
      setError(null);
      setInFlight(question);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: getSessionId(),
            messages: history,
            message: question,
          }),
        });

        const payload = (await response.json().catch(() => null)) as
          | { answer?: string; error?: { message?: string } }
          | null;

        if (!response.ok || !payload?.answer) {
          setError(payload?.error?.message || GENERIC_ERROR);
          return;
        }

        setMessages([
          ...history,
          { role: "user", content: question },
          { role: "assistant", content: payload.answer },
        ]);
        setInFlight(null);
      } catch {
        // Network failure, offline, request aborted by the browser.
        setError(
          "I couldn't connect. Check your signal and try that question again.",
        );
      }
    },
    [],
  );

  function handleSend() {
    const question = draft.trim();
    if (!question || pending) return;
    setDraft("");
    void ask(question, messages);
  }

  function handleRetry() {
    if (!inFlight) return;
    void ask(inFlight, messages);
  }

  function handleRestart() {
    sessionIdRef.current = null; // a genuinely fresh anonymous session
    setMessages([]);
    setInFlight(null);
    setError(null);
    setDraft("");
  }

  const isEmpty = messages.length === 0 && inFlight === null;

  return (
    <div className="tcg-shell flex h-[100dvh] flex-col">
      <header className="sticky top-0 z-10 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <LifeBuoy className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="font-heading truncate text-lg leading-tight font-semibold tracking-tight sm:text-xl">
              The Crazy Game
            </h1>
            <p className="truncate text-xs text-muted-foreground sm:text-[0.8125rem]">
              Official rules assistant
            </p>
          </div>

          {!isEmpty && (
            <button
              type="button"
              onClick={handleRestart}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline">New chat</span>
            </button>
          )}
        </div>
      </header>

      <div
        ref={scrollRef}
        className="scrollbar-slim flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-3 py-5 sm:px-4 sm:py-6">
          {isEmpty ? (
            <Welcome onPick={setDraft} disabled={pending} />
          ) : (
            <>
              {messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}

              {inFlight && <MessageBubble role="user" content={inFlight} />}
              {pending && <ThinkingBubble />}

              {error && (
                <div
                  role="alert"
                  className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/8 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex gap-2.5">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
                    <p className="text-sm leading-relaxed text-foreground">{error}</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRetry}
                    className="shrink-0 self-start rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:self-auto"
                  >
                    Try again
                  </button>
                </div>
              )}
            </>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <Composer
        value={draft}
        onChange={setDraft}
        onSend={handleSend}
        pending={pending}
      />
    </div>
  );
}
