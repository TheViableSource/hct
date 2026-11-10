"use client";
import { ContentText } from "@/components/cms/ContentProvider";


import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export default function SectionReveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const Tag = as;

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true);
        observer.disconnect();
      }
    }, { threshold: 0.05 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Content is visible by default, even without JavaScript or observer support.
  return (
    <Tag ref={ref} className={`${className}${revealed ? " hct-section-enter" : ""}`} style={{ "--reveal-delay": `${delay}s` } as CSSProperties}>
      <ContentText>{children}</ContentText>
    </Tag>
  );
}
