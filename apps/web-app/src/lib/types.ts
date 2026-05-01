export interface Memory {
  id: string;
  title: string;
  date: string;
  createdAt: string;
  description: string;
  fullDescription?: string;
  feeling?: string;
  images: string[];
  tags?: string[];
}

export interface Letter {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface GalleryImage {
  src: string;
  caption?: string;
  createdAt?: string;
}
