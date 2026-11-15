import { NAME_PATHS } from "./name-paths";

type NameKey = keyof typeof NAME_PATHS;

/**
 * A name set in Great Vibes, as one SVG path per glyph so the intro can
 * trace each letter in gold before filling it.
 */
export function NameSvg({ name, className = "" }: { name: NameKey; className?: string }) {
  const data = NAME_PATHS[name];
  return (
    <svg viewBox={data.viewBox} className={`block overflow-visible ${className}`} aria-hidden="true" focusable="false">
      {data.glyphs.map((d, i) => (
        <path key={i} d={d} className="glyph" />
      ))}
    </svg>
  );
}
