import type { LucideIcon } from "lucide-react";

export type ButtonVariant = "primary" | "ghost" | "donate";

export interface ButtonConfig {
  label: string;
  href: string;
  variant?: ButtonVariant;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Pillar {
  title: string;
  body: string;
  icon: "clef" | "circle" | "curtain";
}

export interface RoleCard {
  title: string;
  body: string;
}

export interface ValueItem {
  title: string;
  body: string;
}

export interface Milestone {
  phase: string;
  body: string;
  active?: boolean;
}

export interface DonationTier {
  name: string;
  amount: string;
  body: string;
  cta: string;
  featured?: boolean;
  featuredLabel?: string;
}

export interface SponsorTier {
  tier: string;
  investment: string;
  recognition: string;
}

export interface IconCard {
  title: string;
  body: string;
  icon?: LucideIcon;
}
