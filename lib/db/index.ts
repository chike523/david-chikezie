import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Locally this is a file. In production set TURSO_DATABASE_URL (and TURSO_AUTH_TOKEN).
 * On Vercel a missing URL must stay closed: opening file:local.db throws and aborts the page.
 */
function databaseUrl(): string | null {
  const remote = process.env.TURSO_DATABASE_URL?.trim();
  if (remote) return remote;
  if (process.env.VERCEL) return null;
  return "file:local.db";
}

/** False on Vercel until TURSO_DATABASE_URL is set. */
export function databaseConfigured(): boolean {
  return databaseUrl() !== null;
}

declare global {
  var __portfolio_libsql: Client | undefined;
}

function client(): Client {
  const url = databaseUrl();
  if (!url) throw new Error("No database is configured.");
  const existing = globalThis.__portfolio_libsql;
  if (existing) return existing;
  const created = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  globalThis.__portfolio_libsql = created;
  return created;
}

export function database(): LibSQLDatabase<typeof schema> {
  return drizzle(client(), { schema });
}

let schema_ready: Promise<void> | undefined;

const CREATE_GUESTBOOK = [
  `create table if not exists guestbook_entries (
    id integer primary key autoincrement,
    strokes text not null,
    ip_hash text not null,
    created_at integer not null
  )`,
  `create index if not exists guestbook_created_at_idx on guestbook_entries (created_at)`,
  `create index if not exists guestbook_ip_hash_idx on guestbook_entries (ip_hash)`,
];

/**
 * Creates the tables if they do not exist. Cheap to call repeatedly; runs once per process.
 * A table left over from the typed guestbook (name + message, no strokes) is replaced,
 * because those rows cannot be drawn.
 */
async function prepareSchema(): Promise<void> {
  const connection = client();
  const info = await connection.execute("select name from pragma_table_info('guestbook_entries')");
  const columns = info.rows.map((row) => String(row.name));
  if (columns.length > 0 && !columns.includes("strokes")) {
    await connection.execute("drop table guestbook_entries");
  }
  await connection.batch(CREATE_GUESTBOOK, "write");
}

export function ensureSchema(): Promise<void> {
  schema_ready ??= prepareSchema().catch((error: unknown) => {
    schema_ready = undefined;
    throw error;
  });
  return schema_ready;
}
