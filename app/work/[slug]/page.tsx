import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentProjects, getProject, projects } from "@/content/projects";
import { Container } from "@/components/ui/container";
import { PlaceholderFrame } from "@/components/ui/placeholder-frame";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Every real slug is prerendered by generateStaticParams. Unknown slugs must resolve params before the
 * shell is sent so the response carries a real 404 status, which means this route cannot be "instant".
 */
export const instant = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} — case study`,
    description: project.summary,
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { previous, next } = getAdjacentProjects(slug);
  const index = projects.findIndex((candidate) => candidate.slug === slug);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container as="section" className="pb-12 pt-12 sm:pt-16">
          <Link href="/#work" className="label inline-flex items-center gap-2 transition-colors hover:text-ink">
            <span aria-hidden="true">←</span> all work
          </Link>

          <p className="label mt-10">
            {String(index + 1).padStart(2, "0")} · {project.client} · {project.year}
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {project.headline}{" "}
            {project.headline_emphasis && <em className="italic text-accent">{project.headline_emphasis}</em>}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">{project.summary}</p>

          <dl className="rule mt-10 grid gap-6 pt-6 sm:grid-cols-3">
            <div>
              <dt className="label">Role</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-2">{project.role}</dd>
            </div>
            <div>
              <dt className="label">Stack</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {project.stack.map((item) => (
                  <span key={item} className="label rounded-full border border-line px-2 py-0.5 normal-case tracking-normal">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="label">Tags</dt>
              <dd className="mt-2 text-sm text-ink-2">{project.tags.join(" · ")}</dd>
            </div>
          </dl>
        </Container>

        <Container as="section" className="pb-16">
          <PlaceholderFrame
            aspect="aspect-[16/9]"
            className="w-full rounded-md"
            tone={project.tone}
            label={`${project.name} — replace with a hero image or video`}
          />
        </Container>

        <Container as="section" className="grid gap-12 pb-20 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <nav aria-label="On this page" className="sticky top-24 hidden lg:block">
              <ul className="space-y-2">
                {["context", "problem", "decisions", "shipped", "results"].map((anchor) => (
                  <li key={anchor}>
                    <a href={`#${anchor}`} className="label transition-colors hover:text-ink">
                      {anchor}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="space-y-14 lg:col-span-9 lg:max-w-3xl">
            <Block id="context" title="Context">
              <p>{project.context}</p>
            </Block>
            <Block id="problem" title="Problem">
              <p>{project.problem}</p>
            </Block>
            <Block id="decisions" title="Decisions">
              <ol className="space-y-8">
                {project.decisions.map((decision, decision_index) => (
                  <li key={decision.title} className="grid gap-3 sm:grid-cols-[2.5rem_1fr]">
                    <span className="label pt-1.5 text-accent">{String(decision_index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-sans text-lg font-medium text-ink">{decision.title}</h3>
                      <p className="mt-2 text-ink-2">{decision.body}</p>
                      <p className="mt-3 border-l-2 border-accent/60 pl-3 text-sm text-ink-3">
                        <span className="label mr-2 text-ink-3">trade-off</span>
                        {decision.trade_off}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Block>
            <Block id="shipped" title="What shipped">
              <ul className="space-y-2">
                {project.shipped.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Block>
            <Block id="results" title="Results">
              <ul className="space-y-2">
                {project.results.map((item) => (
                  <li key={item} className="font-serif text-xl leading-snug text-ink sm:text-2xl">
                    {item}
                  </li>
                ))}
              </ul>
            </Block>
          </div>
        </Container>

        <Container as="nav" aria-label="More case studies" className="rule grid gap-6 py-10 sm:grid-cols-2">
          {previous ? (
            <Link href={`/work/${previous.slug}`} className="group">
              <p className="label">← previous</p>
              <p className="mt-2 font-serif text-2xl text-ink group-hover:text-accent">{previous.name}</p>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/work/${next.slug}`} className="group sm:text-right">
              <p className="label">next →</p>
              <p className="mt-2 font-serif text-2xl text-ink group-hover:text-accent">{next.name}</p>
            </Link>
          ) : (
            <span />
          )}
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="label mb-4">{title}</h2>
      <div className="text-base leading-relaxed text-ink-2 sm:text-lg">{children}</div>
    </section>
  );
}
