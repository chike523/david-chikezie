import Link from "next/link";
import { profile } from "@/content/profile";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { label: "work", href: "/#work" },
  { label: "about", href: "/#about" },
  { label: "playground", href: "/playground" },
  { label: "resume", href: profile.resume_href, external: true },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="font-serif text-lg lowercase tracking-tight text-ink">
          {profile.first_name}
          <span className="text-accent">.</span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-3.5 text-[13px] sm:gap-6 sm:text-sm">
          {nav.map((item) =>
            item.external ? (
              <a key={item.label} href={item.href} className="text-ink-2 transition-colors hover:text-ink" target="_blank" rel="noreferrer">
                {item.label} <span aria-hidden="true" className="hidden sm:inline">↓</span>
              </a>
            ) : (
              <Link key={item.label} href={item.href} className="text-ink-2 transition-colors hover:text-ink">
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href={`mailto:${profile.email}`}
            className="hidden rounded-full border border-ink px-3.5 py-1.5 text-sm text-ink transition-colors hover:bg-ink hover:text-paper sm:inline-flex"
          >
            say hey <span aria-hidden="true" className="ml-1">↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}
