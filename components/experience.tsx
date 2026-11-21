"use client";

import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { Gate } from "@/components/gate";
import { PetalScene } from "@/components/petal-scene";
import { emit, on } from "@/lib/events";
import { whenIdle } from "@/lib/idle";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin);

const all = <T extends Element = HTMLElement>(root: ParentNode, selector: string) =>
  Array.from(root.querySelectorAll<T>(selector));

const one = <T extends Element = HTMLElement>(root: ParentNode, selector: string) =>
  root.querySelector<T>(selector);

/** Stems draw, leaves unfurl, blossoms open, roses bloom. */
function floralTimeline(el: Element) {
  return gsap
    .timeline()
    .from(all(el, ".fl-stem"), { drawSVG: 0, duration: 1.8, ease: "power2.inOut", stagger: 0.08 }, 0)
    .from(all(el, ".fl-twig"), { drawSVG: 0, duration: 0.7, ease: "power1.out", stagger: 0.012 }, 0.7)
    .from(
      all(el, ".fl-leaf"),
      { scale: 0, duration: 1, ease: "back.out(1.6)", stagger: 0.025, transformOrigin: "0% 50%" },
      0.45,
    )
    .from(
      all(el, ".fl-dot"),
      { scale: 0, duration: 0.6, ease: "back.out(3)", stagger: { each: 0.012, from: "random" }, transformOrigin: "50% 50%" },
      1,
    )
    .from(
      all(el, ".fl-bloom"),
      {
        scale: 0,
        rotation: -120,
        duration: 1.1,
        ease: "back.out(1.8)",
        stagger: { each: 0.04, from: "random" },
        transformOrigin: "50% 50%",
      },
      0.95,
    )
    .from(
      all(el, ".fl-rose"),
      { scale: 0.2, rotation: -70, autoAlpha: 0, duration: 2, ease: "expo.out", stagger: 0.18, transformOrigin: "50% 50%" },
      0.6,
    );
}

/** Script heading that writes itself left to right (CSS mask driven by --p). */
const write = (el: Element | null, duration = 2.2) =>
  el ? gsap.fromTo(el, { "--p": "-25%" }, { "--p": "125%", duration, ease: "power2.inOut" }) : gsap.timeline();

/**
 * Stroke-draw for paths with vector-effect="non-scaling-stroke". DrawSVG treats
 * those as "live" and re-measures them on every frame (getScreenCTM + getBBox +
 * getTotalLength, each forcing a synchronous layout), which stalled the door
 * opening. Their length can't change mid-intro, so measure once instead.
 */
function drawStroke(paths: SVGPathElement[], vars: gsap.TweenVars) {
  const lengths = paths.map((p) => {
    const m = p.getScreenCTM(); // dashes are in screen px for non-scaling strokes
    return p.getTotalLength() * (m ? Math.hypot(m.a, m.b) : 1) + 1;
  });
  gsap.set(paths, { strokeDasharray: (i: number) => `${lengths[i]} ${lengths[i]}`, strokeDashoffset: (i: number) => lengths[i] });
  return gsap.to(paths, {
    strokeDashoffset: 0,
    ...vars,
    onComplete: () => void gsap.set(paths, { clearProps: "strokeDasharray,strokeDashoffset" }),
  });
}

