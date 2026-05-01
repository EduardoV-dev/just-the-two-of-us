import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useMusic } from "./MusicProvider";

const SONG_TITLE = "Just the Two of Us — Grover Washington Jr. ft. Bill Withers";

export default function MusicPlayer() {
  const { isPlaying, isMuted, volume, toggle, setVolume } = useMusic();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      setIsExpanded(false);
    };

    if (isExpanded) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isExpanded]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Collapsed pill / expand button */}
      <motion.button
        onClick={() => setIsExpanded((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3 py-2 shadow-md backdrop-blur-lg transition-colors hover:border-accent/40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        aria-label={isExpanded ? "Colapsar reproductor" : "Abrir reproductor"}
      >
        {/* Music note with pulse when playing */}
        <motion.span
          className="text-base leading-none text-accent"
          animate={isPlaying ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={isPlaying ? { duration: 0.8, repeat: Infinity } : {}}
        >
          ♪
        </motion.span>
        <span className="hidden max-w-[100px] truncate text-xs font-medium text-text-muted sm:block">
          {isPlaying ? "Reproduciendo" : "Pausado"}
        </span>
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-text-muted"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <path d="M7 10l5 5 5-5z" />
        </motion.svg>
      </motion.button>

      {/* Expanded player card */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="w-72 overflow-hidden rounded-2xl border border-border bg-surface/95 shadow-xl backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Album art + info row */}
            <div className="flex items-center gap-3 p-4 pb-3">
              {/* Album art */}
              <div className="relative h-12 w-12 shrink-0">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-accent/30 bg-accent-light">
                  <img
                    src="/images/song-covers/just-the-two-of-us.jpg"
                    alt="Portada del álbum"
                    className={`h-full w-full object-cover ${isPlaying ? "animate-spin-slow" : ""}`}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {/* Fallback music note */}
                  <span className="absolute text-xl text-accent">♪</span>
                </div>
                {/* Center dot like a vinyl */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full border border-border bg-surface" />
                </div>
              </div>

              {/* Scrolling title */}
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="overflow-hidden">
                  <div className="animate-marquee">
                    <span className="text-sm font-medium text-text-primary">{SONG_TITLE}</span>
                    <span className="text-sm font-medium text-text-primary">{SONG_TITLE}</span>
                  </div>
                </div>
                <p className="mt-0.5 text-xs text-text-muted">
                  {isPlaying ? "Reproduciendo" : "Pausado"}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2 px-4 pb-3">
              {/* Play / Pause */}
              <motion.button
                onClick={toggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-sm transition-colors hover:bg-accent-hover"
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </motion.button>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2 px-4 pb-4">
              {/* Mute icon */}
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.4)}
                className="flex-shrink-0 text-text-muted transition-colors hover:text-accent"
                aria-label={isMuted || volume === 0 ? "Activar sonido" : "Silenciar"}
              >
                {isMuted || volume === 0 ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-1 flex-1 cursor-pointer rounded-full accent-[var(--color-accent)]"
                aria-label="Volumen"
                style={{ accentColor: "var(--accent)" }}
              />

              {/* Max volume icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 text-text-muted"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
