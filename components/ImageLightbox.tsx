"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { modalOverlay, modalContent } from "@/lib/animations";
import { formatDate } from "@/lib/content";
import type { GalleryImage } from "@/lib/types";

interface ImageLightboxProps {
  images: GalleryImage[];
  currentIndex: number | null;
  onClose: () => void;
}

function LightboxContent({
  images,
  initialIndex,
  onClose,
}: {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    },
    [onClose, goNext, goPrev],
  );

  useEffect(() => {
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const image = images[index];
  if (!image) return null;

  return (
    <motion.div
      className="fixed inset-0 z-60 flex items-center justify-center"
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-text-primary/90"
        variants={modalOverlay}
        onClick={onClose}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}

      {/* Image */}
      <motion.div
        className="relative w-full h-full max-w-4xl max-h-[80svh] mx-4"
        variants={modalContent}
      >
        <Image
          src={image.src}
          alt={image.caption || "Gallery image"}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 80vw"
          priority
        />
      </motion.div>

      {/* Caption */}
      {(image.caption || image.createdAt) && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
          variants={modalOverlay}
        >
          {image.caption && (
            <p className="text-white/80 text-sm">{image.caption}</p>
          )}
          {image.createdAt && (
            <p className="text-white/50 text-xs mt-0.5">
              {formatDate(image.createdAt)}
            </p>
          )}
        </motion.div>
      )}

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                idx === index ? "bg-white" : "bg-white/30"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function ImageLightbox({
  images,
  currentIndex,
  onClose,
}: ImageLightboxProps) {
  return (
    <AnimatePresence>
      {currentIndex !== null && (
        <LightboxContent
          key={currentIndex}
          images={images}
          initialIndex={currentIndex}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}
