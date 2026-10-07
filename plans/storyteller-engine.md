# Storyteller engine: toward a multiplayer choice-based novel

Draft proposal, 2026-10-07. For discussion before building.

## Where it stands

The Storyteller bot (`app/lib/storyteller/`) generates a five-act story from a
seed, a tone and a setting. Each act is a scene at a described location; the
group votes on how to proceed or searches for clues, and clues reveal the
people involved. It is procedural: varied, but shallow. Choices change the
next lines of text, not the shape of the story.

## How choice-based novels are built (in general)

Games like *Night Road* and *The Beast of Glenkildove* are licensed World of
Darkness titles from Choice of Games. We must not use their text, characters
or plots (Dark Pack: no verbatim quotations; see
`plans/dark-pack-compliance.md`). Their *structure*, though, follows patterns
that are widely documented for interactive fiction:

- **Passages and choices.** The story is written as passages of prose ending in
  a menu of choices. Each choice leads to another passage.
- **State.** Behind the text are variables: stats (e.g. how ruthless or
  compassionate the character is), relationships with each NPC, flags for
  things that happened ("saved the witness"), resources (money, Hunger).
  Choices change them; later text checks them (“if you lied to Mara…”).
- **Checks.** Some choices only succeed if a stat is high enough, or the game
  rolls against it. Failure is a branch, not a dead end.
- **Branch and bottleneck.** Stories branch for a while, then come back
  together at key moments (a chapter's climax), so the writing stays
  manageable while choices still feel like they matter. Consequences are
  carried forward in variables rather than in separate storylines.
- **Delayed consequences.** A choice in chapter 1 pays off in chapter 4, which
  is what makes choices feel meaningful.
- **Personality through choices.** Many options aren't “succeed or fail” but
  *how* you do something; they shape the character's stats and voice.

## Proposal for Elysium

### 1. Authored story modules, procedural texture

- Stories are **modules**: chapters of hand-written scenes, in a small
  structured format (TypeScript or JSON) with passages, choices, conditions
  and effects. All original writing.
- The procedural generator stays for **texture**: names, locations, minor
  NPCs and complications, so a module plays differently each time.
- Start with one short module per game focus (Vampire, Werewolf, Hunter), each
  with crossover NPCs.

### 2. State that matters

- **Group flags** (what happened), **clues** (what the group knows),
  **NPC attitudes** (trust and suspicion per NPC), a **pressure clock** (Danger
  for hunters, Masquerade heat for vampires, Rage of the land for werewolves).
- **Character sheets feed in:** checks use real traits (“Manipulation +
  Subterfuge, difficulty 3”), and results come from the in-app dice, including
  messy criticals, brutal outcomes and Despair.

### 3. Multiplayer

- **Group choices** by vote (built).
- **Personal beats:** each player sometimes gets a private prompt only they see
  (the Beast whispers to a vampire; a hunter recognises a face). Their answer
  can change what the group learns.
- **Spotlight:** checks are assigned to the character best suited, or rotate,
  so everyone gets moments.
- **Splitting up:** optionally, the group can split for a scene and each part
  plays its own branch, then they reunite.

### 4. Investigation

- An **evidence board**: clues are cards; connecting two clues can unlock a
  deduction, a new location or an NPC dossier.
- NPC dossiers grow as you learn more (look, want, secret, ties), instead of
  appearing all at once.

### 5. Pacing and sessions

- Chapters end at natural breaks, so a module spans several sessions.
- The session log becomes a readable “story so far”, with each player's
  choices and roll highlights.

### 6. Later: Storytellers write their own

- An editor for Storytellers to write modules in the same format, with
  validation and a Dark Pack checklist.

## Suggested phases

1. **Engine:** module format, state, conditions/effects, checks wired to the
   dice; port the current bot onto it.
2. **First module:** a short, fully authored crossover story (3 chapters).
3. **Investigation board and NPC dossiers.**
4. **Personal beats and spotlight.**
5. **Module editor for Storytellers.**

## Questions for you

- Story length: one-evening one-shots, or multi-session chronicles?
- How much authored versus generated? (Authored reads better; generated
  replays better.)
- Who writes modules: me, you, Storytellers in the app, or all three?
- Tone references beyond the two games you mentioned (TV, novels, other games).
