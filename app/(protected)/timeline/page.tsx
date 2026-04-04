"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MemoryCard from "@/components/MemoryCard";
import MemoryDetailModal from "@/components/MemoryDetailModal";
import { getMemories } from "@/lib/content";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Memory } from "@/lib/types";

export default function TimelinePage() {
  const memories = getMemories();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-5 py-12 md:py-16">
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
          Nuestra Historia
        </motion.h1>
        <motion.p
          className="text-text-muted text-base md:text-lg"
          variants={fadeInUp}
        >
          Cada capítulo, cada momento.
        </motion.p>
      </motion.div>

      {/* Timeline line (desktop only) */}
      <div className="relative">
        <div className="hidden md:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-border" />

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

      <MemoryDetailModal
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
      />
    </div>
  );
}
