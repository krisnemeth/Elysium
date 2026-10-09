# Elysium — CLAUDE.md

## Project Overview

**Elysium** is a free, cross-game character vault for the World of Darkness 5th editions: **Vampire: The Masquerade**, **Werewolf: The Apocalypse** and **Hunter: The Reckoning**. Players keep character sheets and loresheets, play at the table (damage, dice, XP), and run chronicles with friends, led by a Storyteller or the Storyteller bot. Each game has its own themed dashboard with two scenes.

- Developer: Krisztian Nemeth — https://krisnemeth.dev
- Repo: `krisnemeth/elysium`
- Dev branch: `main` (the multi-game World of Darkness vault). Feature work happens on branches; the user approves merges into `main`.
- `legacy`: a frozen backup of the original 2023/24 Vampire-only app (as of 2026-10-07, after the Next 16 / Tailwind 4 / Node 24 upgrades). Never delete, rewrite or merge into it; it's protected on GitHub against deletion and force-pushes.
- Roadmap and status: `plans/feature-roadmap.md` (also `plans/storyteller-engine.md`, `plans/dark-pack-compliance.md`).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.3.8 (App Router, Turbopack) + React 19 |
| Language | TypeScript 5.9 (strict) |
| Styling | Tailwind CSS 4 (CSS-first config in `app/globals.css`; per-game themes in `app/games.css`) |
| Database, auth, storage, realtime | **Supabase** (`@supabase/ssr`, migrations in `supabase/migrations/`, CLI linked to project "Elysium") |
| 3D dice | three.js via React Three Fiber (`app/ui/dice3d/`) |
| Icons | react-icons (game-icons `Gi*` for navigation, Material `Md*` for UI) |
| SVG components | @svgr/webpack via `turbopack.rules` |
| Linting | ESLint 9 flat config (`eslint.config.mjs`) |
| Hosting | Vercel (Node 24) |

---

## Directory Structure (main parts)

```
app/
├── page.tsx, vampire/        # Landing pages (World of Darkness, Vampire book cover)
├── login/, signup/, auth/    # Accounts (Supabase Auth)
├── vault/
│   ├── page.tsx              # All characters across games
│   ├── new/                  # Choose a game
│   ├── [game]/               # Each game's dashboard (sidebar layout, data-game theme)
│   │   ├── characters/       # Coterie / Pack / Cell, + [id] view, edit, play
│   │   ├── new/              # Guided or Classic character (new/guided, new/classic)
│   │   ├── loresheets/       # Loresheets list and editor
│   │   ├── dice/, settings/, friends/
│   ├── chronicles/           # Chronicles (own layout; to be reworked)
│   └── print/[id]/           # Printable A4 sheet
├── media/portraits/          # Serves private portrait uploads
├── lib/                      # actions/, data/, supabase/, sheets/, creation/, xp/, play/, dice/, storyteller/, starters/
└── ui/                       # kit/, sheets/, play/, dice/, dice3d/, game/, dashboard/, chronicles/, guided/, loresheets/, social/, characters/
supabase/migrations/          # Schema, RLS, RPCs (pushed with `supabase db push`)
scripts/build-starters.mts    # Validates starter characters, writes their migration
plans/                        # Roadmap and design notes
```

---

## Routes

| Path | Purpose |
|---|---|
| `/` | World of Darkness landing (neutral `data-game='wod'` style) |
| `/vampire` | The Vampire book-cover landing |
| `/login`, `/signup`, `/auth/*` | Accounts |
| `/vault` | All your characters across games |
| `/vault/new` | Choose a game before creating a character |
| `/vault/[game]` | Dashboard (overview) |
| `/vault/[game]/characters` (+ `/[id]`, `/[id]/edit`, `/[id]/play`) | Coterie/Pack/Cell, sheet view, editor, play mode |
| `/vault/[game]/new` (+ `/guided`, `/classic`) | New character |
| `/vault/[game]/loresheets` (+ `/[id]`) | Loresheets |
| `/vault/[game]/dice`, `/settings`, `/friends` | Dice roller, Settings, Friends (`/vault/settings` and `/vault/friends` redirect) |
| `/vault/chronicles` (+ `/[id]`, `/[id]/characters/[characterId]`) | Chronicles, a Storyteller's read-only view of players' sheets |
| `/vault/print/[id]` | Printable sheet |
| `/concept`, `/concept/dashboard/*` | Editorial "case files" prototype (kept for reference) |
| `/dashboard/*` | Redirects to `/vault/vampire/*` |

