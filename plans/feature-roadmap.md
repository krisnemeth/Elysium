# Elysium feature roadmap

Agreed 2026-10-07. Everything must stay free (Dark Pack Agreement: no paywalls,
in-app purchases or ads; donations are fine).

## Group 1 — Make it real

The app was front-end only with sample data. This group makes characters persist.

1. ✅ **Accounts** — Supabase Auth: sign up, log in, log out. `/vault/**` is
   protected via `proxy.ts` (Next.js 16's replacement for `middleware.ts`).
2. ✅ **Saving characters** — one `characters` table for all three games:
   shared columns (owner, game, name, faction, portrait, status, timestamps)
   plus a `sheet` JSONB column holding the game-specific data, so Vampire,
   Werewolf and Hunter sheets don't need separate tables. Row-level security:
   users only ever see their own rows.
3. ✅ **Character pages** — a read-only character view, plus edit and delete,
   wired to the existing cards and lists (replacing the sample data). Empty
   dashboards invite you to create your first character.
4. ✅ **Autosave** — sheets save as you type (debounced Server Action), with a
   visible "saved" state; new characters start as drafts.
5. ✅ **Starter characters** — every new account gets 3 per game (Trixx, Blake,
   Claire; Grey-Fang, Rosa, Old Tom; Dez, Father Ruiz, Vesna), built to the
   5th-edition creation rules with full backstories.
6. ✅ **Character image upload** — players upload their own portrait (Supabase
   Storage, private per user), replacing the default game figure.
7. **Later setup:** Google and Discord sign-in (OAuth apps in the Supabase
   dashboard; the buttons are already in place), custom SMTP for auth emails,
   production redirect URLs, Supabase env vars on Vercel.

## Group 2 — Play at the table

- **Play mode**: a compact, phone-first view for marking damage, Hunger, Rage,
  Desperation and Willpower mid-session.
- **Dice from the sheet**: pick e.g. Strength + Brawl to build the pool; the
  game's special dice come from the current tracker value.
- **Dice graphics improvements**: perfect the dice graphics to match the real dice as close as possible. Explore the idea of dice tray backgrounds in 3D. 
- **XP log**: record spends, with costs worked out from the rules.

## Group 3 — Friends, groups and Storytellers

- ✅ **Friends** (`/vault/friends`): add people by an 8-character friend code
  (nobody can be searched for), accept or decline requests, set your display name.
- ✅ **Chronicles** (`/vault/chronicles`): a play group with a main game, led by
  a Storyteller account or the Storyteller bot. Invite friends, join, and bring
  one of your characters (from any game).
- ✅ **Storyteller access**: the Storyteller reads the sheets players bring,
  read-only (`/vault/chronicles/[id]/characters/[characterId]`).
- ✅ **Storyteller bot**: pick a tone and a setting; the bot builds a five-act
  story with original NPCs from all three games (plus a mortal), suggested
  rolls and game pressure. Any member chooses how the group proceeds; the
  narration goes into the session log. Original writing only, see
  `plans/dark-pack-compliance.md`.
- ✅ **Shared dice log**: rolls made in play mode can be shared to a chronicle
  and appear live for everyone (Supabase Realtime).
- ✅ **Notes and session log**: shared notes, session entries and private notes
  (visible to the author and the Storyteller).
- ✅ **Voting**: every player votes on the bot's options (live tallies); the
  story moves on when everyone has voted or the creator ends the vote.
- ✅ **Scenes and clues**: each act is a scene at a described location; searching
  turns up clues, and NPCs only appear once a clue reveals them.
- ✅ **At the table**: your character's card (key roll values, full sheet in a
  dialog), condition tracking and dice on the chronicle page; a dice roller for
  the Storyteller.
- Next: the story engine proposal in `plans/storyteller-engine.md`.

## Group 4 — Story and polish

- ✅ **New sheet** (`/vault/[game]/new`) offers a character (Guided or Classic)
  or a loresheet (Location, Player character or NPC).
- ✅ **Loresheets** (`/vault/[game]/loresheets`): the player's own write-ups,
  autosaved; a PC loresheet can link to one of your characters. Shown on the
  Vampire dashboard.
- ✅ **Guided creation** (`/vault/[game]/new/guided`): one step per screen (fits
  without scrolling on tablet and desktop), short tutorials, and gated progress
  with friendly "almost there" alerts. Finishing creates the character and
  lands on the classic sheet, filled in. Rules in `app/lib/creation/rules.ts`.
- ✅ **Sheet tooltips**: hover or tab to a trait's name for a plain-language
  explanation (`app/lib/sheets/glossary.ts`, our own wording).
- ✅ **Settings** (`/vault/settings`): display name, tooltips and guided tips on/off.
- ✅ **PDF**: a printable A4 sheet (`/vault/print/[id]`), saved as PDF from the
  browser's print dialog. Our own layout with the game logo, not a copy of the
  official sheet.
- **Open scene work**: darker Hunter cabin, candlelit attic inn, clipboard
  notepaper with aligned lines, the Werewolf cave's light source, new Vampire
  scenes. One scene at a time, checking in after each.
- Later: loresheets shared with a chronicle; Werewolf breed and Hunter
  specifics in guided creation; a true server-generated PDF if browser
  printing isn't enough.
- Storyteller's tones will have to be different, and Players should choose a storyteller identity for the chronicle. these should be varied bots with different styles of storytelling. it helps players pick one, based on a characterized approach.
