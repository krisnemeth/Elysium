// The Storyteller bot: builds a five-act story from a seed and a few choices.
// Deterministic: the same seed and choices always give the same story, so
// only the seed, setup and chosen paths are stored (chronicles.bot).
//
// All text comes from content.ts, which is original writing (Dark Pack rule).

import type { Game } from '@/app/lib/games';
import {
  ACTS,
  AFFILIATIONS,
  APPROACHES,
  CLUE_FINDS,
  CONSEQUENCES,
  SEARCH_EMPTY,
  SENSES,
  ENDINGS,
  FIRST_NAMES,
  LAST_NAMES,
  LOOKS,
  PRESSURE,
  ROLE_LABELS,
  SECRETS,
  SETTINGS,
  THREATS,
  TWISTS,
  WANTS,
  type Approach,
  type Role,
  type SettingKind,
  type Tone,
} from './content';

export type BotSetup = { tone: Tone; setting: SettingKind; focus: Game };
// A group decision: one of the approaches (moves to the next act) or a
// search for clues (stays in the scene).
export type Choice = Approach | 'search';
export type BotState = BotSetup & { seed: number; path: Choice[] };

export type Npc = {
  role: Role;
  roleLabel: string;
  name: string;
  game: Game | 'mortal';
  affiliation: string;
  want: string;
  secret: string;
  look: string;
};

export type Arc = {
  title: string;
  district: string;
  premise: string;
  stakes: string;
  npcs: Npc[];
};

export type Scene = {
  act: number; // 0-based
  title: string;
  location: string;
  narration: string[];
  // Clues found in this scene so far, in order.
  clues: string[];
  tests: string[];
  pressure: string[];
  choices: { id: Choice; label: string; test?: string }[];
  finished: boolean;
};

export const ACT_COUNT = ACTS.length;
const APPROACH_ORDER = Object.keys(APPROACHES) as Approach[];

// mulberry32: small, fast, good enough for story dice.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(r: () => number, list: readonly T[]) => list[Math.floor(r() * list.length)];

function shuffle<T>(r: () => number, list: readonly T[]) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function newBotState(setup: BotSetup, random = Math.random): BotState {
  return { ...setup, seed: Math.floor(random() * 2 ** 31), path: [] };
}

// Labels like "Malkavian (vampire)", "Glass Walkers (werewolf)", "Martial hunter".
function affiliationLabel(game: Game | 'mortal', name: string) {
  if (game === 'mortal') return `Mortal, ${name}`;
  if (game === 'hunter') return `${name} hunter`;
  return `${name} ${game === 'vampire' ? 'vampire' : 'werewolf'}`;
}

export function buildArc(state: BotState): Arc {
  const r = rng(state.seed);
  const threat = pick(r, THREATS[state.focus]);
  const district = pick(r, SETTINGS[state.setting].districts);

  // Five original NPCs; the crossover guarantees one from each game.
  const firsts = shuffle(r, FIRST_NAMES);
  const lasts = shuffle(r, LAST_NAMES);
  const games: (Game | 'mortal')[] = shuffle(r, ['vampire', 'werewolf', 'hunter', 'mortal'] as const);
  const roles: Role[] = ['patron', 'culprit', 'rival', 'victim', 'informant'];
  const wants = shuffle(r, WANTS);
  const secrets = shuffle(r, SECRETS);
  const looks = shuffle(r, LOOKS);

  const npcs: Npc[] = roles.map((role, i) => {
    // The culprit's game comes from the threat; the rest cover the other games.
    const game = role === 'culprit' ? threat.culpritGame : games[i % games.length];
    const affiliation = pick(r, AFFILIATIONS[game]);
    return {
      role,
      roleLabel: ROLE_LABELS[role],
      name: `${firsts[i]} ${lasts[i]}`,
      game,
      affiliation: affiliationLabel(game, affiliation),
      want: wants[i],
      secret: secrets[i],
      look: looks[i],
    };
  });
  // Make sure all three games appear among the NPCs.
  for (const g of ['vampire', 'werewolf', 'hunter'] as const) {
    if (!npcs.some((n) => n.game === g)) {
      const swap = npcs.find((n) => n.role !== 'culprit' && npcs.filter((m) => m.game === n.game).length > 1) ?? npcs.find((n) => n.role === 'informant')!;
      swap.game = g;
      swap.affiliation = affiliationLabel(g, pick(r, AFFILIATIONS[g]));
    }
  }

  const arc: Arc = { title: threat.title, district, premise: '', stakes: threat.stakes, npcs };
  arc.premise = fill(threat.premise, arc, pick(r, SETTINGS[state.setting].places));
  return arc;
}

function fill(text: string, arc: Arc, place: string) {
  const byRole = Object.fromEntries(arc.npcs.map((n) => [n.role, n.name]));
  return (
    text
      .replaceAll('{district}', arc.district)
      .replaceAll('{place}', place)
      .replace(/\{(patron|culprit|rival|victim|informant)\}/g, (_, role: string) => byRole[role])
      // "the Weir will remember" at the start of a sentence.
      .replace(/(^|[.!?]\s+)([a-z])/g, (_, start: string, letter: string) => start + letter.toUpperCase())
  );
}

const TONE_OPENERS: Record<Tone, string[]> = {
  intrigue: ['Everyone you meet tonight wants something from you.', 'The invitation came on good paper, unsigned.'],
  horror: ['Something about the quiet tonight feels arranged.', 'The streetlights flicker in a rhythm, like breathing.'],
  action: ['Sirens somewhere close. Not for you, yet.', 'You have maybe an hour before this gets loud.'],
};