---

## Domain

5th edition rules for all three games:
- **Vampire:** clans (incl. Ministry, Salubri, Caitiff, Thin-blood), Disciplines, predator types, Hunger, Humanity and Stains, Blood Potency, Bane.
- **Werewolf:** tribes, auspices, breed, Renown, Gifts and Rites, Rage, Harano, Hauglosk, patron spirit.
- **Hunter:** creeds, Drives, Edges and Perks, Desperation, Danger, Despair.
- Shared: Attributes, Skills with specialties, Health/Willpower (Superficial and Aggravated damage), advantages and flaws, convictions and touchstones, XP.
- **Loresheets** here are the player's own write-ups of a location, a player character or an NPC (not the rulebook mechanic).

---

## Environment Variables

```env
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
```

Supabase is only called on the server (Server Components, Server Actions, `proxy.ts`), so these have no `NEXT_PUBLIC_` prefix; Vercel won't save a Sensitive variable with that prefix. `app/lib/supabase/env.ts` also accepts the `NEXT_PUBLIC_` names. Locally they're in `.env.local`; on Vercel, under the project's environment variables (Production, Preview, Development). No secret / service-role key is used.

---

## Design System

- **Themes = game × scene**: each game has two scenes (dark/light on `<html data-theme>`), chosen from the **Themes** item in the sidebar. See "Games, themes and routes".
- **Fonts**: Cormorant (display) and Josefin Sans (body); Werewolf uses Cinzel; Hunter uses Special Elite + Courier Prime.
- **Surfaces**: `panel` from `app/ui/kit/styles.ts` (glass panels), `.frame` for each theme's border, `bone`/`ink`/`accent` colour tokens.
- **Ornament** lives on frames and edges only, never over reading areas or portraits; Settings → Simple frames turns it down (`data-frames='simple'`).
- **Motion**: easing tokens in `globals.css`; theme switches crossfade (View Transitions); menus use the "island" pattern (`app/ui/kit/Island.tsx`); everything respects `prefers-reduced-motion`.
- **Custom breakpoint**: `3xl` at 1600px (`--breakpoint-3xl` in `@theme`).

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

- `/` (`app/page.tsx`): the World of Darkness landing: three games side by side, then sections #worlds, #atmospheres and #dice (the navbar dots follow them), each over a location illustration from the asset pack (`public/locations/`, `app/ui/home/SectionBackdrop.tsx`).
- **Site pages are dark only** (landing, `/vampire`, `/vault`, `/vault/new`, chronicles, login/signup/auth, 404): no theme switch in the site navbar; `DARK_ONLY_PATHS` in `app/lib/theme.ts` handles first loads and `app/ui/ForceDark.tsx` in-app navigation, without touching the player's saved theme (which the dashboards use).
- `/vampire`: the book-cover hero (`app/ui/home/Hero.tsx`). The portrait and ankh are sized from one `--cover` width so the ankh halo stays behind the portrait at every viewport; the ankh rises on scroll because the backdrop/portrait layers are sticky. Swap cover art via `COVER_ART` in `Hero.tsx`.
- `/concept`: experimental editorial redesign, kept for reference.
- Scroll-driven effects use CSS `animation-timeline` in `globals.css`, with a static fallback and `prefers-reduced-motion` respected.

## App UI (dashboard)

