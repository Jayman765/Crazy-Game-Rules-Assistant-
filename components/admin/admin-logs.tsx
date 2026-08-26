"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LogTable, type LogRow } from "@/components/admin/log-table";
import {
  SessionThreads,
  type SessionThread,
} from "@/components/admin/session-threads";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type View = "sessions" | "table";

type Paged = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type TablePage = Paged & { rows: LogRow[] };
type SessionPage = Paged & { sessions: SessionThread[] };

/** Sessions hold several turns each, so fewer fit comfortably on a page. */
const PAGE_SIZE: Record<View, number> = { sessions: 10, table: 25 };

export function AdminLogs() {
  const router = useRouter();
  const [view, setView] = useState<View>("sessions");
  const [page, setPage] = useState(1);
  /** Bumped by the Refresh button to re-run the query for the same page. */
  const [nonce, setNonce] = useState(0);

  const [data, setData] = useState<TablePage | SessionPage | null>(null);
  const [error, setError] = useState<string | null>(null);

  // `loading` is derived rather than stored, so the effect below never has to
  // set state synchronously on render.
  const requestKey = `${view}:${page}:${nonce}`;
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const loading = loadedKey !== requestKey;

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        // Paging happens in MongoDB — the server only ever returns this page.
        const response = await fetch(
          `/api/admin/logs?view=${view}&page=${page}&pageSize=${PAGE_SIZE[view]}`,
          { cache: "no-store" },
        );
        if (cancelled) return;

        if (response.status === 401) {
          // Session expired — fall back to the login screen.
          setLoadedKey(requestKey);
          router.refresh();
          return;
        }

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          if (cancelled) return;
          setError(payload?.error ?? "Could not load the logs.");
          setLoadedKey(requestKey);
          return;
        }

        const payload = (await response.json()) as TablePage | SessionPage;
        if (cancelled) return;
        setError(null);
        setData(payload);
        setLoadedKey(requestKey);
      } catch {
        if (cancelled) return;
        setError("Could not reach the server.");
        setLoadedKey(requestKey);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, requestKey, router, view]);

  /**
   * Paging and view switches replace the whole list, so send the reader back to
   * the top — otherwise they land halfway down a page they haven't seen.
   *
   * Instant rather than smooth: the re-render that follows cancels an in-flight
   * smooth scroll, leaving the reader stranded at the old offset.
   */
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function goToPage(next: number) {
    setPage(next);
    scrollToTop();
  }

  function switchView(next: View) {
    if (next === view) return;
    setView(next);
    setPage(1);
    setData(null);
    scrollToTop();
  }

  async function handleSignOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const sessions = data && "sessions" in data ? data.sessions : [];
  const rows = data && "rows" in data ? data.rows : [];

  const summary = !data
    ? "Loading…"
    : view === "sessions"
      ? `${data.total.toLocaleString()} conversation${data.total === 1 ? "" : "s"} · newest first`
      : `${data.total.toLocaleString()} logged question${data.total === 1 ? "" : "s"} · newest first`;

  return (
    <div className="tcg-shell min-h-[100dvh]">
      <header className="border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-lg font-semibold tracking-tight sm:text-xl">
              Playtest Logs
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {summary}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNonce((current) => current + 1)}
              disabled={loading}
            >
              <RefreshCw className={loading ? "animate-spin" : undefined} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            {/*
              A plain link, so the browser handles the download and the request
              carries the admin session cookie to the protected endpoint.
            */}
            <Button
              size="sm"
              nativeButton={false}
              render={<a href="/api/admin/logs/export" download />}
            >
              <Download />
              <span className="hidden sm:inline">Download CSV</span>
              <span className="sm:hidden">CSV</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-4 inline-flex rounded-xl border border-border/70 bg-card p-1 shadow-sm">
          {(
            [
              ["sessions", "Conversations"],
              ["table", "All questions"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => switchView(value)}
              aria-pressed={view === value}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                view === value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-foreground"
          >
            {error}
          </p>
        )}

        {view === "sessions" ? (
          <SessionThreads sessions={sessions} loading={loading} />
        ) : (
          <LogTable rows={rows} loading={loading} />
        )}

        {data && data.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Page {data.page} of {data.totalPages}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(Math.max(1, data.page - 1))}
                disabled={loading || data.page <= 1}
              >
                <ChevronLeft />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  goToPage(Math.min(data.totalPages, data.page + 1))
                }
                disabled={loading || data.page >= data.totalPages}
              >
                Next
                <ChevronRight />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
