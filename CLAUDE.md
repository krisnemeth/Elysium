# Elysium — CLAUDE.md

## Project Overview

**Elysium** is a web application for managing **Vampire: The Masquerade (VTM)** character sheets and loresheets. Players can create accounts, build full VTM character sheets (attributes, skills, disciplines, bio, etc.), and manage multiple characters. The name "Elysium" refers to the neutral ground in VTM lore.

- Developer: Krisztian Nemeth — https://krisnemeth.dev
- Repo: `krisnemeth/elysium`
- Dev branch: `main` (the multi-game World of Darkness vault)
- `legacy`: a frozen backup of the original 2023/24 Vampire-only app (as of 2026-10-07, after the Next 16 / Tailwind 4 / Node 24 upgrades). Never delete, rewrite or merge into it; it's protected on GitHub against deletion and force-pushes.
- Roadmap: `plans/feature-roadmap.md`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.3.8 (App Router, Turbopack) + React 19 |
| Language | TypeScript 5.9 (strict) |
| Styling | Tailwind CSS 4 (CSS-first config in `globals.css`, via `@tailwindcss/postcss`) |
| Icons | react-icons 5.2.0 |
| SVG components | @svgr/webpack 8.1.0 (via `turbopack.rules`) |
| Linting | ESLint 9 flat config (`eslint.config.mjs`) |
| Fonts | Josefin Slab & Josefin Sans (Google Fonts) |
| Database | **Supabase** (PostgreSQL — to be integrated) |
| Auth | **Supabase Auth** (to be integrated) |
| Hosting | Vercel (standard Next.js deployment) |

---

## Directory Structure

```
/
├── app/
│   ├── layout.tsx              # Root layout (fonts, dark theme)
│   ├── page.tsx                # Landing/home page
│   ├── globals.css             # Tailwind entry + @theme config + global dark-theme CSS
│   ├── fonts.ts                # Google Fonts config
│   ├── lib/
│   │   └── utils.ts            # formatDate utility
│   ├── ui/
│   │   ├── navbar.tsx          # Fixed top nav (Log In / Sign Up)
│   │   ├── footer.tsx          # Global footer
│   │   ├── glowUpButtonLarge.tsx
│   │   ├── glowUpButtonMedium.tsx
│   │   ├── home/               # Landing page section components
│   │   │   ├── WelcomeText.tsx
│   │   │   ├── HomePageArt.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── GlowUpCard.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── LogoGrid.tsx
│   │   │   └── Footer.tsx
│   │   ├── dashboard/
│   │   │   ├── sidenav.tsx     # Fixed sidebar (has commented-out signOut)
│   │   │   ├── nav-links.tsx
│   │   │   ├── OverviewCard.tsx
│   │   │   ├── CardList.tsx
│   │   │   └── CardListItem.tsx
│   │   ├── characters/
│   │   │   └── CharacterCard.tsx
│   │   ├── sheets/             # Character sheet form section components
│   │   │   ├── TextInputFields.tsx
│   │   │   ├── Attributes.tsx
│   │   │   ├── AttributeCheckBoxInput.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── SkillCheckBoxInput.tsx
│   │   │   ├── LifeStats.tsx           # Health / Willpower / Humanity tracks
│   │   │   ├── LifeStatsInput.tsx
│   │   │   ├── Disciplines.tsx
│   │   │   ├── DisciplineInput.tsx
│   │   │   ├── ResonanceHunger.tsx
│   │   │   ├── ResonanceHungerInput.tsx  # STUB: renders placeholder text only
│   │   │   ├── TenetsTouchstonesBane.tsx
│   │   │   ├── BloodPotency.tsx
│   │   │   ├── BloodPotencyCheckbox.tsx
│   │   │   ├── BloodPotencyTextInput.tsx
│   │   │   ├── BioData.tsx
│   │   │   ├── BioDataDateOf.tsx
│   │   │   ├── BioDataAge.tsx
│   │   │   ├── BioDataTextArea.tsx
│   │   │   ├── MixedSection.tsx
│   │   │   ├── MeritsFlawsInput.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── TextInput.tsx
│   │   │   ├── TextInputDropdown.tsx
│   │   │   ├── TextArea.tsx
│   │   │   └── CategoryDividers.tsx
│   │   └── svgs/
│   │       ├── index.ts        # All SVG exports
│   │       └── *.svg           # 40+ clan/faction SVGs
│   ├── dashboard/
│   │   ├── layout.tsx          # Sidebar + content shell
│   │   ├── (overview)/page.tsx # Dashboard home (static data)
│   │   ├── characters/page.tsx # Character gallery (static data)
│   │   ├── sheets/page.tsx     # Sheet type selection
│   │   └── sheets/create/page.tsx  # Full character sheet form
│   └── (no api/ directory yet)
├── public/                     # Static assets (character/clan images, art)
├── package.json
├── postcss.config.js           # @tailwindcss/postcss
├── next.config.mjs             # Turbopack rule: SVGs → React components via @svgr/webpack
├── tsconfig.json
└── eslint.config.mjs           # ESLint flat config (core-web-vitals)
```

