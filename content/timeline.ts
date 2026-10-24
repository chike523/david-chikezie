/**
 * Work history for the "work log" tab, newest first.
 */

export type TimelineEntry = {
  company: string;
  role: string;
  from: string;
  to: string;
  /** One line on what you did there. */
  note?: string;
  current?: boolean;
};

export const timeline: TimelineEntry[] = [
  {
    company: "Placeholder Co",
    role: "Senior Product Engineer",
    from: "2025",
    to: "now",
    note: "Approvals, payments, and the internal tools around them.",
    current: true,
  },
  {
    company: "Second Co",
    role: "Product Engineer",
    from: "2023",
    to: "25",
    note: "Rebuilt the deploy pipeline and owned the admin surface.",
  },
  {
    company: "First Co",
    role: "Software Engineer",
    from: "2021",
    to: "23",
    note: "Catalogue search and the data pipeline that fed it.",
  },
  {
    company: "Freelance",
    role: "Full-stack developer",
    from: "2019",
    to: "21",
    note: "Marketing sites, small SaaS tools, and a lot of WordPress rescue.",
  },
];
