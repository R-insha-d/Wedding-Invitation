import type { SVGProps } from "react";

type SvgProps = SVGProps<SVGSVGElement>;

/** Gold rule with an eight-point star in the middle; draws itself on scroll. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" data-anim="divider" className={`mx-auto w-[min(78%,22rem)] ${className}`}>
      <svg viewBox="0 0 300 24" className="block w-full overflow-visible">
        <path className="js-div-line" d="M138 12H8" stroke="url(#rule-l)" strokeWidth="1" />
        <path className="js-div-line" d="M162 12h130" stroke="url(#rule-r)" strokeWidth="1" />
        <circle className="js-div-dot" cx="128" cy="12" r="1.6" fill="#cfa75a" />
        <circle className="js-div-dot" cx="172" cy="12" r="1.6" fill="#cfa75a" />
        <g className="js-div-gem">
          <rect x="144" y="6" width="12" height="12" fill="none" stroke="#b98e3d" strokeWidth="1" />
          <rect
            x="144"
            y="6"
            width="12"
            height="12"
            fill="none"
            stroke="#b98e3d"
            strokeWidth="1"
            transform="rotate(45 150 12)"
          />
          <circle cx="150" cy="12" r="1.9" fill="#b98e3d" />
        </g>
      </svg>
    </div>
  );
}

/** Islamic eight-point star rosette. */
export function Rosette(props: SvgProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect className="js-draw" x="22" y="22" width="56" height="56" />
        <rect className="js-draw" x="22" y="22" width="56" height="56" transform="rotate(45 50 50)" />
        <circle className="js-draw" cx="50" cy="50" r="18" />
        <circle className="js-draw" cx="50" cy="50" r="44" strokeWidth=".8" strokeDasharray="1.5 3.5" />
      </g>
      <path
        d="M50 37l3.6 8.4L62 50l-8.4 3.6L50 63l-3.6-9.4L38 50l8.4-4.6z"
        fill="currentColor"
        className="js-rosette-core"
      />
    </svg>
  );
}

const HEART = "M0 10C-14 1-18.5-8-13.2-14c4.8-5.2 11-3.8 13.2 2 2.2-5.8 8.4-7.2 13.2-2C18.5-8 14 1 0 10z";

/** Two outlined hearts that slide together, with a small gold heart where they meet. */
export function TwoHearts({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 64" className={className} aria-hidden="true" focusable="false">
      <g transform="translate(50 34)">
        <path className="js-heart-l" d={HEART} fill="none" stroke="#b98e3d" strokeWidth="1.5" />
      </g>
      <g transform="translate(70 34)">
        <path className="js-heart-r" d={HEART} fill="none" stroke="#b98e3d" strokeWidth="1.5" />
      </g>
      <g transform="translate(60 31) scale(.42)">
        <g className="heartbeat">
          <path className="js-heart-one" d={HEART} fill="url(#gold-metal-v)" />
        </g>
      </g>
      <g className="js-heart-sparks" fill="#cfa75a">
        <circle cx="60" cy="8" r="1.4" />
        <circle cx="44" cy="12" r="1" />
        <circle cx="77" cy="12" r="1" />
      </g>
    </svg>
  );
}

export function MapPin(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 32" aria-hidden="true" focusable="false" {...props}>
      <ellipse cx="12" cy="30" rx="5" ry="1.6" fill="#7a5a1f" opacity=".18" className="js-pin-shadow" />
      <path
        d="M12 1.5C6.2 1.5 1.8 5.9 1.8 11.4 1.8 19 12 28.5 12 28.5S22.2 19 22.2 11.4C22.2 5.9 17.8 1.5 12 1.5z"
        fill="url(#gold-metal-v)"
      />
      <circle cx="12" cy="11.2" r="4" fill="#fdf9f1" />
      <circle cx="12" cy="11.2" r="1.8" fill="#b98e3d" />
    </svg>
  );
}

export function SmallHeart(props: SvgProps) {
  return (
    <svg viewBox="-20 -20 40 34" aria-hidden="true" focusable="false" {...props}>
      <path d={HEART} fill="url(#gold-metal-v)" className="heartbeat" />
    </svg>
  );
}

/** Hand-drawn circle used to mark the date. */
export function DayCircle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 100"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
      overflow="visible"
    >
      <path
        className="js-day-circle"
        d="M98 10C64-1 16 8 9 42c-6 32 40 52 86 47 42-5 58-38 38-62C118 9 86 4 60 10"
        fill="none"
        stroke="#c69b47"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WhatsAppIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29z" />
    </svg>
  );
}

/** Wavy wax-seal outline, generated once. */
const SEAL_PATH = (() => {
  const points: string[] = [];
  const steps = 72;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const r = 56 + Math.sin(a * 9) * 1.6 + Math.sin(a * 5 + 1.3) * 1.1 + Math.cos(a * 13) * 0.6;
    points.push(`${(60 + Math.cos(a) * r).toFixed(2)} ${(60 + Math.sin(a) * r).toFixed(2)}`);
  }
  return `M${points.join("L")}Z`;
})();

export function WaxSeal({ initials }: { initials: [string, string] }) {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible" aria-hidden="true" focusable="false">
      <path d={SEAL_PATH} fill="url(#seal-wax)" />
      <circle cx="60" cy="60" r="45" fill="none" stroke="#7f5a1d" strokeOpacity=".5" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="41" fill="none" stroke="#fbe9b4" strokeOpacity=".55" strokeWidth=".8" strokeDasharray="1 3" />
      <circle cx="60" cy="60" r="45.8" fill="none" stroke="#fbe9b4" strokeOpacity=".45" strokeWidth=".6" />
      <g className="font-script" textAnchor="middle">
        <text x="61" y="72.6" fontSize="38" fill="#fbe9b4" fillOpacity=".55">
          {initials[0]}
          <tspan fontSize="20" dx="1" dy="-2">
            &amp;
          </tspan>
          <tspan dx="1" dy="2">
            {initials[1]}
          </tspan>
        </text>
        <text x="60" y="71.6" fontSize="38" fill="#6e4c15">
          {initials[0]}
          <tspan fontSize="20" dx="1" dy="-2">
            &amp;
          </tspan>
          <tspan dx="1" dy="2">
            {initials[1]}
          </tspan>
        </text>
      </g>
    </svg>
  );
}
