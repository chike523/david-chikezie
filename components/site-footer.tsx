import { profile } from "@/content/profile";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  const year = 2026;

  return (
    <footer className="rule mt-auto">
      <Container className="grid gap-10 py-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            Got something you want built properly?
          </h2>
          <p className="mt-4 max-w-md text-ink-2">
            Hiring for a product engineering role, or have a product that needs someone who can carry it from idea to
            production? I would like to hear about it.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-full bg-ink px-4 py-2 text-sm text-paper transition-opacity hover:opacity-85"
            >
              {profile.email}
            </a>
            <a
              href={profile.resume_href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-ink"
            >
              open resume ↗
            </a>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5">
          <div>
            <p className="label">elsewhere</p>
            <ul className="mt-3 space-y-1.5">
              {profile.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noreferrer" className="text-sm text-ink-2 hover:text-ink">
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label">where</p>
            <p className="mt-3 text-sm text-ink-2">
              {profile.location}
              <br />
              {profile.home}
            </p>
          </div>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-line py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="label">
          © {year} {profile.name}
        </p>
        <p className="label">that&rsquo;s all from my side.</p>
      </Container>
    </footer>
  );
}
