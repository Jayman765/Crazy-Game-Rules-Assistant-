import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth/admin";
import { CSV_BOM, toCsvRow } from "@/lib/csv";
import { streamInteractions } from "@/lib/mongodb/logs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const COLUMNS = [
  "timestamp",
  "sessionId",
  "question",
  "answer",
  "model",
  "latencyMs",
  "turnIndex",
] as const;

export async function GET() {
  // Same protection as the log table — the export is not a public endpoint.
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(CSV_BOM + toCsvRow(COLUMNS)));
        for await (const log of streamInteractions()) {
          controller.enqueue(
            encoder.encode(
              toCsvRow([
                log.timestamp,
                log.sessionId,
                log.question,
                log.answer,
                log.model,
                log.latencyMs,
                log.turnIndex,
              ]),
            ),
          );
        }
        controller.close();
      } catch (error) {
        console.error("[admin/logs/export] Export failed:", error);
        controller.error(error);
      }
    },
  });

  const filename = `tcg-playtest-logs-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(stream, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
