import Link from "next/link";
import type { Project } from "@/content/projects";

type WorkCardProps = {
  project: Project;
  index: number;
  className?: string;
};

/**
 * One case study card: the outcome leads, then tags and a device mock placeholder.
 */
export function WorkCard({ project, index, className = "" }: WorkCardProps) {
  return (
    <article className={`flex h-full flex-col ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="label">
            {String(index + 1).padStart(2, "0")} · {project.client} · {project.year}
          </p>
          <h3 className="mt-1 font-sans text-lg font-medium text-ink">{project.name}</h3>
        </div>
        <ul className="hidden flex-wrap justify-end gap-1.5 sm:flex" aria-label="Tags">
          {project.tags.map((tag) => (
            <li key={tag} className="label rounded-full border border-line px-2 py-0.5 normal-case tracking-normal">
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={`/work/${project.slug}`}
        className="group relative flex flex-1 flex-col overflow-hidden rounded-md border border-line bg-card transition-shadow hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)]"
        aria-label={`${project.name} — open case study`}
      >
        <div className="grid flex-1 gap-8 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-between">
            <h4 className="font-serif text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-[2.6rem]">
              {project.headline}{" "}
              {project.headline_emphasis && <em className="italic text-accent">{project.headline_emphasis}</em>}
            </h4>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-2">{project.summary}</p>
          </div>

          <div className="relative hidden items-end justify-center lg:flex" aria-hidden="true">
            <DeviceMock tone={project.tone} />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line px-7 py-3 sm:px-10">
          <span className="label group-hover:text-ink">open case study</span>
          <span className="text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-ink" aria-hidden="true">
            →
          </span>
        </div>
      </Link>
    </article>
  );
}

function DeviceMock({ tone }: { tone: string }) {
  return (
    <div className="relative h-[280px] w-full max-w-sm">
      <div
        className="absolute bottom-0 left-4 right-4 top-6 rounded-xl border border-line shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]"
        style={{ backgroundColor: tone }}
      >
        <div className="flex items-center gap-1.5 px-4 pt-3">
          <span className="h-2 w-2 rounded-full bg-white/40" />
          <span className="h-2 w-2 rounded-full bg-white/30" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </div>
        <div className="mt-5 space-y-3 px-5">
          <div className="h-3 w-2/3 rounded bg-white/35" />
          <div className="h-3 w-1/2 rounded bg-white/25" />
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="h-14 rounded bg-white/15" />
            <div className="h-14 rounded bg-white/15" />
            <div className="h-14 rounded bg-white/15" />
          </div>
          <div className="h-3 w-5/6 rounded bg-white/20" />
          <div className="h-3 w-3/4 rounded bg-white/20" />
        </div>
      </div>
    </div>
  );
}
