# Dark Pack compliance

Elysium uses World of Darkness IP under Paradox Interactive's
[Dark Pack Agreement](https://www.paradoxinteractive.com/games/world-of-darkness/community/dark-pack-agreement).
Read the agreement itself before changing anything listed here. Notes below
were taken from it on 2026-10-07.

## What the agreement says (quoted)

- Licence: "a personal, non-sublicensable, royalty-free, revocable right and
  license to use the World of Darkness IP for types of content listed in this
  policy." Use "is strictly limited to what is deemed reasonable extent."
- "With the exception for artwork, the copying, distributing, or making
  publicly available of any World of Darkness work (such as book) in full is
  never deemed reasonable for the purpose of this Agreement."
- Allowed content includes "Online character generators (including
  downloadable and mobile apps)", "Virtual dice rollers", "Online roleplaying
  games" and "Discord bots, provided that they do not contain verbatim
  quotations from World of Darkness products, including books".
- "These apps must be free; they cannot contain in-app purchases or other
  monetized transactions." Donations (Patreon or similar, sponsorships) are fine.
- "Your use of World of Darkness IP is strictly for non-commercial purposes only."
- Required on the material: the Dark Pack logo, the copyright notice, and a
  notice that it is not official World of Darkness material
  (`app/lib/dark-pack.ts`, rendered in the landing page footers).
- "You may not remove or alter any copyright or trademark notices of World of Darkness."

## How Elysium complies

**The whole app**
- Free. No paywalls, in-app purchases, ads or paid tiers. Donations only.
- Notices and logo stay verbatim on public pages.
- Sheets store the player's own entries. We don't ship rulebook text: no
  power, Discipline, Gift, Edge, clan, tribe or creed descriptions copied from
  the books. Names of traits and factions (game terms) are fine.
- Rules are implemented as mechanics (dice, damage, XP costs) with our own
  wording; the code comments describe them in our own words.

**The Storyteller bot** (`app/lib/storyteller/`)
- Treated like the agreement's bot category: **no verbatim quotations** from
  any World of Darkness product, and no close paraphrase either.
- Every sentence in `content.ts` is original writing for Elysium. When adding
  material, write it fresh; never adapt a passage from a book, sample
  chronicle, novel, game or wiki.
- NPCs are original, built from our own name, want, secret and look tables.
  Never use canon named characters (princes, famous Kindred, Garou or hunters).
- Places are fictional districts and generic locations, not canon locations.
- Allowed: game terms (Kindred, Hunger, Rage, Desperation, Masquerade, clan,
  tribe and creed names) and short dice-pool suggestions such as
  "Wits + Awareness, difficulty 3".
- Procedural, not an AI model: an LLM can reproduce book text verbatim, and
  running one would cost money the app can't charge for. Every possible output
  comes from tables we wrote and can review.
- Content stays a small set of tables (reasonable extent), never a reproduction
  of a published adventure.

## Before shipping new content

1. Is every sentence our own? If it came from a book, a PDF, a wiki or memory
   of one, rewrite it from scratch or drop it.
2. Are all named characters and places original?
3. Is it free for everyone, with no paid gate?
4. Are the notices and logo still in place?