function buildGateIntro(root: HTMLElement) {
  const tl = gsap
    .timeline({ delay: 0.2 })
    .set(all(root, ".door__rosette"), { autoAlpha: 1 })
    .from(all(root, ".door__rosette .js-draw"), { drawSVG: 0, duration: 2.2, ease: "power2.inOut", stagger: 0.12 }, 0)
    .from(
      all(root, ".door__rosette .js-rosette-core"),
      { scale: 0, rotation: -120, transformOrigin: "50% 50%", duration: 1.2, ease: "back.out(2)" },
      0.9,
    )
    // The text blocks are shown at once; their letters then arrive one by one.
    .set(all(root, ".js-gate-copy"), { autoAlpha: 1 }, 0);

  const splits: SplitText[] = [];
  const letters = (selector: string) => {
    const el = one(root, selector);
    if (!el) return [];
    const split = SplitText.create(el, { type: "words,chars" });
    splits.push(split);
    return split.chars;
  };
  const from = (targets: Element[], vars: gsap.TweenVars, at: number) => {
    if (targets.length) tl.from(targets, vars, at);
  };

  // Arabic letters join up, so the Bismillah is written in right-to-left instead.
  const arabic = one(root, '.js-gate-copy[lang="ar"]');
  if (arabic) {
    tl.fromTo(
      arabic,
      { clipPath: "inset(-30% 0% -30% 100%)" },
      { clipPath: "inset(-30% 0% -30% 0%)", duration: 1.5, ease: "power2.inOut", clearProps: "clipPath" },
      0.1,
    );
  }

  from(letters(".js-gate-invite"), { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.022, ease: "power2.out" }, 0.7);
  from(
    letters(".js-gate-names"),
    {
      autoAlpha: 0,
      y: 24,
      scale: 0.6,
      rotation: -8,
      transformOrigin: "50% 100%",
      duration: 0.9,
      stagger: 0.06,
      ease: "back.out(2)",
    },
    1.4,
  );
  tl.fromTo(
    all(root, ".js-seal"),
    { autoAlpha: 0, scale: 0, rotation: -40 },
    { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.4, ease: "back.out(1.7)" },
    1.9,
  );
  from(all(root, ".js-gate-rule"), { scaleX: 0, transformOrigin: "100% 50%", duration: 0.8, ease: "power2.out" }, 2.8);
  from(letters(".js-gate-tap"), { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.05, ease: "power2.out" }, 2.8);
  from(letters(".js-gate-date"), { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.05, ease: "power2.out" }, 3.3);
  from(all(root, ".js-gate-gem"), { autoAlpha: 0, scale: 0, duration: 0.5, stagger: 0.25, ease: "back.out(3)" }, 3.45);

  // Join the letters back up (restores the fonts' kerning, lightens the DOM).
  return tl.call(() => splits.forEach((split) => split.revert()));
}

/** GSAP's power eases as CSS cubic-béziers, for the compositor-driven gate animation. */
const EASE = {
  in2: "cubic-bezier(0.32, 0, 0.67, 0)", // power2.in
  out1: "cubic-bezier(0.5, 1, 0.89, 1)", // power1.out
  out2: "cubic-bezier(0.33, 1, 0.68, 1)", // power2.out
  inOut3: "cubic-bezier(0.76, 0, 0.24, 1)", // power3.inOut
};

type GateOpen = { play: () => void; isActive: () => boolean; kill: () => void };

/**
 * Seal bursts → doors swing open → gate fades.
 *
 * Runs on the Web Animations API with transform/opacity only, so the browser's
 * compositor plays it at full frame rate even while the main thread is busy
 * starting the hero animation underneath (GSAP tweens would stutter with it).
 */
