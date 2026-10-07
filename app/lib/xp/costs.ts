import type { Game } from '@/app/lib/games';
import { ATTRIBUTES, SKILLS, type Sheet, type XpEntry } from '@/app/lib/sheets/types';

// Experience costs from the 5th edition core books. Only traits with a cost
// we're sure of are priced here; anything else (Gifts, Rites, Edges, Perks…)
// is logged with the amount the player enters.
//
//   Attribute            new level × 5
//   Skill                new level × 3
//   Specialty            3
//   Advantage            3 per dot
//   Vampire only:
//   Clan Discipline      new level × 5
//   Other Discipline     new level × 7
//   Caitiff Discipline   new level × 6
//   Blood Potency        new level × 10

export const CLAN_DISCIPLINES: Record<string, string[]> = {
  'Banu Haqim': ['Blood Sorcery', 'Celerity', 'Obfuscate'],
  Brujah: ['Celerity', 'Potence', 'Presence'],
  Gangrel: ['Animalism', 'Fortitude', 'Protean'],
  Hecata: ['Auspex', 'Fortitude', 'Oblivion'],
  Lasombra: ['Dominate', 'Oblivion', 'Potence'],
  Malkavian: ['Auspex', 'Dominate', 'Obfuscate'],
  'The Ministry': ['Obfuscate', 'Presence', 'Protean'],
  Nosferatu: ['Animalism', 'Obfuscate', 'Potence'],
  Ravnos: ['Animalism', 'Obfuscate', 'Presence'],
  Salubri: ['Auspex', 'Dominate', 'Fortitude'],
  Toreador: ['Auspex', 'Celerity', 'Presence'],
  Tremere: ['Auspex', 'Blood Sorcery', 'Dominate'],
  Tzimisce: ['Animalism', 'Dominate', 'Protean'],
  Ventrue: ['Dominate', 'Fortitude', 'Presence'],
  'Thin-blood': ['Thin-blood Alchemy'],
};

export const DISCIPLINE_NAMES = [
  'Animalism', 'Auspex', 'Blood Sorcery', 'Celerity', 'Dominate', 'Fortitude', 'Obfuscate',
  'Oblivion', 'Potence', 'Presence', 'Protean', 'Thin-blood Alchemy',
];

export type Purchase = {
  id: string; // e.g. "attribute:Strength"
  group: string;
  label: string;
  from: number;
  to: number;
  cost: number;
  note?: string;
};

const MAX_DOTS = 5;

// Everything that can be bought with XP on this sheet, with its next level and cost.
export function purchases(game: Game, sheet: Sheet): Purchase[] {
  const list: Purchase[] = [];
  for (const [group, attrs] of Object.entries(ATTRIBUTES)) {
    for (const a of attrs) {
      const from = sheet.attributes[a] ?? 1;
      if (from < MAX_DOTS) list.push({ id: `attribute:${a}`, group: `${group} attributes`, label: a, from, to: from + 1, cost: (from + 1) * 5 });
    }
  }
  for (const [group, skills] of Object.entries(SKILLS)) {
    for (const sk of skills) {
      const from = sheet.skills[sk]?.dots ?? 0;
      if (from < MAX_DOTS) list.push({ id: `skill:${sk}`, group: `${group} skills`, label: sk, from, to: from + 1, cost: (from + 1) * 3 });
    }
  }
  list.push({ id: 'specialty', group: 'Other', label: 'New specialty', from: 0, to: 1, cost: 3, note: 'Add it to the skill on your sheet.' });
  sheet.advantages.forEach((adv, i) => {
    if (adv.kind !== 'flaw' && adv.name && adv.dots < MAX_DOTS)
      list.push({ id: `advantage:${i}`, group: 'Advantages', label: adv.name, from: adv.dots, to: adv.dots + 1, cost: 3 });
  });

  if (game === 'vampire') {
    const clan = sheet.profile.clan ?? '';
    const inClan = CLAN_DISCIPLINES[clan] ?? [];
    const caitiff = clan === 'Caitiff';
    for (const name of DISCIPLINE_NAMES) {
      const from = sheet.disciplines?.find((d) => d.name === name)?.dots ?? 0;
      if (from >= MAX_DOTS) continue;
      const rate = caitiff ? 6 : inClan.includes(name) ? 5 : 7;
      const kind = caitiff ? 'Caitiff' : inClan.includes(name) ? 'in-clan' : 'out-of-clan';
      list.push({ id: `discipline:${name}`, group: 'Disciplines', label: name, from, to: from + 1, cost: (from + 1) * rate, note: kind });
    }
    const bp = sheet.bloodPotency ?? 0;
    if (bp < 10) list.push({ id: 'bloodPotency', group: 'Blood', label: 'Blood Potency', from: bp, to: bp + 1, cost: (bp + 1) * 10 });
  }
  return list;
}

// Raises the bought trait on the sheet (mutates the draft passed in).
export function applyPurchase(sheet: Sheet, p: Purchase) {
  const [kind, key] = p.id.split(':') as [string, string | undefined];
  if (kind === 'attribute' && key) sheet.attributes[key as keyof Sheet['attributes']] = p.to;
  if (kind === 'skill' && key) {
    const skill = key as keyof Sheet['skills'];
    sheet.skills[skill] = { ...sheet.skills[skill], dots: p.to };
  }
  if (kind === 'advantage' && key) sheet.advantages[Number(key)].dots = p.to;
  if (kind === 'discipline' && key) {
    const list = (sheet.disciplines ??= []);
    const existing = list.find((d) => d.name === key);
    if (existing) existing.dots = p.to;
    else list.push({ name: key, dots: p.to, powers: [] });
  }
  if (kind === 'bloodPotency') sheet.bloodPotency = p.to;
}

// Totals from the log, plus any amounts typed into the older XP fields.
export function xpTotals(sheet: Sheet) {
  const log: XpEntry[] = sheet.xp ?? [];
  const carriedEarned = Number(sheet.profile.xpTotal) || 0;
  const carriedSpent = Number(sheet.profile.xpSpent) || 0;
  const earned = carriedEarned + log.filter((e) => e.kind === 'earned').reduce((n, e) => n + e.amount, 0);
  const spent = carriedSpent + log.filter((e) => e.kind === 'spent').reduce((n, e) => n + e.amount, 0);
  return { earned, spent, available: earned - spent, carriedEarned, carriedSpent };
}
