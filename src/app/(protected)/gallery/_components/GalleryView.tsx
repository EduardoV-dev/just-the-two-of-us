"use client";

import { useState } from "react";

import Image from "next/image";

import { motion } from "framer-motion";

import { ImageLightbox } from "@/features/gallery";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { getGalleryImages } from "@/lib/content";

export default function GalleryView() {
  const images = getGalleryImages();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
          Nuestra Galería
        </motion.h1>
        <motion.p className="text-base text-text-muted md:text-lg" variants={fadeInUp}>
          Momentos capturados en el tiempo.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {images.map((image, index) => (
          <motion.button
            key={image.src}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            onClick={() => setLightboxIndex(index)}
          >
            <Image
              src={image.src}
              alt={image.caption || `Gallery photo ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-text-primary/0 transition-colors duration-300 group-hover:bg-text-primary/10" />
            {image.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-text-primary/40 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-center text-xs text-white">{image.caption}</p>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <ImageLightbox
        images={images}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </div>
  );
}
