/**
 * Background music. Starts only from the seal tap (browsers only allow audio
 * to start inside a user gesture), loops, fades in/out, pauses while the tab
 * is hidden, and exposes a tiny store for the mute toggle.
 */
const SRC = "/bg-music/music.mp3";
const VOLUME = 0.55;

type MusicState = { started: boolean; playing: boolean };

const SERVER_STATE: MusicState = { started: false, playing: false };
let state: MusicState = SERVER_STATE;
const listeners = new Set<() => void>();

function setState(next: Partial<MusicState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

export const musicStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => state,
  getServerSnapshot: () => SERVER_STATE,
};

let audio: HTMLAudioElement | null = null;
let fadeFrame = 0;
let mutedByUser = false;
let pausedForHidden = false;

function fadeTo(target: number, ms: number, done?: () => void) {
  const el = audio;
  if (!el) return;
  cancelAnimationFrame(fadeFrame);
  const from = el.volume;
  const start = performance.now();
  const step = (now: number) => {
    // rAF timestamps can be slightly earlier than `start`; keep t (and the
    // volume, which throws outside 0–1) in range.
    const t = Math.min(1, Math.max(0, (now - start) / ms));
    el.volume = Math.min(1, Math.max(0, from + (target - from) * t));
    if (t < 1) fadeFrame = requestAnimationFrame(step);
    else done?.();
  };
  fadeFrame = requestAnimationFrame(step);
}

function onVisibility() {
  if (!audio || mutedByUser) return;
  if (document.hidden && !audio.paused) {
    pausedForHidden = true;
    audio.pause();
  } else if (!document.hidden && pausedForHidden) {
    pausedForHidden = false;
    audio.play().catch(() => {});
  }
}

/** Create the element and let the browser fetch the file ahead of the tap. */
export function preloadMusic() {
  if (audio || typeof window === "undefined") return;
  audio = new Audio(SRC);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0;
  audio.addEventListener("play", () => setState({ playing: true }));
  audio.addEventListener("pause", () => setState({ playing: false }));
  document.addEventListener("visibilitychange", onVisibility);
}

/** Call synchronously inside the seal's click handler. */
export function startMusic() {
  preloadMusic();
  if (!audio || state.started) return;
  setState({ started: true });
  audio.volume = 0;
  audio
    .play()
    .then(() => fadeTo(VOLUME, 2500))
    .catch(() => {
      // Blocked or unsupported: the toggle still lets the guest start it.
    });
}

export function toggleMusic() {
  if (!audio) return;
  // Follow the last intent, so a tap during the fade-out resumes the music.
  if (audio.paused || mutedByUser) {
    mutedByUser = false;
    audio.play().then(() => fadeTo(VOLUME, 800)).catch(() => {});
  } else {
    mutedByUser = true;
    fadeTo(0, 400, () => audio?.pause());
  }
}
