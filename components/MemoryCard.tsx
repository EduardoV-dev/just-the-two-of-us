"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeInUp } from "@/lib/animations";
import { formatDate } from "@/lib/content";
import type { Memory } from "@/lib/types";

interface MemoryCardProps {
  memory: Memory;
  index: number;
  onClick: () => void;
}

export default function MemoryCard({
  memory,
  index,
  onClick,
}: MemoryCardProps) {
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
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-6 z-10">
        <div className="w-3 h-3 rounded-full bg-accent ring-4 ring-accent-light" />
      </div>

      {/* Card */}
      <button
        onClick={onClick}
        className={`group w-full md:w-[calc(50%-2rem)] cursor-pointer text-left ${
          isEven ? "md:mr-auto" : "md:ml-auto"
        }`}
      >
        <div className="bg-surface rounded-2xl overflow-hidden border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
          {memory.images[0] && (
            <div className="relative aspect-3/4 overflow-hidden">
              <Image
                src={memory.images[0]}
                alt={memory.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
          <div className="p-5 md:p-6">
            <time className="text-xs text-text-muted tracking-wide uppercase">
              {formatDate(memory.date)}
            </time>
            <h3 className="font-heading text-xl md:text-2xl text-text-primary mt-1.5 mb-2">
              {memory.title}
            </h3>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed">
              {memory.description}
            </p>
            {memory.createdAt && (
              <p className="text-xs text-text-muted mt-3">
                Guardado el {formatDate(memory.createdAt)}
              </p>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
}
