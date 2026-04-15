import galleryData from "@/content/gallery.json";
import lettersData from "@/content/letters/letters.json";
import memoriesData from "@/content/memories/memories.json";

import type { Memory, Letter, GalleryImage } from "./types";

export function getMemories(): Memory[] {
  return (memoriesData as Memory[]).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export function getMemoryById(id: string): Memory | undefined {
  return (memoriesData as Memory[]).find((m) => m.id === id);
}

export function getLetters(): Letter[] {
  return lettersData as Letter[];
}

export function getGalleryImages(): GalleryImage[] {
  return galleryData as GalleryImage[];
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
