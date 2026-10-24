import type { Experiment } from "@/content/playground";

export function ExperimentCard({ experiment, index }: { experiment: Experiment; index: number }) {
  const Wrapper = experiment.href ? "a" : "div";
  const wrapper_props = experiment.href ? { href: experiment.href, target: "_blank", rel: "noreferrer" } : {};

  return (
    <Wrapper
      {...wrapper_props}
      className="group flex h-full flex-col rounded-md border border-line bg-card p-4 transition-colors hover:border-ink-3"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded border border-line bg-paper-2" aria-hidden="true">
        {experiment.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={experiment.src} alt="" className="h-full w-full object-cover" />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${30 + (index % 3) * 20}% ${40 + (index % 2) * 20}%, var(--accent) 0, transparent 45%), linear-gradient(180deg, var(--paper-2), var(--card))`,
              opacity: 0.6,
            }}
          />
        )}
        <span className="label absolute left-3 top-3 rounded-full border border-line bg-card/90 px-2 py-0.5">{experiment.kind}</span>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-sans text-lg font-medium text-ink group-hover:text-accent">{experiment.title}</h3>
          <span className="label tabular-nums">{experiment.year}</span>
        </div>
        <p className="mt-1.5 text-sm text-ink-2">{experiment.description}</p>
        {experiment.href && <span className="label mt-4 text-ink-3 group-hover:text-ink">open ↗</span>}
      </div>
    </Wrapper>
  );
}