const SEARCHES_PER_ACT = 2;
// The order in which searches uncover people. The patron is met in the hook,
// the culprit at the reckoning.
const CLUE_ORDER = ['informant', 'victim', 'rival'] as const;

// Where the story stands after a list of choices.
export function progress(path: Choice[]) {
  const approaches = path.filter((c) => c !== 'search') as Approach[];
  const act = Math.min(approaches.length, ACT_COUNT - 1);
  let searchesThisAct = 0;
  for (let i = path.length - 1; i >= 0 && path[i] === 'search'; i--) searchesThisAct++;
  const searches = path.filter((c) => c === 'search').length;
  return { act, approaches, searchesThisAct, searches };
}

// Which NPCs the group has met so far (secrets stay hidden until the end).
export function knownNpcs(state: BotState) {
  const { act, searches } = progress(state.path);
  const roles = new Set<string>(['patron', ...CLUE_ORDER.slice(0, searches)]);
  if (ACTS[act].key === 'clash' || ACTS[act].key === 'after') roles.add('culprit');
  return roles;
}

// The scene for an act, shaped by the choices made before and during it.
export function sceneFor(state: BotState, act = progress(state.path).act): Scene {
  const arc = buildArc(state);
  const { approaches } = progress(state.path);
  // Choices before this act, and the searches made in it.
  const before: Choice[] = [];
  let seen = 0;
  for (const c of state.path) {
    if (seen >= act) break;
    before.push(c);
    if (c !== 'search') seen++;
  }
  const during: Choice[] = [];
  for (const c of state.path.slice(before.length)) {
    if (c !== 'search') break;
    during.push(c);
  }
  const r = rng(state.seed + 7919 * (act + 1) + before.reduce((n, a) => (n * 31 + APPROACH_ORDER.indexOf(a as Approach) + 2) % 1_000_003, 17));
  const place = pick(r, SETTINGS[state.setting].places);
  const f = (t: string) => fill(t, arc, place);
  const previous = approaches[act - 1];
  const key = ACTS[act].key;
  const narration: string[] = [];
  const location = `${place[0].toUpperCase()}${place.slice(1)}, in ${arc.district}. ${pick(r, SENSES)}`;

  if (act === 0) {
    narration.push(pick(r, TONE_OPENERS[state.tone]), f(arc.premise), arc.stakes);
  } else {
    if (previous) narration.push(f(pick(r, APPROACHES[previous].lines)), f(pick(r, CONSEQUENCES[previous])));
    if (key === 'twist') narration.push(f(pick(r, TWISTS)));
    if (key === 'clash') {
      const threat = THREATS[state.focus].find((t) => t.title === arc.title)!;
      narration.push(`It comes to a head at ${f(threat.climax)}.`, `${arc.npcs.find((n) => n.role === 'culprit')!.name} is waiting.`);
    }
    if (key === 'after') narration.push(f(pick(r, ENDINGS)));
  }

  // Clues found by this act's searches, using the global search count.
  const searchesBefore = before.filter((c) => c === 'search').length;
  const clues = during.map((_, i) => {
    const role = CLUE_ORDER[searchesBefore + i];
    if (!role) return SEARCH_EMPTY;
    const npc = arc.npcs.find((n) => n.role === role)!;
    const cr = rng(state.seed + 104729 * (searchesBefore + i + 1));
    return pick(cr, CLUE_FINDS[role]!).replaceAll('{npc}', npc.name).replaceAll('{aff}', npc.affiliation);
  });

  const finished = act >= ACT_COUNT - 1;
  const options = shuffle(r, APPROACH_ORDER).slice(0, 3);
  const games: Game[] = ['vampire', 'werewolf', 'hunter'];
  const canSearch = !finished && during.length < SEARCHES_PER_ACT && searchesBefore + during.length < CLUE_ORDER.length;
  const searchTest = `Wits + Awareness or Intelligence + Investigation, difficulty ${2 + Math.min(act, 2)}`;
  const choices: Scene['choices'] = finished
    ? []
    : [
        ...(canSearch ? [{ id: 'search' as const, label: 'Search for clues', test: searchTest }] : []),
        ...options.map((o) => ({ id: o, label: APPROACHES[o].label, test: `${pick(r, APPROACHES[o].tests)}, difficulty ${2 + Math.min(act, 3)}` })),
      ];
  return {
    act,
    title: ACTS[act].title,
    location,
    narration,
    clues,
    tests: choices.map((c) => `${c.label}: ${c.test}`),
    pressure: finished ? [] : [pick(r, PRESSURE[pick(r, games)])],
    choices,
    finished,
  };
}

// The whole story so far, act by act.
export function storySoFar(state: BotState) {
  const { act } = progress(state.path);
  return Array.from({ length: act + 1 }, (_, a) => sceneFor(state, a));
}

// What the bot writes in the session log after a group decision.
export function logEntry(state: BotState): { title: string; body: string } {
  const last = state.path[state.path.length - 1];
  const scene = sceneFor(state);
  if (last === 'search') return { title: `${scene.title} · a clue`, body: scene.clues[scene.clues.length - 1] ?? SEARCH_EMPTY };
  return { title: scene.finished ? `${scene.title} · The end` : scene.title, body: [scene.location, ...scene.narration].join('\n\n') };
}
