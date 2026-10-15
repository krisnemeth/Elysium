// Sanity check for the Storyteller bot personas: every persona must tell a
// full story for every setting and game without empty or unfilled text, and
// tell it identically for the same seed. Run with:
//   node --import ./scripts/register-alias.mjs scripts/check-personas.mts
// (Node 24 strips the types; imports use relative paths with extensions.)

import { PERSONAS, PERSONA_ORDER, personaFor } from '../app/lib/storyteller/personas.ts';
import { SETTINGS } from '../app/lib/storyteller/content.ts';
import { ACT_COUNT, buildArc, logEntry, sceneFor, storySoFar, type BotState, type Choice } from '../app/lib/storyteller/generate.ts';

const games = ['vampire', 'werewolf', 'hunter'] as const;
let stories = 0;
const problems: string[] = [];

function check(label: string, text: unknown) {
  if (typeof text !== 'string' || !text.trim()) problems.push(`${label}: empty`);
  else if (/[{}]|undefined/.test(text)) problems.push(`${label}: unfilled "${text}"`);
}

for (const id of PERSONA_ORDER) {
  const p = PERSONAS[id];
  for (const [k, v] of Object.entries({ name: p.name, tagline: p.tagline, characterisation: p.characterisation })) check(`${id}.${k}`, v);
  for (const list of [p.voice.openers, p.voice.asides, p.voice.pressure, p.voice.senses, p.voice.endings, p.traits]) {
    if (!list.length) problems.push(`${id}: empty voice list`);
    list.forEach((t, i) => check(`${id}.voice[${i}]`, t));
  }
  for (const setting of Object.keys(SETTINGS) as (keyof typeof SETTINGS)[]) {
    for (const focus of games) {
      for (let seed = 1; seed <= 25; seed++) {
        // Walk the story: search on even steps when possible, else the first approach.
        const state: BotState = { persona: id, setting, focus, seed: seed * 7919, path: [] };
        const tag = `${id}/${setting}/${focus}/${seed}`;
        buildArc(state).npcs.forEach((n) => check(`${tag} npc`, `${n.name} ${n.want} ${n.secret} ${n.look} ${n.affiliation}`));
        for (let step = 0; step <= ACT_COUNT * 3; step++) {
          const scene = sceneFor(state);
          check(`${tag} step${step} title`, scene.title);
          check(`${tag} step${step} location`, scene.location);
          scene.narration.forEach((t, i) => check(`${tag} step${step} narration${i}`, t));
          scene.pressure.forEach((t, i) => check(`${tag} step${step} pressure${i}`, t));
          scene.clues.forEach((t, i) => check(`${tag} step${step} clue${i}`, t));
          scene.choices.forEach((c) => {
            check(`${tag} step${step} label`, c.label);
            check(`${tag} step${step} test`, c.test);
          });
          if (state.path.length) check(`${tag} step${step} log`, logEntry(state).body);
          if (scene.finished) break;
          const search = scene.choices.find((c) => c.id === 'search');
          const next: Choice = search && step % 2 === 0 ? 'search' : scene.choices.find((c) => c.id !== 'search')!.id;
          state.path.push(next);
        }
        if (!sceneFor(state).finished) problems.push(`${tag}: never finished`);
        if (JSON.stringify(storySoFar(state)) !== JSON.stringify(storySoFar({ ...state, path: [...state.path] }))) problems.push(`${tag}: not deterministic`);
        stories++;
      }
    }
  }
}

// Old chronicles (a tone, no persona) still work.
for (const tone of ['intrigue', 'horror', 'action'] as const) {
  const old = { tone, setting: 'city', focus: 'vampire', seed: 5, path: [] } as BotState;
  check(`legacy ${tone}`, personaFor(old).name);
  sceneFor(old).narration.forEach((t, i) => check(`legacy ${tone} narration${i}`, t));
}

// Personas should sound different: no two share a choice label.
const labels = new Set<string>();
for (const id of PERSONA_ORDER) {
  for (const l of [PERSONAS[id].voice.search, ...Object.values(PERSONAS[id].voice.labels)]) {
    if (labels.has(l)) problems.push(`duplicate choice label "${l}"`);
    labels.add(l);
  }
}

if (problems.length) {
  console.error(`${problems.length} problem(s):\n${problems.slice(0, 40).join('\n')}`);
  process.exit(1);
}
console.log(`ok: ${PERSONA_ORDER.length} personas, ${stories} full stories, no empty or unfilled text`);
