"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import type { Letter } from "@/lib/types";

interface LetterCardProps {
  letter: Letter;
  onClick: () => void;
}

export default function LetterCard({ letter, onClick }: LetterCardProps) {
  return (
    <motion.button
      className="w-full text-left group cursor-pointer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      onClick={onClick}
    >
      <div className="bg-surface rounded-2xl border border-border p-6 md:p-8 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 relative overflow-hidden">
        {/* Envelope flap decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-light to-transparent" />

        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">💌</span>
          <h3 className="font-heading text-xl md:text-2xl text-text-primary group-hover:text-accent transition-colors">
            {letter.title}
          </h3>
        </div>

        <p className="text-text-muted text-sm">Toca para leer...</p>
      </div>
    </motion.button>
  );
}
