"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Render as a block (default) or inline element. */
  as?: "div" | "span";
};

/**
 * Fades and lifts content into view the first time it scrolls on screen.
 * Renders static markup when the visitor prefers reduced motion.
 */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const reduce_motion = usePrefersReducedMotion();
  const Tag = as === "span" ? motion.span : motion.div;

  if (reduce_motion) {
    return as === "span" ? <span className={className}>{children}</span> : <div className={className}>{children}</div>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
