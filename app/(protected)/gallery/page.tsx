"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ImageLightbox from "@/components/ImageLightbox";
import { getGalleryImages } from "@/lib/content";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function GalleryPage() {
  const images = getGalleryImages();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
          Nuestra Galería
        </motion.h1>
        <motion.p
          className="text-text-muted text-base md:text-lg"
          variants={fadeInUp}
        >
          Momentos capturados en el tiempo.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {images.map((image, index) => (
          <motion.button
            key={index}
            className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer"
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
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-text-primary/0 group-hover:bg-text-primary/10 transition-colors duration-300" />
            {image.caption && (
              <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-text-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs text-center">
                  {image.caption}
                </p>
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
