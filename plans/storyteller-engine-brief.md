# Story engine: design brief

For the design talk on #22 / THI-21 (2026-10-15). Nothing here is built. Answer
the table below and the phase-1 sketch can be firmed up and built. Background:
`plans/storyteller-engine.md` (the proposal) and `plans/dark-pack-compliance.md`.

## Decisions needed

| # | Question | Options | Recommendation |
|---|---|---|---|
| 1 | Story length | A one-shots (1 evening) / B multi-session chronicles / C one-shot modules that chain | **C**: author 30-60 min chapters, play one or chain several |
| 2 | Authored vs generated | A fully authored / B fully generated (today) / C authored spine, generated texture | **C**: authored passages, generated names/places/minor NPCs |
| 3 | Who writes modules | A you + me only / B Storytellers in-app / C both, in phases | **C**: we write the first 3 (phase 2), editor later (phase 5) |
| 4 | Tone references | open | Your list needed (see section 4) |
| 5 | Page layout | A story in the existing "Story" tab / B reader panel in the centre column / C full-screen reader mode | **B**, with the tabs kept for notes and party |
| 6 | Group choices | A vote (today) / B turn holder decides / C mix by beat type | **C**: group beats vote; personal and check beats go to the turn holder |
| 7 | Checks and dice | A suggest pool, player rolls by hand / B engine proposes pool, player confirms, roll auto-binds / C engine rolls | **B** |
| 8 | State storage | A one jsonb on `chronicles.bot` / B event log (choices) replayed / C log plus snapshot | **C** |
| 9 | Save/resume | A implicit (state is the save) / B explicit chapter bookmarks | **A**, with chapter breaks as natural stopping points |
| 10 | Personas (#23) | A persona rewrites text / B persona picks among authored variants / C persona is only a voice wrapper | **C** now, **B** later |
| 11 | Originality / moderation | A trust authors / B checklist + validator / C checklist + validator + review gate for shared modules | **B** now, **C** before phase 5 |
| 12 | Module storage | A TS modules in repo / B JSON in DB | **A** now (typed, reviewable), **B** only with the editor |

## 1. Story length

- **A. One-shots.** Self-contained evening. Easy to write and to join; no long-term state worries. Weak payoff for delayed consequences.
- **B. Multi-session chronicles.** Best use of flags and NPC attitudes. Needs real save/resume, absent players, and much more writing before anything ships.
- **C. Chained chapters.** Each chapter is a module with its own ending; a chronicle carries flags and NPC attitudes into the next. Ships small, grows into B.

Recommend **C**. The first deliverable is a one-evening story, and carry-over state is a later, optional feature.

## 2. Authored vs generated

- **A. Authored.** Reads best, easiest to keep original. Replays poorly.
- **B. Generated.** What exists (`generate.ts`): five acts of shuffled tables. Varied but shallow; choices change wording, not shape.
- **C. Authored spine + generated texture.** Passages are written; `{culprit}`, `{district}`, `{place}` slots are filled from the existing tables and seed. NPC roles are authored; names, looks and wants are generated.

Recommend **C**. The seeded RNG and `fill()` already exist and port directly.

## 3. Who writes modules

- **A. You and me.** Quality control, simplest compliance.
- **B. Storytellers in the app.** Needs editor, validation, moderation, sharing. Large.
- **C. Phased.** Repo modules first (3 crossover chapters), then an editor that outputs the same format.

Recommend **C**; the format must be JSON-serialisable from day one so the editor is not a rewrite.

## 4. Tone references

I should not guess these. Please give: 2-4 touchstones (TV, novels, games), what you like in them (pacing, dread, banter, moral grey), and anything to avoid. Constraint: references steer feel only; no names, plots or lines from them in the text (Dark Pack). The existing tones (intrigue, horror, action) can become per-module tags.

## 5. Chronicle page layout around it

Today (`table.tsx`): left character + `PlayTable`, centre game bar + story/notes/party tabs + pinned vote + turn tracker, right dice + roll log.

- **A. Keep the Story tab.** Smallest change; long passages in a tab compete with notes.
- **B. Reader panel in the centre.** Passage text on top, choices pinned below (replaces `BotVote`), tabs for notes/party/evidence beside or under it. Backdrop keeps crossfading by location (`ActBackdrop`).
- **C. Full-screen reader.** Best for reading; loses the dice and sheet next to the story.

Recommend **B**. Checks must sit next to the dice column, so the story cannot hide it. Phones already get one column at a time (Character / Table / Dice), which suits it.

## 6. Multiplayer choice resolution

Today: `chronicle_votes` per `step`; `cast_vote` resolves when all joined members have voted, `call_vote` lets the creator end it; ties go to the creator, then earliest. `chronicle_turns` gives a turn holder (bot chronicles: 120 s fuse, any member can pass an expired turn, only the holder can roll).

Beat types, each with its own resolver:
- **Group beat** (where to go, how to approach): vote, as today.
- **Check beat**: the turn holder (or the best-suited character, "spotlight") rolls; assists come later.
- **Personal beat**: private prompt to one player, the answer feeds group state. Needs per-user visibility (section 8).
- **Split beat**: later.

Risks: stalled votes (reuse the creator's `call_vote`, add the turn timer for bots), absent players (resolve with joined members only; `left` players drop out), double-advance (keep the `expected` step guard).

## 7. Checks, sheets and the in-app dice

A check is an attribute (+ skill) and a difficulty, with a branch for each outcome. The engine proposes a pool from the turn holder's sheet (`app/lib/sheets/derived.ts` plus the sheet's traits); `PoolRoller` is pre-filled and the roll is logged to `chronicle_rolls` as now. To bind a roll to a beat, add `step` and `check_id` to `chronicle_rolls`; the engine reads `outcome`, which already distinguishes messy-critical, bestial-failure, brutal, overreach, despair. Grim outcomes get their own branch slot, which is what makes the game-specific dice matter. Rouse/Rage/Desperation costs are modelled as effects. Failure is always a branch, never a dead end. Bot tables already lock rolling to the turn holder, the right default.

## 8. Persistence of state

- **A. One jsonb** (`chronicles.bot`): simple, but concurrent writes clobber.
- **B. Event log**: only choices and outcomes stored; state recomputed by replaying the module. Deterministic (like today's `seed` + `path`), tiny, auditable. Breaks when a module is edited mid-chronicle.
- **C. Log + snapshot**: the log is the truth; a snapshot per chapter makes replay cheap and survives module edits.

Recommend **C**, with `module_version` pinned per chronicle. Resolution stays in security-definer RPCs (as `cast_vote`/`pass_turn`), so clients cannot write state. Sketch:

- `chronicles.bot` becomes `{ module, version, seed, setup }` (static).
- `chronicle_events (chronicle_id, seq, kind, payload, created_at)`: `choose`, `check`, `private_answer`. Unique `(chronicle_id, seq)` is the double-advance guard.
- `chronicle_state (chronicle_id, seq, state jsonb)`: snapshot at chapter end.
- Private beats: `chronicle_private (chronicle_id, user_id, seq, prompt, answer)`, RLS to that user.

## 9. Save / resume

State is already durable; the work is the experience. Chapters end at natural breaks with a recap ("story so far", from `chronicle_notes` kind `bot`, which exists). Returning players get the current passage and the recap. Absent players' beats are skipped or given to the best-suited present character. Reuses the turns and leave/rejoin work.

## 10. Personas (#23, in parallel)

Personas are a voice layer over the current generator. Plug-in point: the engine returns plain passage text; a persona implements `voice(text, ctx) => string` for framing (openers, asides, sign-offs) and never alters choices, state or checks. Later a module can offer persona variants (`variants?: Record<PersonaId, string>`) where authored. To agree with #23 now: persona content lives in its own file beside `content.ts`, original writing, same compliance rules.

## 11. Originality and moderation of authored text

- All module text original (Dark Pack). Add a **module validator** (build-time script, like `scripts/build-starters.mts`): schema, reachability (no orphan passages, no dead ends), declared variables, every check has a failure branch, a deny-list of canon names, length caps.
- A **PR checklist** from the existing "Before shipping new content" list.
- For Storyteller-written modules (phase 5): private by default; sharing needs report/removal tools and the same validator. Hosting user text raises a licensing question worth checking against the agreement before building.

## Phase 1 sketch (engine, no new content)

### Module format

```ts
// app/lib/storyteller/engine/types.ts
export type Id = string;

export type Expr =                       // conditions: tiny and serialisable
  | { flag: Id }
  | { not: Expr }
  | { all: Expr[] } | { any: Expr[] }
  | { var: Id; op: '>=' | '<=' | '=='; value: number }
  | { npc: Id; attitude: '>=' | '<='; value: number }
  | { clue: Id }
  | { game: Game };                      // chronicle focus

export type Effect =
  | { set: Id } | { unset: Id }
  | { add: Id; by: number }              // vars, incl. the pressure clock
  | { npc: Id; attitude: number }
  | { clue: Id }
  | { goto: Id };                        // jump (bottleneck)

export type Check = {
  id: Id;
  pool: { attribute: string; skill?: string; difficulty: number };
  who: 'holder' | 'best' | 'group';      // spotlight rule
  // passages by outcome from app/lib/dice/rules.ts
  outcomes: { success: Id; critical?: Id; fail: Id; grim?: Id };
};

export type Choice = {
  id: Id;
  label: string;
  when?: Expr;                           // visible only if
  effects?: Effect[];
  to?: Id;                               // next passage
  check?: Check;                         // roll first; outcomes name passages
};

export type Passage = {
  id: Id;
  text: string[];                        // paragraphs; {slots} and conditional blocks
  location?: Id;                         // backdrop
  onEnter?: Effect[];
  decide: 'vote' | 'holder' | 'private' | 'none';
  choices: Choice[];                     // empty = chapter end
  end?: { chapter: boolean; ending?: Id };
};

export type Module = {
  id: Id; version: number; title: string;
  focus: Game | 'crossover'; tones: Tone[];
  slots: Record<Id, 'district' | 'place' | { npc: Role }>;  // filled by the seeded generator
  vars: Record<Id, { initial: number; max?: number }>;      // incl. 'pressure'
  npcs: Record<Id, { role: Role; game?: Game | 'mortal' }>; // names/looks generated
  start: Id;
  passages: Record<Id, Passage>;
};
```

### State

```ts
export type StoryState = {
  seq: number;                 // events applied
  at: Id;                      // current passage
  flags: Id[];
  vars: Record<Id, number>;    // pressure clock lives here
  attitudes: Record<Id, number>;
  clues: Id[];
  visited: Id[];
};
// pure: reduce(module, seed, state, event) => { state, narration }; no I/O
```

The reducer is pure and deterministic: it runs on the server (authoritative) and the client (preview), and is tested as plain functions like `damage.ts`.

### Porting the current bot

1. The five acts become a built-in module "bot-classic": passages `hook, dig, twist, clash, after`; each act's approaches (talk/dig/sneak/force) become choices with checks from `APPROACHES[*].tests`; `search` becomes a self-looping choice limited by a counter var (max 2 per act).
2. `content.ts` tables stay as the texture source; `buildArc`/`fill` become the slot filler. Seed behaviour is unchanged.
3. `chronicles.bot` keeps `{ tone, setting, focus, seed }`; the old `path: Choice[]` replays as `choose` events, so existing chronicles keep working (the migration backfills `chronicle_events` from `path`).
4. `cast_vote`/`call_vote`/`resolve_vote` generalise from the hard-coded choice strings to `choice_id text`, with legality checked by the TS engine before the RPC, as `voteBotChoice` does now.
5. `BotVote` renders `passage.choices` filtered by `when`; `logEntry` becomes the reducer's `narration`.

### Example module outline (original, illustrative)

"The Lamp That Stays On": crossover, intrigue, one night at a closed ferry office.

- `arrive` (vote): the office lamp is lit though the power was cut months ago. Choices: knock (talk); check the back (sneak, Dexterity + Stealth, difficulty 3); read the ledger in the window (dig, Intelligence + Investigation, difficulty 3).
- `ledger`: names {informant} as the last signer. Sets clue `ledger`, pressure +1. A critical also gives clue `tide-times`; a grim result sets flag `seen`, which {culprit} reacts to later.
- `back-room` (holder): {rival} is already inside. Options depend on the rival's attitude; if `seen`, one option closes and *bargain* opens.
- Bottleneck `crossing`: every path meets here at the chapter's turn; text varies on flags `ledger`, `seen`, `tide-times`.
- Personal beat at `crossing`: each player privately gets a one-line prompt tied to their game (a Hunger pang, a scent on the wind, a hunter recognising a face); the answer sets a flag.
- Endings: `quiet` (pressure < 3), `loud` (pressure >= 3), `costly` (`seen` and a failed final check). The chapter end carries `seen` and attitudes into the next chapter.

### Phase-1 deliverables

Types above; reducer with condition/effect evaluator and tests; slot filler extracted from `generate.ts`; `bot-classic` module; events/snapshot migration and generalised vote RPCs; `BotVote` driven by the engine; validator script. Excluded: evidence board, private-beat UI, editor.

## Open risks

- Writing volume: three chapters is weeks of prose; generated texture is what buys replay.
- Migrating live chronicles (backfill path to events).
- Private beats need new RLS and a per-user realtime channel.
- User-authored text hosting and the Dark Pack (check before phase 5).
