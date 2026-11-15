type LanternProps = {
  /** Length of the hanging chain, in SVG units (lantern body is ~145 units tall). */
  chain?: number;
  className?: string;
};

/** A hanging Moroccan-style gold lantern with a flickering flame. */
export function Lantern({ chain = 120, className }: LanternProps) {
  const height = chain + 146;
  return (
    <svg
      viewBox={`0 0 80 ${height}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      overflow="visible"
    >
      <line
        x1="40"
        y1="0"
        x2="40"
        y2={chain}
        stroke="#b08a43"
        strokeWidth="1.7"
        strokeDasharray="3.4 2.2"
        strokeLinecap="round"
      />
      <g transform={`translate(0 ${chain})`}>
        <ellipse className="lantern-glow" cx="40" cy="74" rx="58" ry="62" fill="url(#lantern-glow)" />

        {/* Ring + finial */}
        <circle cx="40" cy="4" r="4" fill="none" stroke="url(#gold-metal)" strokeWidth="1.8" />
        <path d="M38.4 8h3.2l-.6 6.5h-2z" fill="url(#gold-metal)" />
        <circle cx="40" cy="17" r="3.2" fill="url(#gold-metal)" />

        {/* Dome */}
        <path d="M20 37C20 25.5 30.5 21 40 19c9.5 2 20 6.5 20 18z" fill="url(#gold-metal)" />
        <path
          d="M40 19.5V37M31 22.5c-2 4.5-3 9-3 14.5M49 22.5c2 4.5 3 9 3 14.5"
          stroke="#6f4e18"
          strokeOpacity=".45"
          strokeWidth=".8"
          fill="none"
        />
        <rect x="16.5" y="36.5" width="47" height="5" rx="1.6" fill="url(#gold-metal)" />
        <rect x="18.5" y="41.5" width="43" height="6.5" fill="url(#gold-metal)" />
        {[24, 30, 36, 44, 50, 56].map((x) => (
          <circle key={x} cx={x} cy="44.75" r="1.1" fill="#6f4e18" fillOpacity=".55" />
        ))}

        {/* Body + glowing glass */}
        <rect x="18.5" y="48" width="43" height="56" fill="url(#gold-metal)" />
        <path
          d="M20.8 102V64c0-5.6 2.4-9.6 5.6-12.2.5 3.5.7 7 .7 12.2v38z"
          fill="url(#lantern-glass)"
          opacity=".78"
        />
        <path
          d="M59.2 102V64c0-5.6-2.4-9.6-5.6-12.2-.5 3.5-.7 7-.7 12.2v38z"
          fill="url(#lantern-glass)"
          opacity=".78"
        />
        <path d="M29.2 102V62.5c0-7.2 4.6-11.4 10.8-14 6.2 2.6 10.8 6.8 10.8 14V102z" fill="url(#lantern-glass)" />
        <path
          d="M32.2 102V64c0-5.6 3.4-9 7.8-11.2 4.4 2.2 7.8 5.6 7.8 11.2v38"
          fill="none"
          stroke="#b88a3a"
          strokeOpacity=".7"
          strokeWidth=".8"
        />
        <path d="M29.5 81h21.2" stroke="#b88a3a" strokeOpacity=".55" strokeWidth=".8" />
        <path
          className="lantern-flame"
          d="M40 66.5c-3.2 5.6-4 10.4-.1 14.6 4-4.2 3.3-9-.0-14.6z"
          fill="#fffaf0"
        />
        <ellipse cx="40" cy="78" rx="5" ry="6.5" fill="#fff6d8" opacity=".55" />

        {/* Base */}
        <rect x="16.5" y="103.5" width="47" height="5" rx="1.6" fill="url(#gold-metal)" />
        <path d="M20.5 108.5h39c-2 9.3-9.3 15.2-19.5 17-10.2-1.8-17.5-7.7-19.5-17z" fill="url(#gold-metal)" />
        <circle cx="40" cy="129.5" r="3.6" fill="url(#gold-metal)" />
        <path d="M40 133c-2 4-1.6 7.8 0 11 1.6-3.2 2-7 0-11z" fill="url(#gold-metal)" />
      </g>
    </svg>
  );
}
