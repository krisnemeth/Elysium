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
  CONSEQUENCES,
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
export type BotState = BotSetup & { seed: number; path: Approach[] };

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
  narration: string[];
  tests: string[];
  pressure: string[];
  choices: { id: Approach; label: string }[];
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

// The scene for the current act, shaped by the choices made so far.
export function sceneFor(state: BotState, act = state.path.length): Scene {
  const arc = buildArc(state);
  // Each act gets its own stream so earlier choices don't reshuffle the NPCs.
  const r = rng(state.seed + 7919 * (act + 1) + state.path.slice(0, act).reduce((n, a) => (n * 31 + APPROACH_ORDER.indexOf(a) + 1) % 1_000_003, 17));
  const place = pick(r, SETTINGS[state.setting].places);
  const f = (t: string) => fill(t, arc, place);
  const previous = state.path[act - 1];
  const narration: string[] = [];

  if (act === 0) {
    narration.push(pick(r, TONE_OPENERS[state.tone]), f(arc.premise), arc.stakes);
  } else if (act < ACT_COUNT) {
    if (previous) narration.push(f(pick(r, APPROACHES[previous].lines)), f(pick(r, CONSEQUENCES[previous])));
    if (ACTS[act].key === 'twist') narration.push(f(pick(r, TWISTS)));
    if (ACTS[act].key === 'clash') {
      const threat = THREATS[state.focus].find((t) => t.title === arc.title)!;
      narration.push(`It comes to a head at ${f(threat.climax)}.`, `${arc.npcs.find((n) => n.role === 'culprit')!.name} is waiting.`);
    }
    if (ACTS[act].key === 'after') narration.push(f(pick(r, ENDINGS)));
    if (ACTS[act].key === 'dig') narration.push(`The trail leads to ${place}.`);
  }

  const finished = act >= ACT_COUNT - 1;
  const options = shuffle(r, Object.keys(APPROACHES) as Approach[]).slice(0, 3);
  const games: Game[] = ['vampire', 'werewolf', 'hunter'];
  return {
    act: Math.min(act, ACT_COUNT - 1),
    title: ACTS[Math.min(act, ACT_COUNT - 1)].title,
    narration,
    tests: finished ? [] : options.map((o) => `${APPROACHES[o].label}: ${pick(r, APPROACHES[o].tests)}, difficulty ${2 + Math.min(act, 3)}`),
    pressure: finished ? [] : [pick(r, PRESSURE[pick(r, games)])],
    choices: finished ? [] : options.map((id) => ({ id, label: APPROACHES[id].label })),
    finished,
  };
}

// The whole story so far, act by act.
export function storySoFar(state: BotState) {
  return Array.from({ length: Math.min(state.path.length + 1, ACT_COUNT) }, (_, act) => sceneFor(state, act));
}
