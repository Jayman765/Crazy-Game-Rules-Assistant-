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

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type LogRow = {
  id: string;
  sessionId: string;
  question: string;
  answer: string;
  timestamp: string;
  model?: string;
  latencyMs?: number;
};

type LogPage = {
  rows: LogRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const PAGE_SIZE = 25;

function formatTimestamp(value: string): string {
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

/** Groups a session's rows visually without inventing a colour per session. */
function shortSession(sessionId: string): string {
  return sessionId.slice(0, 8);
}

export function AdminLogs() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  /** Bumped by the Refresh button to re-run the query for the same page. */
  const [nonce, setNonce] = useState(0);
  const [data, setData] = useState<LogPage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  // `loading` is derived rather than stored, so the effect below never has to
  // set state synchronously on render.
  const requestKey = `${page}:${nonce}`;
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const loading = loadedKey !== requestKey;

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch(
          `/api/admin/logs?page=${page}&pageSize=${PAGE_SIZE}`,
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

        const payload = (await response.json()) as LogPage;
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
  }, [page, requestKey, router]);

  async function handleSignOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const rows = data?.rows ?? [];

  return (
    <div className="tcg-shell min-h-[100dvh]">
      <header className="border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-lg font-semibold tracking-tight sm:text-xl">
              Playtest Logs
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {data
                ? `${data.total.toLocaleString()} logged question${data.total === 1 ? "" : "s"} · newest first`
                : "Loading…"}
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
              Download CSV
            </Button>

            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-foreground"
          >
            {error}
          </p>
        )}

        {/*
          Phones get a stacked list instead of the table. A four-column table
          needs ~830px to stay readable, which on a 390px screen means every
          row is a horizontal scroll away — unusable for skimming what confused
          a tester.
        */}
        <div className="flex flex-col gap-3 sm:hidden">
          {rows.length === 0 && !loading && (
            <p className="rounded-2xl border border-border/70 bg-card px-4 py-12 text-center text-sm text-muted-foreground shadow-sm">
              No questions logged yet. They appear here as soon as playtesters
              start asking.
            </p>
          )}

          {rows.map((row) => {
            const isOpen = expanded === row.id;
            return (
              <button
                key={row.id}
                type="button"
                onClick={() => setExpanded(isOpen ? null : row.id)}
                className="rounded-2xl border border-border/70 bg-card p-4 text-start shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <div className="mb-2 flex items-center justify-between gap-2 text-[0.6875rem] text-muted-foreground">
                  <span className="tabular-nums">
                    {formatTimestamp(row.timestamp)}
                  </span>
                  <span className="font-mono">
                    {shortSession(row.sessionId)}
                  </span>
                </div>

                <p
                  className={`text-sm font-medium break-words ${isOpen ? "whitespace-pre-wrap" : "line-clamp-3"}`}
                >
                  {row.question}
                </p>

                <p
                  className={`mt-2 text-sm break-words text-muted-foreground ${isOpen ? "whitespace-pre-wrap" : "line-clamp-4"}`}
                >
                  {row.answer}
                </p>

                <span className="mt-2 inline-block text-xs text-primary">
                  {isOpen ? "Tap to collapse" : "Tap to expand"}
                </span>
              </button>
            );
          })}
        </div>

        {/*
          `table-fixed` is what makes the answer column readable: with auto
          layout the table sizes itself to the longest answer (thousands of
          pixels wide) and `line-clamp` never engages. Fixed layout pins the
          columns so long text wraps and clamps inside its cell instead.
        */}
        <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm sm:block">
          <Table className="min-w-[52rem] table-fixed">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[10.5rem] whitespace-nowrap">
                  Timestamp
                </TableHead>
                <TableHead className="w-[6.5rem] whitespace-nowrap">
                  Session
                </TableHead>
                <TableHead className="w-[30%]">Question</TableHead>
                <TableHead>Answer</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.length === 0 && !loading && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-16 text-center text-sm text-muted-foreground"
                  >
                    No questions logged yet. They appear here as soon as
                    playtesters start asking.
                  </TableCell>
                </TableRow>
              )}

              {rows.map((row) => {
                const isOpen = expanded === row.id;
                return (
                  <TableRow
                    key={row.id}
                    onClick={() => setExpanded(isOpen ? null : row.id)}
                    className="cursor-pointer align-top"
                  >
                    <TableCell className="py-3 align-top text-xs whitespace-nowrap text-muted-foreground tabular-nums">
                      {formatTimestamp(row.timestamp)}
                    </TableCell>

                    <TableCell
                      title={row.sessionId}
                      className="truncate py-3 align-top font-mono text-xs text-muted-foreground"
                    >
                      {shortSession(row.sessionId)}
                    </TableCell>

                    {/*
                      `whitespace-normal` is required: TableCell ships with
                      `whitespace-nowrap`, which the text would otherwise
                      inherit and run straight off the side of the column.
                    */}
                    <TableCell className="py-3 align-top text-sm font-medium break-words whitespace-normal">
                      <p
                        className={
                          isOpen ? "whitespace-pre-wrap" : "line-clamp-3"
                        }
                      >
                        {row.question}
                      </p>
                    </TableCell>

                    <TableCell className="py-3 align-top text-sm break-words whitespace-normal text-muted-foreground">
                      <p
                        className={
                          isOpen ? "whitespace-pre-wrap" : "line-clamp-3"
                        }
                      >
                        {row.answer}
                      </p>
                      {!isOpen && row.answer.length > 220 && (
                        <span className="mt-1 inline-block text-xs text-primary">
                          Click to expand
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Page {data.page} of {data.totalPages}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={loading || data.page <= 1}
              >
                <ChevronLeft />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((current) => Math.min(data.totalPages, current + 1))
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
