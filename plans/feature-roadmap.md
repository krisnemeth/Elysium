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
- ✅ **Dice graphics improvements** (2026-10-08): the 3D dice now match the official dice art: vector symbols (Werewolf/Hunter traced from the asset pack), placed where the printed faces have them, sharp 768px faces, true colours. A themed 3D tray per game (walnut, stone/slate, ammo crate/canvas) under one warm lamp, with dice bouncing off the walls and each other and coming to rest where they fall; pools capped to the official dice sets. Still open: dice surface texture.
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
- **Open scene work**: darker Hunter cabin, a city concept to replace the inn (light mode dropped), clipboard
  notepaper with aligned lines, the Werewolf cave's light source, new Vampire
  scenes. One scene at a time, checking in after each.
- ✅ Guided creation, second pass: Werewolf breed (required) and patron spirit,
  Hunter "what drives you" and Redemption notes.
- Later: loresheets shared with a chronicle; a true server-generated PDF if browser
  printing isn't enough.
- Storyteller's tones will have to be different, and Players should choose a storyteller identity for the chronicle. these should be varied bots with different styles of storytelling. it helps players pick one, based on a characterized approach.

## Future theme rework (notes, 2026-10-07)

Not scheduled yet. Do one theme at a time and check in after each.

**Guiding rule:** themes are a game-native kind of customisation, but keep the
texture in check so it doesn't feel too "gamey". Ornament lives on frames and
edges only, never inside reading areas or portraits; one strong signature
element per theme, the rest quiet; text panels calm and readable everywhere.
**Decided:** add a "Simple frames" option in Settings to turn ornament down
(also an accessibility win).

**Character card shapes** (each theme its own silhouette, not too on the nose):
- Vampire, Masquerade: Gothic arch (done; richer ornament would come from real
  SVG artwork, e.g. drawn in Figma/Inkscape or commissioned).
- Vampire, Neon Nights: the neon card frame was taken back out (2026-10-07);
  the cards use the original rectangular design again. The neon *sidebar*
  stays exactly as it is ("brilliant"). Revisit the card details later.
- Werewolf, Moonlit forest: a tall oval (a gap in the canopy, a moon on its
  side), with a thin ring showing the auspice's moon phase as a lit arc.
- Werewolf, The cave: a standing stone: tall, slightly tapered, chamfered top
  corners, the tribe glyph at the top like a petroglyph.
- Hunter, The cabin: an evidence bag: portrait behind glossy plastic, a
  red-striped label strip with name, creed and an evidence number.
- Hunter, second theme: **drop the light-mode inn**; it doesn't fit the games.
  Needs a new concept, probably **the city** (streets, rooftops, a stakeout
  car or motel room) for more contrast with the cabin. Card idea to go with it:
  an instant photo with a handwritten-style caption and a strip of tape. (The
  current case files stay available for one of the two.)

**Sidebar textures:**
- Werewolf, Moonlit forest: dark bark grain with a thin moss line, instead of
  the leaf border; let the scene do the talking.
- Werewolf, The cave: keep stone; add a faint carved line and a slight wet
  sheen near the top.
- Hunter, The cabin: darker, rougher plank with nail heads.
- Hunter, second theme (city, replacing the inn): to be designed with the
  new concept, e.g. concrete, rust or a wet street sign rather than wood.

**Tools worth trying:** augmented-ui (CSS cut-corner/neon frames) for Neon
Nights, Rough.js (hand-drawn borders) for Hunter, CSS `border-image` 9-slice
SVGs for ornate rectangular frames. Gothic ornament needs artwork, not a library.

**3D dice** (`app/ui/dice3d/`): improve greatly on the dice's colour intensity
and surface texture. Today they read flat and pale (especially the special
dice). Ideas: richer, more saturated per-game materials (deep blood-red
Hunger dice, ember Rage dice, Desperation dice with a sharper accent);
physically based materials with some roughness and clearcoat; subtle surface
texture (resin swirl, stone grain, worn bone) via normal/roughness maps;
engraved, slightly recessed glyphs that catch the light; better lighting and a
soft environment map so edges and faces read clearly in every theme.

## Images (notes, 2026-10-08)

- **A large housed image library.** Many pictures hosted on the site, largely
  drawn from the official Dark Pack asset pack (`brand-assets/`, ~300
  illustrations: characters, antagonists, locations, scenes), tagged by game
  and kind, so players can give their locations, NPCs and other loresheets an
  image. Check the asset pack's terms for each image we host.
- ✅ **Pick a character portrait from the library** (`app/lib/portrait-library.ts`, the site's own hosted portraits for now), as well as uploading one; both go through the cropper. On the classic sheet the portrait sits at the very end; guided creation ends with a Portrait step. Grow the library from the asset pack next.
- ✅ **Image cropper** (portraits): uploads open a 3:4 frame to drag and zoom
  (wheel, pinch, slider, keyboard) before saving. Later: the card's own frame
  shape (e.g. the arch) as the crop guide, and the same tool for loresheet images.
- **Later:** these images could shape how a chronicle is laid out (scene
  backdrops, location cards, NPC portraits in the story engine; see
  `plans/storyteller-engine.md`).
