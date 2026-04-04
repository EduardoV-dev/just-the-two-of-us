"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LetterCard from "@/components/LetterCard";
import LetterModal from "@/components/LetterModal";
import { getLetters } from "@/lib/content";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Letter } from "@/lib/types";

export default function LettersPage() {
  const letters = getLetters();
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  return (
    <div className="max-w-2xl mx-auto px-5 py-12 md:py-16">
      <motion.div
        className="text-center mb-12 md:mb-16"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1
          className="font-heading text-3xl md:text-5xl text-text-primary mb-3"
          variants={fadeInUp}
        >
          Cartas Para Ti
        </motion.h1>
        <motion.p
          className="text-text-muted text-base md:text-lg"
          variants={fadeInUp}
        >
          Palabras que quiero que lleves contigo.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {letters.map((letter) => (
          <LetterCard
            key={letter.id}
            letter={letter}
            onClick={() => setSelectedLetter(letter)}
          />
        ))}
      </div>

      <LetterModal
        letter={selectedLetter}
        onClose={() => setSelectedLetter(null)}
      />
    </div>
  );
}
