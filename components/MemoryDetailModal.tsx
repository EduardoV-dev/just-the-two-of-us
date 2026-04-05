"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
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

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, dragFree: false, watchDrag: memory.images.length > 1 },
    [Fade()]
  );

  // Sync Embla's selected index with our state
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCurrentImage(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Reset when memory changes
  useEffect(() => {
    setCurrentImage(0);
    setShowInfo(false);
    if (emblaApi) {
      emblaApi.scrollTo(0, true);
    }
  }, [memory.id, emblaApi]);

  const goNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const goPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

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

  const hasMultiple = memory.images.length > 1;

  // Track pointer to distinguish taps from drags
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const TAP_THRESHOLD = 10; // px — movement below this is a tap

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!pointerStartRef.current) return;
    const dx = Math.abs(e.clientX - pointerStartRef.current.x);
    const dy = Math.abs(e.clientY - pointerStartRef.current.y);
    if (dx < TAP_THRESHOLD && dy < TAP_THRESHOLD) {
      setShowInfo((prev) => !prev);
    }
    pointerStartRef.current = null;
  }, []);

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
        {/* Embla Carousel */}
        <div
          className="embla-memory"
          ref={emblaRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <div className="embla-memory__container">
            {memory.images.map((src, idx) => (
              <div key={idx} className="embla-memory__slide">
                <Image
                  src={src}
                  alt={`${memory.title} — imagen ${idx + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>
        </div>

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
                onClick={(e) => {
                  e.stopPropagation();
                  if (emblaApi) emblaApi.scrollTo(idx);
                }}
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
