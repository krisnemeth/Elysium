# Ticket sweep (2026-10-15)

Integration branch: `ticket-sweep` (off `main` at 39bac6d). Each workstream is built
on its own branch `sweep/<slug>` in a separate worktree, then merged into
`ticket-sweep`. Nothing reaches `main` without your approval.

Tickets are mirrored in Linear (THI-xx) and GitHub (#xx).

## Wave 1 (parallel)

| Slug | Ticket(s) | Scope | Notes |
|---|---|---|---|
| `dice-texture` | THI-31 / #32 | Surface texture (normal/roughness maps), engraved glyphs in `app/ui/dice3d/` | Colours stay true, symbols readable |
| `loresheet-sharing` | THI-32 / #33 | Share a loresheet with a chronicle, read-only for members | New migration + RLS; needs `supabase db push` |
| `images` | THI-29 / #30, THI-30 / #31 | Tagged image library (from art already in `public/`), loresheet images, cropper with each theme's card shape as the guide | `brand-assets/` isn't in the cloud checkout, so the library grows from it later; migration for loresheet images |
| `hunter-themes` | THI-23 / #24, THI-24 / #25 | City theme replaces the inn; cabin rework (darker scene, notepaper lines, plank sidebar, evidence-bag card) | Built to screenshot stage for your check-in |
| `werewolf-themes` | THI-25 / #26 | Moonlit forest (oval card, moon-phase ring, bark sidebar); cave (light source, standing-stone card, carved sidebar) | Screenshot check-in |
| `vampire-themes` | THI-26 / #27 | New Vampire scenes; Neon Nights card details | Arch ornament artwork needs real SVG art: left for you |
| `storyteller-personas` | THI-22 / #23 | Bot personas with distinct styles; the tone picker becomes part of the identity | Built on the current generator so it carries over to the story engine |
| `landing-concept` | THI-37 / #39 | Concept only: a mocked cinematic first screen + moodboard notes | Per the ticket: check in before building it out |
| `engine-brief` | THI-21 / #22 | A brief for the design talk: the open questions with options and a recommendation each | The talk itself is yours; no engine code until it's had |

## Not for agents

- THI-27 / #28 Google and Discord sign-in, THI-28 / #29 SMTP, redirect URLs, Preview env vars: Supabase and Vercel dashboard settings.
- THI-33 / #34 Server PDF: waits until browser printing proves insufficient.
- THI-36 / #38 Copy review: touches every page, so it runs last (wave 2) on top of the merged work.

## Wave 2 (next session)

- Copy review (#38) over the merged branch.
- Follow-ups from your check-ins on the theme screenshots and the landing concept.
- Story engine phase 1 once the design talk has happened.
