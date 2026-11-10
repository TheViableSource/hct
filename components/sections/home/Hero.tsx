"use client";
import { ContentText } from "@/components/cms/ContentProvider";


import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import { BRAND } from "@/lib/constants";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen min-h-[100svh] flex items-center justify-center bg-hct-ink overflow-hidden pt-32 pb-28 sm:pt-36 sm:pb-32">
      {/* Atmospheric layers */}
      <div className="absolute inset-0 bg-atmosphere" />
      <div className="absolute inset-0 texture-celestial opacity-[0.05]" />
      <div className="absolute inset-0 glow-spotlight" />
      {/* Subtle warm spotlight pooling from above */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 900px 600px at 50% 0%, rgba(244,240,232,0.05) 0%, transparent 60%)",
        }}
      />

      <motion.div
        variants={container}
        initial={false}
        animate="show"
        className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 text-center flex flex-col items-center"
      >
        <motion.p
          variants={item}
          className="font-body text-xs tracking-[0.4em] uppercase text-hct-silver mb-8"
        >
          <ContentText>{BRAND.location}</ContentText>
        </motion.p>

        <h1 className="font-display font-light tracking-tight leading-[0.95] text-hct-cloud text-6xl md:text-8xl">
          <motion.span variants={item} className="block"><ContentText>Where Hillsboro
          </ContentText></motion.span>
          <motion.span variants={item} className="block"><ContentText>Takes the Stage
          </ContentText></motion.span>
        </h1>

        <motion.p
          variants={item}
          className="font-body font-light text-lg text-hct-mist leading-relaxed max-w-xl mt-10"
        ><ContentText>A new theater is taking shape in Hillsboro. Local volunteers build and run it. If you love the thrill of a live show, you belong here.
        </ContentText></motion.p>

        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center gap-4 mt-12"
        >
          <Button href="/get-involved" variant="primary"><ContentText>Join the Movement
          </ContentText></Button>
          <Button href="/about" variant="ghost"><ContentText>Learn Our Story
          </ContentText></Button>
        </motion.div>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
