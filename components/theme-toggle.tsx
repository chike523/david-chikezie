"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe_noop = () => () => {};

/**
 * True after hydration, false during server rendering. Keeps the first client render identical to the server's.
 */
function useMounted() {
  return useSyncExternalStore(
    subscribe_noop,
    () => true,
    () => false,
  );
}

/**
 * Light / dark switch. Renders a neutral button until mounted so the server and client markup match.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const is_dark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(is_dark ? "light" : "dark")}
      aria-label={is_dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={is_dark}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
    >
      {is_dark ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
