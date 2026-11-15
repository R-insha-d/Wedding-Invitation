/**
 * Generative ivory-rose & jasmine corner arrangement, drawn in SVG so it
 * stays crisp at any size and can "grow": stems draw, leaves unfurl,
 * blossoms open (see floralTimeline in components/experience.tsx).
 *
 * The arrangement is authored for a top-right corner in a 320×320 box;
 * rotate/mirror the wrapper for other corners.
 */

type V = readonly [number, number];
type Bezier = readonly [V, V, V, V];

type StemSpec = {
  c: Bezier;
  /** [t along stem, side (+1/-1), size] */
  leaves?: ReadonlyArray<readonly [number, 1 | -1, number]>;
  /** [t along stem, side, twig length, blossom radius] */
  blooms?: ReadonlyArray<readonly [number, 1 | -1, number, number]>;
  tip?: "bloom" | "bud";
  /** t values where a baby's-breath sprig sprouts */
  gyp?: ReadonlyArray<number>;
  width?: number;
};

type RoseSpec = {
  x: number;
  y: number;
  r: number;
  rot: number;
  /** [direction in degrees, size] */
  leaves: ReadonlyArray<readonly [number, number]>;
};

const ROSES: RoseSpec[] = [
  { x: 250, y: 64, r: 50, rot: 8, leaves: [[150, 1.25], [196, 1.05], [104, 1.0], [62, 0.9]] },
  { x: 298, y: 170, r: 36, rot: -24, leaves: [[146, 1.1], [204, 0.9], [98, 1.0]] },
  { x: 158, y: 20, r: 24, rot: 30, leaves: [[168, 0.85], [118, 0.8]] },
];

const STEMS: StemSpec[] = [
  {
    c: [[318, 4], [262, 26], [176, 46], [74, 56]],
    leaves: [[0.2, -1, 1], [0.34, 1, 0.9], [0.5, -1, 0.95], [0.68, 1, 0.85], [0.86, -1, 0.72]],
    blooms: [[0.42, 1, 16, 10], [0.6, -1, 15, 9], [0.77, 1, 14, 8.5]],
    tip: "bloom",
    gyp: [0.27, 0.55, 0.92],
  },
  {
    c: [[314, 20], [324, 112], [302, 214], [252, 318]],
    leaves: [[0.22, 1, 1], [0.37, -1, 0.95], [0.55, 1, 0.9], [0.71, -1, 0.82], [0.87, 1, 0.72]],
    blooms: [[0.45, -1, 16, 10], [0.63, 1, 15, 9], [0.81, -1, 13, 8.5]],
    tip: "bud",
    gyp: [0.3, 0.67, 0.93],
  },
  {
    c: [[290, 38], [248, 104], [208, 152], [146, 206]],
    leaves: [[0.3, 1, 0.9], [0.52, -1, 0.85], [0.74, 1, 0.74]],
    blooms: [[0.4, -1, 13, 9], [0.63, 1, 12, 8], [0.85, -1, 12, 7.5]],
    tip: "bloom",
    gyp: [0.5, 0.8],
  },
  {
    c: [[268, 84], [212, 92], [160, 106], [106, 128]],
    leaves: [[0.36, 1, 0.8], [0.62, -1, 0.74]],
    blooms: [[0.5, 1, 12, 8], [0.74, -1, 12, 7.5]],
    tip: "bloom",
    gyp: [0.3, 0.88],
  },
  {
    c: [[306, 92], [264, 150], [238, 202], [222, 266]],
    leaves: [[0.42, 1, 0.7]],
    gyp: [0.34, 0.5, 0.64, 0.78, 0.92],
    width: 0.9,
  },
];

const PETAL_OUTER =
  "M0 .06C-.5 .04-.86-.48-.52-.86-.3-1.06.3-1.06.52-.86.86-.48.5.04 0 .06z";
const PETAL_INNER = "M0 .05C-.55 0-.7-.6-.3-.86-.1-.96.1-.96.3-.86.7-.6.55 0 0 .05z";
const PETAL_EDGE = "M-.44-.84C-.2-.99.2-.99.44-.84";
const SPIRAL =
  "M-.1.02C-.11-.11.09-.15.13-.03.15.09-.03.16-.09.06-.12-.03-.01-.08.04-.03";
const BLOSSOM_PETAL = "M0 0C-.42-.2-.48-.82 0-1 .48-.82.42-.2 0 0z";
const BUD = "M0 0C-.5-.3-.42-1.1 0-1.45.42-1.1.5-.3 0 0z";
const LEAF = "M0 0C.22-.2.62-.26 1 0 .62.24.22.18 0 0z";
const LEAF_RIB = "M.04 0Q.5-.03.96 0";

const r1 = (n: number) => Math.round(n * 10) / 10;

