import { LifeBuoy, Sparkles } from "lucide-react";

/**
 * The empty state a player sees the moment the QR code drops them here.
 * The suggested questions are conversation starters, not a rules engine —
 * tapping one just fills the composer.
 */
export const SUGGESTED_QUESTIONS = [
  "I landed on another player — what happens?",
  "Can I move backwards to reach a Star?",
  "How do the Portals work?",
  "What happens if I run out of Life Preservers in the water?",
] as const;

export function Welcome({
  onPick,
  disabled,
}: {
  onPick: (question: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center px-1 py-6 text-center sm:py-10">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/20">
        <LifeBuoy className="size-8" />
      </div>

      <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
        Stuck on a rule?
      </h2>

      <p className="mt-3 max-w-md text-balance text-[0.9375rem] leading-relaxed text-muted-foreground">
        Ask me anything about{" "}
        <span className="font-medium text-foreground">The Crazy Game</span> — bumps,
        Portals, Life Preservers, Sharky Shores, the lot. I answer straight from
        the official rules and the board layout, and I&apos;ll ask you a question
        back if the ruling depends on how you got there.
      </p>

      <div className="mt-7 w-full">
        <div className="mb-3 flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <Sparkles className="size-3.5" />
          Try one of these
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {SUGGESTED_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              disabled={disabled}
              onClick={() => onPick(question)}
              className="rounded-xl border border-border/70 bg-card/80 px-4 py-3 text-start text-sm leading-snug shadow-sm transition-colors hover:border-primary/40 hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-60"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
