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
- **Private SQLite storage** for opt-in newsletter signups and inquiries (Node 22.23+)

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

## Forms

Forms use the same-origin POST-only `/api/forms` route. No mailing service is connected.
Inquiry forms have an optional, unchecked newsletter opt-in. Newsletter signups
require that consent. Online donations are disabled, including server-side rejection.

See [OPERATIONS.md](OPERATIONS.md) before deployment. An admin must configure
`HCT_FORM_DATA_DIR` outside all public/deployment/Git trees, initialize its private
SQLite database, and set `HCT_FORM_ORIGINS`. Missing or unsafe configuration fails
closed. There is no public admin, list, export, or download route.

Local checks: `npm run typecheck`, `npm test`, `npm run build`. Tests use isolated,
temporary `example.invalid` records and remove only their own synthetic files.

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
  forms/              Website-backed forms + shared field primitives
lib/                  constants.ts (brand/content data), types.ts
```

## Design tokens

Brand colors and fonts live in `tailwind.config.ts` under the `hct` color namespace
(`velvet`, `navy`, `ink`, `silver`, `mist`, `cloud`, `garnet`, etc.) and the
`display` / `body` / `accent` font families (Cormorant Garamond, Inter, Cormorant Infant).

## Deployment

Deploy to persistent Node hosting using [DEPLOY-PLESK.md](DEPLOY-PLESK.md) and
[OPERATIONS.md](OPERATIONS.md). Ephemeral/serverless disks are not supported by
this storage design. No form data belongs in Git or the app deployment folder.

## Backend content editor

The optional CMS provides authenticated copy, links, sections, blog and search metadata editing with separate draft, private preview and publish controls. Storage and editor access must be provisioned separately. Outbound form email remains disabled by default until its authenticated mail route is configured and tested.
