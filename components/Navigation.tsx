"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

function HomeIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function TimelineIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14.5" />
    </svg>
  );
}

function LettersIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

const links = [
  { href: "/home", label: "Inicio", Icon: HomeIcon },
  { href: "/timeline", label: "Historia", Icon: TimelineIcon },
  { href: "/letters", label: "Cartas", Icon: LettersIcon },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto"
    >
      <div className="bg-surface/80 backdrop-blur-lg border-t border-border md:border-t-0 md:border-b">
        <div className="max-w-3xl mx-auto flex items-center justify-around md:justify-center md:gap-8 px-4 py-2 md:py-3">
          {links.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-lg min-w-[52px] min-h-[44px] justify-center transition-colors ${
                  isActive
                    ? "text-accent"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <motion.span
                  whileHover={{ y: -3, scale: 1.15 }}
                  animate={isActive ? { y: [0, -3, 0] } : {}}
                  transition={
                    isActive
                      ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.2 }
                  }
                  className="flex items-center justify-center"
                >
                  <Icon />
                </motion.span>
                <span className="text-xs font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
