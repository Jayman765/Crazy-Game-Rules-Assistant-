"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type LogRow = {
  id: string;
  sessionId: string;
  question: string;
  answer: string;
  timestamp: string;
  model?: string;
  latencyMs?: number;
};

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

const EMPTY_MESSAGE =
  "No questions logged yet. They appear here as soon as playtesters start asking.";

export function LogTable({
  rows,
  loading,
}: {
  rows: LogRow[];
  loading: boolean;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      {/*
        Phones get a stacked list instead of the table. A four-column table
        needs ~830px to stay readable, which on a 390px screen means every row
        is a horizontal scroll away — unusable for skimming what confused a
        tester.
      */}
      <div className="flex flex-col gap-3 sm:hidden">
        {rows.length === 0 && !loading && (
          <p className="rounded-2xl border border-border/70 bg-card px-4 py-12 text-center text-sm text-muted-foreground shadow-sm">
            {EMPTY_MESSAGE}
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
                <span className="font-mono">{shortSession(row.sessionId)}</span>
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
        `table-fixed` is what makes the answer column readable: with auto layout
        the table sizes itself to the longest answer (thousands of pixels wide)
        and `line-clamp` never engages. Fixed layout pins the columns so long
        text wraps and clamps inside its cell instead.
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
                  {EMPTY_MESSAGE}
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
                    `whitespace-nowrap`, which the text would otherwise inherit
                    and run straight off the side of the column.
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
    </>
  );
}