function buildGateOpen(root: HTMLElement, motion: boolean, onReveal: () => void, onDone: () => void): GateOpen {
  const gate = one(root, ".js-gate");
  if (!gate) return { play() {}, isActive: () => false, kill() {} };

  if (!motion) {
    const tl = gsap.timeline({ paused: true }).call(onReveal).to(gate, { autoAlpha: 0, duration: 0.5 }).call(onDone);
    return { play: () => void tl.play(), isActive: () => tl.isActive(), kill: () => void tl.kill() };
  }

  const BURST = 200; // ms the seal is pressed in before it bursts
  const OPEN = BURST + 300; // ms until the doors start to swing

  let active = false;
  const running: Animation[] = [];
  const calls: gsap.core.Tween[] = [];
  const run = (els: Element[], keyframes: Keyframe[], timing: KeyframeAnimationOptions) =>
    els.map((el) => {
      const anim = el.animate(keyframes, { fill: "forwards", ...timing });
      running.push(anim);
      return anim;
    });

  return {
    isActive: () => active,
    kill() {
      running.forEach((a) => a.cancel());
      calls.forEach((c) => c.kill());
    },
    play() {
      if (active) return;
      active = true;

      run(
        all(root, ".js-seal"),
        [
          { transform: "scale(1)", opacity: 1, easing: EASE.in2 },
          { transform: "scale(0.88)", opacity: 1, offset: BURST / 1000, easing: EASE.out2 },
          { transform: "scale(1.5)", opacity: 0 },
        ],
        { duration: 1000 },
      );
      run(
        all(root, ".js-flash"),
        [
          { transform: "scale(0.3)", opacity: 1 },
          { transform: "scale(11)", opacity: 0 },
        ],
        { duration: 1500, delay: BURST, easing: EASE.out2 },
      );
      all(root, ".js-gate-copy").forEach((el, i) =>
        run(
          [el],
          [
            { transform: "translateY(0)", opacity: 1 },
            { transform: "translateY(-18px)", opacity: 0 },
          ],
          { duration: 600, delay: BURST + i * 50, easing: EASE.in2 },
        ),
      );

      const swing = { duration: 2500, delay: OPEN, easing: EASE.inOut3 };
      run(all(root, ".js-door-left"), [{ transform: "rotateY(0deg)" }, { transform: "rotateY(-112deg)" }], swing);
      run(all(root, ".js-door-right"), [{ transform: "rotateY(0deg)" }, { transform: "rotateY(112deg)" }], swing);
      run(all(root, ".js-seam"), [{ transform: "scaleX(1)" }, { transform: "scaleX(90)" }], {
        duration: 1100,
        delay: OPEN,
        easing: EASE.out2,
      });
      run(all(root, ".js-seam"), [{ opacity: 0, easing: EASE.out2 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], {
        duration: 1800,
        delay: OPEN,
      });

      // Each fires once: on GSAP's clock normally, or at the latest when the gate is gone.
      // (The doors run on the browser's animation clock; after the guest switches apps
      // mid-opening the two clocks can disagree, and the page must never stay locked.)
      let opened = false;
      let revealed = false;
      const fireOpen = () => void (!opened && ((opened = true), emit("open")));
      const fireReveal = () => void (!revealed && ((revealed = true), onReveal()));
      calls.push(gsap.delayedCall((OPEN + 250) / 1000, fireOpen), gsap.delayedCall((OPEN + 450) / 1000, fireReveal));

      const [fade] = run([gate], [{ opacity: 1 }, { opacity: 0 }], {
        duration: 800,
        delay: OPEN + 1800,
        easing: EASE.out1,
      });
      fade.finished.then(
        () => {
          fireOpen();
          fireReveal();
          active = false;
          onDone();
        },
        () => {}, // cancelled on unmount
      );
    },
  };
}

function buildHero(root: HTMLElement) {
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

  tl.add(drawStroke(all<SVGPathElement>(root, ".js-arch-line"), { duration: 2.6, ease: "power2.inOut" }), 0)
    .from(all(root, ".js-arch-finial"), { autoAlpha: 0, y: 12, duration: 1.1, ease: "back.out(2)" }, 1.3)
    .from(all(root, ".js-frame-outer"), { scaleY: 0, duration: 3.2, ease: "power2.inOut" }, 1.4)
    .from(all(root, ".js-frame-inner"), { autoAlpha: 0, duration: 1.6 }, 2.2);

  all(root, ".js-lantern").forEach((el, i) => {
    tl.from(el, { yPercent: -110, duration: 2.1, ease: "power3.out" }, 0.25 + i * 0.3).from(
      el,
      { rotation: i % 2 ? 15 : -17, duration: 3.8, ease: "elastic.out(1, 0.28)", transformOrigin: "50% 0%" },
      0.6 + i * 0.3,
    );
  });

  all(root, ".js-hero-floral").forEach((el, i) => tl.add(floralTimeline(el), 0.6 + i * 0.55));

  // No filter:blur in the hero: it repaints the text every frame while the doors open.
  tl.from(all(root, ".js-bismillah"), { autoAlpha: 0, y: 18, scale: 0.96, duration: 1.8 }, 0.8)
    .from(all(root, ".js-hero-ornament .js-orn-line"), { drawSVG: 0, duration: 1.4, ease: "power2.inOut" }, 1.4)
    .from(
      all(root, ".js-hero-ornament .js-orn-gem"),
      { scale: 0, transformOrigin: "50% 50%", duration: 0.8, ease: "back.out(3)", stagger: 0.1 },
      1.5,
    );

  const eyebrow = one(root, ".js-hero-eyebrow");
  if (eyebrow) {
    const split = SplitText.create(eyebrow, { type: "chars" });
    tl.from(split.chars, { autoAlpha: 0, y: 10, duration: 0.8, stagger: 0.045 }, 1.4);
  }

  const name1 = all<SVGPathElement>(root, ".js-name-1 .glyph");
  const name2 = all<SVGPathElement>(root, ".js-name-2 .glyph");
  tl.set([...name1, ...name2], { strokeOpacity: 1 }, 0)
    .from(name1, { drawSVG: 0, duration: 1.3, ease: "power1.inOut", stagger: 0.16 }, 1.6)
    .from(name1, { fillOpacity: 0, duration: 1.1, ease: "power1.out", stagger: 0.16 }, 2.3)
    .to(name1, { strokeOpacity: 0, duration: 1.2, stagger: 0.16 }, 3.1)
    .from(all(root, ".js-with"), { autoAlpha: 0, y: 8, duration: 0.9 }, 2.6)
    .from(all(root, ".js-with-rule"), { scaleX: 0, duration: 1.1, ease: "power2.inOut" }, 2.6)
    .from(name2, { drawSVG: 0, duration: 1.2, ease: "power1.inOut", stagger: 0.11 }, 2.8)
    .from(name2, { fillOpacity: 0, duration: 1.1, ease: "power1.out", stagger: 0.11 }, 3.4)
    .to(name2, { strokeOpacity: 0, duration: 1.2, stagger: 0.11 }, 4.2)
    .from(all(root, ".js-hero-date > *"), { autoAlpha: 0, y: 16, duration: 1, stagger: 0.15 }, 4.1)
    .from(all(root, ".js-scroll-cue"), { autoAlpha: 0, y: -10, duration: 1 }, 4.9);

  return tl;
}

/**
 * QR card entrance: viewfinder corners lock onto the code, a gold beam
 * "prints" it top to bottom, a confirm ring flashes, then the caption settles
 * and the idle scan line resumes. Ends on a clean, unclipped QR.
 */
/**
 * Countdown tiles: they rise in one by one, each gold outline traces itself
 * from the crown down both sides (--trace), the labels settle, and the digits
 * roll up from 00 like an odometer (Countdown listens for "countdown:reveal").
 */
function tilesTimeline(scope: Element) {
  const tl = gsap.timeline();
  const tiles = all(scope, ".js-tile");
  if (!tiles.length) return tl;
  tl.from(tiles, { autoAlpha: 0, y: 28, scale: 0.94, duration: 1, ease: "power3.out", stagger: 0.1 }, 0)
    .fromTo(
      tiles,
      { "--trace": "0deg" },
      { "--trace": "180deg", duration: 1.4, ease: "power2.inOut", stagger: 0.1 },
      0.1,
    )
    .from(all(scope, ".js-tile-label"), { autoAlpha: 0, letterSpacing: "0.6em", duration: 1, stagger: 0.1 }, 0.45)
    .call(() => one(scope, ".js-tiles")?.dispatchEvent(new Event("countdown:reveal")), undefined, 0.5);
  return tl;
}

function qrTimeline(card: Element) {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  const corners = all(card, ".js-qr-corner"); // tl, tr, bl, br
  const box = one(card, ".js-qr-box");
  const code = one(card, ".js-qr-code");
  const beam = one(card, ".js-qr-beam");
  const scan = one(card, ".js-qr-scan");
  const confirm = one(card, ".js-qr-confirm");
  const label = one(card, ".js-qr-label");

  tl.from(card, { autoAlpha: 0, y: 34, duration: 0.9 });
  if (box) tl.from(box, { scale: 0.86, duration: 1, ease: "back.out(1.6)" }, 0.1);

  // Corners fly in from outside and lock on, then a quick "focus" squeeze.
  corners.forEach((corner, i) => {
    const sx = i % 2 ? 1 : -1;
    const sy = i < 2 ? -1 : 1;
    tl.from(
      corner,
      { x: sx * 18, y: sy * 18, rotation: sx * sy * -30, autoAlpha: 0, duration: 0.7, ease: "back.out(2.2)" },
      0.35 + i * 0.06,
    );
  });
  tl.to(corners, { scale: 0.8, duration: 0.16, ease: "power2.in" }, 1.05).to(
    corners,
    { scale: 1, duration: 0.55, ease: "back.out(3)" },
    1.21,
  );

  // The beam sweeps down and the code appears right behind it.
  if (scan) tl.fromTo(scan, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 2.9);
  if (code) {
    tl.fromTo(
      code,
      { clipPath: "inset(0% 0% 100% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power1.inOut", clearProps: "clipPath" },
      1.25,
    );
  }
  if (beam) {
    tl.fromTo(
      beam,
      { autoAlpha: 1, yPercent: 0 },
      { yPercent: 100, duration: 1.1, ease: "power1.inOut", immediateRender: false },
      1.25,
    ).to(beam, { autoAlpha: 0, duration: 0.3 }, 2.3);
  }

  // Confirmation ring, like a successful scan.
  if (confirm) {
    tl.fromTo(
      confirm,
      { autoAlpha: 0.95, scale: 1 },
      { autoAlpha: 0, scale: 1.14, duration: 0.9, ease: "power2.out", immediateRender: false },
      2.35,
    );
  }

  if (label) {
    const split = SplitText.create(label, { type: "chars" });
    tl.from(split.chars, { autoAlpha: 0, y: 8, duration: 0.5, stagger: 0.03 }, 2.2);
  }
  const hint = one(card, ".js-qr-hint");
  if (hint) tl.from(hint, { autoAlpha: 0, y: 8, duration: 0.7 }, 2.6);
  return tl;
}

function buildScroll(root: HTMLElement) {
  const once = (trigger: Element, start = "top 78%") => ({ trigger, start, once: true });
  const existingTriggers = new Set(ScrollTrigger.getAll());

  // Ornamental dividers
  all(root, '[data-anim="divider"]').forEach((el) => {
    gsap
      .timeline({ scrollTrigger: once(el, "top 90%") })
      .from(all(el, ".js-div-line"), { drawSVG: 0, duration: 1.5, ease: "power2.inOut" })
      .from(
        all(el, ".js-div-gem"),
        { scale: 0, rotation: -180, transformOrigin: "50% 50%", duration: 1.1, ease: "back.out(2)" },
        0.05,
      )
      .from(all(el, ".js-div-dot"), { scale: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(3)" }, 0.8);
  });

  // Verse: rosette draws and slowly turns; words light up as you read.
  all(root, '[data-anim="rosette"]').forEach((el) => {
    gsap
      .timeline({ scrollTrigger: once(el, "top 88%") })
      .from(all(el, ".js-draw"), { drawSVG: 0, duration: 1.6, ease: "power2.inOut", stagger: 0.12 })
      .from(
        all(el, ".js-rosette-core"),
        { scale: 0, rotation: -180, transformOrigin: "50% 50%", duration: 1.2, ease: "back.out(2)" },
        0.6,
      );
    // Slow turn, only while visible (it restyles every frame otherwise).
    gsap.to(el, {
      rotation: 360,
      duration: 60,
      ease: "none",
      repeat: -1,
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" },
    });
  });

  all(root, '[data-anim="scrub-words"]').forEach((el) => {
    const split = SplitText.create(el, { type: "words" });
    gsap.fromTo(
      split.words,
      { opacity: 0.12, y: 6 },
      {
        opacity: 1,
        y: 0,
        ease: "none",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 55%", scrub: 0.8 },
      },
    );
  });

  all(root, '[data-anim="cite"]').forEach((el) => {
    gsap
      .timeline({ scrollTrigger: once(el, "top 92%") })
      .from(all(el, ".js-rule"), { scaleX: 0, duration: 1.2, ease: "power2.inOut" })
      .from(all(el, ".js-cite"), { autoAlpha: 0, letterSpacing: "0.9em", duration: 1.4 }, 0.1);
  });

  // Invitation wording
  all(root, '[data-anim="invitation"]').forEach((el) => {
    const tl = gsap.timeline({ scrollTrigger: once(el, "top 72%") });
    const parents = one(el, ".js-parents");
    const request = one(el, ".js-request");
    if (parents) {
      const split = SplitText.create(parents, { type: "words,chars" });
      tl.from(split.chars, {
        autoAlpha: 0,
        yPercent: 80,
        rotateX: -90,
        transformPerspective: 500,
        transformOrigin: "50% 100%",
        duration: 0.9,
        ease: "back.out(1.6)",
        stagger: 0.025,
      });
    }
    if (request) {
      const split = SplitText.create(request, { type: "words" });
      tl.from(
        split.words,
        { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.04 },
        0.5,
      );
    }
    all(el, ".js-write").forEach((w, i) => {
      tl.add(write(w, 2.2), 1.1 + i * 1.3).to(
        w,
        { backgroundPosition: "100% 50%", duration: 2.6, ease: "power1.inOut" },
        2.4 + i * 1.3,
      );
    });
    tl.from(all(el, ".js-with2"), { autoAlpha: 0, y: 8, duration: 0.8 }, 2)
      .from(all(el, ".js-with2-rule"), { scaleX: 0, duration: 1, ease: "power2.inOut" }, 2)
      .from(all(el, ".js-bride-parents"), { autoAlpha: 0, y: 14, letterSpacing: "0.5em", duration: 1.4 }, 3.3);
  });

  // Save the date
  all(root, '[data-anim="date"]').forEach((el) => {
    const tl = gsap.timeline({ scrollTrigger: once(el, "top 72%") });
    tl.from(all(el, ".js-date-eyebrow"), { autoAlpha: 0, y: 10, duration: 0.8 });
    const month = one(el, ".js-month");
    if (month) {
      const split = SplitText.create(month, { type: "chars" });
      tl.from(
        split.chars,
        {
          autoAlpha: 0,
          yPercent: -140,
          rotateX: 100,
          transformPerspective: 400,
          duration: 0.9,
          ease: "back.out(2)",
          stagger: 0.07,
        },
        0.15,
      );
    }
    const reel = one(el, ".js-reel");
    tl.from(all(el, ".js-date-rule"), { scaleX: 0, duration: 1.2, ease: "power3.inOut" }, 0.5)
      .from(all(el, ".js-date-bar"), { scaleY: 0, duration: 0.9, ease: "power3.inOut" }, 0.7)
      .from(all(el, ".js-weekday"), { autoAlpha: 0, x: -36, duration: 1.1 }, 0.9)
      .from(all(el, ".js-year"), { autoAlpha: 0, x: 36, duration: 1.1 }, 0.9)
      .from(all(el, ".js-day"), { autoAlpha: 0, scale: 0.7, duration: 1, ease: "back.out(1.6)" }, 0.8);
    if (reel) {
      const n = reel.children.length;
      tl.fromTo(reel, { yPercent: (-100 * (n - 1)) / n }, { yPercent: 0, duration: 2, ease: "power4.inOut" }, 0.8);
    }
    tl.from(all(el, ".js-day-circle"), { drawSVG: 0, duration: 1.6, ease: "power2.inOut" }, 2.4).from(
      all(el, ".js-date-after"),
      { autoAlpha: 0, y: 20, duration: 1, stagger: 0.15 },
      2.6,
    );
  });

  // Hearts + countdown
  all(root, '[data-anim="countdown"]').forEach((el) => {
    const tl = gsap.timeline({ scrollTrigger: once(el, "top 72%") });
    tl.from(all(el, ".js-heart-l"), { x: -34, rotation: -24, autoAlpha: 0, duration: 1.4, transformOrigin: "50% 50%" })
      .from(all(el, ".js-heart-r"), { x: 34, rotation: 24, autoAlpha: 0, duration: 1.4, transformOrigin: "50% 50%" }, 0)
      .from(all(el, ".js-heart-one"), { scale: 0, duration: 0.9, ease: "back.out(3)", transformOrigin: "50% 50%" }, 1.1)
      .from(
        all(el, ".js-heart-sparks circle"),
        { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.6, stagger: 0.08, ease: "back.out(3)" },
        1.3,
      )
      .add(write(one(el, ".js-write"), 2.4), 0.6)
      .add(tilesTimeline(el), 1.5)
      .from(all(el, ".js-blessing"), { autoAlpha: 0, y: 16, duration: 1.1 }, 2.6);
  });

  // Venue
  all(root, '[data-anim="venue"]').forEach((el) => {
    const tl = gsap.timeline({ scrollTrigger: once(el, "top 72%") });
    tl.from(all(el, ".js-pin"), { y: -70, autoAlpha: 0, duration: 1.3, ease: "bounce.out" }).from(
      all(el, ".js-venue-eyebrow"),
      { autoAlpha: 0, y: 8, duration: 0.8 },
      0.3,
    );
    const name = one(el, ".js-venue-name");
    if (name) {
      const split = SplitText.create(name, { type: "words,chars" });
      tl.from(split.chars, { autoAlpha: 0, yPercent: 60, duration: 0.9, stagger: 0.045 }, 0.5);
    }
    tl.from(all(el, ".js-venue-area"), { autoAlpha: 0, y: 12, duration: 0.9 }, 1)
      // The frame fades in and an ivory veil rises into the arch. The embedded
      // map is never transformed or clipped: animating an ancestor of a
      // cross-origin iframe made it shake against its frame while scrolling.
      .from(all(el, ".js-map"), { autoAlpha: 0, duration: 0.9, ease: "power2.out" }, 0.9)
      .fromTo(all(el, ".js-map-veil"), { scaleY: 1 }, { scaleY: 0, duration: 1.5, ease: "power3.inOut" }, 1.15)
      .from(all(el, ".js-map-shadow"), { autoAlpha: 0, duration: 1.4, ease: "power2.out" }, 1.5)
      .from(all(el, ".js-map-keystone"), { autoAlpha: 0, scale: 0, duration: 0.8, ease: "back.out(3)" }, 2.3)
      .from(all(el, ".js-venue-btn"), { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.12 }, 1.9);
    const qr = one(el, ".js-qr");
    if (qr) tl.add(qrTimeline(qr), 1.3);
  });

  // Closing
  all(root, '[data-anim="closing"]').forEach((el) => {
    const tl = gsap.timeline({ scrollTrigger: once(el, "top 75%") });
    tl.add(write(one(el, ".js-write"), 2.4), 0);
    const names = one(el, ".js-compliments");
    if (names) {
      const split = SplitText.create(names, { type: "words,chars" });
      tl.from(split.chars, { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.025 }, 1);
    }
    tl.from(all(el, ".js-contact"), { autoAlpha: 0, y: 10, duration: 0.9 }, 1.8)
      .from(all(el, ".js-end-heart"), { scale: 0, duration: 1.2, ease: "elastic.out(1, 0.4)" }, 2.1)
      .from(all(el, ".js-save"), { autoAlpha: 0, y: 14, duration: 0.9 }, 2.3);
  });

  // Florals outside the hero bloom as they scroll in.
  all(root, '[data-anim="floral"]').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: "top 95%", once: true, animation: floralTimeline(el) });
  });

  // Sage arches drift for depth — mouse/trackpad only. On phones the page
  // scrolls on the compositor while this runs on the main thread, so the
  // fixed arches lag a frame behind and visibly shake.
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    gsap.to(all(root, ".js-sage-arch"), {
      yPercent: -9,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1 },
    });
  }

  // The inner gold frame grows with your reading progress.
  const card = one(root, ".arch-card");
  const inner = all(root, ".js-frame-inner");
  if (card && inner.length) {
    gsap.fromTo(
      inner,
      { scaleY: () => Math.min(1, window.innerHeight / Math.max(1, inner[0].offsetHeight)) },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: card, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
      },
    );
  }

  const onScreen = (el: Element) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  };

  // Endless sheen across the traced names. It repaints the glyphs every frame,
  // so it only runs once the gate is open and while the hero is on screen.
  const sheen = gsap.to(one(root, "#gold-sheen"), {
    attr: { x1: 340, x2: 680 },
    duration: 6,
    ease: "none",
    repeat: -1,
    repeatDelay: 3,
    paused: true,
  });
  const hero = one(root, "#top");
  let gateOpen = !document.documentElement.classList.contains("is-locked");
  let heroVisible = hero ? onScreen(hero) : false;
  const syncSheen = () => (gateOpen && heroVisible ? sheen.play() : sheen.pause());
  if (hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        heroVisible = self.isActive;
        syncSheen();
      },
    });
  }
  syncSheen();

  // Infinite CSS loops (lanterns, florals, hearts, map ping, button sheen)
  // pause while their section is off screen; on phones they'd keep repainting.
  // The class goes on the looping elements themselves: toggling one on the
  // section made Chrome restyle every descendant (~1000 nodes) each time.
  const LOOPS =
    ".lantern-sway, .lantern-flame, .lantern-glow, .floral-breathe, .heartbeat, .qr-scan, .scroll-cue__line, .btn-gold, .map-ping";
  const looping = all(root, '#top, [data-anim="countdown"], [data-anim="venue"], [data-anim="closing"]');
  const loopsOf = looping.map((section) => all<Element>(section, LOOPS));
  const setPaused = (els: Element[], paused: boolean) =>
    els.forEach((node) => node.classList.toggle("loop-paused", paused));
  looping.forEach((section, i) => {
    setPaused(loopsOf[i], !onScreen(section));
    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => setPaused(loopsOf[i], !self.isActive),
    });
  });

  // Initialise every reveal ahead of time, one per idle slot. Otherwise each
  // tween reads computed styles the moment it first plays — mid-scroll — which
  // forced a full style + layout pass per tween on phones.
  const cancelPriming = ScrollTrigger.getAll()
    .filter((st) => !existingTriggers.has(st) && st.animation)
    .map((st) =>
      whenIdle(() => {
        const anim = st.animation;
        if (!anim || anim.progress() !== 0 || anim.isActive()) return; // already playing
        anim.progress(1, true).progress(0, true);
      }),
    );

  // Cleanup for the non-GSAP bits, run when the surrounding context reverts.
  gsap.context(() => {
    const offOpen = on("open", () => {
      gateOpen = true;
      syncSheen();
    });
    return () => {
      offOpen();
      cancelPriming.forEach((cancel) => cancel());
      loopsOf.forEach((els) => setPaused(els, false));
    };
  });
}

