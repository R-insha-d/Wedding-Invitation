"use client";

import { Rosette, WaxSeal } from "@/components/art/ornaments";
import { wedding } from "@/lib/wedding";

function Door({ side }: { side: "left" | "right" }) {
  return (
    <div className={`js-door-${side} door door--${side}`}>
      <div className="door__face">
        <div className="door__frame" />
        <div className="door__arch">
          <Rosette className="door__rosette text-gold-200/90" />
        </div>
        <div className="door__knob" />
      </div>
    </div>
  );
}

/**
 * Full-screen double doors shown on load. Tapping the seal plays the
 * opening timeline that lives in Experience (see buildGate).
 */
export function Gate({ onOpen }: { onOpen: () => void }) {
  return (
    <div
      className="js-gate gate fixed inset-0 z-[60] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={`Wedding invitation of ${wedding.groom.name} and ${wedding.bride.name}`}
    >
      <Door side="left" />
      <Door side="right" />
      <div className="js-seam seam-light" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-[clamp(1.4rem,4.5svh,2.6rem)] px-6 text-center">
        <p
          className="js-gate-copy font-arabic text-[clamp(1.5rem,5.5vw,2.3rem)] leading-[1.8] text-gold-200 drop-shadow-[0_2px_6px_rgb(30_34_20/.5)]"
          lang="ar"
          dir="rtl"
        >
          {wedding.bismillah}
        </p>

        <div className="js-gate-copy">
          <p className="font-serif text-[clamp(1.05rem,3.6vw,1.35rem)] text-ivory/90 italic drop-shadow-[0_1px_4px_rgb(30_34_20/.6)]">
            You are warmly invited to the wedding of
          </p>
          <p className="mt-2 flex flex-col items-center font-script text-[clamp(2.7rem,11vw,4.6rem)] leading-[1.08] text-gold-100 drop-shadow-[0_3px_10px_rgb(30_34_20/.55)] sm:flex-row sm:gap-4">
            <span>{wedding.groom.name}</span>
            <span className="text-[0.6em] text-gold-300">&amp;</span>
            <span>{wedding.bride.name}</span>
          </p>
        </div>

        <div className="relative flex flex-col items-center">
          <div className="js-flash gate-flash" />
          <button type="button" onClick={onOpen} className="js-seal seal" aria-label="Open the invitation">
            <WaxSeal initials={[wedding.groom.name[0], wedding.bride.name[0]]} />
          </button>
          <p className="js-gate-copy mt-6 pl-[0.45em] font-display text-[0.68rem] tracking-[0.45em] text-gold-100 uppercase">
            Tap to open
          </p>
        </div>

        <p className="js-gate-copy pl-[0.4em] font-display text-[0.72rem] tracking-[0.4em] text-ivory/80">
          {wedding.event.numeric}
        </p>
      </div>
    </div>
  );
}
