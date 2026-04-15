"use client";

import { useEffect, useCallback, useState, useRef } from "react";

import Image from "next/image";

import Fade from "embla-carousel-fade";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

import { formatDate } from "@/lib/content";

import type { Memory } from "@/lib/types";

interface MemoryDetailModalProps {
  memory: Memory | null;
  onClose: () => void;
}

function MemoryDetailContent({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, dragFree: false, watchDrag: memory.images.length > 1 },
    [Fade()],
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
      className="fixed inset-0 flex items-center justify-center bg-black"
      style={{ zIndex: 70 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Image area — fills entire screen */}
      <div className="relative h-full w-full">
        {/* Embla Carousel */}
        <div
          className="embla-memory"
          ref={emblaRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <div className="embla-memory__container">
            {memory.images.map((src, idx) => (
              <div key={src} className="embla-memory__slide">
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
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 md:left-6 md:h-12 md:w-12"
            aria-label="Imagen anterior"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Right arrow */}
        {hasMultiple && currentImage < memory.images.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 md:right-6 md:h-12 md:w-12"
            aria-label="Imagen siguiente"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Close button — top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
          aria-label="Cerrar"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Image counter — top left */}
        {hasMultiple && (
          <div className="absolute top-4 left-4 z-20 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {currentImage + 1} / {memory.images.length}
          </div>
        )}

        {/* Dot indicators — bottom center */}
        {hasMultiple && (
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {memory.images.map((src, idx) => (
              <button
                key={src}
                onClick={(e) => {
                  e.stopPropagation();
                  if (emblaApi) emblaApi.scrollTo(idx);
                }}
                className={`rounded-full transition-all duration-200 ${
                  idx === currentImage
                    ? "h-2 w-5 bg-white"
                    : "h-2 w-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Ver imagen ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Info toggle button — bottom right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowInfo((prev) => !prev);
          }}
          className={`absolute right-4 bottom-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
            showInfo
              ? "border-white bg-white text-black"
              : "border-white/40 bg-black/50 text-white hover:bg-black/70"
          }`}
          aria-label={showInfo ? "Ocultar información" : "Mostrar información"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </button>

        {/* Text overlay — slides up from bottom */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />

              {/* Text content */}
              <div className="relative px-5 pt-16 pb-16 md:px-10 md:pb-20">
                <time className="text-xs tracking-widest text-white/60 uppercase">
                  {formatDate(memory.date)}
                </time>
                <h2 className="mt-1 mb-3 font-heading text-2xl leading-tight text-white md:text-3xl">
                  {memory.title}
                </h2>
                <p className="text-sm leading-relaxed text-white/85 md:text-base">
                  {memory.fullDescription || memory.description}
                </p>
                {memory.feeling && (
                  <p className="mt-4 border-l-2 border-white/40 pl-3 text-sm text-white/70 italic md:text-base">
                    {memory.feeling}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>,
    document.body,
  );
}

export default function MemoryDetailModal({ memory, onClose }: MemoryDetailModalProps) {
  return (
    <AnimatePresence>
      {memory && <MemoryDetailContent key={memory.id} memory={memory} onClose={onClose} />}
    </AnimatePresence>
  );
}
