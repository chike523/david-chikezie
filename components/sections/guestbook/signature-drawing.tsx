import { SIGNATURE_SPACE, strokePath, type Stroke } from "@/lib/guestbook/shared";

const INK = "#1c1915";

type SignatureDrawingProps = {
  strokes: Stroke[];
  className?: string;
  /** When set, assistive tech gets a name. Decorative copies stay silent. */
  label?: string;
};

/**
 * Renders stored strokes as ink on a transparent SVG. The pad that captured them uses the same
 * coordinate space, so a signature looks the same here as it did while it was drawn.
 */
export function SignatureDrawing({ strokes, className = "", label }: SignatureDrawingProps) {
  return (
    <svg
      viewBox={`0 0 ${SIGNATURE_SPACE.width} ${SIGNATURE_SPACE.height}`}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {strokes.map((stroke, index) =>
        stroke.length === 2 ? (
          <circle key={index} cx={stroke[0]} cy={stroke[1]} r={8} fill={INK} />
        ) : (
          <path
            key={index}
            d={strokePath(stroke)}
            fill="none"
            stroke={INK}
            strokeWidth={16}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
      )}
    </svg>
  );
}
