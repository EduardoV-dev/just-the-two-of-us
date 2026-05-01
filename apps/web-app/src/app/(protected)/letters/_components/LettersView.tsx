import { useState } from "react";

import { motion } from "framer-motion";

import { LetterCard, LetterModal } from "@/features/letters";
import { fadeInUp, staggerContainer, letterStagger } from "@/lib/animations";
import { getLetters } from "@/lib/content";

import type { Letter } from "@/lib/types";

export default function LettersView() {
  const letters = getLetters();
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 md:py-20">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <motion.div
        className="mb-12 text-center"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Postbox icon */}
        <motion.div variants={fadeInUp} className="mb-5 flex justify-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, #f0e0e0, #faf4f4)",
              border: "2px solid #e8dada",
              boxShadow: "0 4px 16px rgba(201,160,160,0.25)",
              fontSize: "28px",
            }}
          >
            ✉️
          </div>
        </motion.div>

        <motion.h1
          className="mb-3 font-heading text-3xl text-text-primary md:text-5xl"
          variants={fadeInUp}
        >
          Cartas Para Ti
        </motion.h1>

        <motion.p
          className="text-sm tracking-widest text-text-muted uppercase md:text-base"
          style={{ letterSpacing: "0.15em", fontFamily: "monospace" }}
          variants={fadeInUp}
        >
          Entregadas con todo mi amor
        </motion.p>

        {/* Decorative postmark line */}
        <motion.div variants={fadeInUp} className="mt-6 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent/40" />
          <span
            style={{
              color: "var(--accent)",
              fontSize: "10px",
              letterSpacing: "3px",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            CORREO DEL CORAZÓN
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent/40" />
        </motion.div>
      </motion.div>

      {/* ── Letters stack ──────────────────────────────────────────── */}
      <motion.div
        className="flex flex-col gap-6 md:gap-8"
        initial="hidden"
        animate="visible"
        variants={letterStagger}
      >
        {letters.map((letter, index) => (
          <LetterCard
            key={letter.id}
            letter={letter}
            index={index}
            onClick={() => setSelectedLetter(letter)}
          />
        ))}
      </motion.div>

      <LetterModal letter={selectedLetter} onClose={() => setSelectedLetter(null)} />
    </div>
  );
}
