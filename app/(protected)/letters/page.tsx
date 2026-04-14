"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LetterCard from "@/components/LetterCard";
import LetterModal from "@/components/LetterModal";
import { getLetters } from "@/lib/content";
import { fadeInUp, staggerContainer, letterStagger } from "@/lib/animations";
import type { Letter } from "@/lib/types";

export default function LettersPage() {
  const letters = getLetters();
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  return (
    <div className="max-w-2xl mx-auto px-5 py-12 md:py-20">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <motion.div
        className="text-center mb-12"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Postbox icon */}
        <motion.div variants={fadeInUp} className="flex justify-center mb-5">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full"
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
          className="font-heading text-3xl md:text-5xl text-text-primary mb-3"
          variants={fadeInUp}
        >
          Cartas Para Ti
        </motion.h1>

        <motion.p
          className="text-text-muted text-sm md:text-base tracking-widest uppercase"
          style={{ letterSpacing: "0.15em", fontFamily: "monospace" }}
          variants={fadeInUp}
        >
          Entregadas con todo mi amor
        </motion.p>

        {/* Decorative postmark line */}
        <motion.div
          variants={fadeInUp}
          className="flex items-center justify-center gap-3 mt-6"
        >
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

      <LetterModal
        letter={selectedLetter}
        onClose={() => setSelectedLetter(null)}
      />
    </div>
  );
}
