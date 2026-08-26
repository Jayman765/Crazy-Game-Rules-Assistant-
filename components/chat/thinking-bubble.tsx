import { LifeBuoy } from "lucide-react";

/**
 * Shown while Claude is working. Three CSS-only dots — no animation library.
 */
export function ThinkingBubble() {
  return (
    <div className="flex w-full gap-2.5 sm:gap-3" aria-live="polite">
      <div
        aria-hidden
        className="mt-0.5 hidden size-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary ring-1 ring-primary/20 sm:flex"
      >
        <LifeBuoy className="size-4" />
      </div>

      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-border/70 bg-card px-4 py-3.5 shadow-sm">
        <span className="sr-only">Checking the rules…</span>
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            aria-hidden
            className="size-2 animate-bounce rounded-full bg-primary/55"
            style={{ animationDelay: `${index * 150}ms`, animationDuration: "1s" }}
          />
        ))}
        <span className="ms-1 text-sm text-muted-foreground">Checking the rules…</span>
      </div>
    </div>
  );
}
