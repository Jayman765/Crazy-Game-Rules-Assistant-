import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth/admin";
import { listInteractions, listSessions } from "@/lib/mongodb/logs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_TABLE_PAGE_SIZE = 25;
/** Sessions carry several turns each, so fewer per page. */
const DEFAULT_SESSION_PAGE_SIZE = 10;

export async function GET(request: Request) {
  // Server-side protection — the UI never decides who may read logs.
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  const url = new URL(request.url);
  const grouped = url.searchParams.get("view") === "sessions";

  const rawPage = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(rawPage) ? rawPage : 1;

  const rawPageSize = Number.parseInt(
    url.searchParams.get("pageSize") ?? "",
    10,
  );
  const pageSize = Number.isFinite(rawPageSize)
    ? rawPageSize
    : grouped
      ? DEFAULT_SESSION_PAGE_SIZE
      : DEFAULT_TABLE_PAGE_SIZE;

  try {
    const result = grouped
      ? await listSessions(page, pageSize)
      : await listInteractions(page, pageSize);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[admin/logs] Query failed:", error);
    return NextResponse.json(
      { error: "Could not load the logs. Check the database connection." },
      { status: 500 },
    );
  }
}
