import "server-only";

import { MongoClient, type Db } from "mongodb";

import { env } from "@/lib/env";

/**
 * A single MongoClient is shared across all invocations on a warm serverless
 * instance. The connection promise is stashed on `globalThis` so Next.js's dev
 * hot-reload does not open a new pool on every edit.
 */
declare global {
  var __tcgMongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  const client = new MongoClient(env.mongoUri(), {
    // Fail fast rather than holding a player's request open — a logging outage
    // must never block the AI answer.
    serverSelectionTimeoutMS: 5_000,
    connectTimeoutMS: 5_000,
    maxPoolSize: 10,
  });
  return client.connect();
}

export function getMongoClient(): Promise<MongoClient> {
  if (!global.__tcgMongoClientPromise) {
    global.__tcgMongoClientPromise = createClientPromise().catch((error) => {
      global.__tcgMongoClientPromise = undefined; // allow a later retry
      throw error;
    });
  }
  return global.__tcgMongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(env.mongoDbName());
}
