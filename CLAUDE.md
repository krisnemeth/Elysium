# Elysium — CLAUDE.md

Project reference for AI-assisted development sessions.

---

## What This Is

**Elysium** (package name: `character-vault`) is a Next.js 14 web app for managing Vampire: The Masquerade (V5) characters and character sheets. Built by Krisztian Nemeth. The app lets players create, store, and view VTM characters and their full stat sheets.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14.1.0 (App Router, Server Components) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.3 + PostCSS + Autoprefixer |
| Icons | react-icons 5.2 |
| SVGs | @svgr/webpack — SVGs are imported as React components |
| Utilities | clsx |
| Fonts | Google Fonts via next/font — Josefin Slab (headings) + Josefin Sans (body) |

No backend, no database, no auth — yet. All data is currently hardcoded.

---

## Directory Structure

```
app/
  layout.tsx              # Root layout, metadata, fonts
  page.tsx                # Landing page (/)
  fonts.ts                # Font config (Josefin Slab + Sans)
  globals.css             # CSS vars, @tailwind directives
  ui/
    navbar.tsx            # Fixed top nav (Log In / Sign Up buttons → /dashboard)
    home/                 # Landing page sections
      HomePageArt.tsx     # Background art with clan symbols
      WelcomeText.tsx     # Hero section
      Features.tsx        # Feature cards
      GlowUpCard.tsx      # Individual feature card
      Footer.tsx
      LogoGrid.tsx
    dashboard/
      sidenav.tsx         # Fixed sidebar with nav + dice roller + sign-out stub
      nav-links.tsx       # Links: Home, Characters, Sheets
      OverviewCard.tsx
      CardList.tsx
      CardListItem.tsx
    characters/
      CharacterCard.tsx
    sheets/               # ~43 form section components
      Attributes.tsx
      Skills.tsx
      Disciplines.tsx
      BloodPotency.tsx
      ResonanceHunger.tsx
      LifeStats.tsx
      TenetsTouchstonesBane.tsx
      MixedSection.tsx
      BioData.tsx
      TextInputFields.tsx
      CategoryDividers.tsx
      [checkbox/input variants...]
    svgs/
      index.ts            # Barrel export for all SVG components
      [60+ clan/sect/branding SVGs]
  lib/
    utils.ts              # Date formatting helper
  dashboard/
    layout.tsx            # Dashboard shell with SideNav
    (overview)/page.tsx   # /dashboard — hardcoded overview cards
    characters/page.tsx   # /dashboard/characters — hardcoded character gallery
    sheets/
      page.tsx            # /dashboard/sheets — sheet management hub
      create/page.tsx     # /dashboard/sheets/create — character sheet form

public/
  [character portrait images: Female1-4, Male1-2, clan portraits]
  [feature screenshots: iPadCharShotsDark.png, SheetShot.png, etc.]
  [HomePageArt*.webp — landing page backgrounds]
```

---

## Routes

| Path | Purpose |
|---|---|
| `/` | Landing page — hero + features + footer |
| `/dashboard` | Overview — hardcoded finished/draft character counts |
| `/dashboard/characters` | Character gallery — 8 hardcoded characters with clan info |
| `/dashboard/sheets` | Sheet hub — links to create Loresheets or Character Sheets |
| `/dashboard/sheets/create` | Full VTM character sheet form (no submit action yet) |

---

## Visual Design System

- **Color palette:** Dark theme — purple/red gradient backgrounds (`violet-950` light / `red-950` dark), slate text, black surfaces
- **CSS variables** (globals.css): `--background-start-hex`, `--background-middle-hex`, `--background-end-hex` differ between light/dark mode
- **Effects:** Glass morphism (backdrop-blur + bg-opacity), colored glow drop-shadows, border-opacity overlays, hover glow animations (duration-200 / duration-500)
- **Custom Tailwind:** `3xl` breakpoint at 1600px, `gradient-radial` and `gradient-conic` utilities
- **Breakpoints used:** default (mobile), `md`, `lg`, `xl`, `2xl`, `3xl`
- **SVG styling:** All clan/branding SVGs are React components, styled via `className` (e.g., `text-slate-300/80`, `w-28`)

---

## VTM Domain Concepts

The app models V5 (5th Edition) mechanics:
- **Clans:** Brujah, Ventrue, Malkavian, Tremere, Gangrel, Lasombra, Banu Haqim, Nosferatu, Toreador, Tzimisce, Ravnos, Salubri, Hecata + more
- **Sects:** Camarilla, Anarch, Sabbat (SVGs exist for all three)
- **Sheet sections:** Attributes, Skills, Disciplines, Blood Potency, Resonance, Hunger, Life Stats (Health/Willpower), Tenets, Touchstones, Bane, Bio Data
- **Loresheets:** A V5 mechanic — character history documents; planned but not yet implemented

---

## Current State — What's Missing

1. **No database** — all data (characters, overview counts) is hardcoded in page components
2. **No authentication** — Log In / Sign Up buttons link directly to `/dashboard`; `signOut` is commented out in `sidenav.tsx`; auth import (`@/auth`) is commented out
3. **No form submission** — the character sheet `<form action=''>` has an empty action; no state, no validation, no persistence
4. **No character data model** — no TypeScript types for Character, Loresheet, User
5. **Loresheets section** — shows "0" on dashboard, create flow not built
6. **Stale commented-out code** — old dashboard layout remains commented out in `app/dashboard/(overview)/page.tsx`; similar dead code in `sidenav.tsx` and `navbar.tsx`

---

## Dev Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint check
```

SVGs are handled by `@svgr/webpack` via custom rule in `next.config.mjs`. Import them from `@/app/ui/svgs` (barrel export).

---

## Active Branch

Development branch: `claude/review-previous-task-Hj63P`  
Main branch: `main`  
Always push to the designated feature branch unless told otherwise.
