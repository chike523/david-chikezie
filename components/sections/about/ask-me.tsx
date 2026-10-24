"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { useRef, useState } from "react";
import type { ChatEntry } from "@/content/chatbot";

type Message = { id: number; from: "visitor" | "host"; text: string };

type AskMeProps = {
  greeting: string;
  disclaimer: string;
  entries: ChatEntry[];
  host_name: string;
};

/**
 * A chat that only answers pre-written questions. No input box, no network.
 */
export function AskMe({ greeting, disclaimer, entries, host_name }: AskMeProps) {
  const reduce_motion = usePrefersReducedMotion();
  const [messages, set_messages] = useState<Message[]>([{ id: 0, from: "host", text: greeting }]);
  const [asked, set_asked] = useState<Set<string>>(new Set());
  const [typing, set_typing] = useState(false);
  const next_id = useRef(1);

  const ask = (entry: ChatEntry) => {
    if (typing) return;
    const question_id = next_id.current;
    next_id.current += 2;
    set_messages((current) => [...current, { id: question_id, from: "visitor", text: entry.question }]);
    set_asked((current) => new Set(current).add(entry.id));
    set_typing(true);
    const delay = reduce_motion ? 0 : 550;
    window.setTimeout(() => {
      set_messages((current) => [...current, { id: question_id + 1, from: "host", text: entry.answer }]);
      set_typing(false);
    }, delay);
  };

  const remaining = entries.filter((entry) => !asked.has(entry.id));

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <ol className="flex min-h-[260px] flex-col gap-3" aria-live="polite">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.li
                key={message.id}
                initial={reduce_motion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${message.from === "visitor" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    message.from === "visitor"
                      ? "rounded-br-sm bg-ink text-paper"
                      : "rounded-bl-sm border border-line bg-paper text-ink"
                  }`}
                >
                  {message.from === "host" && <span className="label mb-1 block !text-[0.6rem]">{host_name}</span>}
                  {message.text}
                </div>
              </motion.li>
            ))}
            {typing && (
              <motion.li key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex">
                <div className="rounded-2xl rounded-bl-sm border border-line bg-paper px-4 py-2.5">
                  <span className="label">typing…</span>
                </div>
              </motion.li>
            )}
          </AnimatePresence>
        </ol>
      </div>

      <div className="lg:col-span-5">
        <p className="label">What do you want to know?</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {remaining.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => ask(entry)}
                disabled={typing}
                className="rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-2 transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
              >
                {entry.question}
              </button>
            </li>
          ))}
          {remaining.length === 0 && <li className="text-sm text-ink-3">That is every question I know. Email is in the footer.</li>}
        </ul>
        <p className="mt-6 text-xs text-ink-3">{disclaimer}</p>
      </div>
    </div>
  );
}