- Shell: `app/vault/[game]/layout.tsx` (ambient backdrop + `ui/dashboard/sidenav.tsx`: glass sidebar on desktop; on phones a top bar that grows into a menu, `PhoneIsland.tsx`, plus a bottom tab bar).
- Shared kit in `app/ui/kit/`: `styles.ts` (panel, buttons, field classes), `PageHeader`, `Stagger` (cascading entrance), `DotRating` (V5 dot/box ratings, keyboard slider). Themes: `app/ui/dashboard/ThemePicker.tsx` (sidebar, grows in place; also in the phone menu); every switch goes through `switchTheme` in `app/lib/theme-switch.ts` (View Transition crossfade). Theme script: `app/lib/theme.ts`. Island menus: `app/ui/kit/Island.tsx`.
- Character sheets: one `Sheet` object (`app/lib/sheets/types.ts`) held by `app/ui/sheets/CharacterEditor.tsx`, which autosaves it (900 ms debounce) through the server actions in `app/lib/actions/characters.ts`. Sections (`app/ui/sheets/sections/`) read and write it via `useSheet()` / `useSheetFields()` from `SheetContext.tsx`; per-game section lists are in `game-sheets.tsx`. Inputs are in `fields.tsx`.
- Characters live in Supabase (`public.characters`, RLS: owner only); reads go through `app/lib/data/characters.ts`. New accounts get copies of the 9 starters (`app/lib/starters/`, validated and turned into a migration by `node scripts/build-starters.mts <file>`).
- Saving: `app/ui/sheets/useCharacterSave.ts` (autosave hook) and `SaveStatus.tsx`, shared by the editor and play mode.
- Play mode: `app/vault/[game]/characters/[id]/play` → `app/ui/play/PlaySheet.tsx` (tracks in `app/ui/play/tracks.tsx`). Damage rules are pure functions in `app/lib/play/damage.ts`; play state lives on the sheet (`damage`, `stains`, `despair`). `DiceRoller` is uncontrolled on the dice page and bound to the sheet in play mode (`pool`, `special`, `danger`, `despair`, `onWillpowerReroll`).
- XP: `sheet.xp` entries; costs and the in-clan Discipline table in `app/lib/xp/costs.ts`; UI in `app/ui/sheets/sections/experience.tsx`. Only costs we're sure of are priced; anything else takes a player-entered cost.
- Portraits: uploads go to the private `portraits` bucket at `<user>/<character>/<uuid>.webp` (policies in the migration limit each user to their own folder) and are served by `app/media/portraits/[...path]/route.ts` with the user's session. `app/ui/characters/PortraitPicker.tsx` crops to 3:4 and resizes to 900×1200 in the browser first; `setPortrait`/`removePortrait` are in `app/lib/actions/characters.ts`. Uploaded portraits render with `unoptimized` (see `Character.image`).
- Social (Group 3): `/vault/[game]/friends`, `/vault/chronicles`, `/vault/chronicles/[id]`. Tables `friendships`, `chronicles`, `chronicle_members`, `chronicle_rolls`, `chronicle_notes` (migration `…_friends_and_chronicles.sql`); cross-table checks go through security-definer helpers (`is_chronicle_member`, `chronicle_role`, `storyteller_can_read`, `in_same_chronicle`) and lookups of other users through RPCs (`send_friend_request`, `create_chronicle`, `invite_to_chronicle`, `chronicle_party`, `cast_vote`, `call_vote`). Data in `app/lib/data/social.ts`, actions in `app/lib/actions/social.ts`, UI in `app/ui/social/` and `app/ui/chronicles/`.
- Chronicle table (`/vault/chronicles/[id]`, `app/ui/chronicles/TableShell.tsx` + `table.tsx`): a self-contained game mode with no site navbar. From lg up it fills the screen (`p-2`, no page scroll): two wide full-height sidebars (18rem, 22rem from xl): the character on the left (`PlayTable`: the faction's official mark, the name and the clan wordmark (the portrait is on the turn card), Health and Willpower from the rules (`app/lib/sheets/derived.ts`: Stamina + 3, Composure + Resolve) and the game's Hunger/Rage/Desperation, autosaved; the full sheet opens editable in a dialog, `SheetDialog.tsx`, on the same sheet state), the dice (`app/ui/play/PoolRoller.tsx`, shared with play mode) and the roll log on the right (each die drawn as its official face; colours and symbols in `app/lib/dice/faces.ts`, shared with the 3D dice). Between them: the game's own bar (`GameBar.tsx`: the chronicle's name, its kind and storyteller ("Bot" or a name), the theme island and the way out; container queries keep the title first), the story/notes/party tabs (on darker glass, `.story-panel`) with the vote pinned under them, and the turn tracker. Below lg one column shows at a time (Character · Table · Dice tabs). The `short:` variant (max-height 860px) slims things for short laptops.
- Table skins: the game bar's theme island offers all six scenes for the table (`app/lib/table-skin.ts`, `TableSkin.tsx`, cookie `elysium-table-skin`, default the chronicle's game in dark). `[data-skin='<game>-<mode>']` on the table's `<main>` sets only accent, ink and bone, and frames the two sidebars (`.skin-frame`, added to each frame rule's selector list in `app/games.css`); the chronicle's game keeps its fonts and dice. The game bar itself is unframed.
- Backdrop: each act of a bot story has its own location (official Dark Pack art in `public/acts/`: hook, dig, twist, clash, after), crossfading when the act changes (`ActBackdrop.tsx`); `.chronicle-table` in `app/games.css` lightens the panels' glass so it shows through.
- Leaving: playing alone, "Pause and exit" saves and leaves (turns never time out alone). With others, "Leave the game" asks in a dialog; `leave_chronicle` sets the member's status to `left` (keeping their character; a creator hands the chronicle to the next member). Only a re-invite brings them back (`guard_rejoin` trigger), with the same character. Migration `…_leave_and_rejoin.sql`.
- Turns (`app/ui/chronicles/turns.tsx`, table `chronicle_turns`, RPCs `pass_turn`/`give_turn`, migration `…_chronicle_turns.sql`): joined players with a character take turns in join order; the current card rises. A Storyteller (person) gives the turn by clicking a card. With the bot and two or more players, turns start by themselves, last `seconds` (default 120) with a fuse that glows in the last 20 s, and any open page passes an expired turn on; the server's clock decides. Only the turn holder can roll in bot chronicles (`useRollLock`). Seats update live (`chronicle_members` is in the Realtime publication).
- Characters RLS lets Storytellers read players' sheets, so `getCharacters`/`getCharacter` filter by owner; use `getSharedCharacter` only for the chronicle view.
- Live updates: `app/lib/supabase/browser.ts` `subscribe()` loads the session and calls `realtime.setAuth` before joining (otherwise RLS sends nothing). The server passes the URL and publishable key down.
- Storyteller bot: `app/lib/storyteller/` (content tables + seeded generator). **Dark Pack: all bot text must be original writing; no quotes or paraphrase of books, no canon named characters.** Read `plans/dark-pack-compliance.md` before adding content.
- Group 4: `/vault/[game]/new` offers Guided (`/new/guided`) or Classic (`/new/classic`); loresheets are created from the Loresheets page (one "New loresheet" menu). Guided creation: `app/ui/guided/GuidedCreation.tsx` (client-only via `GuidedLoader`, draft in sessionStorage) on the rules in `app/lib/creation/rules.ts` (keep the numbers in step with `scripts/build-starters.mts`). Loresheets: `public.loresheets`, `app/lib/loresheets.ts` (field specs), editor `app/ui/loresheets/LoresheetEditor.tsx`. Preferences: `profiles.preferences` → `PreferencesProvider` in `app/vault/[game]/layout.tsx`; tooltips via `app/ui/sheets/Explain.tsx` + `app/lib/sheets/glossary.ts` (our own wording, Dark Pack). Printable sheet: `/vault/print/[id]`.
- Don't run Prettier on this repo: there's no config, and its defaults rewrite the house style (single JSX quotes, long lines).
- Sample data (landing and `/concept` only): `app/lib/sample-characters.ts`; clan → official symbol/name logo: `app/lib/clans.ts`.
- Dice roller: `/vault/[game]/dice` (`app/ui/dice/DiceRoller.tsx`) on the rules in `app/lib/dice/rules.ts`. Includes rouse/Rage checks and Willpower rerolls. A roll marked as using the blood (Vampire) or a Gift/shift (Werewolf) stays locked until its check is made; ordinary rolls need none. A failed rouse adds a Hunger die, a failed Rage check removes a Rage die (W5). `compact` (the chronicle table's dice column) is one column with no panel of its own, small steppers, a portrait tray (`DiceScene` `portrait`) that grows to fill the column, and no history; `locked` disables Roll with a reason.
- Motion keyframes and easing tokens (`--ease-spring`, `--ease-out-expo`) are in `globals.css`; all motion is disabled under `prefers-reduced-motion`.

## Games, themes and routes

Elysium is a cross-game vault for Vampire: The Masquerade, Werewolf: The Apocalypse and Hunter: The Reckoning (5th editions).

| Route | What |
|---|---|
| `/` | World of Darkness landing (neutral `data-game='wod'` style) |
| `/vampire` | The Vampire book-cover landing (the earlier revamp) |
| `/vault` | All characters across games |
| `/vault/new` | Choose a game before creating a character |
| `/vault/[game]` (+ `/characters`, `/new`, `/loresheets`, `/dice`, `/settings`, `/friends`) | Each game's dashboard and pages |
| `/concept`, `/concept/dashboard/*` | Editorial "case files" prototype (kept for reference) |
| `/dashboard/*` | Redirects to `/vault/vampire/*` (next.config.mjs) |

- **Themes = game × mode.** `app/vault/[game]/layout.tsx` sets `data-game` on a wrapper; the mode is `<html data-theme>` (toggle). `app/games.css` holds per-game tokens, fonts (Werewolf: Cinzel; Hunter: Special Elite + Courier Prime), the six `.frame` borders (gothic, neon, leaves, stone, timber, paper & tape) and ambient keyframes. Vampire uses the root tokens. Hunter's light mode ("the inn") is a true light theme and is being replaced by a city concept (roadmap); the others stay dark.
- **Ambience:** `app/ui/game/Ambience.tsx`, one backdrop + looping element per game and mode.
- **Navigation:** `app/ui/navbar.tsx` → `app/ui/SiteIsland.tsx` (site pages: links on the right, phone menu, section dots; no theme switch) and `app/ui/dashboard/sidenav.tsx` (dashboards: game switcher, nav items, Chronicles, Themes, Settings, Friends, Log out); the theme frame comes from `.frame`.
- **Game config:** `app/lib/games.ts` (names, logos, nouns, mode names). Factions: `app/lib/factions.ts`. Sheets per game: `app/ui/sheets/game-sheets.tsx` (sections in `app/ui/sheets/sections/`).
- **Dice:** rules for all three games in `app/lib/dice/rules.ts` (tested cases in git history: Hunger, Rage/Brutal, Desperation/Overreach/Despair). `app/ui/dice/DiceRoller.tsx` takes `game`. 3D dice: `app/ui/dice3d/` (React Three Fiber + three.js): `d10.ts` builds a true pentagonal trapezohedron and per-game face textures from the official glyphs in `public/dice/glyphs/`; `DiceScene.tsx` throws them into a per-game tray (`Tray.tsx`, procedural textures in `tray-look.ts`: walnut, stone and slate, ammo crate and canvas), lit by one warm lamp. `throw.ts` simulates each throw up front (floor, walls, dice knocking each other, friction, rolling spin), each die until it stops (capped by `MAX_THROW_SECONDS`), and the scene reports the end through `onSettled`; dice stay where they fall, and the rolled value is reached by offsetting each die's orientation once (`landing`), not by steering it. Before a roll the dice wait in rows. `timing.ts` is shared with the roller. Dice-set limits (pool and special dice per game) are `DICE_SET` in `app/lib/dice/rules.ts`. Symbols are vector SVGs placed by `GLYPH_BOX` (measured from the official dice art) and colours are sampled from it (`DICE_STYLES`). Faces glow a little (emissive map) so colours read true; the studio environment's strength is `scene.environmentIntensity` (three.js ignores a material's `envMapIntensity` when lighting comes from `scene.environment`). The `react-hooks/immutability` lint rule is disabled in that file because R3F mutates three.js objects in the render loop.
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
- Never expose a Supabase secret/service-role key to the client; the app only uses the publishable key, server-side.
- Use the theme tokens (`bg-ink`, `text-bone`, `accent`, `panel`, `.frame`) rather than fixed colours, so every game and scene works.
- The character sheets stay faithful to the official sheets' structure — don't simplify the fields.
- `clsx` is installed; use it for conditional class names.
- Game text and generated content must follow `plans/dark-pack-compliance.md` (original wording, no quoted book text).
- Don't run Prettier (see above). Check work with `npx tsc --noEmit`, `npm run lint` and `npm run build`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
