import { createHash } from "node:crypto";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { db, ensureSchema } from "@/lib/db";
import { guestbook_entries } from "@/lib/db/schema";
import { GUESTBOOK_LIMITS, parseStrokes, type Stroke } from "@/lib/guestbook/shared";

export type PublicEntry = {
  id: number;
  strokes: Stroke[];
  created_at: Date;
};

export function hashIp(ip: string): string {
  const salt = process.env.GUESTBOOK_SALT ?? "portfolio-guestbook";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function listEntries(): Promise<{ entries: PublicEntry[]; total: number }> {
  await ensureSchema();
  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: guestbook_entries.id,
        strokes: guestbook_entries.strokes,
        created_at: guestbook_entries.created_at,
      })
      .from(guestbook_entries)
      .orderBy(desc(guestbook_entries.created_at), desc(guestbook_entries.id))
      .limit(GUESTBOOK_LIMITS.page_size),
    db.select({ total: sql<number>`count(*)` }).from(guestbook_entries),
  ]);

  const entries: PublicEntry[] = [];
  for (const row of rows) {
    const parsed = parseStrokes(row.strokes);
    if (!parsed.ok) continue;
    entries.push({ id: row.id, strokes: parsed.strokes, created_at: row.created_at });
  }
  return { entries, total: Number(total) };
}

export async function recentlySigned(ip_hash: string, now: Date): Promise<boolean> {
  await ensureSchema();
  const since = new Date(now.getTime() - GUESTBOOK_LIMITS.cooldown_ms);
  const rows = await db
    .select({ id: guestbook_entries.id })
    .from(guestbook_entries)
    .where(and(eq(guestbook_entries.ip_hash, ip_hash), gt(guestbook_entries.created_at, since)))
    .limit(1);
  return rows.length > 0;
}

export async function insertEntry(input: { strokes: Stroke[]; ip_hash: string; now: Date }): Promise<void> {
  await ensureSchema();
  await db.insert(guestbook_entries).values({
    strokes: JSON.stringify(input.strokes),
    ip_hash: input.ip_hash,
    created_at: input.now,
  });
}
