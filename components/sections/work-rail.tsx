"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/projects";
import { WorkCard } from "@/components/sections/work-card";

type WorkRailProps = {
  projects: Project[];
  /** Anchor to jump past the pinned region. */
  skip_to: string;
};

function useIsDesktop() {
  const [is_desktop, set_is_desktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => set_is_desktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return is_desktop;
}

/**
 * Pinned horizontal rail on desktop; a plain vertical stack on small screens or with reduced motion.
 */
export function WorkRail({ projects, skip_to }: WorkRailProps) {
  const reduce_motion = usePrefersReducedMotion();
  const is_desktop = useIsDesktop();
  const pinned = !reduce_motion && is_desktop;

  if (!pinned) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-12 px-5 sm:px-8 lg:px-12">
        {projects.map((project, index) => (
          <div key={project.slug} className="min-h-[520px]">
            <WorkCard project={project} index={index} />
          </div>
        ))}
      </div>
    );
  }

  return <PinnedRail projects={projects} skip_to={skip_to} />;
}

function PinnedRail({ projects, skip_to }: WorkRailProps) {
  const track_ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track_ref, offset: ["start start", "end end"] });
  const count = projects.length;
  // Each card is 72vw wide with a 4vw gap. The rail holds still for the first 8% so the first card is read
  // before anything moves, then translates so the last card ends with the same left padding it started with.
  const x = useTransform(scrollYProgress, [0, 0.08, 1], ["0vw", "0vw", `-${(count - 1) * 76}vw`]);
  const progress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div ref={track_ref} style={{ height: `${count * 100}vh` }} className="relative">
      <div className="sticky top-14 flex flex-col overflow-hidden pb-8">
        <div className="flex items-center justify-between px-5 pb-4 pt-6 sm:px-8 lg:px-12">
          <RailProgress progress={progress} count={count} />
          <a href={skip_to} className="label rounded-full border border-line px-3 py-1.5 transition-colors hover:border-ink hover:text-ink">
            skip to snippets →
          </a>
        </div>

        <div className="flex items-start">
          <motion.div
            style={{ x }}
            className="flex h-[min(600px,calc(100vh_-_9rem))] w-full items-stretch gap-[4vw] pl-5 sm:pl-8 lg:pl-12"
          >
            {projects.map((project, index) => (
              <div key={project.slug} className="h-full w-[72vw] shrink-0">
                <WorkCard project={project} index={index} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function RailProgress({ progress, count }: { progress: ReturnType<typeof useTransform<number, number>>; count: number }) {
  const width = useTransform(progress, (value) => `${value}%`);
  return (
    <div className="flex items-center gap-3">
      <span className="label">
        {String(1).padStart(2, "0")} — {String(count).padStart(2, "0")}
      </span>
      <div className="h-px w-32 bg-line">
        <motion.div className="h-px bg-accent" style={{ width }} />
      </div>
    </div>
  );
}