export function Experience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const openRef = useRef<() => void>(() => {});
  const openedRef = useRef(false);
  const lenisRef = useRef<Lenis | undefined>(undefined);
  const [gateDone, setGateDone] = useState(false);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const html = document.documentElement;

      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      if (!openedRef.current) window.scrollTo(0, 0);

      const mm = gsap.matchMedia();

      // Lenis smooth scrolling only with a mouse or trackpad. Touch screens keep the phone's
      // own momentum scrolling: it runs off the main thread, so it can't stutter while the
      // page animates (Lenis smoothing touch input made phones lag). Its own matchMedia
      // context, so attaching/removing a mouse (iPad keyboard, 2-in-1 tablet mode) only adds
      // or removes Lenis instead of tearing down the gate and every animation.
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const lenis = new Lenis({ lerp: 0.085, anchors: true, autoRaf: false });
        const tick = (time: number) => lenis.raf(time * 1000);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        if (!openedRef.current) lenis.stop();
        lenisRef.current = lenis;
        return () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
          lenisRef.current = undefined;
        };
      });

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const motion = Boolean(context.conditions?.motion);
          // GSAP's clock follows real time even after a dropped frame (Lenis relies on it, and
          // the gate's delayed calls must keep pace with the compositor-driven doors).
          if (motion) gsap.ticker.lagSmoothing(0);

          // Without Lenis (phones), in-page links like the hero's "Scroll" cue still glide,
          // using the browser's native smooth scroll. A CSS scroll-behavior rule wouldn't
          // work: ScrollTrigger forces scroll-behavior to "auto" on the page.
          const glideToAnchor = (event: MouseEvent) => {
            if (lenisRef.current) return; // Lenis handles anchors itself (anchors: true)
            const link = (event.target as Element | null)?.closest('a[href^="#"]');
            const id = link?.getAttribute("href")?.slice(1);
            const target = id ? document.getElementById(id) : null;
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          };
          if (motion) scope.addEventListener("click", glideToAnchor);

          // The page's endless CSS loops hold still behind the closed gate (the SVG ones
          // repaint every frame). Paused per element with an inline style: an html class plus a
          // descendant selector would make Chrome restyle the whole page when the gate opens,
          // right as the hero animation starts. Inline also can't clash with buildScroll's
          // off-screen .loop-paused class, which only ever pauses too.
          const held =
            motion && !openedRef.current
              ? all<HTMLElement | SVGElement>(
                  scope,
                  ".lantern-sway, .lantern-flame, .lantern-glow, .floral-breathe, .heartbeat, .scroll-cue__line",
                )
              : [];
          held.forEach((el) => el.style.setProperty("animation-play-state", "paused"));
          const releaseLoops = () => held.forEach((el) => el.style.removeProperty("animation-play-state"));

          const reveal = () => {
            openedRef.current = true;
            html.classList.remove("is-locked");
            releaseLoops();
            // The gate blocks touch panning while closed (see .gate); let touches through
            // to the page as soon as it starts revealing it.
            one(scope, ".js-gate")?.style.setProperty("pointer-events", "none");
            lenisRef.current?.start();
            hero?.play();
            one(scope, "#top")?.focus({ preventScroll: true });
          };

          const hero = motion && !openedRef.current ? buildHero(scope) : undefined;
          const intro = motion && !openedRef.current ? buildGateIntro(scope) : undefined;
          if (!motion) gsap.set(all(scope, ".js-gate-copy, .js-seal, .door__rosette"), { autoAlpha: 1 });

          // Nothing scroll-driven shows behind the closed gate, so the scroll animations
          // (SplitText measuring, ScrollTriggers) are built in idle time after the intro
          // instead of fighting it for the main thread, or at the latest on the tap.
          let scrollBuilt = !motion;
          const buildScrollOnce = () => {
            if (scrollBuilt) return;
            scrollBuilt = true;
            context.add(() => buildScroll(scope));
            ScrollTrigger.refresh();
          };
          let cancelIdle = () => {};
          const afterIntro = () => {
            emit("warmup"); // the petal scene starts Three.js now, not during the intro
            cancelIdle = whenIdle(buildScrollOnce);
          };
          if (intro) intro.eventCallback("onComplete", afterIntro);
          else afterIntro();

          const gate = buildGateOpen(scope, motion, reveal, () => setGateDone(true));
          openRef.current = () => {
            if (openedRef.current || gate.isActive()) return;
            intro?.progress(1);
            gate.play();
            buildScrollOnce();
          };

          document.fonts?.ready.then(() => ScrollTrigger.refresh());

          return () => {
            cancelIdle();
            gate.kill();
            releaseLoops();
            scope.removeEventListener("click", glideToAnchor);
            if (motion) gsap.ticker.lagSmoothing(500, 33); // GSAP's default
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    // overflow-x-clip: the hero florals bleed past the screen edge on phones; clip them here so the
    // page can't be dragged sideways (iOS ignores body-level overflow for touch panning).
    <div ref={root} className="relative overflow-x-clip">
      {!gateDone && <Gate onOpen={() => openRef.current()} />}
      {children}
      <PetalScene />
    </div>
  );
}
