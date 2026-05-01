import { useEffect, useCallback, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

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
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
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
            className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}

      {/* Image */}
      <motion.div
        className="relative mx-4 h-full max-h-[80svh] w-full max-w-4xl"
        variants={modalContent}
      >
        <img
          src={image.src}
          alt={image.caption || "Gallery image"}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </motion.div>

      {/* Caption */}
      {(image.caption || image.createdAt) && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
          variants={modalOverlay}
        >
          {image.caption && <p className="text-sm text-white/80">{image.caption}</p>}
          {image.createdAt && (
            <p className="mt-0.5 text-xs text-white/50">{formatDate(image.createdAt)}</p>
          )}
        </motion.div>
      )}

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-14 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((image, idx) => (
            <button
              key={image.src}
              onClick={() => setIndex(idx)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
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

export default function ImageLightbox({ images, currentIndex, onClose }: ImageLightboxProps) {
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
