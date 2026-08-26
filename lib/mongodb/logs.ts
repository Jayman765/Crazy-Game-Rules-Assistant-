import "server-only";

import type { Collection, Sort } from "mongodb";

import { env } from "@/lib/env";
import { getDb } from "@/lib/mongodb/client";

/**
 * One document per completed question/answer exchange.
 *
 * Anonymous by design: the only identifier is the random per-visit session ID.
 * No name, email, account, IP address or other personally identifying data is
 * stored — the client asked for anonymous logging purely to see where testers
 * get confused.
 */
export type InteractionLog = {
  sessionId: string;
  question: string;
  answer: string;
  timestamp: Date;
  /** Technical metadata only — useful for cost/latency analysis. */
  model: string;
  latencyMs: number;
  turnIndex: number;
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
  inputTokens: number;
  outputTokens: number;
};

let indexesEnsured = false;

async function getCollection(): Promise<Collection<InteractionLog>> {
  const db = await getDb();
  const collection = db.collection<InteractionLog>(env.mongoCollection());

  if (!indexesEnsured) {
    indexesEnsured = true;
    // Fire-and-forget: index creation must not delay a player's answer, and a
    // failure here is not a reason to lose the log entry.
    collection
      .createIndexes([
        { key: { timestamp: -1 }, name: "timestamp_desc" },
        { key: { sessionId: 1, timestamp: -1 }, name: "session_timestamp" },
      ])
      .catch(() => {
        indexesEnsured = false;
      });
  }

  return collection;
}

export async function recordInteraction(log: InteractionLog): Promise<void> {
  const collection = await getCollection();
  await collection.insertOne({ ...log });
}

export type LogRow = InteractionLog & { id: string };

export type LogPage = {
  rows: LogRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const SORT_NEWEST_FIRST: Sort = { timestamp: -1, _id: -1 };

export async function listInteractions(
  page: number,
  pageSize: number,
): Promise<LogPage> {
  const collection = await getCollection();
  const safePageSize = Math.min(Math.max(pageSize, 1), 100);
  // `countDocuments` rather than `estimatedDocumentCount`: the estimate comes
  // from collection metadata and can lag reality, which would show the wrong
  // number of pages right after a burst of playtest questions.
  const total = await collection.countDocuments({});
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const documents = await collection
    .find({}, { sort: SORT_NEWEST_FIRST })
    .skip((safePage - 1) * safePageSize)
    .limit(safePageSize)
    .toArray();

  return {
    rows: documents.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    })),
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
}

/* -------------------------------------------------------------------------- */
/* Session-grouped view                                                        */
/* -------------------------------------------------------------------------- */

export type SessionTurn = {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
  latencyMs: number;
};

export type SessionThread = {
  sessionId: string;
  startedAt: Date;
  lastAt: Date;
  turns: SessionTurn[];
};

export type SessionPage = {
  sessions: SessionThread[];
  /** Distinct sessions, not individual questions. */
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Returns whole conversations rather than individual rows, so a tester's
 * session can be read in order.
 *
 * Deliberately two queries instead of one `$group` with `$push: "$$ROOT"`:
 * pushing every document into a group would materialise the entire collection
 * in memory before paginating. Here the first query pages over session IDs
 * only, and the second fetches just that page's documents.
 */
export async function listSessions(
  page: number,
  pageSize: number,
): Promise<SessionPage> {
  const collection = await getCollection();
  const safePageSize = Math.min(Math.max(pageSize, 1), 50);

  const counted = await collection
    .aggregate<{ total: number }>([
      { $group: { _id: "$sessionId" } },
      { $count: "total" },
    ])
    .toArray();

  const total = counted[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const heads = await collection
    .aggregate<{ _id: string; lastAt: Date }>([
      { $group: { _id: "$sessionId", lastAt: { $max: "$timestamp" } } },
      { $sort: { lastAt: -1, _id: -1 } },
      { $skip: (safePage - 1) * safePageSize },
      { $limit: safePageSize },
    ])
    .toArray();

  if (heads.length === 0) {
    return {
      sessions: [],
      total,
      page: safePage,
      pageSize: safePageSize,
      totalPages,
    };
  }

  // Preserve the newest-session-first order established above.
  const rank = new Map(heads.map((head, index) => [head._id, index]));

  const documents = await collection
    .find(
      { sessionId: { $in: heads.map((head) => head._id) } },
      { sort: { timestamp: 1, _id: 1 } },
    )
    .toArray();

  const threads = new Map<string, SessionThread>();
  for (const document of documents) {
    let thread = threads.get(document.sessionId);
    if (!thread) {
      thread = {
        sessionId: document.sessionId,
        startedAt: document.timestamp,
        lastAt: document.timestamp,
        turns: [],
      };
      threads.set(document.sessionId, thread);
    }
    thread.lastAt = document.timestamp;
    thread.turns.push({
      id: document._id.toString(),
      question: document.question,
      answer: document.answer,
      timestamp: document.timestamp,
      latencyMs: document.latencyMs,
    });
  }

  const sessions = [...threads.values()].sort(
    (a, b) => (rank.get(a.sessionId) ?? 0) - (rank.get(b.sessionId) ?? 0),
  );

  return {
    sessions,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
}

/**
 * Streams every log in newest-first order for the CSV export. A cursor is used
 * rather than `toArray()` so a large playtest history never has to sit in
 * memory all at once.
 */
export async function* streamInteractions(): AsyncGenerator<InteractionLog> {
  const collection = await getCollection();
  const cursor = collection.find({}, { sort: SORT_NEWEST_FIRST });
  try {
    for await (const document of cursor) {
      yield document;
    }
  } finally {
    await cursor.close();
  }
}
