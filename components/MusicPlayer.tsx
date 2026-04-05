"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusic } from "./MusicProvider";

const SONG_TITLE =
  "Just the Two of Us — Grover Washington Jr. ft. Bill Withers";

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
    <div
      className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Collapsed pill / expand button */}
      <motion.button
        onClick={() => setIsExpanded((v) => !v)}
        className="flex items-center gap-2 bg-surface/90 backdrop-blur-lg border border-border rounded-full px-3 py-2 shadow-md hover:border-accent/40 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        aria-label={isExpanded ? "Colapsar reproductor" : "Abrir reproductor"}
      >
        {/* Music note with pulse when playing */}
        <motion.span
          className="text-accent text-base leading-none"
          animate={isPlaying ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={isPlaying ? { duration: 0.8, repeat: Infinity } : {}}
        >
          ♪
        </motion.span>
        <span className="text-text-muted text-xs font-medium hidden sm:block max-w-[100px] truncate">
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
            className="bg-surface/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl overflow-hidden w-72"
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Album art + info row */}
            <div className="flex items-center gap-3 p-4 pb-3">
              {/* Album art */}
              <div className="relative shrink-0 w-12 h-12">
                <div className="w-12 h-12 rounded-full bg-accent-light border-2 border-accent/30 overflow-hidden flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/song-covers/just-the-two-of-us.jpg"
                    alt="Portada del álbum"
                    className={`w-full h-full object-cover ${isPlaying ? "animate-spin-slow" : ""}`}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                  {/* Fallback music note */}
                  <span className="text-accent text-xl absolute">♪</span>
                </div>
                {/* Center dot like a vinyl */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-surface border border-border" />
                </div>
              </div>

              {/* Scrolling title */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="overflow-hidden">
                  <div className="animate-marquee">
                    <span className="text-text-primary text-sm font-medium">
                      {SONG_TITLE}
                    </span>
                    <span className="text-text-primary text-sm font-medium">
                      {SONG_TITLE}
                    </span>
                  </div>
                </div>
                <p className="text-text-muted text-xs mt-0.5">
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
                className="w-10 h-10 flex items-center justify-center rounded-full bg-accent text-white shadow-sm hover:bg-accent-hover transition-colors"
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
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
                className="text-text-muted hover:text-accent transition-colors flex-shrink-0"
                aria-label={
                  isMuted || volume === 0 ? "Activar sonido" : "Silenciar"
                }
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
                className="flex-1 h-1 rounded-full accent-[var(--color-accent)] cursor-pointer"
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
                className="text-text-muted flex-shrink-0"
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
