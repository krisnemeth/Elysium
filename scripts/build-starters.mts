// Validates the starter characters against the 5th edition creation rules and
// writes a Supabase migration that loads them.
//
//   node scripts/build-starters.mts [migration-name]
//
// Runs with Node's built-in TypeScript support (Node 24).

import { writeFileSync } from 'node:fs';
import { VAMPIRES } from '../app/lib/starters/vampire.ts';
import { WEREWOLVES } from '../app/lib/starters/werewolf.ts';
import { HUNTERS } from '../app/lib/starters/hunter.ts';
import type { Starter } from '../app/lib/sheets/types.ts';

const STARTERS: Starter[] = [...VAMPIRES, ...WEREWOLVES, ...HUNTERS];

const count = (values: number[]) =>
  values.reduce<Record<number, number>>((acc, v) => ((acc[v] = (acc[v] ?? 0) + 1), acc), {});
const same = (a: Record<number, number>, b: Record<number, number>) =>
  JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());

const SKILL_SPREADS = {
  'Jack of all trades': { 3: 1, 2: 8, 1: 10 },
  Balanced: { 3: 3, 2: 5, 1: 7 },
  Specialist: { 4: 1, 3: 3, 2: 3, 1: 3 },
};
const REQUIRED_SPECIALTY = ['Academics', 'Craft', 'Performance', 'Science'];

// V5 predator types used by the starters: discipline dot, humanity change,
// specialty and the advantages they grant.
const PREDATORS: Record<string, { disciplines: string[]; humanity: number; specialty: string[] }> = {
  Alleycat: { disciplines: ['Celerity', 'Potence'], humanity: -1, specialty: ['Intimidation', 'Brawl'] },
  Sandman: { disciplines: ['Auspex', 'Obfuscate'], humanity: 0, specialty: ['Medicine', 'Stealth'] },
  Consensualist: { disciplines: ['Auspex', 'Fortitude'], humanity: 1, specialty: ['Medicine', 'Persuasion'] },
};
const CLAN_DISCIPLINES: Record<string, string[]> = {
  Brujah: ['Celerity', 'Potence', 'Presence'],
  Nosferatu: ['Animalism', 'Obfuscate', 'Potence'],
  Malkavian: ['Auspex', 'Dominate', 'Obfuscate'],
};

const errors: string[] = [];
const check = (who: string, ok: boolean, message: string) => {
  if (!ok) errors.push(`${who}: ${message}`);
};

