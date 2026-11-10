"use client";
import { ContentText } from "@/components/cms/ContentProvider";




import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";
import DecorativeRule from "@/components/ui/DecorativeRule";
import type { ButtonConfig } from "@/lib/types";

const HEIGHTS = {
  full: "min-h-screen min-h-[100svh]",
  tall: "min-h-[70vh]",
  short: "min-h-[60vh]",
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function PageHero({
  label,
  title,
  subtitle,
  actions = [],
  height = "short",
  glow = false,
  caption,
}: {
  label?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ButtonConfig[];
  height?: keyof typeof HEIGHTS;
  glow?: boolean;
  caption?: ReactNode;
}) {
  return (
    <section
      className={`relative ${HEIGHTS[height]} flex items-center justify-center bg-hct-ink bg-atmosphere overflow-hidden`}
    >
      <div className="absolute inset-0 texture-celestial opacity-[0.04]" />
      <ContentText>{glow && <div className="absolute inset-0 glow-spotlight" />}</ContentText>

      <motion.div
        variants={container}
        initial={false}
        animate="show"
        className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 text-center flex flex-col items-center pt-32 pb-16 sm:pt-36 sm:pb-20"
      >
        <ContentText>{label && (
          <motion.div variants={item} className="flex flex-col items-center">
            <SectionLabel><ContentText>{label}</ContentText></SectionLabel>
            <DecorativeRule className="mx-auto" />
          </motion.div>
        )}</ContentText>

        <motion.h1
          variants={item}
          className="font-display font-light tracking-tight leading-[1.05] text-hct-cloud text-4xl sm:text-5xl md:text-7xl text-balance max-w-4xl"
        >
          <ContentText>{title}</ContentText>
        </motion.h1>

        <ContentText>{subtitle && (
          <motion.p
            variants={item}
            className="font-body font-light text-lg text-hct-mist leading-relaxed max-w-2xl mt-8"
          >
            <ContentText>{subtitle}</ContentText>
          </motion.p>
        )}</ContentText>

        <ContentText>{actions.length > 0 && (
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row flex-wrap justify-center items-stretch sm:items-center gap-4 mt-10 w-full sm:w-auto"
          >
            {actions.map((a) => (
              <Button key={a.label} href={a.href} variant={a.variant}>
                <ContentText>{a.label}</ContentText>
              </Button>
            ))}
          </motion.div>
        )}</ContentText>

        <ContentText>{caption && (
          <motion.p
            variants={item}
            className="text-sm text-hct-silver font-body tracking-wide mt-6 max-w-md"
          >
            <ContentText>{caption}</ContentText>
          </motion.p>
        )}</ContentText>
      </motion.div>
    </section>
  );
}
