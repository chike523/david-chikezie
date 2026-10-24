import Link from "next/link";
import { experiments } from "@/content/playground";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/motion/reveal";
import { ExperimentCard } from "@/components/sections/playground/experiment-card";

export function Playground() {
  const featured = experiments.slice(0, 6);

  return (
    <Container as="section" id="playground" className="scroll-mt-14 pt-20 lg:pt-28">
      <Reveal>
        <SectionLabel number="05">playground</SectionLabel>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-2xl font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
            Where I try things to see if they can work.
          </h2>
          <Link href="/playground" className="label rounded-full border border-line px-3 py-1.5 hover:border-ink hover:text-ink">
            see all {experiments.length} →
          </Link>
        </div>
      </Reveal>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((experiment, index) => (
          <li key={experiment.id}>
            <Reveal delay={(index % 3) * 0.05} className="h-full">
              <ExperimentCard experiment={experiment} index={index} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Container>
  );
}
