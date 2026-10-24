import { profile } from "@/content/profile";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/motion/reveal";

export function WorkOn() {
  return (
    <Container as="section" id="work-on" className="scroll-mt-14 pt-20 lg:pt-28">
      <Reveal>
        <SectionLabel number="03">what I work on</SectionLabel>
        <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
          The kinds of problems I get pulled into, and the ones I go looking for.
        </h2>
      </Reveal>
      <ol className="mt-10 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
        {profile.work_on.map((item, index) => (
          <li key={item.title} className="bg-paper p-6 sm:p-8">
            <Reveal delay={index * 0.05}>
              <p className="label text-accent">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-sans text-xl font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-ink-2">{item.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Container>
  );
}
