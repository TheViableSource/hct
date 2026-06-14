# Hillsboro Civic Theater

> Where Hillsboro Takes the Stage

The marketing website for Hillsboro Civic Theater (HCT) — a community-powered civic
theater producing large-scale musicals with a full orchestra. Built with an emphasis
on cinematic, emotionally immersive design.

## Tech stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS v3** with custom HCT design tokens (`tailwind.config.ts`)
- **Framer Motion** for scroll reveals, staggered hero entrances, and the mobile menu
- **Lucide React** for minimal iconography
- **Formspree** for all form submissions (no backend required)

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

## Forms

All forms submit to Formspree. Create a form at [formspree.io](https://formspree.io),
then set the ID:

```bash
cp .env.example .env.local
# edit NEXT_PUBLIC_FORMSPREE_ID
```

Until an ID is set, forms post to a `PLACEHOLDER` endpoint and will not deliver.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Home — hero, vision, three pillars, community call, newsletter signup |
| `/about` | Founding story, mission/vision/values, roadmap timeline |
| `/community` | Role cards, emotional statement, community values, interest form |
| `/donate` | Impact, donation tiers, other ways to give, donation form |
| `/get-involved` | Founders' note, sponsorship tiers, volunteering, auditions, master form |

## Project structure

```
app/                  Routes, layout, metadata, sitemap, robots, icon
components/
  ui/                 Button, SectionLabel, DecorativeRule, AtmosphericCard, SectionReveal, icons
  layout/             Nav, Footer, PageHero
  sections/           Page-specific section components
  forms/              Formspree-backed forms + shared field primitives
lib/                  constants.ts (brand/content data), types.ts
```

## Design tokens

Brand colors and fonts live in `tailwind.config.ts` under the `hct` color namespace
(`velvet`, `navy`, `ink`, `silver`, `mist`, `cloud`, `garnet`, etc.) and the
`display` / `body` / `accent` font families (Cormorant Garamond, Inter, Cormorant Infant).

## Deployment

Deploy to [Vercel](https://vercel.com) — standard Next.js, no environment variables
required at launch except `NEXT_PUBLIC_FORMSPREE_ID`. `robots.txt` and `sitemap.xml`
are generated natively by Next.js.
