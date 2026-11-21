"use client";

import { useSyncExternalStore } from "react";
import { musicStore, toggleMusic } from "@/lib/music";

/** Floating play/mute control; appears once the music has been started. */
export function MusicToggle() {
  const { started, playing } = useSyncExternalStore(
    musicStore.subscribe,
    musicStore.getSnapshot,
    musicStore.getServerSnapshot,
  );
  if (!started) return null;

  return (
    <button
      type="button"
      onClick={toggleMusic}
      className="music-toggle"
      aria-pressed={playing}
      aria-label={playing ? "Pause the music" : "Play the music"}
    >
      {playing ? (
        <span aria-hidden="true" className="music-bars">
          <span />
          <span />
          <span />
          <span />
        </span>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M9 18V6l10-2v12" strokeLinejoin="round" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="16" r="2.5" />
          <path d="M3 3l18 18" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
