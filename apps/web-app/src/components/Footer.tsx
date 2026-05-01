import { motion } from "framer-motion";

import { fadeIn } from "@/lib/animations";

function HeartIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="relative z-10 border-t border-border bg-surface/60 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-8 text-center">
        {/* Decorative divider */}
        <div className="flex items-center gap-3 text-accent">
          <span className="block h-px w-12 bg-accent/40" />
          <HeartIcon />
          <span className="block h-px w-12 bg-accent/40" />
        </div>

        {/* Main quote */}
        <p className="font-heading text-base leading-relaxed text-text-secondary italic">
          &ldquo;En cada momento contigo, encuentro un hogar.&rdquo;
        </p>

        {/* Sub line */}
        <p className="text-xs tracking-wide text-text-muted uppercase">
          Hecho con{" "}
          <span className="relative top-[1px] mx-0.5 inline-flex items-center text-accent">
            <HeartIcon />
          </span>{" "}
          para ti, mi Dayana Leonor Peralta Amador - Mi Hermosa Leona &mdash; {year}
        </p>
      </div>
    </motion.footer>
  );
}
