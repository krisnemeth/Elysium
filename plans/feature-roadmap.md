# Elysium feature roadmap

Agreed 2026-10-07. Everything must stay free (Dark Pack Agreement: no paywalls,
in-app purchases or ads; donations are fine).

## Group 1 — Make it real (in progress)

The app is front-end only with sample data. This group makes characters persist.

1. **Accounts** — Supabase Auth: sign up, log in, log out. `/vault/**` is
   protected via `proxy.ts` (Next.js 16's replacement for `middleware.ts`).
2. **Saving characters** — one `characters` table for all three games:
   shared columns (owner, game, name, faction, portrait, status, timestamps)
   plus a `sheet` JSONB column holding the game-specific data, so Vampire,
   Werewolf and Hunter sheets don't need separate tables. Row-level security:
   users only ever see their own rows.
3. **Character pages** — a read-only character view, plus edit and delete,
   wired to the existing cards and lists (replacing the sample data).
4. **Autosave** — sheets save as you type (debounced Server Action), with a
   visible "saved" state; new characters start as drafts.

Open setup step: a Supabase project (URL + anon key). Either create one at
supabase.com or add Supabase through the Vercel Marketplace, which also sets
the environment variables on Vercel.

## Group 2 — Play at the table

- **Play mode**: a compact, phone-first view for marking damage, Hunger, Rage,
  Desperation and Willpower mid-session.
- **Dice from the sheet**: pick e.g. Strength + Brawl to build the pool; the
  game's special dice come from the current tracker value.
- **XP log**: record spends, with costs worked out from the rules.

## Group 3 — Groups and Storytellers

- Shared coteries / packs / cells; the Storyteller sees everyone's sheets.
- Shared dice log: rolls appear live for the group.
- Chronicle notes and a session log.

## Group 4 — Story and polish

- **Loresheets** (backstory pages, currently stubbed).
- **PDF export** of a sheet that looks like the official printed one.
- **Guided character creation**: step-by-step choices (clan, predator type,
  Gifts, Edges) with the rules explained along the way.
- **Open scene work**: darker Hunter cabin, candlelit attic inn, clipboard
  notepaper with aligned lines, the Werewolf cave's light source, new Vampire
  scenes. One scene at a time, checking in after each.

Lore sheets as a feature
when clicking sheets, user should get offered a choice of new char sheet or lore sheet. if lore sheet, then is it for location or PC or NPC.
character sheets should have two appraches. the current, which is kind of the classic way digitized, almost like filling the paper-based char sheet. I'd like a stepped, guided beginner friendly approach, where new players are encouraged and guided through the process, with tutorials, tooltips, hints, and gated progress (meaning until they fill stuff in properly they can't progress, but friendly alerts should let them know). the stepped way would be pages without vertical scroll. then once the steps are all completed, they wuld essentially land on the classic sheet, but all filled in now. Once landing on the classic sheet, there should be tooltip explanation for everything hovered, unless turned off. They should be able to adjust these settings on their profile/setting page.
Character image upload
Storyteller bot
We'll need friends inside the app, so players can connect with each other, and start a session either with a storyteller account in the lead, or with the Storyteller bot that will lead them through a chosen story arc that is built with a few choices, but then random-generated. These always include NPCs from all 3 games, as most VTM sessions do anyway.

