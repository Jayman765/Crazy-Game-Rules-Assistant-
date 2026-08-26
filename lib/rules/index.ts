import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * The two authoritative reference documents. They live in `/content` as plain
 * Markdown so the client can replace them when the rules change without
 * touching any application code. The filenames below are the only place the
 * paths are declared — see README.md ("Updating the rules content").
 */
export const REFERENCE_FILES = [
  {
    id: "master-rules",
    filename: "TCG_Master_Rules_Reference_v1-2.md",
    title: "TCG Master Rules Reference",
  },
  {
    id: "board-layout",
    filename: "TCG_Board_Layout_Reference_v1.md",
    title: "TCG Board Layout Reference",
  },
] as const;

export type ReferenceDocument = {
  id: string;
  filename: string;
  title: string;
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Server-memory cache of the loaded Markdown. The files are the source of
 * truth; this only avoids re-reading them on every request within the lifetime
 * of a warm serverless instance. A redeploy (which is how content updates ship)
 * starts fresh instances, so there is nothing to invalidate by hand.
 */
let cached: Promise<ReferenceDocument[]> | null = null;

async function readReferenceDocuments(): Promise<ReferenceDocument[]> {
  return Promise.all(
    REFERENCE_FILES.map(async (file) => {
      const filePath = path.join(CONTENT_DIR, file.filename);
      let content: string;
      try {
        content = await readFile(filePath, "utf8");
      } catch {
        throw new Error(
          `Reference document not found or unreadable: content/${file.filename}`,
        );
      }
      if (!content.trim()) {
        throw new Error(`Reference document is empty: content/${file.filename}`);
      }
      return { ...file, content };
    }),
  );
}

export function loadReferenceDocuments(): Promise<ReferenceDocument[]> {
  if (!cached) {
    // Cache the promise, not the result, so concurrent requests on a cold
    // instance share a single read instead of racing.
    cached = readReferenceDocuments().catch((error) => {
      cached = null; // let the next request retry rather than caching a failure
      throw error;
    });
  }
  return cached;
}
