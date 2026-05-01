import { useLocation } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import { pageTransition } from "@/lib/animations";

export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransition}
        className="flex flex-1 flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
