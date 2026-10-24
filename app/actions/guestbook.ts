"use server";

import { headers } from "next/headers";
import { refresh } from "next/cache";
import { cleanText, parseStrokes, type GuestbookState } from "@/lib/guestbook/shared";
import { databaseConfigured } from "@/lib/db";
import { hashIp, insertEntry, recentlySigned } from "@/lib/guestbook/server";

async function clientIp(): Promise<string> {
  const header_store = await headers();
  const forwarded = header_store.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return header_store.get("x-real-ip") ?? "unknown";
}

/**
 * Saves a drawn signature. Validates the strokes on the server, applies a per-client cooldown,
 * then refreshes the wall.
 */
export async function signGuestbook(_previous: GuestbookState, form_data: FormData): Promise<GuestbookState> {
  // A hidden field that humans never see; bots that fill every input trip it.
  if (cleanText(form_data.get("website")) !== "") {
    return { status: "success", message: "Thanks for signing." };
  }

  const raw = form_data.get("strokes");
  const parsed = parseStrokes(typeof raw === "string" ? raw : "");
  if (!parsed.ok) {
    if (parsed.reason === "too_long") {
      return { status: "error", message: "That one is a bit much. Clear it and try a shorter signature." };
    }
    return { status: "error", message: "Draw your signature first." };
  }

  if (!databaseConfigured()) {
    return { status: "error", message: "The wall isn't connected to a database yet." };
  }

  const ip_hash = hashIp(await clientIp());
  const now = new Date();

  try {
    if (await recentlySigned(ip_hash, now)) {
      return { status: "error", message: "You signed a moment ago. Give it a minute before signing again." };
    }
    await insertEntry({ strokes: parsed.strokes, ip_hash, now });
  } catch (error) {
    console.error("guestbook insert failed", error);
    return { status: "error", message: "Could not save that. Try again in a moment." };
  }

  refresh();
  return { status: "success", message: "Thanks for signing. You are on the wall." };
}