---

## Routes

| Path | Purpose |
|---|---|
| `/` | Landing page — hero + features + footer |
| `/concept` | Concept landing page ("Nightly Edition"): editorial V5-style alternative, own fonts in `app/concept/fonts.ts` |
| `/dashboard` | Overview — hardcoded finished/draft character counts |
| `/dashboard/characters` | Character gallery — 8 hardcoded characters with clan info |
| `/dashboard/sheets` | Sheet hub — links to create Loresheets or Character Sheets |
| `/dashboard/sheets/create` | Full VTM character sheet form (no submit action yet) |

---

## VTM Domain Concepts

The app models V5 (5th Edition) mechanics:
- **Clans:** Brujah, Ventrue, Malkavian, Tremere, Gangrel, Lasombra, Banu Haqim, Nosferatu, Toreador, Tzimisce, Ravnos, Salubri, Hecata + more
- **Sects:** Camarilla, Anarch, Sabbat (SVGs exist for all three)
- **Sheet sections:** Attributes, Skills, Disciplines, Blood Potency, Resonance, Hunger, Life Stats (Health/Willpower/Humanity), Tenets, Touchstones, Bane, Bio Data
- **Loresheets:** A V5 mechanic — character history documents; planned but not yet implemented

---

## Current State

### What Works (Frontend Only)
- **Landing page** — hero, feature highlights, logo grid, footer with sign-up form stub
- **Dashboard layout** — responsive sidebar nav, mobile top nav
- **Characters page** — gallery of 8 hardcoded VTM characters with images, clan symbols
- **Sheet creator form** — complete UI for full VTM character sheet with local React state:
  - Basic info (Name, Player, Chronicle, Concept, Ambition, Predator, Sire, Clan, Generation)
  - 9 Attributes (Physical / Social / Mental, 5-checkbox each)
  - 27 Skills (3 categories, 5-checkbox + optional label each)
  - Life Stats (Health, Willpower, Humanity — 10 checkboxes each)
  - 6 Discipline slots (dropdown + 5-level checkboxes + 5 power name fields)
  - Resonance & Hunger (5-checkbox hunger track)
  - Tenets, Touchstones & Bane (3 textareas)
  - Blood Potency (10 checkboxes + 6 stat text fields)
  - Experience (Total / Spent inputs)
  - Biographical data (DoB, DoD, auto-calculated ages, appearance, history)
  - Merits & Flaws (13 rows: name + 5-checkbox rating)

### Known Bugs
- None currently tracked. (Fixed: `LifeStats.tsx` willpower & humanity rows previously wrote to the health state.)

