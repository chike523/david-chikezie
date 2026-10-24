import { projects } from "@/content/projects";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/motion/reveal";
import { WorkRail } from "@/components/sections/work-rail";

export function Work() {
  return (
    <section id="work" className="scroll-mt-14 pt-16 lg:pt-24">
      <Container>
        <Reveal>
          <SectionLabel number="01">featured work</SectionLabel>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
            Products I built, and what changed because they shipped.
          </h2>
        </Reveal>
      </Container>
      <div className="mt-10 lg:mt-6">
        <WorkRail projects={projects} skip_to="#snippets" />
      </div>
    </section>
  );
}
