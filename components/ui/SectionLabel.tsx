import { ReactNode } from "react";

export default function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-body text-xs tracking-[0.3em] uppercase text-hct-silver mb-4 ${className}`}
    >
      {children}
    </p>
  );
}
