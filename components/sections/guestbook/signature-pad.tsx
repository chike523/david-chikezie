"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { signGuestbook } from "@/app/actions/guestbook";
import { GUESTBOOK_LIMITS, SIGNATURE_SPACE, type GuestbookState, type Stroke } from "@/lib/guestbook/shared";

const INK = "#1c1915";
const initial: GuestbookState = { status: "idle" };

function draw(canvas: HTMLCanvasElement, strokes: Stroke[]) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  ctx.lineWidth = Math.max(1.75, (16 / SIGNATURE_SPACE.width) * rect.width);

  for (const stroke of strokes) {
    if (stroke.length < 2) continue;
    if (stroke.length === 2) {
      ctx.beginPath();
      ctx.arc(xOf(stroke[0], rect.width), yOf(stroke[1], rect.height), ctx.lineWidth * 0.55, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(xOf(stroke[0], rect.width), yOf(stroke[1], rect.height));
    for (let index = 2; index < stroke.length; index += 2) {
      ctx.lineTo(xOf(stroke[index], rect.width), yOf(stroke[index + 1], rect.height));
    }
    ctx.stroke();
  }
}

function xOf(value: number, width: number) {
  return (value / SIGNATURE_SPACE.width) * width;
}

function yOf(value: number, height: number) {
  return (value / SIGNATURE_SPACE.height) * height;
}

function locate(event: React.PointerEvent<HTMLCanvasElement>): [number, number] {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = Math.round(((event.clientX - rect.left) / rect.width) * SIGNATURE_SPACE.width);
  const y = Math.round(((event.clientY - rect.top) / rect.height) * SIGNATURE_SPACE.height);
  return [clamp(x, SIGNATURE_SPACE.width), clamp(y, SIGNATURE_SPACE.height)];
}

function clamp(value: number, max: number) {
  return Math.min(max, Math.max(0, value));
}

export function SignaturePad() {
  const [state, action, pending] = useActionState(signGuestbook, initial);
  const [has_ink, set_has_ink] = useState(false);
  const [was_pending, set_was_pending] = useState(pending);
  const canvas_ref = useRef<HTMLCanvasElement>(null);
  const strokes_ref = useRef<Stroke[]>([]);
  const drawing_ref = useRef(false);

  // `pending` flips back to false in the same render the action result arrives. The button state
  // updates here; the canvas itself is cleared in the effect below, which is the DOM write.
  if (pending !== was_pending) {
    set_was_pending(pending);
    if (!pending && state.status === "success") set_has_ink(false);
  }

  useEffect(() => {
    const canvas = canvas_ref.current;
    if (!canvas) return;
    const redraw = () => draw(canvas, strokes_ref.current);
    redraw();
    const observer = new ResizeObserver(redraw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (pending || state.status !== "success") return;
    strokes_ref.current = [];
    const canvas = canvas_ref.current;
    if (canvas) draw(canvas, []);
  }, [pending, state]);

  function redraw() {
    const canvas = canvas_ref.current;
    if (canvas) draw(canvas, strokes_ref.current);
  }

  function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (drawing_ref.current || pending) return;
    if (strokes_ref.current.length >= GUESTBOOK_LIMITS.max_strokes) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing_ref.current = true;
    const [x, y] = locate(event);
    strokes_ref.current.push([x, y]);
    set_has_ink(true);
    redraw();
  }

  function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing_ref.current) return;
    const stroke = strokes_ref.current.at(-1);
    if (!stroke) return;
    if (stroke.length / 2 >= GUESTBOOK_LIMITS.max_points_per_stroke) return;
    const [x, y] = locate(event);
    const previous_x = stroke[stroke.length - 2];
    const previous_y = stroke[stroke.length - 1];
    if (Math.hypot(x - previous_x, y - previous_y) < 3) return;
    stroke.push(x, y);
    redraw();
  }

  function onPointerUp() {
    drawing_ref.current = false;
  }

  function undo() {
    strokes_ref.current.pop();
    set_has_ink(strokes_ref.current.length > 0);
    redraw();
  }

  function clear() {
    strokes_ref.current = [];
    set_has_ink(false);
    redraw();
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    const field = event.currentTarget.elements.namedItem("strokes");
    if (field instanceof HTMLInputElement) field.value = JSON.stringify(strokes_ref.current);
  }

  return (
    <form action={action} onSubmit={onSubmit} className="rounded-md border border-[#1c1915]/10 bg-[#faf8f2] p-4 text-[#1c1915] sm:p-5">
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="strokes" defaultValue="[]" />

      <p className="font-hand text-xl leading-none text-[#8a847a]">sign here</p>
      <div className="relative mt-2">
        <div className="pointer-events-none absolute inset-x-4 bottom-[22%] border-b border-[#1c1915]/15" aria-hidden="true" />
        <canvas
          ref={canvas_ref}
          aria-label="Signature pad. Draw with a mouse, finger, or pen."
          className="relative aspect-[5/2] w-full touch-none cursor-crosshair"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm" role="status" aria-live="polite">
          {state.status === "success" && <span>{state.message}</span>}
          {state.status === "error" && <span className="text-accent">{state.message}</span>}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={!has_ink || pending}
            className="rounded-full px-3 py-2 text-sm text-[#4a453d] transition-opacity hover:text-[#1c1915] disabled:opacity-40"
          >
            undo
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={!has_ink || pending}
            className="rounded-full px-3 py-2 text-sm text-[#4a453d] transition-opacity hover:text-[#1c1915] disabled:opacity-40"
          >
            clear
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[#1c1915] px-4 py-2 text-sm text-[#faf8f2] transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {pending ? "signing…" : "sign the wall"}
          </button>
        </div>
      </div>
    </form>
  );
}
