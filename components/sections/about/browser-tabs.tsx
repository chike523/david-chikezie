"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { useCallback, useEffect, useId, useState } from "react";

export type TabId = "about-me" | "work-log" | "travel" | "music" | "ask-me";

export type Tab = {
  id: TabId;
  label: string;
  /** Fake address bar text. */
  url: string;
  content: React.ReactNode;
};

const TAB_IDS: TabId[] = ["about-me", "work-log", "travel", "music", "ask-me"];

function read_hash(): TabId | null {
  const raw = window.location.hash.replace(/^#/, "");
  return (TAB_IDS as string[]).includes(raw) ? (raw as TabId) : null;
}

/**
 * A fake browser window whose tabs are the about-section panels.
 * The active tab is mirrored into the URL hash so each one can be linked to.
 */
export function BrowserTabs({ tabs }: { tabs: Tab[] }) {
  const reduce_motion = usePrefersReducedMotion();
  const base_id = useId();
  const [active, set_active] = useState<TabId>(tabs[0].id);

  useEffect(() => {
    const sync = () => {
      const from_hash = read_hash();
      if (from_hash) set_active(from_hash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const select = useCallback((id: TabId) => {
    set_active(id);
    // Replace rather than push so the back button is not filled with tab changes.
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  const on_key = (event: React.KeyboardEvent, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = tabs[(index + delta + tabs.length) % tabs.length];
    select(next.id);
    document.getElementById(`${base_id}-tab-${next.id}`)?.focus();
  };

  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)]">
      {/* Title bar with traffic lights and tabs */}
      <div className="flex items-end gap-2 border-b border-line bg-paper-2 px-3 pt-2">
        <div className="mb-2.5 mr-1 hidden items-center gap-1.5 sm:flex" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ec6a5e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f4bf4f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#61c554]" />
        </div>
        <div role="tablist" aria-label="About" className="no-scrollbar flex flex-1 gap-1 overflow-x-auto">
          {tabs.map((tab, index) => {
            const selected = tab.id === active;
            return (
              <button
                key={tab.id}
                id={`${base_id}-tab-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${base_id}-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(tab.id)}
                onKeyDown={(event) => on_key(event, index)}
                className={`relative shrink-0 rounded-t-md px-3.5 py-2 text-xs transition-colors sm:text-sm ${
                  selected ? "bg-card text-ink" : "text-ink-3 hover:text-ink"
                }`}
              >
                {tab.label}
                {selected && !reduce_motion && (
                  <motion.span layoutId={`${base_id}-tab-underline`} className="absolute inset-x-0 -bottom-px h-px bg-card" />
                )}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          aria-label="Open a new tab"
          onClick={() => select(tabs[(tabs.findIndex((tab) => tab.id === active) + 1) % tabs.length].id)}
          className="mb-1.5 hidden h-7 w-7 items-center justify-center rounded text-ink-3 hover:bg-card hover:text-ink sm:flex"
        >
          +
        </button>
      </div>

      {/* Address bar */}
      <div className="flex items-center gap-3 border-b border-line px-3 py-2">
        <span className="label hidden !tracking-normal !normal-case sm:inline" aria-hidden="true">
          ← →
        </span>
        <div className="label flex-1 truncate rounded-md bg-paper-2 px-3 py-1.5 normal-case tracking-normal">{current.url}</div>
      </div>

      {/* Panel */}
      <div className="relative min-h-[420px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            id={`${base_id}-panel-${current.id}`}
            role="tabpanel"
            aria-labelledby={`${base_id}-tab-${current.id}`}
            initial={reduce_motion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce_motion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="p-5 sm:p-8"
          >
            {current.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
