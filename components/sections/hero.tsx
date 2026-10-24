import Image from "next/image";
import { profile, type Photo } from "@/content/profile";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

function Polaroid({ photo, index }: { photo: Photo; index: number }) {
  return (
    <figure
      className="absolute w-[46%] max-w-[190px] rounded-[3px] bg-white p-2 pb-10 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)] dark:bg-[#f4efe4] sm:max-w-[210px]"
      style={{
        transform: `rotate(${photo.tilt}deg)`,
        left: `${index * 27}%`,
        top: `${index % 2 === 0 ? 0 : 10}%`,
        zIndex: index,
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
        {photo.src ? (
          <Image src={photo.src} alt={photo.alt} fill sizes="210px" className="object-cover" />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg, hsl(${20 + index * 60} 20% 80%), hsl(${200 + index * 40} 18% 62%))`,
            }}
            aria-hidden="true"
          />
        )}
      </div>
      <figcaption className="absolute bottom-1.5 left-2 right-2 font-hand text-[13px] leading-[1.1] text-[#2a2520] sm:text-[15px]">
        {photo.caption}
      </figcaption>
    </figure>
  );
}

export function Hero() {
  return (
    <Container as="section" className="pb-10 pt-12 sm:pt-16 lg:pb-14 lg:pt-20">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="label">{profile.title}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="squiggle mt-6 inline-block font-serif text-4xl italic leading-none text-ink sm:text-5xl">
              hey, I&rsquo;m
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-4 font-sans text-[22vw] font-semibold leading-[0.85] tracking-[-0.05em] text-ink sm:text-[18vw] lg:text-[11rem] xl:text-[13rem]">
              {profile.first_name}
              <span className="text-accent">.</span>
            </h1>
          </Reveal>
        </div>

        <div className="relative lg:col-span-5">
          <Reveal delay={0.2} className="relative mx-auto aspect-[5/4] w-full max-w-md lg:mt-6 lg:max-w-none">
            {profile.photos.map((photo, index) => (
              <Polaroid key={photo.caption} photo={photo} index={index} />
            ))}
            <p className="absolute -bottom-6 right-2 font-hand text-xl text-ink-2 sm:text-2xl" aria-hidden="true">
              <span className="mr-1 inline-block -rotate-12">↘</span> that&rsquo;s me
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.25}>
        <div className="mt-16 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="font-sans text-xl leading-snug text-ink sm:text-2xl">
              {profile.statement[0]}
              <br />
              {profile.statement[1].split(" ").slice(0, -1).join(" ")}{" "}
              <em className="font-serif italic">{profile.statement[1].split(" ").slice(-1)}</em>
            </p>
          </div>
          <p className="text-sm leading-relaxed text-ink-3 md:col-span-5">{profile.statement_note}</p>
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="rule mt-10 flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="label">Experiences</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {profile.employers.map((employer, index) => (
              <li key={employer.name} className="flex items-center gap-3">
                {index > 0 && <span className="hidden text-ink-3 sm:inline" aria-hidden="true">/</span>}
                <span className="font-serif text-lg text-ink">{employer.name}</span>
                {employer.current && (
                  <span className="label rounded-full bg-accent px-2 py-0.5 !text-[0.6rem] !text-accent-ink">currently here</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Container>
  );
}