function bezierPoint(c: Bezier, t: number): [number, number] {
  const m = 1 - t;
  const a = m * m * m;
  const b = 3 * m * m * t;
  const d = 3 * m * t * t;
  const e = t * t * t;
  return [
    a * c[0][0] + b * c[1][0] + d * c[2][0] + e * c[3][0],
    a * c[0][1] + b * c[1][1] + d * c[2][1] + e * c[3][1],
  ];
}

function bezierAngle(c: Bezier, t: number) {
  const m = 1 - t;
  const dx =
    3 * m * m * (c[1][0] - c[0][0]) + 6 * m * t * (c[2][0] - c[1][0]) + 3 * t * t * (c[3][0] - c[2][0]);
  const dy =
    3 * m * m * (c[1][1] - c[0][1]) + 6 * m * t * (c[2][1] - c[1][1]) + 3 * t * t * (c[3][1] - c[2][1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rad = (deg: number) => (deg * Math.PI) / 180;

type Leaf = { x: number; y: number; angle: number; size: number; tone: "sage" | "olive" };
type Twig = { d: string; width: number };
type Blossom = { x: number; y: number; r: number; rot: number };
type Dot = { x: number; y: number; r: number };
type Bud = { x: number; y: number; angle: number; size: number };

function buildArrangement(seed: number) {
  const rand = mulberry32(seed);
  const jitter = (amount: number) => (rand() - 0.5) * 2 * amount;

  const stems: Twig[] = [];
  const twigs: Twig[] = [];
  const leaves: Leaf[] = [];
  const blossoms: Blossom[] = [];
  const dots: Dot[] = [];
  const buds: Bud[] = [];

  for (const stem of STEMS) {
    const [p0, p1, p2, p3] = stem.c;
    stems.push({
      d: `M${p0[0]} ${p0[1]}C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`,
      width: stem.width ?? 1.5,
    });

    for (const [t, side, size] of stem.leaves ?? []) {
      const [x, y] = bezierPoint(stem.c, t);
      leaves.push({
        x,
        y,
        angle: bezierAngle(stem.c, t) + side * (40 + jitter(8)),
        size: size * (0.95 + jitter(0.08)),
        tone: rand() > 0.6 ? "olive" : "sage",
      });
    }

    for (const [t, side, len, r] of stem.blooms ?? []) {
      const [x, y] = bezierPoint(stem.c, t);
      const a = rad(bezierAngle(stem.c, t) + side * (52 + jitter(10)));
      const ex = x + Math.cos(a) * len;
      const ey = y + Math.sin(a) * len;
      const bend = side * 4;
      twigs.push({
        d: `M${r1(x)} ${r1(y)}Q${r1((x + ex) / 2 + Math.cos(a + Math.PI / 2) * bend)} ${r1(
          (y + ey) / 2 + Math.sin(a + Math.PI / 2) * bend,
        )} ${r1(ex)} ${r1(ey)}`,
        width: 0.8,
      });
      blossoms.push({ x: ex, y: ey, r: r * (0.94 + jitter(0.1)), rot: rand() * 72 });
    }

    if (stem.tip) {
      const [x, y] = stem.c[3];
      const angle = bezierAngle(stem.c, 1);
      if (stem.tip === "bloom") blossoms.push({ x, y, r: 9.5, rot: rand() * 72 });
      else buds.push({ x, y, angle: angle + 90, size: 9 });
    }

    for (const t of stem.gyp ?? []) {
      const [x, y] = bezierPoint(stem.c, t);
      const base = bezierAngle(stem.c, t);
      for (const side of [1, -1] as const) {
        const a = rad(base + side * (38 + jitter(14)));
        const len = 10 + rand() * 9;
        const ex = x + Math.cos(a) * len;
        const ey = y + Math.sin(a) * len;
        twigs.push({ d: `M${r1(x)} ${r1(y)}L${r1(ex)} ${r1(ey)}`, width: 0.55 });
        dots.push({ x: ex, y: ey, r: 2.3 + rand() * 0.8 });
        dots.push({
          x: ex + Math.cos(a + 0.9) * 4.2,
          y: ey + Math.sin(a + 0.9) * 4.2,
          r: 1.7 + rand() * 0.6,
        });
      }
    }
  }

  for (const rose of ROSES) {
    for (const [dir, size] of rose.leaves) {
      const a = rad(dir);
      leaves.push({
        x: rose.x + Math.cos(a) * rose.r * 0.72,
        y: rose.y + Math.sin(a) * rose.r * 0.72,
        angle: dir + jitter(6),
        size: size * 1.15,
        tone: rand() > 0.5 ? "olive" : "sage",
      });
    }
  }

  return { stems, twigs, leaves, blossoms, dots, buds };
}

function Rose({ x, y, r, rot }: RoseSpec) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r})`}>
      <g className="fl-rose">
        <circle r="1.12" fill="url(#rose-shadow)" />
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={`o${a}`} transform={`rotate(${a})`}>
            <path d={PETAL_OUTER} fill="url(#rose-petal)" stroke="#d3bd90" strokeWidth=".014" />
            <path d={PETAL_EDGE} fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth=".022" />
          </g>
        ))}
        {[36, 108, 180, 252, 324].map((a) => (
          <g key={`m${a}`} transform={`rotate(${a}) scale(.74)`}>
            <path d={PETAL_OUTER} fill="url(#rose-petal)" stroke="#d3bd90" strokeWidth=".018" />
            <path d={PETAL_EDGE} fill="none" stroke="#fff" strokeOpacity=".85" strokeWidth=".026" />
          </g>
        ))}
        {[12, 132, 252].map((a) => (
          <path
            key={`i${a}`}
            d={PETAL_INNER}
            transform={`rotate(${a}) scale(.5)`}
            fill="url(#rose-inner)"
            stroke="#cfb07a"
            strokeWidth=".03"
          />
        ))}
        {[72, 192, 312].map((a) => (
          <path
            key={`c${a}`}
            d={PETAL_INNER}
            transform={`rotate(${a}) scale(.32)`}
            fill="url(#rose-inner)"
            stroke="#c9a76c"
            strokeWidth=".04"
          />
        ))}
        <circle r=".15" fill="url(#rose-core)" />
        <path d={SPIRAL} fill="none" stroke="#b99350" strokeWidth=".022" strokeLinecap="round" />
      </g>
    </g>
  );
}

type FloralProps = {
  className?: string;
  /** Changes the small random variations between instances. */
  seed?: number;
  /** Marks the arrangement for the hero intro instead of a scroll trigger. */
  hero?: boolean;
};

export function FloralCorner({ className = "", seed = 7, hero = false }: FloralProps) {
  const { stems, twigs, leaves, blossoms, dots, buds } = buildArrangement(seed);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${hero ? "js-hero-floral" : ""} ${className}`}
      data-anim={hero ? undefined : "floral"}
    >
      <div className="floral-breathe h-full w-full origin-top-right">
        <svg viewBox="0 0 320 320" className="block h-auto w-full overflow-visible" focusable="false">
          <g fill="none" strokeLinecap="round">
            {stems.map((s, i) => (
              <path key={`s${i}`} className="fl-stem" d={s.d} stroke="#7b825d" strokeWidth={s.width} />
            ))}
            {twigs.map((s, i) => (
              <path key={`t${i}`} className="fl-twig" d={s.d} stroke="#a08b58" strokeWidth={s.width} />
            ))}
          </g>

          {leaves.map((l, i) => (
            <g
              key={`l${i}`}
              transform={`translate(${r1(l.x)} ${r1(l.y)}) rotate(${r1(l.angle)}) scale(${r1(l.size * 38)})`}
            >
              <g className="fl-leaf">
                <path d={LEAF} fill={l.tone === "olive" ? "url(#leaf-olive)" : "url(#leaf-sage)"} />
                <path d={LEAF_RIB} fill="none" stroke="#eef0e2" strokeOpacity=".55" strokeWidth=".018" />
              </g>
            </g>
          ))}

          {dots.map((d, i) => (
            <circle
              key={`d${i}`}
              className="fl-dot"
              cx={r1(d.x)}
              cy={r1(d.y)}
              r={r1(d.r)}
              fill="#fffdf6"
              stroke="#dccca7"
              strokeWidth=".5"
            />
          ))}

          {buds.map((b, i) => (
            <g key={`b${i}`} transform={`translate(${r1(b.x)} ${r1(b.y)}) rotate(${r1(b.angle)}) scale(${b.size})`}>
              <g className="fl-bloom">
                <path d={BUD} fill="url(#bloom)" stroke="#dccca7" strokeWidth=".05" />
                <path d="M0 0C-.3-.1-.5-.5-.42-.8M0 0C.3-.1.5-.5.42-.8" fill="none" stroke="#7b825d" strokeWidth=".09" />
              </g>
            </g>
          ))}

          {blossoms.map((b, i) => (
            <g key={`f${i}`} transform={`translate(${r1(b.x)} ${r1(b.y)}) rotate(${r1(b.rot)}) scale(${r1(b.r)})`}>
              <g className="fl-bloom">
                {[0, 72, 144, 216, 288].map((a) => (
                  <path
                    key={a}
                    d={BLOSSOM_PETAL}
                    transform={`rotate(${a})`}
                    fill="url(#bloom)"
                    stroke="#dcc9a2"
                    strokeWidth=".045"
                  />
                ))}
                <circle r=".22" fill="#d6ad55" />
                <circle r=".1" fill="#a97c2a" />
              </g>
            </g>
          ))}

          {ROSES.map((rose, i) => (
            <Rose key={`r${i}`} {...rose} />
          ))}
        </svg>
      </div>
    </div>
  );
}
