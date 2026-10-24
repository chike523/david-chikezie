/**
 * Case studies. Each one is a page at /work/[slug] and a card on the home page.
 */

export type Decision = {
  title: string;
  /** What you chose and why. */
  body: string;
  /** What you gave up by choosing it. */
  trade_off: string;
};

export type Project = {
  slug: string;
  /** Short name shown on the card tag row and in navigation. */
  name: string;
  /** The outcome, written as a headline. This leads the card. */
  headline: string;
  /** The emphasised part of the headline, rendered in italic serif and accent color. */
  headline_emphasis?: string;
  /** One sentence under the headline. */
  summary: string;
  client: string;
  year: string;
  tags: string[];
  /** Accent color for the card panel. Any CSS color. */
  tone: string;
  context: string;
  problem: string;
  role: string;
  decisions: Decision[];
  shipped: string[];
  results: string[];
  stack: string[];
  /** Live link, if any. */
  href?: string;
};

export const projects: Project[] = [
  {
    slug: "approvals",
    name: "Expense approvals",
    headline: "Turning missed emails into confident decisions and cutting approval time from",
    headline_emphasis: "~3 days to under 10 minutes",
    summary: "A faster way to approve without losing the scrutiny that keeps decisions accountable.",
    client: "Placeholder Co",
    year: "2025",
    tags: ["Web", "Mobile", "Full-stack"],
    tone: "#2f4858",
    context:
      "Finance teams at mid-sized companies approve hundreds of expenses a week. The old flow lived in email threads and a spreadsheet, so approvals stalled whenever a manager was travelling.",
    problem:
      "Approvals took days, nobody knew who was blocking, and the audit trail was reconstructed by hand at month end.",
    role: "Sole engineer on a team of three. I owned the data model, the API, the approval UI, and the rollout.",
    decisions: [
      {
        title: "Model approvals as an append-only event log",
        body: "Every approve, reject, and comment is an immutable event. The current state is derived, never edited.",
        trade_off: "Reads need a projection step, so list views are computed from a materialised table rather than the raw log.",
      },
      {
        title: "Ship the mobile approval screen first",
        body: "The bottleneck was managers on the move, so the first release was a single swipe-to-approve screen with the three facts that mattered.",
        trade_off: "Desktop stayed on the old flow for six weeks, which meant two systems in parallel and a careful sync job.",
      },
      {
        title: "Push notifications over email digests",
        body: "A single notification with a deep link beat a daily digest in the pilot by a wide margin.",
        trade_off: "Required a mobile app wrapper and a notification service we did not have before.",
      },
    ],
    shipped: [
      "Approval API with idempotent writes and an event log",
      "Mobile approval screen with swipe actions",
      "Desktop review table with filters and bulk actions",
      "Audit export that matches the finance team's month-end template",
    ],
    results: [
      "Median approval time fell from roughly three days to under ten minutes",
      "Month-end audit prep dropped from two days to a single export",
      "Zero lost approvals in the first quarter after launch",
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "React Native", "Expo"],
  },
  {
    slug: "deploys",
    name: "Deploy pipeline",
    headline: "Cutting a 40 minute deploy to",
    headline_emphasis: "under 6 minutes",
    summary: "A rebuilt pipeline that let a ten-person team ship whenever the tests were green.",
    client: "Second Co",
    year: "2024",
    tags: ["Infrastructure", "DX", "CI"],
    tone: "#5b4a3f",
    context:
      "A monolith with a decade of history and a deploy script that nobody had touched in years. Deploys happened twice a week, after hours, with one person watching.",
    problem:
      "Every deploy was slow and risky, so the team batched changes, which made each deploy riskier. The loop fed itself.",
    role: "Led the project. Paired with the platform engineer on infrastructure and wrote most of the pipeline code.",
    decisions: [
      {
        title: "Build once, promote the same artifact",
        body: "Produce one container image per commit and promote it from staging to production rather than rebuilding.",
        trade_off: "Configuration had to move out of the build and into the runtime environment, which touched a lot of old code.",
      },
      {
        title: "Split the test suite by historical timing",
        body: "Tests are sharded across runners using timing data from the previous run, so no shard is much slower than the rest.",
        trade_off: "A flaky timing file can unbalance shards; it is regenerated nightly to keep it honest.",
      },
      {
        title: "Canary before full rollout",
        body: "Five percent of traffic hits the new version for ten minutes before the rest follows, with automatic rollback on error-rate change.",
        trade_off: "Database migrations must be backward compatible for one release, which is a discipline the team had to learn.",
      },
    ],
    shipped: [
      "Containerised build with layer caching",
      "Sharded test runner with timing-based balancing",
      "Canary rollout with automatic rollback",
      "A deploy dashboard that shows what is live where",
    ],
    results: [
      "Deploy time from about forty minutes to under six",
      "From two deploys a week to several a day",
      "Rollbacks became a button instead of a late night",
    ],
    stack: ["GitHub Actions", "Docker", "Kubernetes", "Go", "Grafana"],
  },
  {
    slug: "search",
    name: "Catalogue search",
    headline: "Making a 1.2 million item catalogue searchable in",
    headline_emphasis: "under 80 milliseconds",
    summary: "Search that understands typos, synonyms, and what people actually mean when they type three letters.",
    client: "First Co",
    year: "2023",
    tags: ["Backend", "Data", "Web"],
    tone: "#3d5a3a",
    context:
      "An industrial parts supplier with a catalogue that had grown by acquisition. Product names were inconsistent and customers searched by part number, brand, or a half-remembered description.",
    problem:
      "Search was a LIKE query on a single column. It was slow, missed obvious matches, and the top complaint from sales was that customers gave up and called instead.",
    role: "Backend lead. I designed the indexing pipeline and the ranking, and paired with a frontend engineer on the results UI.",
    decisions: [
      {
        title: "Index into a dedicated search engine",
        body: "Mirror the catalogue into a search index with analysers tuned for part numbers and product names rather than bolt search onto the primary database.",
        trade_off: "A second source of truth to keep in sync; solved with change-data-capture and a reconciliation job.",
      },
      {
        title: "Rank with behaviour, not just text",
        body: "Click-through and order data feed a boost so the parts people actually buy rise to the top.",
        trade_off: "New products start cold; a small freshness boost keeps them visible for their first month.",
      },
    ],
    shipped: [
      "Indexing pipeline with CDC from the primary database",
      "Typo-tolerant search with synonym expansion",
      "Behavioural ranking signals",
      "Results page with instant filters",
    ],
    results: [
      "p95 search latency under eighty milliseconds",
      "Search-to-cart conversion up by about a third",
      "Sales calls that started with 'I could not find' fell sharply",
    ],
    stack: ["Elasticsearch", "Python", "PostgreSQL", "Debezium", "React"],
  },
  {
    slug: "onboarding",
    name: "Onboarding flow",
    headline: "Lifting activation from",
    headline_emphasis: "31% to 54%",
    summary: "A rebuilt first-run experience that gets people to the moment the product makes sense.",
    client: "Independent project",
    year: "2024",
    tags: ["Web", "Product", "Full-stack"],
    tone: "#6b3a2e",
    context:
      "A small SaaS tool with healthy signups and poor activation. Most new users never completed the setup that made the product useful.",
    problem:
      "Setup asked for everything up front. People bounced on the third form before they had seen any value.",
    role: "Designed and built it end to end, including the instrumentation used to measure it.",
    decisions: [
      {
        title: "Show value before asking for setup",
        body: "A sample workspace loads immediately so the first screen is the product doing something, not a form.",
        trade_off: "Sample data has to be cleaned up when real data arrives, which added a migration path.",
      },
      {
        title: "Defer every optional question",
        body: "Anything not required for the first task is asked later, in context, when the answer matters.",
        trade_off: "Some profile fields now take weeks to fill in, so reports had to handle missing values gracefully.",
      },
    ],
    shipped: [
      "Instant sample workspace",
      "Progressive setup prompts tied to user actions",
      "Event instrumentation and an activation funnel dashboard",
    ],
    results: ["Activation from 31% to 54% in eight weeks", "Time to first meaningful action under two minutes"],
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "PostHog"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string): { previous?: Project; next?: Project } {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return {};
  return {
    previous: projects[index - 1],
    next: projects[index + 1],
  };
}
