"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio:preloaded";
const DURATION_MS = 1100;

type PreloaderProps = {
  name: string;
};

/**
 * A short counter shown once per browser session. Skipped entirely when the visitor prefers reduced motion.
 */
export function Preloader({ name }: PreloaderProps) {
  const reduce_motion = usePrefersReducedMotion();
  const [visible, set_visible] = useState(false);
  const [progress, set_progress] = useState(0);

  useEffect(() => {
    // Re-check the media query here too, so a stale first render can never start the counter.
    if (reduce_motion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let already_seen = false;
    try {
      already_seen = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      already_seen = false;
    }
    if (already_seen) return;

    let started: number | null = null;
    let frame = 0;

    const tick = (now: number) => {
      if (started === null) {
        started = now;
        set_visible(true);
      }
      const elapsed = now - started;
      const next = Math.min(100, Math.round((elapsed / DURATION_MS) * 100));
      set_progress(next);
      if (next < 100) {
        frame = window.requestAnimationFrame(tick);
      } else {
        try {
          window.sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {
          // Storage can be unavailable in private mode; the preloader simply shows again next time.
        }
        window.setTimeout(() => set_visible(false), 180);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [reduce_motion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-live="polite"
          aria-label="Loading"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-accent p-6 text-accent-ink sm:p-8"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-start justify-between">
            <p className="label !text-accent-ink/80">{name}</p>
            <p className="label !text-accent-ink/80">glad you dropped by</p>
          </div>
          <div className="mx-auto h-px w-48 bg-accent-ink/40">
            <div className="h-px bg-accent-ink transition-[width]" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-end justify-between">
            <p className="font-serif text-5xl tabular-nums sm:text-6xl">
              {String(progress).padStart(3, "0")}
              <span className="text-2xl">%</span>
            </p>
            <p className="label !text-accent-ink/80">full-stack product engineer</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
