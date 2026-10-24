/**
 * Everything about you that appears on the site.
 * Replace the placeholder values; the layout reads from here.
 */

export type Photo = {
  /** Path under /public, or a remote URL allowed in next.config. Leave undefined for a placeholder. */
  src?: string;
  alt: string;
  /** Handwritten caption shown under the polaroid. */
  caption: string;
  /** Tilt in degrees; small values look natural. */
  tilt: number;
};

export type Employer = {
  name: string;
  current?: boolean;
};

export type SocialLink = {
  label: string;
  href: string;
};

export const profile = {
  name: "David Chikezie",
  first_name: "david",
  title: "Full-Stack Product Engineer",
  tagline: "I build products end to end: the interface, the API, and the parts that keep them running.",
  /** The two-line statement under the hero name. */
  statement: ["I build products.", "I also make them hold up in production."],
  /** Short trailing note next to the statement. */
  statement_note: "Web apps, APIs, data pipelines & the occasional detour into tooling.",
  location: "currently in Lagos",
  home: "home is Ibadan",
  email: "you@example.com",
  resume_href: "/resume.pdf",
  /** Three to five quick facts for the about tab. */
  facts: ["ships on Fridays", "writes the runbook first", "24x7 music on"],
  /** Short bio for the about tab. */
  bio: "full-stack product engineer and full-time edge-case hunter. most of my time goes to shaping a problem, cutting scope, and shipping something a real person can use by the end of the week. the rest goes to making sure it still works at 3am. web apps, APIs, and the odd detour into developer tooling.",
  /** Where you are right now; shown in the about tab and footer. */
  current_role: "currently building at Placeholder Co",
  photos: [
    { alt: "At a desk, mid-thought", caption: "usually thinking about a trade-off.", tilt: -6 },
    { alt: "A view from somewhere high", caption: "roots: ibadan.", tilt: 3 },
    { alt: "Outside, with a backpack", caption: "happiest a little higher up.", tilt: 7 },
  ] as Photo[],
  employers: [
    { name: "Placeholder Co", current: true },
    { name: "Second Co" },
    { name: "First Co" },
  ] satisfies Employer[],
  links: [
    { label: "GitHub", href: "https://github.com/your-handle" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle" },
    { label: "X", href: "https://x.com/your-handle" },
  ] satisfies SocialLink[],
  /** Problem types for the "What I work on" section. */
  work_on: [
    {
      title: "Complex systems",
      body: "I make products with lots of moving parts easier to reason about, for the people who use them and the people who run them.",
    },
    {
      title: "Zero to one",
      body: "When the problem is still fuzzy I help a team decide what to build, then build the first version fast enough to learn from it.",
    },
    {
      title: "Performance and reliability",
      body: "Slow pages, flaky jobs, and quiet data loss. I like finding the real cause and fixing it where it lives.",
    },
    {
      title: "Developer experience",
      body: "Internal tools, CI, and the glue code nobody wants to own. Good tooling is how a small team ships like a bigger one.",
    },
  ],
  /** Trips for the travel tab. */
  travel: [
    { year: "2022", place: "Idanre Hills", note: "solo" },
    { year: "2023", place: "Obudu Plateau", note: "with friends" },
    { year: "2025", place: "Atlas Mountains", note: "thin air, no signal" },
  ],
} as const;

export type Profile = typeof profile;