for (const s of STARTERS) {
  const { sheet } = s;
  const a = sheet.attributes;

  check(s.name, same(count(Object.values(a)), { 4: 1, 3: 3, 2: 4, 1: 1 }), 'attributes must be one 4, three 3s, four 2s and one 1');

  const skillDots = Object.values(sheet.skills).map((v) => v!.dots);
  const spread = Object.entries(SKILL_SPREADS).find(([, d]) => same(count(skillDots), d));
  check(s.name, Boolean(spread), `skills match no distribution: ${JSON.stringify(count(skillDots))}`);

  check(s.name, sheet.trackers.health === a.Stamina + 3, 'Health must be Stamina + 3');
  check(s.name, sheet.trackers.willpower === a.Composure + a.Resolve, 'Willpower must be Composure + Resolve');

  const budget = sheet.advantages.filter((x) => !x.source);
  const bg = budget.filter((x) => x.kind !== 'flaw').reduce((n, x) => n + x.dots, 0);
  const fl = budget.filter((x) => x.kind === 'flaw').reduce((n, x) => n + x.dots, 0);
  check(s.name, bg === 7, `starting advantages must total 7 dots (got ${bg})`);
  check(s.name, fl === 2, `starting flaws must total 2 dots (got ${fl})`);

  const specialties = Object.entries(sheet.skills).filter(([, v]) => v!.specialty);

  if (s.game === 'vampire') {
    const predator = PREDATORS[sheet.profile.predator];
    check(s.name, Boolean(predator), `unknown predator type ${sheet.profile.predator}`);
    const clan = CLAN_DISCIPLINES[sheet.profile.clan];
    const disc = sheet.disciplines ?? [];
    const total = disc.reduce((n, d) => n + d.dots, 0);
    check(s.name, total === 4, 'disciplines must total 4 dots (2 + 1 clan, +1 predator)');
    disc.forEach((d) => check(s.name, d.powers.length === d.dots, `${d.name} needs one power per dot`));
    const clanDots = disc.filter((d) => clan.includes(d.name));
    check(s.name, clanDots.length >= 2, 'needs two clan disciplines');
    const extra = disc.filter((d) => !clan.includes(d.name));
    extra.forEach((d) => check(s.name, predator.disciplines.includes(d.name) && d.dots === 1, `${d.name} is not from the clan or predator type`));
    check(s.name, sheet.trackers.humanity === 7 + predator.humanity, `Humanity must be ${7 + predator.humanity}`);
    check(s.name, sheet.trackers.hunger === 1 && sheet.bloodPotency === 1, 'start at Hunger 1, Blood Potency 1');
    const required = Object.entries(sheet.skills).filter(([k, v]) => REQUIRED_SPECIALTY.includes(k) && v!.dots > 0);
    required.forEach(([k, v]) => check(s.name, Boolean(v!.specialty), `${k} needs a specialty`));
    check(s.name, specialties.some(([k]) => predator.specialty.includes(k)), 'needs the predator type specialty');
    check(s.name, specialties.length === required.length + 2, `specialties: required + predator + 1 free (got ${specialties.length})`);
  }

  if (s.game === 'werewolf') {
    const r = sheet.renown!;
    check(s.name, r.glory + r.honor + r.wisdom === 3 && Math.max(r.glory, r.honor, r.wisdom) <= 2, 'Renown: 3 dots, max 2 in one');
    const gifts = sheet.gifts ?? [];
    check(s.name, ['Native', 'Auspice', 'Tribe'].every((src) => gifts.filter((g) => g.source === src).length === 1), 'one Native, one Auspice and one Tribe gift');
    gifts.forEach((g) => check(s.name, r[g.renown.toLowerCase() as keyof typeof r] >= 1, `${g.name} needs ${g.renown} Renown`));
    check(s.name, specialties.length === 3, 'three specialties');
    check(s.name, sheet.trackers.rage === 1 && sheet.trackers.harano === 0 && sheet.trackers.hauglosk === 0, 'Rage 1, Harano 0, Hauglosk 0');
  }

  if (s.game === 'hunter') {
    const edges = sheet.edges ?? [];
    const perks = edges.reduce((n, e) => n + e.perks.length, 0);
    check(s.name, (edges.length === 2 && perks === 1) || (edges.length === 1 && perks === 2), '2 Edges + 1 Perk, or 1 Edge + 2 Perks');
    check(s.name, specialties.length === 3, 'three specialties');
  }

  console.log(`✓ ${s.game.padEnd(8)} ${s.name.padEnd(20)} ${spread?.[0] ?? '?'}`);
}

if (errors.length) {
  console.error('\nRule check failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

// ------------------------------------------------------------------ migration

const lit = (v: string | null) => (v === null ? 'null' : `'${v.replaceAll("'", "''")}'`);
const rows = STARTERS.map(
  (s) =>
    `  (${lit(s.key)}, '${s.game}', ${s.sort}, ${lit(s.name)}, ${lit(s.faction)}, ${lit(s.portrait)}, ${lit(s.summary)}, ${lit(JSON.stringify(s.sheet))}::jsonb)`,
);

const sql = `-- Generated by scripts/build-starters.mts. Edit app/lib/starters/*.ts and regenerate.

insert into public.starter_characters (key, game, sort, name, faction, portrait, summary, sheet)
values
${rows.join(',\n')}
on conflict (key) do update set
  game = excluded.game,
  sort = excluded.sort,
  name = excluded.name,
  faction = excluded.faction,
  portrait = excluded.portrait,
  summary = excluded.summary,
  sheet = excluded.sheet;

-- Give existing accounts the starters they don't have yet.
insert into public.characters (user_id, game, name, faction, portrait, summary, status, sheet, starter_key)
select u.id, s.game, s.name, s.faction, s.portrait, s.summary, 'finished', s.sheet, s.key
from auth.users u
cross join public.starter_characters s
where not exists (
  select 1 from public.characters c where c.user_id = u.id and c.starter_key = s.key
);
`;

const name = process.argv[2];
if (name) {
  writeFileSync(name, sql);
  console.log(`\nWrote ${name}`);
} else {
  console.log(`\nAll ${STARTERS.length} starters pass. Pass a migration path to write SQL.`);
}
