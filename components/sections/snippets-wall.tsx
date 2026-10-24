"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { useEffect, useMemo, useState } from "react";
import type { Snippet, SnippetCategory } from "@/content/snippets";
import { snippet_categories } from "@/content/snippets";

type Filter = SnippetCategory | "shipped";

type SnippetsWallProps = {
  snippets: Snippet[];
};

function matches(snippet: Snippet, filter: Filter) {
  return filter === "shipped" ? Boolean(snippet.shipped) : snippet.category === filter;
}

export function SnippetsWall({ snippets }: SnippetsWallProps) {
  const reduce_motion = usePrefersReducedMotion();
  const [filter, set_filter] = useState<Filter>("web");
  const [open, set_open] = useState<Snippet | null>(null);

  const counts = useMemo(() => {
    const result = {} as Record<Filter, number>;
    for (const category of snippet_categories) {
      result[category.id] = snippets.filter((snippet) => matches(snippet, category.id)).length;
    }
    return result;
  }, [snippets]);

  const visible = snippets.filter((snippet) => matches(snippet, filter));

  useEffect(() => {
    if (!open) return;
    const on_key = (event: KeyboardEvent) => {
      if (event.key === "Escape") set_open(null);
    };
    window.addEventListener("keydown", on_key);
    return () => window.removeEventListener("keydown", on_key);
  }, [open]);

  return (
    <div>
      <div role="tablist" aria-label="Snippet categories" className="flex flex-wrap gap-2">
        {snippet_categories.map((category) => {
          const selected = filter === category.id;
          return (
            <button
              key={category.id}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => set_filter(category.id)}
              className={`label rounded-full border px-3 py-1.5 normal-case tracking-normal transition-colors ${
                selected ? "border-ink bg-ink text-paper" : "border-line text-ink-2 hover:border-ink-3 hover:text-ink"
              }`}
            >
              {category.label}
              <span className={`ml-2 tabular-nums ${selected ? "text-paper/70" : "text-ink-3"}`}>{counts[category.id]}</span>
            </button>
          );
        })}
      </div>

      <motion.ul layout={!reduce_motion} className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" role="tabpanel">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((snippet) => (
            <motion.li
              key={snippet.id}
              layout={!reduce_motion}
              initial={reduce_motion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce_motion ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
            >
              <button
                type="button"
                onClick={() => set_open(snippet)}
                aria-label={`Open ${snippet.title} full size`}
                className="group block w-full text-left"
              >
                <SnippetThumb snippet={snippet} />
                <span className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-ink-2 group-hover:text-ink">{snippet.title}</span>
                  {snippet.shipped && <span className="label !text-[0.6rem] text-accent">shipped</span>}
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => set_open(null)}
          >
            <motion.div
              className="w-full max-w-2xl rounded-md border border-line bg-card p-4 shadow-2xl"
              initial={reduce_motion ? false : { scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={reduce_motion ? undefined : { scale: 0.96, y: 12 }}
              onClick={(event) => event.stopPropagation()}
            >
              <SnippetThumb snippet={open} large />
              <div className="mt-4 flex items-start justify-between gap-6">
                <div>
                  <h3 className="font-serif text-2xl text-ink">{open.title}</h3>
                  {open.note && <p className="mt-1 text-sm text-ink-2">{open.note}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => set_open(null)}
                  className="label rounded-full border border-line px-3 py-1.5 hover:border-ink hover:text-ink"
                >
                  close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SnippetThumb({ snippet, large = false }: { snippet: Snippet; large?: boolean }) {
  if (snippet.code) {
    return (
      <div
        className={`overflow-hidden rounded-md border border-line bg-[#1a1713] text-[#e8e2d4] ${large ? "" : "aspect-[4/5]"}`}
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-white/30" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/10" />
          <span className="label ml-2 !text-[0.6rem] !text-white/50">{snippet.title}</span>
        </div>
        <pre className={`overflow-hidden p-3 font-mono leading-relaxed ${large ? "text-xs sm:text-sm" : "text-[9px] sm:text-[10px]"}`}>
          <code>{snippet.code}</code>
        </pre>
      </div>
    );
  }

  const is_mobile = snippet.category === "mobile";

  return (
    <div
      className={`relative overflow-hidden rounded-md border border-line bg-paper-2 ${large ? "aspect-[16/10]" : "aspect-[4/5]"}`}
      aria-hidden="true"
    >
      {snippet.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={snippet.src} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            className={`relative rounded-lg border border-line bg-card shadow-sm ${
              is_mobile ? "aspect-[9/19] h-[88%]" : "aspect-[16/10] w-[88%]"
            }`}
          >
            <div className="absolute inset-x-3 top-3 h-2 w-1/2 rounded bg-ink/15" />
            <div className="absolute inset-x-3 top-7 h-2 w-1/3 rounded bg-ink/10" />
            <div className="absolute inset-x-3 top-12 grid grid-cols-2 gap-2">
              <div className="h-6 rounded bg-ink/8" />
              <div className="h-6 rounded bg-ink/8" />
            </div>
            <div className="absolute inset-x-3 bottom-3 h-7 rounded-full bg-accent/80" />
          </div>
        </div>
      )}
    </div>
  );
}
