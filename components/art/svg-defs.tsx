/**
 * Shared gradients referenced by every SVG on the page (url(#id)).
 * Rendered once, invisibly; must not be display:none or the
 * references stop resolving in some browsers.
 */
export function SvgDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {/* Moving sheen for the traced names (GSAP animates x1/x2). */}
        <linearGradient
          id="gold-sheen"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="340"
          y2="60"
          spreadMethod="repeat"
        >
          <stop offset="0" stopColor="#87631f" />
          <stop offset="0.24" stopColor="#b88b38" />
          <stop offset="0.44" stopColor="#e6c77f" />
          <stop offset="0.5" stopColor="#f7e3a8" />
          <stop offset="0.56" stopColor="#e6c77f" />
          <stop offset="0.76" stopColor="#b88b38" />
          <stop offset="1" stopColor="#87631f" />
        </linearGradient>

        <linearGradient id="gold-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6f4e18" />
          <stop offset="0.26" stopColor="#b88a3a" />
          <stop offset="0.5" stopColor="#f2d894" />
          <stop offset="0.72" stopColor="#c29343" />
          <stop offset="1" stopColor="#77551c" />
        </linearGradient>

        <linearGradient id="gold-metal-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2d894" />
          <stop offset="0.5" stopColor="#c29343" />
          <stop offset="1" stopColor="#7a571c" />
        </linearGradient>

        <radialGradient id="lantern-glass" cx="0.5" cy="0.62" r="0.7">
          <stop offset="0" stopColor="#fffbea" />
          <stop offset="0.35" stopColor="#fce7a8" />
          <stop offset="0.75" stopColor="#efc062" />
          <stop offset="1" stopColor="#c98f34" />
        </radialGradient>

        <radialGradient id="lantern-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe3a0" stopOpacity="0.75" />
          <stop offset="0.45" stopColor="#ffd98a" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>

        {/* Florals */}
        <linearGradient id="leaf-sage" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5f6a4a" />
          <stop offset="0.55" stopColor="#87907a" />
          <stop offset="1" stopColor="#b4ba9f" />
        </linearGradient>
        <linearGradient id="leaf-olive" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6c6d45" />
          <stop offset="0.55" stopColor="#979873" />
          <stop offset="1" stopColor="#c5c3a0" />
        </linearGradient>
        <linearGradient id="bloom" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#efdfbd" />
          <stop offset="0.45" stopColor="#fdf8ec" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="rose-petal" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e2c995" />
          <stop offset="0.38" stopColor="#f4e8cf" />
          <stop offset="0.75" stopColor="#fdf9ef" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="rose-inner" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#d8b673" />
          <stop offset="0.5" stopColor="#efdcb0" />
          <stop offset="1" stopColor="#fbf3e0" />
        </linearGradient>
        <radialGradient id="rose-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c99d4f" />
          <stop offset="0.6" stopColor="#e2c387" />
          <stop offset="1" stopColor="#f3e2bb" />
        </radialGradient>
        <radialGradient id="rose-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.6" stopColor="#8a7448" stopOpacity="0.28" />
          <stop offset="1" stopColor="#8a7448" stopOpacity="0" />
        </radialGradient>

        {/* Wax seal */}
        <radialGradient id="seal-wax" cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#f8e5a6" />
          <stop offset="0.32" stopColor="#dcb565" />
          <stop offset="0.68" stopColor="#b5883a" />
          <stop offset="1" stopColor="#7f5a1d" />
        </radialGradient>

        {/* Divider rules that fade toward their ends */}
        <linearGradient id="rule-l" gradientUnits="userSpaceOnUse" x1="8" y1="0" x2="138" y2="0">
          <stop offset="0" stopColor="#cfa75a" stopOpacity="0" />
          <stop offset="1" stopColor="#cfa75a" />
        </linearGradient>
        <linearGradient id="rule-r" gradientUnits="userSpaceOnUse" x1="162" y1="0" x2="292" y2="0">
          <stop offset="0" stopColor="#cfa75a" />
          <stop offset="1" stopColor="#cfa75a" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
