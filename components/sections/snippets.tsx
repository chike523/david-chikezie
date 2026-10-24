import { snippets } from "@/content/snippets";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/motion/reveal";
import { SnippetsWall } from "@/components/sections/snippets-wall";

export function Snippets() {
  return (
    <Container as="section" id="snippets" className="scroll-mt-14 pt-20 lg:pt-28">
      <Reveal>
        <SectionLabel number="02">snippets</SectionLabel>
        <div className="mt-4 grid gap-4 lg:grid-cols-12 lg:items-end">
          <h2 className="font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl lg:col-span-8">
            Little pieces of work, across web, mobile &amp; the backend.
          </h2>
          <p className="text-ink-3 lg:col-span-4 lg:text-right">different screens. same climb.</p>
        </div>
      </Reveal>
      <div className="mt-10">
        <SnippetsWall snippets={snippets} />
      </div>
    </Container>
  );
}
