"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { heroText, fadeInUp } from "@/lib/animations";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100svh-5rem)] md:min-h-[calc(100svh-4rem)] px-6">
      <motion.div
        className="text-center max-w-xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 },
          },
        }}
      >
        <motion.p
          className="text-text-muted text-sm tracking-widest uppercase mb-4"
          variants={fadeInUp}
        >
          Un lugar solo para nosotros
        </motion.p>

        <motion.h1
          className="font-heading text-5xl md:text-7xl text-text-primary leading-tight mb-6"
          variants={heroText}
        >
          Cada momento que estoy{" "}
          <span className="text-accent">contigo mi Leo🤍🦁✨</span>
        </motion.h1>

        <motion.p
          className="text-text-secondary text-lg md:text-xl mb-4 max-w-md mx-auto leading-relaxed"
          variants={fadeInUp}
        >
          es un recuerdo que quiero guardar para siempre.
        </motion.p>

        <motion.p
          className="text-text-secondary text-lg md:text-xl mb-10 max-w-md mx-auto leading-relaxed"
          variants={fadeInUp}
        >
          Ésta es una prueba de mi amor por tí, un espacio donde cada palabra,
          cada imagen, cada recuerdo es para ti.
        </motion.p>

        <motion.div variants={fadeInUp}>
          <Link
            href="/timeline"
            className="inline-block px-8 py-4 bg-accent text-white rounded-full text-base font-medium hover:bg-accent-hover transition-colors"
          >
            Comenzar nuestra historia
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
