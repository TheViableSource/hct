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
      className={`bg-hct-ink/60 border border-hct-silver/10 p-6 sm:p-8 min-w-0 rounded-sm hover:border-hct-silver/30 transition-colors duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
