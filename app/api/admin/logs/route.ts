import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth/admin";
import { listInteractions } from "@/lib/mongodb/logs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_PAGE_SIZE = 25;

export async function GET(request: Request) {
  // Server-side protection — the UI never decides who may read logs.
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const pageSize = Number.parseInt(
    url.searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE),
    10,
  );

  try {
    const result = await listInteractions(
      Number.isFinite(page) ? page : 1,
      Number.isFinite(pageSize) ? pageSize : DEFAULT_PAGE_SIZE,
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("[admin/logs] Query failed:", error);
    return NextResponse.json(
      { error: "Could not load the logs. Check the database connection." },
      { status: 500 },
    );
  }
}
