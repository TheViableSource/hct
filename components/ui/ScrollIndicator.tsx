"use client";

import { motion } from "framer-motion";

export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 1 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      aria-hidden
    >
      <span className="font-body text-[10px] tracking-[0.3em] uppercase text-hct-silver/40">
        Scroll
      </span>
      <div className="w-px h-12 bg-gradient-to-b from-hct-silver/40 to-transparent animate-fade-pulse" />
    </motion.div>
  );
}
