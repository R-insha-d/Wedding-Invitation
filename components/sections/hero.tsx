import { FloralCorner } from "@/components/art/floral";
import { Lantern } from "@/components/art/lantern";
import { NameSvg } from "@/components/art/names";
import { wedding } from "@/lib/wedding";

export function Hero() {
  return (
    <header
      id="top"
      className="relative flex min-h-[calc(100svh-2.5rem)] flex-col items-center px-5 pb-8 text-center sm:px-10"
    >
      {/* Hanging lanterns */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-2.5rem] left-[4%] z-20 flex items-start gap-[3cqw] md:left-[-17%]"
      >
        <div className="js-lantern">
          <div className="lantern-sway">
            <Lantern chain={170} className="block w-[clamp(40px,10.5cqw,74px)]" />
          </div>
        </div>
        <div className="js-lantern">
          <div className="lantern-sway lantern-sway--slow">
            <Lantern chain={80} className="block w-[clamp(32px,8cqw,58px)]" />
          </div>
        </div>
      </div>

      {/* Florals, like the printed card */}
      <FloralCorner
        hero
        seed={7}
        className="absolute top-[-2rem] right-[-9%] z-20 w-[56%] md:right-[-27%] md:w-[52%]"
      />
      <FloralCorner
        hero
        seed={19}
        className="absolute bottom-[1%] left-[-10%] z-20 w-[50%] rotate-180 md:left-[-28%] md:w-[48%]"
      />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center pt-[15.5cqw]">
        <p
          className="js-bismillah font-arabic text-[clamp(1.5rem,6.2cqw,2.6rem)] leading-[1.9] text-gold-600"
          lang="ar"
          dir="rtl"
        >
          {wedding.bismillah}
        </p>
        <svg
          aria-hidden="true"
          viewBox="0 0 160 16"
          className="js-hero-ornament mt-1 w-[clamp(7rem,30cqw,11rem)] overflow-visible"
        >
          <path className="js-orn-line" d="M66 8H4" stroke="#cfa75a" strokeOpacity=".75" strokeWidth="1" />
          <path className="js-orn-line" d="M94 8h62" stroke="#cfa75a" strokeOpacity=".75" strokeWidth="1" />
          <path className="js-orn-gem" d="M80 1.5l3.2 6.5L80 14.5 76.8 8z" fill="#c69b47" />
          <circle className="js-orn-gem" cx="71" cy="8" r="1.4" fill="#c69b47" />
          <circle className="js-orn-gem" cx="89" cy="8" r="1.4" fill="#c69b47" />
        </svg>

        <div className="flex w-full flex-1 flex-col items-center justify-center gap-[clamp(.5rem,2cqw,1rem)] py-6">
          <p className="js-hero-eyebrow font-display text-[clamp(.62rem,2.3cqw,.78rem)] tracking-[0.5em] text-ink-soft uppercase">
            The Wedding Of
          </p>

          <h1 className="w-full">
            <span className="sr-only">
              {wedding.groom.name} with {wedding.bride.name}
            </span>
            <NameSvg name="dilshad" className="js-name-1 mx-auto w-[min(74%,25rem)]" />
            <span
              aria-hidden="true"
              className="my-[clamp(.35rem,1.6cqw,.9rem)] flex items-center justify-center gap-4"
            >
              <span className="js-with-rule h-px w-[clamp(2.5rem,13cqw,5.5rem)] origin-right bg-linear-to-l from-gold-400 to-transparent" />
              <span className="js-with font-serif text-[clamp(1.2rem,4.8cqw,1.8rem)] text-ink-soft italic">with</span>
              <span className="js-with-rule h-px w-[clamp(2.5rem,13cqw,5.5rem)] origin-left bg-linear-to-r from-gold-400 to-transparent" />
            </span>
            <NameSvg name="jahanaSherin" className="js-name-2 mx-auto w-[min(96%,37rem)]" />
          </h1>

          <div className="js-hero-date mt-[clamp(1rem,4cqw,2rem)] flex flex-col items-center gap-2">
            <p className="font-display text-[clamp(.72rem,2.9cqw,.95rem)] tracking-[0.32em] text-ink uppercase">
              {wedding.event.weekday} · {wedding.event.numeric}
            </p>
            <p className="font-serif text-[clamp(1.05rem,4cqw,1.35rem)] text-ink-soft italic">
              {wedding.venue.name}, {wedding.venue.area}
            </p>
          </div>
        </div>

        <a
          href="#verse"
          className="js-scroll-cue flex flex-col items-center gap-3 font-display text-[0.6rem] tracking-[0.5em] text-gold-600"
        >
          <span className="pl-[0.5em]">SCROLL</span>
          <span className="relative h-12 w-px overflow-hidden bg-gold-200">
            <span className="scroll-cue__line absolute inset-0 bg-gold-500" />
          </span>
        </a>
      </div>
    </header>
  );
}
