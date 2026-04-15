"use client";

import { useState, useEffect, useCallback } from "react";

import { useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";

import { heroText, fadeInUp } from "@/lib/animations";

// Default: April 25, 2026 at 8:00 PM Nicaragua Time (CST = UTC-6)
// Override via NEXT_PUBLIC_UNLOCK_DATE env variable
const UNLOCK_DATE = new Date(process.env.NEXT_PUBLIC_UNLOCK_DATE || "2026-04-26T02:00:00.000Z");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = UNLOCK_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function isUnlocked(): boolean {
  return new Date() >= UNLOCK_DATE;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const digitVariants = {
  initial: { opacity: 0, y: -20, scale: 0.8 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.8,
    transition: { duration: 0.25, ease },
  },
};

function TimeUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-20 w-18 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface shadow-sm md:h-27.5 md:w-35">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            variants={digitVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="font-heading text-3xl text-accent tabular-nums md:text-5xl"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs font-medium tracking-wider text-text-muted uppercase md:text-sm">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center pb-6">
      <motion.span
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="font-heading text-2xl text-accent-hover md:text-4xl"
      >
        :
      </motion.span>
    </div>
  );
}

export default function CountdownView() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const [mounted, setMounted] = useState(false);

  const tick = useCallback(() => {
    if (isUnlocked()) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      router.push("/");
      return;
    }
    setTimeLeft(calculateTimeLeft());
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: hydration-safe mount flag
    setMounted(true);
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  // Avoid hydration mismatch — show nothing until mounted
  if (!mounted) {
    return <div className="flex min-h-[80vh] flex-1 items-center justify-center" />;
  }

  return (
    <div className="flex min-h-[80vh] flex-1 flex-col items-center justify-center px-6 text-center">
      <motion.div initial="hidden" animate="visible" variants={heroText} className="max-w-lg">
        {/* Heart icon */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 text-4xl text-accent md:text-5xl"
        >
          &#10084;
        </motion.div>

        <motion.h1
          className="mb-4 font-heading text-3xl leading-tight text-text-primary md:text-4xl lg:text-5xl"
          variants={heroText}
        >
          Estoy preparando algo especial para ti mi amorcito 🦁✨
        </motion.h1>

        <motion.p
          className="mb-12 text-base leading-relaxed text-text-secondary md:text-lg"
          variants={fadeInUp}
        >
          Cada segundo que pasa nos acerca más a algo hermoso. Ten paciencia, mi niña hermosa
          🤍🦁✨.
        </motion.p>
      </motion.div>

      {/* Countdown timer */}
      {/* Below 400px: 2×2 grid (days+hours / minutes+seconds) */}
      {/* 400px+: single row with separators */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="flex flex-col items-center gap-4 min-[400px]:flex-row min-[400px]:gap-2 md:gap-4"
      >
        {/* Days + Hours */}
        <div className="flex items-start gap-3 min-[400px]:gap-2 md:gap-4">
          <TimeUnit value={timeLeft.days} label="Dias" />
          <Separator />
          <TimeUnit value={timeLeft.hours} label="Horas" />
        </div>

        {/* Separator between pairs — only visible on 400px+ */}
        <div className="hidden min-[400px]:block">
          <Separator />
        </div>

        {/* Minutes + Seconds */}
        <div className="flex items-start gap-3 min-[400px]:gap-2 md:gap-4">
          <TimeUnit value={timeLeft.minutes} label="Minutos" />
          <Separator />
          <TimeUnit value={timeLeft.seconds} label="Segundos" />
        </div>
      </motion.div>

      {/* Subtle footer message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-12 text-sm text-text-muted"
      >
        Solo un poco más, cuando te des cuenta, ya será el gran día. Te amo 🤍...
      </motion.p>
    </div>
  );
}
