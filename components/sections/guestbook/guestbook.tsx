import { connection } from "next/server";
import { Suspense } from "react";
import { listEntries } from "@/lib/guestbook/server";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/motion/reveal";
import { SignatureDrawing } from "@/components/sections/guestbook/signature-drawing";
import { SignaturePad } from "@/components/sections/guestbook/signature-pad";

const date_format = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

async function Entries() {
  // The wall changes with every signature, so it is always read at request time.
  await connection();
  const { entries, total, available } = await listEntries();

  if (!available) {
    return (
      <p className="max-w-sm text-ink-2">The wall needs a database before signatures can show up here.</p>
    );
  }

  return (
    <div>
      <p className="label">
        {total === 0 ? "nobody yet. be the first." : `${total} ${total === 1 ? "signature" : "signatures"}`}
      </p>
      <ol className="mt-4 columns-1 gap-4 sm:columns-2 [&>li]:break-inside-avoid">
        {entries.map((entry) => (
          <li key={entry.id} className="mb-4 rounded-md border border-[#1c1915]/10 bg-[#faf8f2] p-3">
            <SignatureDrawing strokes={entry.strokes} label="Signature" className="aspect-[5/2] w-full" />
            <time dateTime={entry.created_at.toISOString()} className="label mt-1 block text-right">
              {date_format.format(entry.created_at)}
            </time>
          </li>
        ))}
      </ol>
    </div>
  );
}

function EntriesFallback() {
  return (
    <div aria-busy="true">
      <div className="h-3 w-24 rounded bg-paper-2" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="aspect-[5/2] rounded-md border border-line bg-paper-2/60" />
        ))}
      </div>
    </div>
  );
}

export function Guestbook() {
  return (
    <Container as="section" id="guestbook" className="scroll-mt-14 pt-20 lg:pt-28">
      <Reveal>
        <SectionLabel number="06">sign the wall</SectionLabel>
        <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
          You made it to the end. Sign the wall.
        </h2>
        <p className="mt-3 max-w-xl text-ink-2">Draw your signature. It stays on the wall, newest first.</p>
      </Reveal>
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SignaturePad />
        </div>
        <div className="lg:col-span-7">
          <Suspense fallback={<EntriesFallback />}>
            <Entries />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
