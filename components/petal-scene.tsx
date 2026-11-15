"use client";

import { useEffect, useRef } from "react";
import { on } from "@/lib/events";
import { whenIdle } from "@/lib/idle";
import type { PetalEngine } from "./petal-engine";

/**
 * Full-screen WebGL layer of falling petals and gold leaf.
 * Three.js is loaded lazily (its own chunk) and only when motion is allowed.
 *
 * Starting it (parsing Three.js, building the environment map, compiling
 * shaders) is heavy, so it waits for the gate's intro to finish ("warmup")
 * and for an idle moment, instead of stuttering the intro or the doors.
 */
export function PetalScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let loading = false;
    let engine: PetalEngine | undefined;
    let pending = 0;

    const load = () => {
      if (loading || disposed) return;
      loading = true;
      import("./petal-engine")
        .then(async ({ createPetalEngine }) => {
          if (disposed) return;
          const created = await createPetalEngine(el);
          if (disposed) return created.dispose();
          engine = created;
          if (pending) engine.burst(pending);
        })
        .catch(() => {
          // No WebGL: the page is complete without the petals.
        });
    };

    let cancelIdle = () => {};
    const loadWhenIdle = () => {
      cancelIdle();
      cancelIdle = whenIdle(load, 2000);
    };

    const offWarmup = on("warmup", loadWhenIdle);
    const offOpen = on("open", () => {
      if (engine) return engine.burst(1);
      pending = 1;
      load(); // tapped before warmup finished: start now, burst when ready
    });
    const offCelebrate = on("celebrate", () => engine?.burst(0.8));
    // Safety net in case "warmup" fired before this effect subscribed.
    const fallback = window.setTimeout(loadWhenIdle, 6000);

    return () => {
      disposed = true;
      cancelIdle();
      window.clearTimeout(fallback);
      offWarmup();
      offOpen();
      offCelebrate();
      engine?.dispose();
    };
  }, []);

  return <div ref={host} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40" />;
}
