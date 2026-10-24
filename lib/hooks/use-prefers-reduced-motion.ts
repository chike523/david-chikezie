"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(on_change: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", on_change);
  return () => media.removeEventListener("change", on_change);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * Whether the visitor prefers reduced motion.
 *
 * Unlike motion's `useReducedMotion`, this is hydration-safe: the server and the first client
 * render both report `false`, then React re-renders with the real preference before paint.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
