/**
 * Run `fn` when the main thread is idle, so heavy setup doesn't land on an
 * animation frame. Safari has no requestIdleCallback, so it gets a short timeout.
 * Returns a function that cancels the call.
 */
export function whenIdle(fn: () => void, timeout = 1500) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(() => fn(), { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(fn, 250);
  return () => window.clearTimeout(id);
}
