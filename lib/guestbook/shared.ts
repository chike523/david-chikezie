/**
 * Guestbook values that are safe to import from client components. No database access here.
 * A signature is a list of strokes. Each stroke is [x, y, x, y, ...] inside SIGNATURE_SPACE.
 */

export const SIGNATURE_SPACE = { width: 1000, height: 400 } as const;

export const GUESTBOOK_LIMITS = {
  /** Minimum gap between two signatures from the same client. */
  cooldown_ms: 60_000,
  page_size: 50,
  max_strokes: 40,
  max_points_per_stroke: 500,
  max_points: 1600,
  /** Reject payloads larger than this before parsing. */
  max_raw_length: 48_000,
} as const;

/** Flat [x, y, x, y, ...] coordinates. One point is a dot; two or more are a line. */
export type Stroke = number[];

export type GuestbookState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export type StrokeParse =
  | { ok: true; strokes: Stroke[] }
  | { ok: false; reason: "empty" | "invalid" | "too_long" };

/** Collapses whitespace and trims; returns an empty string for non-string input. */
export function cleanText(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

function inRange(value: number, max: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= max;
}

/**
 * Accepts only a compact list of in-range integer points. Anything else is rejected
 * so stored strokes can be drawn without treating them as text.
 */
export function parseStrokes(raw: string): StrokeParse {
  if (raw.length > GUESTBOOK_LIMITS.max_raw_length) return { ok: false, reason: "too_long" };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (!Array.isArray(parsed)) return { ok: false, reason: "invalid" };
  if (parsed.length === 0) return { ok: false, reason: "empty" };
  if (parsed.length > GUESTBOOK_LIMITS.max_strokes) return { ok: false, reason: "too_long" };

  const strokes: Stroke[] = [];
  let points = 0;

  for (const stroke of parsed) {
    if (!Array.isArray(stroke) || stroke.length < 2 || stroke.length % 2 !== 0) {
      return { ok: false, reason: "invalid" };
    }
    const count = stroke.length / 2;
    if (count > GUESTBOOK_LIMITS.max_points_per_stroke) return { ok: false, reason: "too_long" };
    points += count;
    if (points > GUESTBOOK_LIMITS.max_points) return { ok: false, reason: "too_long" };

    for (let index = 0; index < stroke.length; index += 2) {
      const x = stroke[index];
      const y = stroke[index + 1];
      if (typeof x !== "number" || typeof y !== "number") return { ok: false, reason: "invalid" };
      if (!inRange(x, SIGNATURE_SPACE.width) || !inRange(y, SIGNATURE_SPACE.height)) {
        return { ok: false, reason: "invalid" };
      }
    }
    strokes.push(stroke as Stroke);
  }

  return { ok: true, strokes };
}

/** SVG path for a stroke with at least two points. Coordinates are already validated numbers. */
export function strokePath(stroke: Stroke): string {
  const [x0, y0] = stroke;
  let path = `M ${x0} ${y0}`;
  if (stroke.length === 4) return `${path} L ${stroke[2]} ${stroke[3]}`;

  for (let index = 2; index < stroke.length - 2; index += 2) {
    const x = stroke[index];
    const y = stroke[index + 1];
    const next_x = stroke[index + 2];
    const next_y = stroke[index + 3];
    path += ` Q ${x} ${y} ${(x + next_x) / 2} ${(y + next_y) / 2}`;
  }
  path += ` L ${stroke[stroke.length - 2]} ${stroke[stroke.length - 1]}`;
  return path;
}
