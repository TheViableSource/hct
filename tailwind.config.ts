import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hct: {
          // Primary
          velvet: "#0D1B2E", // Midnight velvet blue — primary bg, nav, footer
          navy: "#0F2545", // Deep sapphire — section alternates
          ink: "#080F1C", // Near-black — deepest backgrounds, overlays

          // Neutrals
          silver: "#B8C4D4", // Primary metallic accent — borders, labels, captions
          mist: "#D6DDE8", // Light silver — body text on dark
          cloud: "#EEF1F5", // Near-white — light text, cards on dark

          // Accents (use sparingly)
          garnet: "#7B1E2A", // Deep garnet — hover states, decorative rules
          plum: "#4A1942", // Velvet plum — gradient partner
          teal: "#1C4A4A", // Oxidized teal — tertiary accent
          spotlight: "#F4F0E8", // Soft warm white — spotlight glow, pull quotes

          // Utility
          graphite: "#2A2E38", // UI elements, card backgrounds
          overlay: "rgba(8,15,28,0.72)", // Modal/hero overlays
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        accent: ["var(--font-cormorant-infant)", "Georgia", "serif"],
      },
      backgroundImage: {
        atmosphere:
          "radial-gradient(ellipse at 30% 40%, rgba(15,37,69,0.8) 0%, rgba(8,15,28,1) 70%)",
        spotlight:
          "radial-gradient(ellipse 600px 400px at 50% 50%, rgba(180,196,212,0.06) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
