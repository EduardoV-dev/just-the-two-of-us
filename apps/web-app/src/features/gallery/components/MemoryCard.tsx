import { motion } from "framer-motion";

import { fadeInUp } from "@/lib/animations";
import { formatDate } from "@/lib/content";

import type { Memory } from "@/lib/types";

interface MemoryCardProps {
  memory: Memory;
  index: number;
  onClick: () => void;
}

export default function MemoryCard({ memory, index, onClick }: MemoryCardProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className={`relative flex items-start gap-6 md:gap-10 ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeInUp}
    >
      {/* Timeline dot */}
      <div className="absolute top-6 left-1/2 z-10 hidden -translate-x-1/2 md:flex">
        <div className="h-3 w-3 rounded-full bg-accent ring-4 ring-accent-light" />
      </div>

      {/* Card */}
      <button
        onClick={onClick}
        className={`group w-full cursor-pointer text-left md:w-[calc(50%-2rem)] ${
          isEven ? "md:mr-auto" : "md:ml-auto"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
          {memory.images[0] && (
            <div className="relative aspect-3/4 overflow-hidden">
              <img
                src={memory.images[0]}
                alt={memory.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-5 md:p-6">
            <time className="text-xs tracking-wide text-text-muted uppercase">
              {formatDate(memory.date)}
            </time>
            <h3 className="mt-1.5 mb-2 font-heading text-xl text-text-primary md:text-2xl">
              {memory.title}
            </h3>
            <p className="text-sm leading-relaxed text-text-secondary md:text-base">
              {memory.description}
            </p>
            {memory.createdAt && (
              <p className="mt-3 text-xs text-text-muted">
                Guardado el {formatDate(memory.createdAt)}
              </p>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
}
