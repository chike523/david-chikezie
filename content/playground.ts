/**
 * Experiments and small builds. Shown on the home page (first six) and at /playground.
 */

export type Experiment = {
  id: string;
  title: string;
  description: string;
  /** Short mono tag, e.g. "CLI", "Web", "Rust". */
  kind: string;
  year: string;
  href?: string;
  /** Image under /public, or undefined for a placeholder. */
  src?: string;
};

export const experiments: Experiment[] = [
  {
    id: "receipt-printer",
    title: "Receipt printer",
    description: "A payment receipt that prints itself line by line, with real thermal-printer pacing.",
    kind: "Web",
    year: "2025",
  },
  {
    id: "undo-toast",
    title: "Undo everything",
    description: "A tiny library that makes any destructive action undoable for thirty seconds.",
    kind: "Library",
    year: "2025",
  },
  {
    id: "cron-cli",
    title: "cron, but readable",
    description: "A CLI that explains a cron expression in plain English and shows the next five runs.",
    kind: "CLI",
    year: "2024",
  },
  {
    id: "sql-diff",
    title: "Schema diff",
    description: "Point it at two Postgres databases and get a migration that moves one to the other.",
    kind: "CLI",
    year: "2024",
  },
  {
    id: "menu-bar",
    title: "Skewing menu",
    description: "A menu bar that skews toward the pointer and settles with a spring.",
    kind: "Web",
    year: "2024",
  },
  {
    id: "log-tail",
    title: "Pretty tail",
    description: "A log tailer that colours by level, folds stack traces, and never loses your place.",
    kind: "CLI",
    year: "2023",
  },
  {
    id: "keyboard-map",
    title: "Keyboard heatmap",
    description: "Records which keys you hit all day and draws a heatmap of your keyboard at midnight.",
    kind: "Desktop",
    year: "2023",
  },
  {
    id: "colour-contrast",
    title: "Contrast checker",
    description: "Paste a palette, get every pair that fails WCAG and a nudged version that passes.",
    kind: "Web",
    year: "2023",
  },
];
