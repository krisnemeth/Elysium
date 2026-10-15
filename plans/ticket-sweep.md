# Ticket sweep (2026-10-15)

Every ticket was built on its own branch `sweep/<slug>`, off `main` at 39bac6d,
and pushed to GitHub. `ticket-sweep` is only a combined preview with everything
merged in; it is not meant to be merged as a whole. Review ticket by ticket and
take what you want: merge the ticket's branch, then cherry-pick its follow-up
commits listed below (they live on shared fix branches).

Tickets are mirrored in Linear (THI-xx) and GitHub (#xx).

## Per ticket

| Ticket | Branch | Follow-up commits to cherry-pick | Migration (needs `supabase db push`) | Status |
|---|---|---|---|---|
| #32 / THI-31 Dice surface texture | `sweep/dice-texture` | 41a305f, 461ba50 (`sweep/minor-fixes`) | none | Built |
| #33 / THI-32 Share loresheets with a chronicle | `sweep/loresheet-sharing` | f3ef32b (`sweep/minor-fixes`) | `20261015120000_shared_loresheets.sql` | Built |
| #30 / THI-29 Image library + #31 / THI-30 Cropper and loresheet images | `sweep/images` | d4f8db1 (`sweep/minor-fixes`), 3b3ae1d (`sweep/review-fixes`) | `20261015100000_loresheet_images.sql` | Built |
| #33 + #30/#31 together: shared loresheet images, live Lore tab | `sweep/lore-integration` (ffdeed3; needs both branches above) | | `20261015130000_shared_lore_images.sql` | Built |
| #23 / THI-22 Storyteller personas | `sweep/storyteller-personas` | ceb9e80 (migration renamed to `…121000`, the original clashed with `…120000`), b6d9500 (`sweep/review-fixes`) | `20261015121000_storyteller_personas.sql` | Built |
| #22 / THI-21 Story engine: design talk | `sweep/engine-brief` | | | Brief for the talk: `plans/storyteller-engine-brief.md` |
| #39 / THI-37 Landing page | `sweep/landing-concept` | | | Concept only, at `/concept/landing` (A) and `/concept/landing/b` (B); `/` untouched |
| #27 / THI-26 Vampire scenes, Neon Nights cards | `sweep/vampire-themes` | | | Screenshot check-in; not in `ticket-sweep` |
| #26 / THI-25 Werewolf forest and cave | `sweep/werewolf-themes` | | | Screenshot check-in; not in `ticket-sweep` |
| #24 / THI-23 Hunter city, #25 / THI-24 Hunter cabin | `sweep/hunter-themes` | | | Screenshot check-in; not in `ticket-sweep` |
| #38 / THI-36 Copy review | `sweep/copy-review` | | | In progress (built on top of `ticket-sweep`) |

Other branches:
- `sweep/docs`: `CLAUDE.md` and roadmap updates for the built tickets (built on `ticket-sweep`; easiest to redo after you've picked).
- `sweep/review-fixes`, `sweep/minor-fixes`: the follow-up fixes above, from a review of the combined branch.

## Not done by agents

- THI-27 / #28 Google and Discord sign-in, THI-28 / #29 SMTP, redirect URLs, Preview env vars: Supabase and Vercel dashboard settings.
- THI-33 / #34 Server PDF: waits until browser printing proves insufficient.
