import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Guestbook entries. One row per drawn signature; nothing is ever edited.
 * `strokes` is JSON: a list of [x, y, x, y, ...] polylines inside the signature pad.
 */
export const guestbook_entries = sqliteTable(
  "guestbook_entries",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    strokes: text("strokes").notNull(),
    /** Hashed client IP used only for rate limiting. */
    ip_hash: text("ip_hash").notNull(),
    created_at: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("guestbook_created_at_idx").on(table.created_at), index("guestbook_ip_hash_idx").on(table.ip_hash)],
);

export type GuestbookEntry = typeof guestbook_entries.$inferSelect;
export type NewGuestbookEntry = typeof guestbook_entries.$inferInsert;
