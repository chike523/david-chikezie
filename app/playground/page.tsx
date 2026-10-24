import type { Metadata } from "next";
import Link from "next/link";
import { experiments } from "@/content/playground";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ExperimentCard } from "@/components/sections/playground/experiment-card";

export const metadata: Metadata = {
  title: "Playground",
  description: "Experiments, small tools, and things built to see if they could work.",
};

export default function PlaygroundPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container as="section" className="pb-20 pt-12 sm:pt-16">
          <Link href="/" className="label inline-flex items-center gap-2 hover:text-ink">
            <span aria-hidden="true">←</span> home
          </Link>
          <div className="mt-10">
            <SectionLabel number="05">playground</SectionLabel>
          </div>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Experiments, small tools, and things built to see if they could work.
          </h1>
          <p className="mt-4 max-w-xl text-ink-2">
            This is where I try new tools, test an idea on a weekend, and keep the ones that turned out useful.
          </p>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {experiments.map((experiment, index) => (
              <li key={experiment.id}>
                <ExperimentCard experiment={experiment} index={index} />
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
