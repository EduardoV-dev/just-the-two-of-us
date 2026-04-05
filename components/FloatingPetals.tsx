"use client";

import { motion } from "framer-motion";

// Deterministic values to avoid hydration mismatch
const PETALS = [
  { id: 0, symbol: "❤", x: 5, delay: 0, duration: 14, size: 22, drift: 20 },
  { id: 1, symbol: "✦", x: 12, delay: 2.5, duration: 18, size: 18, drift: -15 },
  { id: 2, symbol: "♡", x: 20, delay: 5, duration: 16, size: 26, drift: 25 },
  { id: 3, symbol: "·", x: 28, delay: 1, duration: 12, size: 16, drift: -20 },
  { id: 4, symbol: "✿", x: 35, delay: 7, duration: 20, size: 24, drift: 18 },
  { id: 5, symbol: "❤", x: 43, delay: 3.5, duration: 15, size: 20, drift: -22 },
  { id: 6, symbol: "✦", x: 52, delay: 9, duration: 17, size: 16, drift: 16 },
  { id: 7, symbol: "♡", x: 60, delay: 4, duration: 13, size: 28, drift: -18 },
  { id: 8, symbol: "·", x: 68, delay: 6, duration: 19, size: 18, drift: 24 },
  { id: 9, symbol: "✿", x: 76, delay: 11, duration: 16, size: 22, drift: -16 },
  { id: 10, symbol: "❤", x: 84, delay: 8, duration: 21, size: 20, drift: 20 },
  { id: 11, symbol: "✦", x: 92, delay: 13, duration: 14, size: 16, drift: -14 },
  { id: 12, symbol: "♡", x: 15, delay: 1.5, duration: 15, size: 20, drift: 22 },
  { id: 13, symbol: "✿", x: 48, delay: 10, duration: 17, size: 18, drift: -19 },
  { id: 14, symbol: "❤", x: 72, delay: 6.5, duration: 19, size: 24, drift: 15 },
  { id: 15, symbol: "·", x: 88, delay: 3, duration: 13, size: 16, drift: -17 },
  { id: 16, symbol: "✦", x: 32, delay: 14, duration: 16, size: 20, drift: 21 },
  { id: 17, symbol: "♡", x: 58, delay: 0.5, duration: 18, size: 22, drift: -13 },
  { id: 18, symbol: "✿", x: 8, delay: 12, duration: 20, size: 18, drift: 17 },
  { id: 19, symbol: "❤", x: 96, delay: 4.5, duration: 14, size: 20, drift: -20 },
];

// Start well below viewport; travel the full viewport + buffer
const START_Y = 80; // px below bottom edge
const TRAVEL = 1400; // total upward travel in px

export default function FloatingPetals() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {PETALS.map((petal) => (
        <motion.span
          key={petal.id}
          className="absolute select-none text-accent"
          style={{
            left: `${petal.x}%`,
            top: `calc(100% + ${START_Y}px)`,
            fontSize: petal.size,
            animation: `petal-fade ${petal.duration}s ${petal.delay}s linear infinite`,
          }}
          animate={{
            y: [0, -TRAVEL],
            x: [0, petal.drift],
            rotate: [0, 180],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {petal.symbol}
        </motion.span>
      ))}
    </div>
  );
}
