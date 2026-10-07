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
6. **Character image upload** — players upload their own portrait (Supabase
   Storage, private per user), replacing the default game figure.
7. **Later setup:** Google and Discord sign-in (OAuth apps in the Supabase
   dashboard; the buttons are already in place), custom SMTP for auth emails,
   production redirect URLs, Supabase env vars on Vercel.

## Group 2 — Play at the table

- **Play mode**: a compact, phone-first view for marking damage, Hunger, Rage,
  Desperation and Willpower mid-session.
- **Dice from the sheet**: pick e.g. Strength + Brawl to build the pool; the
  game's special dice come from the current tracker value.
- **XP log**: record spends, with costs worked out from the rules.

## Group 3 — Friends, groups and Storytellers

- **Friends**: players find and connect with each other inside the app.
- **Sessions**: friends start a session together, led either by a Storyteller
  account or by the Storyteller bot.
- **Storyteller bot**: leads the group through a story arc. The players make a
  few choices up front; the rest is randomly generated. Every arc includes NPCs
  from all three games, as most VtM chronicles do anyway.
- Shared coteries / packs / cells; the Storyteller sees everyone's sheets.
- Shared dice log: rolls appear live for the group.
- Chronicle notes and a session log.

## Group 4 — Story and polish

- **Loresheets** (backstory pages, currently stubbed). Choosing "new sheet"
  offers a character sheet or a loresheet; a loresheet then asks whether it's
  for a location, a PC or an NPC.
- **Two ways to make a character**:
  - *Classic*: the current sheet, the paper character sheet digitised.
  - *Guided*: a stepped, beginner-friendly flow with tutorials, tooltips and
    hints. Each step is a page with no vertical scroll. Progress is gated:
    you can't move on until the step is filled in properly, and friendly
    alerts explain what's missing. Finishing the steps lands you on the
    classic sheet, fully filled in.
- **Sheet tooltips**: on the classic sheet, hovering anything explains it,
  unless turned off.
- **Profile / settings page**: tooltips and guidance on/off (and other
  preferences as they come up).
- **PDF export** of a sheet that looks like the official printed one.
- **Open scene work**: darker Hunter cabin, candlelit attic inn, clipboard
  notepaper with aligned lines, the Werewolf cave's light source, new Vampire
  scenes. One scene at a time, checking in after each.
