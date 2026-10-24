import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * One libSQL client per process. Locally this is a file; in production it is Turso.
 * Set TURSO_DATABASE_URL (and TURSO_AUTH_TOKEN for remote databases) to point elsewhere.
 */
const url = process.env.TURSO_DATABASE_URL ?? "file:local.db";
const auth_token = process.env.TURSO_AUTH_TOKEN;

declare global {
  var __portfolio_libsql: Client | undefined;
}

const client = globalThis.__portfolio_libsql ?? createClient({ url, authToken: auth_token });
if (process.env.NODE_ENV !== "production") globalThis.__portfolio_libsql = client;

export const db = drizzle(client, { schema });

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
  const info = await client.execute("select name from pragma_table_info('guestbook_entries')");
  const columns = info.rows.map((row) => String(row.name));
  if (columns.length > 0 && !columns.includes("strokes")) {
    await client.execute("drop table guestbook_entries");
  }
  await client.batch(CREATE_GUESTBOOK, "write");
}

export function ensureSchema(): Promise<void> {
  schema_ready ??= prepareSchema().catch((error: unknown) => {
    schema_ready = undefined;
    throw error;
  });
  return schema_ready;
}
