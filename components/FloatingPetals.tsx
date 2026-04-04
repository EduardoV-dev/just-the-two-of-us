"use client";

import { motion } from "framer-motion";

// Deterministic values to avoid hydration mismatch
const PETALS = [
  { id: 0, symbol: "❤", x: 8, delay: 0, duration: 14, size: 11, drift: 20 },
  { id: 1, symbol: "✦", x: 18, delay: 2.5, duration: 18, size: 9, drift: -15 },
  { id: 2, symbol: "♡", x: 30, delay: 5, duration: 16, size: 13, drift: 25 },
  { id: 3, symbol: "·", x: 42, delay: 1, duration: 12, size: 8, drift: -20 },
  { id: 4, symbol: "✿", x: 55, delay: 7, duration: 20, size: 12, drift: 18 },
  { id: 5, symbol: "❤", x: 65, delay: 3.5, duration: 15, size: 10, drift: -22 },
  { id: 6, symbol: "✦", x: 75, delay: 9, duration: 17, size: 8, drift: 16 },
  { id: 7, symbol: "♡", x: 85, delay: 4, duration: 13, size: 14, drift: -18 },
  { id: 8, symbol: "·", x: 92, delay: 6, duration: 19, size: 9, drift: 24 },
  { id: 9, symbol: "✿", x: 22, delay: 11, duration: 16, size: 11, drift: -16 },
  { id: 10, symbol: "❤", x: 50, delay: 8, duration: 21, size: 10, drift: 20 },
  { id: 11, symbol: "✦", x: 38, delay: 13, duration: 14, size: 8, drift: -14 },
];

export default function FloatingPetals() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {PETALS.map((petal) => (
        <motion.span
          key={petal.id}
          className="absolute select-none text-accent/15"
          style={{
            left: `${petal.x}%`,
            bottom: "-3rem",
            fontSize: petal.size,
          }}
          animate={{
            y: [-40, -1300],
            x: [0, petal.drift],
            rotate: [0, 180],
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
            opacity: { times: [0, 0.1, 0.85, 1] },
          }}
        >
          {petal.symbol}
        </motion.span>
      ))}
    </div>
  );
}
