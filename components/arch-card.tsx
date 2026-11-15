import type { ReactNode } from "react";

/**
 * The long ivory invitation panel with an ogee-arched top and a double
 * gold frame. Its width is a container, so the arch (40cqw tall) and the
 * frame lines stay aligned at every screen size.
 */
export function ArchCard({ children }: { children: ReactNode }) {
  return (
    <div className="arch-card">
      <div className="arch-card__bg" aria-hidden="true" />

      <svg
        className="pointer-events-none absolute inset-x-0 top-0 block h-auto w-full overflow-visible"
        viewBox="0 0 400 160"
        aria-hidden="true"
        focusable="false"
      >
        <g className="js-arch-finial">
          <path d="M200-17c2.6 6 5.2 10.4 0 17-5.2-6.6-2.6-11 0-17z" fill="url(#gold-metal-v)" />
          <circle cx="200" cy="-21.5" r="2.6" fill="#c69b47" />
        </g>
        <g fill="none" strokeLinecap="round">
          <path
            className="js-arch-line"
            d="M200 0C186 30 158 47 116 54 64 62 0 72 0 118v42"
            stroke="#cfa75a"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="js-arch-line"
            d="M200 0c14 30 42 47 84 54 52 8 116 18 116 64v42"
            stroke="#cfa75a"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="js-arch-line"
            d="M200 13c-11.5 24-38 40.5-82 48.5C68 69 8 79 8 120v40"
            stroke="#e0c27e"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="js-arch-line"
            d="M200 13c11.5 24 38 40.5 82 48.5 50 7.5 110 17.5 110 58.5v40"
            stroke="#e0c27e"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>

      <span aria-hidden="true" className="frame-line frame-line--outer-l js-frame-outer" />
      <span aria-hidden="true" className="frame-line frame-line--outer-r js-frame-outer" />
      <span aria-hidden="true" className="frame-line frame-line--outer-b" />
      <span aria-hidden="true" className="frame-line frame-line--inner-l js-frame-inner" />
      <span aria-hidden="true" className="frame-line frame-line--inner-r js-frame-inner" />
      <span aria-hidden="true" className="frame-line frame-line--inner-b" />

      <div className="relative">{children}</div>
    </div>
  );
}
