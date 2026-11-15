"use client";

import { useSyncExternalStore } from "react";

/*
 * A once-per-second clock shared by every subscriber. The server snapshot is
 * 0, so the prerendered HTML never reads the current time (Next.js
 * cacheComponents forbids that) and the real numbers appear after hydration.
 */
let now = 0;
const listeners = new Set<() => void>();
let timer: number | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === undefined) {
    timer = window.setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

function getSnapshot() {
  if (now === 0) now = Date.now();
  return now;
}

function getServerSnapshot() {
  return 0;
}

const UNITS = [
  { label: "Days", ms: 86_400_000 },
  { label: "Hours", ms: 3_600_000 },
  { label: "Minutes", ms: 60_000 },
  { label: "Seconds", ms: 1_000 },
] as const;

function splitDuration(ms: number) {
  const values: { label: string; value: number }[] = [];
  let rest = ms;
  for (const unit of UNITS) {
    const value = Math.floor(rest / unit.ms);
    rest -= value * unit.ms;
    values.push({ label: unit.label, value });
  }
  return values;
}

export function Countdown({ start, end }: { start: string; end: string }) {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const startMs = Date.parse(start);
  const endMs = Date.parse(end);

  if (current !== 0 && current >= startMs) {
    const live = current < endMs;
    return (
      <div className="js-tiles rounded-[22px] bg-ivory/80 px-6 py-8 shadow-[inset_0_0_0_1px_var(--color-gold-300)]">
        <p className="font-display text-xs tracking-[0.35em] text-gold-600 uppercase">
          {live ? "Happening now" : "Alhamdulillah"}
        </p>
        <p className="mt-3 font-serif text-2xl text-ink italic">
          {live
            ? "The celebration has begun — we can’t wait to see you!"
            : "Thank you for your prayers and for celebrating with us."}
        </p>
      </div>
    );
  }

  const values = splitDuration(current === 0 ? 0 : startMs - current);

  const summary =
    current === 0
      ? "Counting down to the wedding"
      : `${values[0].value} days, ${values[1].value} hours and ${values[2].value} minutes to go`;

  return (
    <div className="js-tiles grid grid-cols-4 gap-[clamp(.4rem,2.2cqw,1rem)]" role="timer" aria-label={summary}>
      {values.map(({ label, value }) => {
        const text = current === 0 ? "--" : String(value).padStart(2, "0");
        return (
          <div key={label} className="js-tile tile" aria-hidden="true">
            <span className="flex font-serif text-[clamp(2rem,9.5cqw,3.3rem)] leading-none font-semibold text-ink lining-nums tabular-nums">
              {[...text].map((char, i) => (
                <span key={`${i}-${char}`} className="digit">
                  {char}
                </span>
              ))}
            </span>
            <span className="font-display text-[clamp(.5rem,1.9cqw,.66rem)] tracking-[0.22em] text-gold-600 uppercase">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
