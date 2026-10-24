import { profile } from "@/content/profile";
import { timeline } from "@/content/timeline";
import { playlist, tracks } from "@/content/music";
import { chatbot } from "@/content/chatbot";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/motion/reveal";
import { BrowserTabs, type Tab } from "@/components/sections/about/browser-tabs";
import { AskMe } from "@/components/sections/about/ask-me";

const host = profile.first_name.replace(/^\w/, (char) => char.toUpperCase());

function AboutMe() {
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="label">hello, i&rsquo;m</p>
        <h3 className="mt-2 font-serif text-4xl tracking-tight text-ink sm:text-5xl">{profile.name}</h3>
        <p className="mt-1 text-sm text-ink-3">if you want to be formal</p>
        <p className="mt-6 text-ink-2 leading-relaxed">{profile.bio}</p>
        <p className="mt-6 text-sm text-ink-3">
          {profile.location} · {profile.home} ·{" "}
          <a href={`mailto:${profile.email}`} className="text-ink underline-offset-4 hover:underline">
            {profile.email}
          </a>
        </p>
      </div>
      <div className="lg:col-span-5">
        <p className="label">{profile.current_role}</p>
        <ul className="mt-4 space-y-2">
          {profile.facts.map((fact) => (
            <li key={fact} className="flex items-center gap-3 text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {fact}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex aspect-[4/5] max-w-[220px] -rotate-2 items-end rounded-[3px] bg-white p-2 pb-8 shadow-md dark:bg-[#f4efe4]">
          <div className="h-full w-full bg-gradient-to-br from-[#d9cfc0] to-[#8f9aa3]" aria-hidden="true" />
          <span className="absolute translate-y-7 font-hand text-sm text-[#2a2520]">yep, that&rsquo;s me</span>
        </div>
      </div>
    </div>
  );
}

function WorkLog() {
  return (
    <div>
      <p className="label">where I&rsquo;ve been building · {timeline.at(-1)?.from} → now</p>
      <ol className="mt-6">
        {timeline.map((entry, index) => (
          <li
            key={`${entry.company}-${entry.from}`}
            className="grid gap-2 border-t border-line py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-baseline sm:gap-6"
          >
            <span className="label text-accent">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-serif text-2xl text-ink">{entry.company}</h3>
                {entry.current && <span className="label rounded-full bg-accent px-2 py-0.5 !text-[0.6rem] !text-accent-ink">now</span>}
              </div>
              <p className="mt-1 text-sm text-ink-2">{entry.role}</p>
              {entry.note && <p className="mt-1 text-sm text-ink-3">{entry.note}</p>}
            </div>
            <span className="label tabular-nums">
              {entry.from} – {entry.to}
            </span>
          </li>
        ))}
      </ol>
      <a
        href={profile.resume_href}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-sm text-ink underline-offset-4 hover:underline"
      >
        the serious bit, in one PDF → open resume ↗
      </a>
    </div>
  );
}

function Travel() {
  return (
    <div>
      <p className="label">the hills are where I reset.</p>
      <ol className="mt-6 grid gap-4 sm:grid-cols-3">
        {profile.travel.map((trip, index) => (
          <li key={trip.place} className="group">
            <div
              className="aspect-[4/3] rounded-md border border-line"
              style={{ background: `linear-gradient(160deg, hsl(${200 - index * 30} 25% 70%), hsl(${30 + index * 20} 30% 55%))` }}
              aria-hidden="true"
            />
            <p className="label mt-3">{trip.year}</p>
            <p className="mt-1 font-serif text-xl text-ink">{trip.place}</p>
            <p className="text-sm text-ink-3">{trip.note}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Music() {
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <div className="aspect-square max-w-[260px] rounded-md bg-gradient-to-br from-accent to-[#5a2a1c] p-5 text-accent-ink">
          <p className="label !text-accent-ink/70">playlist</p>
          <p className="mt-2 font-serif text-2xl leading-tight">{playlist.name}</p>
        </div>
        <p className="mt-4 text-sm text-ink-2">{playlist.description}</p>
        <a href={playlist.href} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-ink underline-offset-4 hover:underline">
          open the full playlist ↗
        </a>
      </div>
      <ol className="lg:col-span-8">
        {tracks.map((track, index) => (
          <li key={track.title} className="border-t border-line">
            <a
              href={track.href}
              target="_blank"
              rel="noreferrer"
              className="group grid grid-cols-[2rem_1fr_auto] items-center gap-4 py-3"
            >
              <span className="label tabular-nums group-hover:text-accent">{String(index + 1).padStart(2, "0")}</span>
              <span>
                <span className="block text-ink group-hover:text-accent">{track.title}</span>
                <span className="block text-sm text-ink-3">{track.artist}</span>
              </span>
              <span className="text-ink-3 group-hover:text-ink" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
        <li className="border-t border-line py-3 text-sm text-ink-3">+ {playlist.total - tracks.length} more songs</li>
      </ol>
    </div>
  );
}

export function About() {
  const tabs: Tab[] = [
    { id: "about-me", label: "about me", url: `${profile.first_name}.dev/about`, content: <AboutMe /> },
    { id: "work-log", label: "work log", url: `${profile.first_name}.dev/work-log`, content: <WorkLog /> },
    { id: "travel", label: "travel", url: `${profile.first_name}.dev/travel`, content: <Travel /> },
    { id: "music", label: "music", url: `${profile.first_name}.dev/music`, content: <Music /> },
    {
      id: "ask-me",
      label: "ask me",
      url: `${profile.first_name}.dev/ask`,
      content: <AskMe greeting={chatbot.greeting} disclaimer={chatbot.disclaimer} entries={chatbot.entries} host_name={host} />,
    },
  ];

  return (
    <Container as="section" id="about" className="scroll-mt-14 pt-20 lg:pt-28">
      <Reveal>
        <SectionLabel number="04">about me</SectionLabel>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">a little more about me.</h2>
          <p className="font-hand text-xl text-ink-3">yes, I have too many tabs open</p>
        </div>
      </Reveal>
      <div className="mt-10">
        <BrowserTabs tabs={tabs} />
      </div>
    </Container>
  );
}
