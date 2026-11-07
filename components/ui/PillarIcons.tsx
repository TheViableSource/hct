import type { Pillar } from "@/lib/types";

const COMMON = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Treble clef : minimal, abstract
function Clef() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" {...COMMON} aria-hidden>
      <path d="M24 6c-4 2-6 6-6 11 0 6 3 10 3 16 0 4-2 7-5 7-2.5 0-4-1.8-4-4 0-2 1.4-3.5 3.2-3.5 1.6 0 2.8 1.2 2.8 2.8" />
      <path d="M21 33c1.5.5 3 .8 4.5.8 5 0 8.5-3 8.5-7.3 0-3.6-2.7-6-6-6-2.8 0-5 1.8-5 4.4" />
      <line x1="24" y1="6" x2="24" y2="38" />
    </svg>
  );
}

// People / circle : minimal community mark
function Circle() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" {...COMMON} aria-hidden>
      <circle cx="24" cy="24" r="16" />
      <circle cx="24" cy="18" r="4" />
      <path d="M15 33c1.5-4 5-6.5 9-6.5s7.5 2.5 9 6.5" />
    </svg>
  );
}

// Parting stage curtain : abstract, not cliché
function Curtain() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" {...COMMON} aria-hidden>
      <path d="M10 8c3 8 3 24 0 32 4-1 6-4 6.5-9V8" />
      <path d="M38 8c-3 8-3 24 0 32-4-1-6-4-6.5-9V8" />
      <line x1="8" y1="8" x2="40" y2="8" />
      <line x1="24" y1="8" x2="24" y2="20" strokeDasharray="1 4" />
    </svg>
  );
}

const MAP = {
  clef: Clef,
  circle: Circle,
  curtain: Curtain,
};

export default function PillarIcon({ icon }: { icon: Pillar["icon"] }) {
  const Component = MAP[icon];
  return (
    <span className="text-hct-silver inline-block">
      <Component />
    </span>
  );
}
