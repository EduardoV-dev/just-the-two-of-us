import { useEffect, useCallback } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

import { modalOverlay, envelopeOpen } from "@/lib/animations";
import { formatDate } from "@/lib/content";

import type { Letter } from "@/lib/types";

interface LetterModalProps {
  letter: Letter | null;
  onClose: () => void;
}

function LetterModalContent({ letter, onClose }: { letter: Letter; onClose: () => void }) {
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
        className="relative max-h-[85svh] w-full max-w-lg overflow-y-auto rounded-2xl"
        variants={envelopeOpen}
      >
        {/* Paper-like background */}
        <div className="bg-[#FFFEF9] p-8 shadow-2xl md:p-10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-colors hover:text-text-primary"
            aria-label="Close"
          >
            ✕
          </button>

          <h2 className="mb-6 font-heading text-2xl text-text-primary md:text-3xl">
            {letter.title}
          </h2>

          <div className="text-base leading-relaxed whitespace-pre-line text-text-secondary md:text-lg">
            {letter.content}
          </div>

          {letter.createdAt && (
            <p className="mt-8 text-right text-sm text-text-muted italic">
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
      {letter && <LetterModalContent key={letter.id} letter={letter} onClose={onClose} />}
    </AnimatePresence>
  );
}
