# Voice and terms

The copy review (GitHub #38 / THI-36) in one page: how Elysium sounds, how it
spells, and which words mean one thing everywhere. Written after reading every
user-facing string in `app/`. When you add copy, check it against this note;
when this note and the code disagree, fix the code.

Not covered by this note, and never edited: the Dark Pack copyright notice, the
"not official" notice and the logo (`app/lib/dark-pack.ts`).

## Voice

- **A quiet host, not a game master.** Dark and warm, a little wry. We set the
  mood with a short line on headlines and empty states; everywhere you actually
  do something (forms, buttons, errors, settings, tooltips) we are plain.
- **Short sentences, second person.** "You" for the player, "we" only when the
  app itself speaks ("We sent a confirmation link"). Contractions are fine.
- **Say what happened and what to do next.** Errors never blame and never show
  codes: "Couldn't save. Check your connection and try again."
- **One flourish at most per screen.** Headlines may be atmospheric ("Join the
  night."); the line under them says what the page is for.
- **No developer wording.** No "null", "undefined", "payload", "RPC", "server",
  raw error messages from Supabase, or file/route names in anything a player sees.
- **Original writing only** (Dark Pack): tooltips, tutorials, dice outcomes and
  bot narration are ours; no book quotes or paraphrase, no canon named
  characters.

## Spelling

**British English**, with the books' own game terms left as printed.

The UI already leans British: "Colours", "favour", "flavour", "rumours",
"recognise", "harbour", "fulfils", dates formatted `en-GB`, and the repo's docs
are British. So: colour, centre, favour, grey, recognise, organise, cancelled,
labelled, behaviour, licence (noun).

Exceptions, because they are game terms or proper names: **Honor** (Werewolf
Renown) and **Favor** (a patron spirit's Favor and Ban). The Hunter faction
names and the Camarilla/Anarch/Sabbat names are used as printed.

## Typography

- Apostrophes and quotes are curly: ’ “ ”. Never `&apos;` or a straight `'` in
  prose.
- A single ellipsis character for waiting states: "Saving…", "Creating…".
- Ranges use an en dash: "1–5". Avoid em dashes in UI copy; use a colon, a full
  stop or a comma.
- Numerals: digits for counts and dots ("7 dots"), words for "one", "two" in
  flowing sentences.
- "email" (no hyphen), "log in" (verb) and "login" never; "reroll" (no hyphen),
  "loresheet" (one word), "Storyteller" (always capital).

## Buttons, labels and headings

- **Sentence case** for buttons, labels, menu items, tabs, headings and section
  titles ("Create character", "Edges & Perks"). Title Case only for names: game
  titles, themes ("Neon Nights"), Dark Pack, chronicle names.
- Buttons start with a verb and name the thing when there is room: "Create
  character", "Send request", "Save settings". Short pairs are fine: "Accept" /
  "Decline", "Stay" / "Leave the table".
- Waiting states mirror the button: "Create character" becomes "Creating…".
- Account words: **Log in**, **Log out**, **Sign up**. The page after sign-up is
  "Check your email". We say "account" for the thing, never "profile" for it
  (the profile is the name friends see).
- Headlines on app pages are a short sentence ending in a full stop; the small
  line above them (eyebrow) is the plain page name.
- `&` is allowed in section titles and nav labels only ("Gifts & Rites");
  prose uses "and".
- Empty states say what is missing and what to do: one line, one action.
- Save states are always: "Saving…", "Unsaved changes", "All changes saved",
  and "Retry" when it failed.
- Accessible names (aria-labels, alt text) are plain sentences in the same
  vocabulary: "Portrait of Rosa.", "Close menu". Decorative images keep
  `alt=''`.

## Capitalising game terms

Capitalise what the game treats as a named mechanic:

- **Tracks and ratings:** Health, Willpower, Humanity, Hunger, Rage,
  Desperation, Danger, Despair, Harano, Hauglosk, Blood Potency, Renown (and
  Glory, Honor, Wisdom), Stains.
- **Powers:** Disciplines, Gifts, Rites, Edges, Perks, Blood Surge. A single
  power or trait name is always capitalised (Dominate, Brawl).
- **Checks:** Rouse check, Rage check; "Willpower reroll"; "Hunger dice",
  "Rage dice", "Desperation dice".
- **Roll results:** *critical win*, *messy critical*, *bestial failure*,
  *total failure* and *brutal outcome* are lowercase mid-sentence (capitalised
  only as a heading). **Overreach** and **Despair** are always capitalised.
- **People and places:** Storyteller, Kindred, Garou, the Beast, the
  Masquerade, the Camarilla, the Anarchs. Faction names (Brujah, Silver Fangs,
  Faithful) as printed.

Lowercase the generic vocabulary: attributes, skills, specialties, advantages,
merits, backgrounds, flaws, convictions, touchstones, predator type, auspice,
breed, clan/tribe/creed (as general nouns), chronicle, coterie/pack/cell, dice
pool, difficulty, loresheet, XP/experience, superficial and aggravated damage.
Sheet section titles still start with a capital because they start a title.

## Terminology

| Use | Avoid | Notes |
|---|---|---|
| Storyteller | storyteller, ST, GM, narrator | Always capital. "Storyteller bot" when it is the bot. |
| chronicle | campaign, game (for the group) | The group that plays together. "Game" means one of the three games. |
| table | room, lobby | The live play screen of a chronicle. "Leave the table", "Pause and exit". |
| vault | library, account (for the collection) | Your characters across games. |
| character sheet, sheet | character card (for the sheet) | A "card" is the small preview in lists. |
| loresheet | lore sheet, lore | A player’s write-up of a place, a character or an NPC. |
| Log in / Log out | Sign in / Sign out / Login | Verbs in two words. |
| Sign up | Register, Join | Creating an account. |
| email | e-mail, Email address (as a sentence) | Field label: "Email". |
| friend code | invite code, friend ID | Eight letters and numbers. |
| party | players (for the members list) | Everyone seated at a chronicle. |
| reroll | re-roll | Also "Willpower reroll". |
| Rouse check | rouse check, Rouse Check | The verb is "rouse the blood". |
| Rage check | rage check | |
| dice pool | pool of dice | "Pool" alone is fine as a field label. |
| difficulty | target number | "Diff." only where space is tight. |
| XP, experience | exp | Section and prose: "experience"; buttons and tight labels: "XP". |
| Impaired | hindered, wounded | The state of a full Health or Willpower track. |
| superficial / aggravated | minor / major | Damage types, lowercase. |
| Embrace, Embraced | turned, sired (as the event) | Vampire; "sire" is the vampire who made you. |
| First Change | first transformation | Werewolf. |
| the Reckoning | the awakening | Hunter: when a hunter first sees. |

### Per-game nouns (`app/lib/games.ts`)

| Game | Character | Group | Faction | Tracks it adds |
|---|---|---|---|---|
| Vampire: The Masquerade | Kindred (plural: Kindred) | coterie | Clan | Hunger, Humanity, Blood Potency |
| Werewolf: The Apocalypse | Garou (plural: Garou) | pack | Tribe | Rage, Harano, Hauglosk, Renown |
| Hunter: The Reckoning | Hunter (plural: Hunters) | cell | Creed | Desperation, Danger, Despair, Drive |

- "Vampire", "Werewolf" and "Hunter" name the game; in running text the
  creatures are "vampires", "werewolves" and "hunters" (lowercase), and the
  game’s own word (Kindred, Garou) is capitalised.
- Group nouns are lowercase mid-sentence: "your coterie", "the pack", "the cell".
- The `Kindred` / `Garou` / `Hunter` labels are display text only; stored values
  (`game` ids, sheet keys, persona and setting ids) never change with copy.

### Theme names

Theme names are proper names and keep their wording (`modes` in
`app/lib/games.ts`): Masquerade, Neon Nights, Moonlit forest, The cave, The
cabin, The inn. Say "Masquerade" (not "Classic Masquerade").
