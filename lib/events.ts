/**
 * Tiny window-event bus so the animation timeline and the Three.js petal
 * scene can talk without sharing React state.
 *
 * - "warmup": the gate's intro has finished; good time for heavy setup.
 * - "open": the doors are opening (petals burst).
 */
export type WeddingEvent = "warmup" | "open" | "celebrate";

export function emit(event: WeddingEvent) {
  window.dispatchEvent(new CustomEvent(`wedding:${event}`));
}

export function on(event: WeddingEvent, handler: () => void) {
  const name = `wedding:${event}`;
  window.addEventListener(name, handler);
  return () => window.removeEventListener(name, handler);
}
