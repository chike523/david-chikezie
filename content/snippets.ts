/**
 * Small pieces of work for the snippets wall.
 * UI snippets render as a framed screen placeholder; code snippets render as a terminal card.
 */

export type SnippetCategory = "web" | "mobile" | "backend";

export type Snippet = {
  id: string;
  title: string;
  category: SnippetCategory;
  /** True when this shipped to real users under your name. */
  shipped?: boolean;
  /** Image under /public, or undefined for a placeholder frame. */
  src?: string;
  /** For backend snippets: a few lines of code or terminal output. */
  code?: string;
  /** Short description shown in the lightbox. */
  note?: string;
};

export const snippet_categories: { id: SnippetCategory | "shipped"; label: string }[] = [
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "backend", label: "Backend" },
  { id: "shipped", label: "Shipped by me" },
];

export const snippets: Snippet[] = [
  { id: "onboarding", title: "Onboarding", category: "web", shipped: true, note: "First-run flow with a sample workspace loaded before any form." },
  { id: "empty-state", title: "Empty state", category: "web", note: "An empty state that teaches the next action instead of apologising." },
  { id: "filters", title: "Instant filters", category: "web", shipped: true, note: "Filters that update results as you type, with URL state." },
  { id: "deploy-dash", title: "Deploy dashboard", category: "web", note: "What is live where, with a one-click rollback." },
  { id: "bulk-actions", title: "Bulk actions", category: "web", note: "Select, preview, confirm. Undo for thirty seconds." },
  { id: "command-palette", title: "Command palette", category: "web", note: "Keyboard-first navigation for a dense admin tool." },
  { id: "activity-feed", title: "Activity feed", category: "web", note: "Grouped by day, collapsible by actor." },
  { id: "settings", title: "Settings", category: "web", note: "A settings page with inline validation and autosave." },
  { id: "pricing", title: "Pricing table", category: "web", note: "Monthly and annual toggle with the saving shown, not hidden." },
  { id: "table", title: "Data table", category: "web", note: "Sticky header, resizable columns, keyboard navigation." },

  { id: "swipe-approve", title: "Swipe to approve", category: "mobile", shipped: true, note: "One screen, three facts, a swipe." },
  { id: "receipt", title: "Receipt capture", category: "mobile", note: "Camera, crop, and a confidence hint from the OCR." },
  { id: "push", title: "Notification", category: "mobile", note: "A single actionable notification with a deep link." },
  { id: "offline", title: "Offline banner", category: "mobile", note: "Queued actions shown while the network is down." },
  { id: "ticket", title: "Ticket", category: "mobile", note: "A boarding pass style card with a live countdown." },
  { id: "mobile-onboarding", title: "Mobile onboarding", category: "mobile", note: "Three screens, skippable, remembered." },

  {
    id: "event-log",
    title: "Append-only approvals",
    category: "backend",
    shipped: true,
    code: `create table approval_events (
  id          bigserial primary key,
  expense_id  uuid not null,
  kind        text not null check (kind in ('approve','reject','comment')),
  actor_id    uuid not null,
  payload     jsonb not null default '{}',
  created_at  timestamptz not null default now()
);
create index on approval_events (expense_id, created_at);`,
    note: "Current state is a projection. Nothing is ever edited.",
  },
  {
    id: "idempotent",
    title: "Idempotent writes",
    category: "backend",
    code: `export async function approve(input: ApproveInput, key: string) {
  return db.transaction(async (tx) => {
    const seen = await tx.query.idempotency.findFirst({ where: eq(idempotency.key, key) });
    if (seen) return seen.response;
    const result = await appendEvent(tx, input);
    await tx.insert(idempotency).values({ key, response: result });
    return result;
  });
}`,
    note: "Retries from flaky mobile networks produce one event, not three.",
  },
  {
    id: "shards",
    title: "Timing-balanced shards",
    category: "backend",
    code: `$ ci shard --from timings.json --count 8
shard 1  214 files   4m 51s
shard 2  198 files   4m 49s
shard 3  231 files   4m 53s
...
longest shard 4m 55s   previous 11m 02s`,
    note: "Test files are packed by their last known duration so no shard drags the rest.",
  },
  {
    id: "canary",
    title: "Canary rollout",
    category: "backend",
    code: `strategy:
  canary:
    steps:
      - setWeight: 5
      - pause: { duration: 10m }
      - analysis:
          templates: [{ templateName: error-rate }]
      - setWeight: 100`,
    note: "Five percent for ten minutes, then everyone, unless the error rate moves.",
  },
  {
    id: "search-analyzer",
    title: "Part-number analyser",
    category: "backend",
    code: `"analysis": {
  "analyzer": {
    "part_number": {
      "tokenizer": "keyword",
      "filter": ["lowercase", "strip_separators", "edge_ngram_2_12"]
    }
  }
}`,
    note: "Lets 'AB-123/4' match 'ab1234' and 'AB 123'.",
  },
];
