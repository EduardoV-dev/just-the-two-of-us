"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { formatDate } from "@/lib/content";
import type { Memory } from "@/lib/types";

interface MemoryDetailModalProps {
  memory: Memory | null;
  onClose: () => void;
}

function MemoryDetailContent({
  memory,
  onClose,
}: {
  memory: Memory;
  onClose: () => void;
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const goNext = useCallback(() => {
    setCurrentImage((prev) => Math.min(memory.images.length - 1, prev + 1));
  }, [memory.images.length]);

  const goPrev = useCallback(() => {
    setCurrentImage((prev) => Math.max(0, prev - 1));
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "i" || e.key === " ") {
        e.preventDefault();
        setShowInfo((prev) => !prev);
      }
    },
    [onClose, goPrev, goNext],
  );

  useEffect(() => {
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Reset image index when memory changes
  useEffect(() => {
    setCurrentImage(0);
    setShowInfo(false);
  }, [memory.id]);

  const hasMultiple = memory.images.length > 1;

  return createPortal(
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center"
      style={{ zIndex: 70 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
        {/* Image area — fills entire screen */}
        <div className="relative w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              className="absolute inset-0"
              style={{ background: 'black' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              drag={hasMultiple ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                const threshold = 50;
                const velocity = 500;
                if (info.offset.x < -threshold || info.velocity.x < -velocity) {
                  goNext();
                } else if (info.offset.x > threshold || info.velocity.x > velocity) {
                  goPrev();
                }
              }}
            >
              {memory.images[currentImage] && (
                <Image
                  src={memory.images[currentImage]}
                  alt={`${memory.title} — imagen ${currentImage + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Tap image center to toggle info */}
          <button
            className="absolute inset-0 w-full h-full cursor-default"
            onClick={() => setShowInfo((prev) => !prev)}
            aria-label="Mostrar u ocultar información"
            tabIndex={-1}
          />

        {/* Left arrow */}
        {hasMultiple && currentImage > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label="Imagen anterior"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Right arrow */}
        {hasMultiple && currentImage < memory.images.length - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label="Imagen siguiente"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Close button — top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Cerrar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Image counter — top left */}
        {hasMultiple && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
            {currentImage + 1} / {memory.images.length}
          </div>
        )}

        {/* Dot indicators — bottom center */}
        {hasMultiple && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {memory.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentImage(idx); }}
                className={`rounded-full transition-all duration-200 ${
                  idx === currentImage
                    ? "w-5 h-2 bg-white"
                    : "w-2 h-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Ver imagen ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Info toggle button — bottom right */}
        <button
          onClick={(e) => { e.stopPropagation(); setShowInfo((prev) => !prev); }}
          className={`absolute bottom-5 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full border transition-colors ${
            showInfo
              ? "bg-white text-black border-white"
              : "bg-black/50 text-white border-white/40 hover:bg-black/70"
          }`}
          aria-label={showInfo ? "Ocultar información" : "Mostrar información"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </button>

        {/* Text overlay — slides up from bottom */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />

              {/* Text content */}
              <div className="relative px-5 pt-16 pb-16 md:px-10 md:pb-20">
                <time className="text-white/60 text-xs tracking-widest uppercase">
                  {formatDate(memory.date)}
                </time>
                <h2 className="font-heading text-white text-2xl md:text-3xl mt-1 mb-3 leading-tight">
                  {memory.title}
                </h2>
                <p className="text-white/85 text-sm md:text-base leading-relaxed">
                  {memory.fullDescription || memory.description}
                </p>
                {memory.feeling && (
                  <p className="mt-4 text-white/70 italic text-sm md:text-base border-l-2 border-white/40 pl-3">
                    {memory.feeling}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  , document.body);
}

export default function MemoryDetailModal({
  memory,
  onClose,
}: MemoryDetailModalProps) {
  return (
    <AnimatePresence>
      {memory && (
        <MemoryDetailContent
          key={memory.id}
          memory={memory}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}
