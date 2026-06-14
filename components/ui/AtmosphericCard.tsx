import { ReactNode } from "react";

export default function AtmosphericCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-hct-ink/60 border border-hct-silver/10 p-8 rounded-sm hover:border-hct-silver/30 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
