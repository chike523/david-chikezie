type PlaceholderFrameProps = {
  label?: string;
  className?: string;
  /** Aspect ratio as a Tailwind class, e.g. "aspect-[4/5]". */
  aspect?: string;
  tone?: string;
};

/**
 * A neutral frame used wherever a real image has not been supplied yet.
 * Replace by passing `src` in the content file; the component that owns it swaps this out.
 */
export function PlaceholderFrame({ label = "image", className = "", aspect = "aspect-[4/3]", tone }: PlaceholderFrameProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-sm border border-line bg-paper-2 ${aspect} ${className}`}
      style={tone ? { backgroundColor: tone } : undefined}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <span className="label absolute bottom-2 left-2 rounded-sm bg-paper/85 px-2 py-1 normal-case tracking-normal text-ink-2">
        {label}
      </span>
    </div>
  );
}
