import { Link, useLocation } from "react-router-dom";

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

const links = [
  { to: "/", label: "Inicio", Icon: HomeIcon },
  { to: "/timeline", label: "Historia", Icon: TimelineIcon },
  { to: "/letters", label: "Cartas", Icon: LettersIcon },
];

export default function Navigation() {
  const { pathname } = useLocation();

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="fixed right-0 bottom-0 left-0 z-50 md:top-0 md:bottom-auto"
    >
      <div className="border-t border-border bg-surface/80 backdrop-blur-lg md:border-t-0 md:border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-around px-4 py-2 md:justify-center md:gap-8 md:py-3">
          {links.map(({ to, label, Icon }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex min-h-[44px] min-w-[52px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-1.5 transition-colors ${
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