### What's Missing / Incomplete
- No Supabase integration (database, auth)
- No API route handlers (`app/api/` doesn't exist)
- Form has no `onSubmit` / `action` handler — data is never saved
- No authentication — Log Out button's server action is empty, `signOut` import is commented out
- `ResonanceHungerInput.tsx` is a placeholder stub
- All dashboard data is hardcoded (characters, overview counts)
- Character action buttons (View, Edit, Delete) all link to `#`
- No PDF export
- No form validation
- No search / filter on characters page
- No loresheet system (navigation item exists, no implementation)

---

## Environment Variables

```env
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
```

Supabase is only called on the server (Server Components, Server Actions, `proxy.ts`), so these have no `NEXT_PUBLIC_` prefix; Vercel won't save a Sensitive variable with that prefix. `app/lib/supabase/env.ts` also accepts the `NEXT_PUBLIC_` names. Locally they're in `.env.local`; on Vercel, under the project's environment variables (Production, Preview, Development). No secret / service-role key is used.

---

## Design System

- **Theme**: Dark gothic — black backgrounds, `slate-300` text, `rose-600` / `red-800` accents
- **Gradients**: `violet-950 → red-950`
- **Glass effects**: `backdrop-blur`, `bg-opacity`
- **Glow buttons**: rose-600 blur shadow
- **Checkboxes**: rotated 45° for diamond shape
- **Borders**: dotted on text inputs
- **Custom breakpoint**: `3xl` at 1600px, defined as `--breakpoint-3xl` in the `@theme` block of `globals.css`
- **Fonts**: Josefin Slab (headings), Josefin Sans (body)

---

## Refactoring & Completion Plan

### Phase 0 — Bug Fixes (do first)

1. ~~**Fix `LifeStats.tsx`**: Change willpower and humanity inputs to use their own state keys and handlers.~~ ✅ Done
2. **Complete `ResonanceHungerInput.tsx`**: Implement resonance text input + 5-checkbox hunger track (same pattern as other stat inputs).
3. **Remove dead/commented code**: Clean up commented-out blocks in `sidenav.tsx` and elsewhere.

---

### Phase 1 — Supabase Setup

#### 1.1 Install dependencies
```bash
npm install @supabase/supabase-js @supabase/ssr
```

#### 1.2 Supabase client helpers
Create `app/lib/supabase/`:
- `client.ts` — browser client (`createBrowserClient`)
- `server.ts` — server client (`createServerClient` using Next.js cookies)
- `proxy.ts` — session refresh helper

#### 1.3 Next.js proxy (formerly middleware)
Create `proxy.ts` at root (Next.js 16 renamed `middleware.ts` → `proxy.ts`; export a function named `proxy`) to refresh Supabase Auth sessions on every request, protecting `/dashboard/**` routes.

#### 1.4 Database Schema (PostgreSQL via Supabase)

```sql
-- Users are handled by Supabase Auth (auth.users)

-- Character sheet (one row per character)
create table public.characters (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  player       text,
  chronicle    text,
  concept      text,
  ambition     text,
  predator     text,
  sire         text,
  clan         text,
  generation   text,
  -- attributes (9 integers 0-5)
  str int2, dex int2, sta int2,
  cha int2, man int2, com int2,
  int int2, wit int2, res int2,
  -- life stats (10-bit arrays stored as integer bitmask or jsonb)
  health       int2[],
  willpower    int2[],
  humanity     int2[],
  -- disciplines (jsonb array of {name, level, powers[]})
  disciplines  jsonb,
  -- skills (jsonb map of skill_name -> {level, specialty})
  skills       jsonb,
  -- resonance & hunger
  resonance    text,
  hunger       int2,
  -- blood potency
  blood_potency         int2,
  blood_surge           text,
  power_bonus           text,
  feeding_penalty       text,
  mend_amount           text,
  rouse_reroll          text,
  bane_severity         text,
  -- experience
  exp_total    int2,
  exp_spent    int2,
  -- tenets / touchstones / bane
  tenets       text,
  touchstones  text,
  clan_bane    text,
  -- merits & flaws (jsonb array of {name, level})
  merits_flaws jsonb,
  -- bio
  date_of_birth        date,
  date_of_death        date,
  appearance           text,
  distinguishing_features text,
  history              text,
  notes                text,
  -- meta
  is_draft     boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Row-level security
alter table public.characters enable row level security;
create policy "Users own their characters"
  on public.characters for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

---

### Phase 2 — Authentication

#### 2.1 Auth pages
Create `app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx` using Supabase Auth UI or a custom form calling `supabase.auth.signInWithPassword` / `signUp`.

#### 2.2 Wire up navbar buttons
- "Log In" → `/login`
- "Sign Up" → `/signup`

#### 2.3 Wire up Log Out
Uncomment and implement `signOut` in `sidenav.tsx` using Supabase client.

#### 2.4 Protect dashboard
Middleware redirects unauthenticated users from `/dashboard/**` to `/login`.

---

### Phase 3 — API / Server Actions

Use **Next.js Server Actions** (already used pattern in the project with `'use server'`) rather than separate REST routes.

Create `app/lib/actions/characters.ts`:
- `createCharacter(formData)` — insert into `public.characters`
- `updateCharacter(id, formData)` — update by id (RLS enforces ownership)
- `deleteCharacter(id)` — delete by id
- `getCharacters()` — fetch all characters for the current user
- `getCharacter(id)` — fetch one character

Create `app/lib/data/characters.ts`:
- Server-side data fetching functions called from Server Components

---

### Phase 4 — Connect the Sheet Form

1. Lift all local state in sheet components into a single parent form state object in `sheets/create/page.tsx` (convert it to `'use client'`).
2. Wire the `<form>` `action` to the `createCharacter` Server Action.
3. Add client-side validation (required fields, numeric ranges).
4. After save, redirect to `/dashboard/characters/[id]`.
5. Create `sheets/[id]/edit/page.tsx` that loads existing data and calls `updateCharacter`.

---

### Phase 5 — Dynamic Dashboard

1. Replace all hardcoded character arrays in `(overview)/page.tsx` and `characters/page.tsx` with `getCharacters()` fetches.
2. `OverviewCard` counts (finished, drafts, loresheets) become real queries.
3. Character card "View / Edit / Delete" buttons become functional links and server actions.

---

### Phase 6 — Character Detail Page

Create `app/dashboard/characters/[id]/page.tsx`:
- Read-only view of a saved character sheet (print-friendly layout)
- Edit button → navigate to edit page

---

### Phase 7 — PDF Export (Stretch)

Use `@react-pdf/renderer` or `puppeteer` on a route handler to generate a print-ready VTM character sheet PDF.

---

### Phase 8 — Loresheet System (Stretch)

The sidebar already has a Loresheet link. Implement:
- `public.loresheets` table (user_id, title, content, character_id)
- CRUD pages under `app/dashboard/loresheets/`

---

## Next.js 16 Notes

Migrated from Next.js 14 → 16.3.8 / React 19 (2026-10-06). Things that differ from older Next.js knowledge:

- **Turbopack is the default** for `next dev` and `next build`. Don't add a `webpack()` function to `next.config.mjs` — a custom webpack config makes `next build` fail. Loaders go in `turbopack.rules`.
- **`next lint` is removed.** `npm run lint` runs `eslint .` with the flat config. Stay on ESLint 9: `eslint-plugin-react` (pulled in by `eslint-config-next`) crashes on ESLint 10.
- **`middleware.ts` is now `proxy.ts`** (Node.js runtime only).
- **Request APIs are async-only**: `await params`, `await searchParams`, `await cookies()`, `await headers()`.
- `next build` no longer runs lint and no longer prints per-route bundle sizes.
- Bundled, version-matched docs live in `node_modules/next/dist/docs/` — check them before writing Next.js code.

## Landing Pages

- `/` (`app/page.tsx`): book-cover hero (`app/ui/home/Hero.tsx`). The portrait and ankh are sized from one `--cover` width so the ankh halo stays behind the portrait at every viewport; the ankh rises on scroll because the backdrop/portrait layers are sticky. Swap cover art via `COVER_ART` in `Hero.tsx`.
- `/concept`: experimental redesign. `_lib/hunger-dice.ts` implements V5 dice rules (crits, messy crits, bestial failures) as a pure function, reusable for the dashboard dice roller.
- Scroll-driven effects use CSS `animation-timeline` in `globals.css`, with a static fallback and `prefers-reduced-motion` respected.

## App UI (dashboard)

- Shell: `app/dashboard/layout.tsx` (ambient backdrop + `ui/dashboard/sidenav.tsx`: glass sidebar on desktop, top bar + bottom tab bar on phones). `app/dashboard/template.tsx` animates every page in.
- Shared kit in `app/ui/kit/`: `styles.ts` (panel, buttons, field classes), `PageHeader`, `Stagger` (cascading entrance), `DotRating` (V5 dot/box ratings, keyboard slider). Theme toggle: `app/ui/ThemeToggle.tsx`; theme script: `app/lib/theme.ts`.
- Character sheets: one `Sheet` object (`app/lib/sheets/types.ts`) held by `app/ui/sheets/CharacterEditor.tsx`, which autosaves it (900 ms debounce) through the server actions in `app/lib/actions/characters.ts`. Sections (`app/ui/sheets/sections/`) read and write it via `useSheet()` / `useSheetFields()` from `SheetContext.tsx`; per-game section lists are in `game-sheets.tsx`. Inputs are in `fields.tsx`.
- Characters live in Supabase (`public.characters`, RLS: owner only); reads go through `app/lib/data/characters.ts`. New accounts get copies of the 9 starters (`app/lib/starters/`, validated and turned into a migration by `node scripts/build-starters.mts <file>`).
- Saving: `app/ui/sheets/useCharacterSave.ts` (autosave hook) and `SaveStatus.tsx`, shared by the editor and play mode.
- Play mode: `app/vault/[game]/characters/[id]/play` → `app/ui/play/PlaySheet.tsx` (tracks in `app/ui/play/tracks.tsx`). Damage rules are pure functions in `app/lib/play/damage.ts`; play state lives on the sheet (`damage`, `stains`, `despair`). `DiceRoller` is uncontrolled on the dice page and bound to the sheet in play mode (`pool`, `special`, `danger`, `despair`, `onWillpowerReroll`).
- XP: `sheet.xp` entries; costs and the in-clan Discipline table in `app/lib/xp/costs.ts`; UI in `app/ui/sheets/sections/experience.tsx`. Only costs we're sure of are priced; anything else takes a player-entered cost.
- Portraits: uploads go to the private `portraits` bucket at `<user>/<character>/<uuid>.webp` (policies in the migration limit each user to their own folder) and are served by `app/media/portraits/[...path]/route.ts` with the user's session. `app/ui/characters/PortraitPicker.tsx` crops to 3:4 and resizes to 900×1200 in the browser first; `setPortrait`/`removePortrait` are in `app/lib/actions/characters.ts`. Uploaded portraits render with `unoptimized` (see `Character.image`).
- Social (Group 3): `/vault/friends`, `/vault/chronicles`, `/vault/chronicles/[id]`. Tables `friendships`, `chronicles`, `chronicle_members`, `chronicle_rolls`, `chronicle_notes` (migration `…_friends_and_chronicles.sql`); cross-table checks go through security-definer helpers (`is_chronicle_member`, `chronicle_role`, `storyteller_can_read`, `in_same_chronicle`) and lookups of other users through RPCs (`send_friend_request`, `create_chronicle`, `invite_to_chronicle`, `chronicle_party`, `advance_bot`). Data in `app/lib/data/social.ts`, actions in `app/lib/actions/social.ts`, UI in `app/ui/social/` and `app/ui/chronicles/`.
- Characters RLS lets Storytellers read players' sheets, so `getCharacters`/`getCharacter` filter by owner; use `getSharedCharacter` only for the chronicle view.
- Live updates: `app/lib/supabase/browser.ts` `subscribe()` loads the session and calls `realtime.setAuth` before joining (otherwise RLS sends nothing). The server passes the URL and publishable key down.
- Storyteller bot: `app/lib/storyteller/` (content tables + seeded generator). **Dark Pack: all bot text must be original writing; no quotes or paraphrase of books, no canon named characters.** Read `plans/dark-pack-compliance.md` before adding content.
- Sample data (landing and `/concept` only): `app/lib/sample-characters.ts`; clan → official symbol/name logo: `app/lib/clans.ts`.
- Dice roller: `/dashboard/dice` (`app/ui/dice/DiceRoller.tsx`) on the pure rules in `app/lib/hunger-dice.ts` (also used by `/concept`). Includes rouse checks and Willpower rerolls.
- Motion keyframes and easing tokens (`--ease-spring`, `--ease-out-expo`) are in `globals.css`; all motion is disabled under `prefers-reduced-motion`.

## Games, themes and routes

Elysium is a cross-game vault for Vampire: The Masquerade, Werewolf: The Apocalypse and Hunter: The Reckoning (5th editions).

| Route | What |
|---|---|
| `/` | World of Darkness landing (neutral `data-game='wod'` style) |
| `/vampire` | The Vampire book-cover landing (the earlier revamp) |
| `/vault` | All characters across games |
| `/vault/new` | Choose a game before creating a character |
| `/vault/[game]` (+ `/characters`, `/new`, `/dice`) | Each game's dashboard, sheet and dice |
| `/concept`, `/concept/dashboard/*` | Editorial "case files" prototype (kept for reference) |
| `/dashboard/*` | Redirects to `/vault/vampire/*` (next.config.mjs) |

- **Themes = game × mode.** `app/vault/[game]/layout.tsx` sets `data-game` on a wrapper; the mode is `<html data-theme>` (toggle). `app/games.css` holds per-game tokens, fonts (Werewolf: Cinzel; Hunter: Special Elite + Courier Prime), the six `.frame` borders (gothic, neon, leaves, stone, timber, paper & tape) and ambient keyframes. Vampire uses the root tokens. Hunter's light mode ("the inn") is a true light theme; the others stay dark.
- **Ambience:** `app/ui/game/Ambience.tsx`, one backdrop + looping element per game and mode.
- **Same navigation everywhere:** `app/ui/navbar.tsx` (site) and `app/ui/dashboard/sidenav.tsx` (dashboards, with the game switcher); the theme frame comes from `.frame`.
- **Game config:** `app/lib/games.ts` (names, logos, nouns, mode names). Factions: `app/lib/factions.ts`. Sheets per game: `app/ui/sheets/game-sheets.tsx` (Werewolf/Hunter built from `generic.tsx`).
- **Dice:** rules for all three games in `app/lib/dice/rules.ts` (tested cases in git history: Hunger, Rage/Brutal, Desperation/Overreach/Despair). `app/ui/dice/DiceRoller.tsx` takes `game`. 3D dice: `app/ui/dice3d/` (React Three Fiber + three.js): `d10.ts` builds a true pentagonal trapezohedron and per-game face textures from the official glyphs in `public/dice/glyphs/`; `DiceScene.tsx` throws them and lands each on the rolled value. The `react-hooks/immutability` lint rule is disabled in that file because R3F mutates three.js objects in the render loop.
- Werewolf tribe/auspice glyphs: `public/werewolf/*.png` (used as CSS masks). Sample portraits: `public/portraits/`.

## Licensing (Dark Pack)

Elysium uses World of Darkness IP under the [Dark Pack Agreement](https://www.paradoxinteractive.com/games/world-of-darkness/community/dark-pack-agreement). Requirements:
- Show the verbatim copyright notice, a "not official World of Darkness material" notice, and the Dark Pack logo. All three live in `app/lib/dark-pack.ts` and are rendered in both landing page footers; don't paraphrase the notice.
- The rights holder named in the notice is Paradox Interactive AB. White Wolf is Paradox's World of Darkness brand, not a separate rights holder.
- Character generators/apps must stay free: no in-app purchases, paywalls or other monetised transactions. Donations (Patreon, ko-fi) are allowed.
- The official asset pack is linked from the agreement page under "Download free materials". It's extracted (git-ignored, ~490 MB) in `brand-assets/`: VtM clan/sect/discipline/dice symbols and logos, plus ~300 official illustrations (characters, antagonists, locations, scenes). See `brand-assets/README.md`.

## Official SVGs

`app/ui/svgs/official/` holds 57 SVGs generated from the official EPS/AI artwork: 16 clan symbols (incl. Ministry, Salubri, Caitiff, Thin-blood), 14 clan name logos, Camarilla/Anarch/Sabbat symbols and names, 12 discipline badges, 6 dice symbols, the ankh and V5 logos. Import named components from `@/app/ui/svgs/official` (e.g. `ClanBrujah`, `ClanNameBrujah`, `DisciplineAuspex`, `DiceMessyCritical`).
- Shapes use `currentColor`, so style them with `text-*`. White inner details use `var(--knockout, #fff)`; set `--knockout` (e.g. to the background colour) to recolour or "cut out" those details.
- Regenerate with `scripts/convert-brand-svgs.sh` (needs `brew install ghostscript poppler`). Each file's ids are prefixed so inline SVGs don't share clip-path ids; `next.config.mjs` disables svgr's `cleanupIds` to keep them.
- The older hand-sourced SVGs in `app/ui/svgs/` are still used by the hero and dashboard; prefer the official set for new work.

## Tailwind 4 Notes

Migrated from Tailwind 3 → 4 (2026-10-06); the UI was verified layout-identical to v3 on every route. There is no `tailwind.config.ts` — theme customisation lives in `@theme` in `app/globals.css`.

- Use v4 names: `shadow-xs` (was `shadow-sm`), `rounded-xs` (was `rounded-sm`), `outline-hidden` (was `outline-none`), `bg-linear-to-*` (was `bg-gradient-to-*`), `grow`/`shrink`.
- Opacity uses the slash syntax: `bg-black/80`, never `bg-opacity-*` (removed).
- Bare `border` now defaults to `currentColor` — always pair it with a colour (e.g. `border-slate-300/50`).
- Any spacing number is now valid (`h-68`, `w-100`…). In v3 these were silently ignored, so double-check intent before adding them.
- `globals.css` restores two v3 defaults in `@layer base`: pointer cursor on buttons and gray-400 placeholders.
- `hover:` only applies on devices that support hover (no sticky hover on touch).

Remaining `npm audit` advisories are a `braces` DoS inside `eslint-config-next`'s lint-time glob dependency. No patched `braces` exists yet, so there is nothing to override; it never ships to users. Re-check when bumping `eslint-config-next`.

---

## Development Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint check
```

---

## Notes for AI Assistants

- All new code should be TypeScript with strict types.
- Prefer **Server Components** by default; only add `'use client'` when interactivity is needed.
- Prefer **Server Actions** over API routes for mutations.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client bundle.
- Follow the existing Tailwind dark-theme design: `bg-black`, `text-slate-300`, `border-slate-300/50`, hover `bg-rose-600`.
- The VTM character sheet UI is intentionally faithful to the official sheet — don't simplify the field structure.
- `clsx` is already installed; use it for conditional class names.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
