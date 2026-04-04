"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { modalOverlay, envelopeOpen } from "@/lib/animations";
import { formatDate } from "@/lib/content";
import type { Letter } from "@/lib/types";

interface LetterModalProps {
  letter: Letter | null;
  onClose: () => void;
}

function LetterModalContent({
  letter,
  onClose,
}: {
  letter: Letter;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return createPortal(
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 md:p-8"
      style={{ zIndex: 70 }}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-text-primary/60 backdrop-blur-sm"
        variants={modalOverlay}
        onClick={onClose}
      />

      {/* Letter content */}
      <motion.div
        className="relative w-full max-w-lg max-h-[85svh] overflow-y-auto rounded-2xl"
        variants={envelopeOpen}
      >
        {/* Paper-like background */}
        <div className="bg-[#FFFEF9] p-8 md:p-10 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            ✕
          </button>

          <h2 className="font-heading text-2xl md:text-3xl text-text-primary mb-6">
            {letter.title}
          </h2>

          <div className="text-text-secondary leading-relaxed text-base md:text-lg whitespace-pre-line">
            {letter.content}
          </div>

          {letter.createdAt && (
            <p className="mt-8 text-text-muted text-sm text-right italic">
              Escrito con amor &mdash; {formatDate(letter.createdAt)}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export default function LetterModal({ letter, onClose }: LetterModalProps) {
  return (
    <AnimatePresence>
      {letter && (
        <LetterModalContent key={letter.id} letter={letter} onClose={onClose} />
      )}
    </AnimatePresence>
  );
}
