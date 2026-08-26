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
          const payload = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
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

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[10.5rem] whitespace-nowrap">
                    Timestamp
                  </TableHead>
                  <TableHead className="w-[7rem] whitespace-nowrap">
                    Session
                  </TableHead>
                  <TableHead className="min-w-[16rem]">Question</TableHead>
                  <TableHead className="min-w-[24rem]">Answer</TableHead>
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
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground tabular-nums">
                        {formatTimestamp(row.timestamp)}
                      </TableCell>

                      <TableCell
                        title={row.sessionId}
                        className="font-mono text-xs text-muted-foreground"
                      >
                        {shortSession(row.sessionId)}
                      </TableCell>

                      <TableCell className="text-sm font-medium">
                        <p className={isOpen ? "whitespace-pre-wrap" : "line-clamp-3"}>
                          {row.question}
                        </p>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        <p className={isOpen ? "whitespace-pre-wrap" : "line-clamp-3"}>
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
