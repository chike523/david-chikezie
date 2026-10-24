type SectionLabelProps = {
  number: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Small mono label used at the top of each numbered section, e.g. "01 / work".
 */
export function SectionLabel({ number, children, className = "" }: SectionLabelProps) {
  return (
    <p className={`label ${className}`}>
      <span className="text-accent">{number}</span>
      <span className="mx-2 text-ink-3">/</span>
      <span>{children}</span>
    </p>
  );
}
