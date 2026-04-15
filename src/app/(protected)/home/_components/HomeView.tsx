"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import { heroText, fadeInUp } from "@/lib/animations";

export default function HomeView() {
  return (
    <div className="flex min-h-[calc(100svh-5rem)] items-center justify-center px-6 md:min-h-[calc(100svh-4rem)]">
      <motion.div
        className="max-w-xl text-center"
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
          className="mb-4 text-sm tracking-widest text-text-muted uppercase"
          variants={fadeInUp}
        >
          Un lugar solo para nosotros
        </motion.p>

        <motion.h1
          className="mb-6 font-heading text-5xl leading-tight text-text-primary md:text-7xl"
          variants={heroText}
        >
          Cada momento que estoy <span className="text-accent">contigo mi Leo🤍🦁✨</span>
        </motion.h1>

        <motion.p
          className="mx-auto mb-4 max-w-md text-lg leading-relaxed text-text-secondary md:text-xl"
          variants={fadeInUp}
        >
          es un recuerdo que quiero guardar para siempre.
        </motion.p>

        <motion.p
          className="mx-auto mb-10 max-w-md text-lg leading-relaxed text-text-secondary md:text-xl"
          variants={fadeInUp}
        >
          Ésta es una prueba de mi amor por tí, un espacio donde cada palabra, cada imagen, cada
          recuerdo es para ti.
        </motion.p>

        <motion.div variants={fadeInUp}>
          <Link
            href="/timeline"
            className="inline-block rounded-full bg-accent px-8 py-4 text-base font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Comenzar nuestra historia
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
