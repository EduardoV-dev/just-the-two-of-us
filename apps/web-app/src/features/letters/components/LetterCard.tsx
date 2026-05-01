import { motion } from "framer-motion";

import { slideInFromLeft } from "@/lib/animations";

import type { Letter } from "@/lib/types";

interface LetterCardProps {
  letter: Letter;
  index: number;
  onClick: () => void;
}

const TILTS = [-1.8, 1.2, -0.8, 1.5, -1.2, 0.9, -1.5, 1.1];

export default function LetterCard({ letter, index, onClick }: LetterCardProps) {
  const tilt = TILTS[index % TILTS.length];

  return (
    <motion.div
      variants={slideInFromLeft}
      style={{ rotate: tilt }}
      whileHover={{ rotate: 0, scale: 1.025, transition: { duration: 0.25 } }}
      className="group w-full cursor-pointer"
      onClick={onClick}
    >
      <motion.div
        className="relative w-full select-none"
        style={{
          backgroundColor: "#FFFEF5",
          borderRadius: "3px",
        }}
        initial={{ boxShadow: "0 3px 12px rgba(0,0,0,0.10)" }}
        whileHover={{
          boxShadow: "0 18px 44px rgba(0,0,0,0.16), 0 4px 14px rgba(168,45,69,0.14)",
          transition: { duration: 0.25 },
        }}
      >
        {/* ── Airmail border stripes ──────────────────────────────────── */}
        {/* Top */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "10px",
            zIndex: 10,
            borderRadius: "3px 3px 0 0",
            pointerEvents: "none",
            background:
              "repeating-linear-gradient(90deg,#c0392b 0,#c0392b 9px,#fff 9px,#fff 18px,#2471a3 18px,#2471a3 27px,#fff 27px,#fff 36px)",
          }}
        />
        {/* Bottom */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "10px",
            zIndex: 10,
            borderRadius: "0 0 3px 3px",
            pointerEvents: "none",
            background:
              "repeating-linear-gradient(90deg,#c0392b 0,#c0392b 9px,#fff 9px,#fff 18px,#2471a3 18px,#2471a3 27px,#fff 27px,#fff 36px)",
          }}
        />
        {/* Left */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "10px",
            zIndex: 10,
            pointerEvents: "none",
            background:
              "repeating-linear-gradient(180deg,#c0392b 0,#c0392b 9px,#fff 9px,#fff 18px,#2471a3 18px,#2471a3 27px,#fff 27px,#fff 36px)",
          }}
        />
        {/* Right */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "10px",
            zIndex: 10,
            pointerEvents: "none",
            background:
              "repeating-linear-gradient(180deg,#c0392b 0,#c0392b 9px,#fff 9px,#fff 18px,#2471a3 18px,#2471a3 27px,#fff 27px,#fff 36px)",
          }}
        />

        {/* ── Envelope top band (sealed flap look) ────────────────────── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            right: "10px",
            height: "64px",
            zIndex: 5,
            background: "linear-gradient(180deg,#F2E8D0 0%,#EDE0C2 100%)",
            borderBottom: "1.5px solid #D5C49E",
            boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
            pointerEvents: "none",
          }}
        />

        {/* ── Wax seal — centered on the band bottom edge ─────────────── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "55px", // centers the 38px circle on the band bottom (10 + 64 - 19)
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 15,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 38% 32%,#de7a8a,#a82d45)",
            boxShadow: "0 3px 10px rgba(168,45,69,0.55),inset 0 1px 3px rgba(255,255,255,0.25)",
            border: "2.5px solid #b03050",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "16px",
            pointerEvents: "none",
          }}
        >
          ♡
        </div>

        {/* ── Postage stamp — top-right of the band ───────────────────── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "15px",
            right: "22px",
            zIndex: 15,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "58px",
              backgroundColor: "#FFF9EE",
              border: "2px solid #C8B690",
              borderRadius: "2px",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.13)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
            }}
          >
            <span style={{ fontSize: "22px", lineHeight: 1 }}>🌹</span>
            <span
              style={{
                fontSize: "7px",
                color: "#a82d45",
                fontFamily: "monospace",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              AMOR
            </span>
          </div>
        </div>

        {/* ── Card body ──────────────────────────────────────────────────── */}
        <div style={{ position: "relative", zIndex: 5, padding: "96px 32px 32px 32px" }}>
          {/* Para: label */}
          <div
            style={{
              fontSize: "10px",
              color: "#B09A7A",
              fontFamily: "monospace",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Para:
          </div>

          {/* Title */}
          <h3
            className="font-heading transition-colors duration-300 group-hover:text-accent"
            style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
              lineHeight: 1.3,
              color: "#3a3028",
              marginBottom: "20px",
            }}
          >
            {letter.title}
          </h3>

          {/* Dashed fold line */}
          <div
            aria-hidden
            style={{
              height: "1px",
              marginBottom: "16px",
              background:
                "repeating-linear-gradient(90deg,#C8B690 0,#C8B690 6px,transparent 6px,transparent 14px)",
            }}
          />

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontSize: "10px",
                color: "#B09A7A",
                fontFamily: "monospace",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Toca para abrir
            </span>
            <motion.span
              style={{ color: "#a82d45", fontSize: "13px" }}
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
