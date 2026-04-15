"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import MemoryCard from "@/components/MemoryCard";
import MemoryDetailModal from "@/components/MemoryDetailModal";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { getMemories } from "@/lib/content";

import type { Memory } from "@/lib/types";

export default function TimelinePage() {
  const memories = getMemories();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
      <motion.div
        className="mb-12 text-center md:mb-16"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1
          className="mb-3 font-heading text-3xl text-text-primary md:text-5xl"
          variants={fadeInUp}
        >
          Nuestra Historia
        </motion.h1>
        <motion.p className="text-base text-text-muted md:text-lg" variants={fadeInUp}>
          Cada capítulo, cada momento.
        </motion.p>
      </motion.div>

      {/* Timeline line (desktop only) */}
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-px bg-border md:block" />

        <div className="space-y-8 md:space-y-12">
          {memories.map((memory, index) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              index={index}
              onClick={() => setSelectedMemory(memory)}
            />
          ))}
        </div>
      </div>

      <MemoryDetailModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
    </div>
  );
}
