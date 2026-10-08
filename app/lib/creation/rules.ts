// Character creation rules for guided creation (5th edition core books),
// described in our own words. The same numbers are checked for the starter
// characters in scripts/build-starters.mts; keep them in step.

import type { Game } from '@/app/lib/games';
import { ATTRIBUTES, SKILLS, type Attribute, type Sheet, type Skill } from '@/app/lib/sheets/types';
import { CLAN_DISCIPLINES } from '@/app/lib/xp/costs';
import { BLOOD_POTENCY_1 } from '@/app/lib/starters/vampire';

export const ATTRIBUTE_SPREAD: Record<number, number> = { 4: 1, 3: 3, 2: 4, 1: 1 };

export const SKILL_SPREADS = {
  jack: { label: 'Jack of all trades', blurb: 'A little of everything: one skill at 3, eight at 2, ten at 1.', spread: { 3: 1, 2: 8, 1: 10 } },
  balanced: { label: 'Balanced', blurb: 'Solid all-round: three at 3, five at 2, seven at 1.', spread: { 3: 3, 2: 5, 1: 7 } },
  specialist: { label: 'Specialist', blurb: 'Great at a few things: one at 4, three at 3, three at 2, three at 1.', spread: { 4: 1, 3: 3, 2: 3, 1: 3 } },
} as const;
export type SpreadKey = keyof typeof SKILL_SPREADS;

export const REQUIRED_SPECIALTY: Skill[] = ['Academics', 'Craft', 'Performance', 'Science'];

// Predator types: the two Disciplines to pick a dot from, the Humanity change,
// and the skills that can take the predator specialty.
export const PREDATORS: Record<string, { disciplines: string[]; humanity: number; specialty: Skill[]; blurb: string }> = {
  Alleycat: { disciplines: ['Celerity', 'Potence'], humanity: -1, specialty: ['Intimidation', 'Brawl'], blurb: 'Takes blood by force, mugging whoever is unlucky enough.' },
  Bagger: { disciplines: ['Blood Sorcery', 'Obfuscate'], humanity: 0, specialty: ['Larceny', 'Streetwise'], blurb: 'Lives on stolen or bought bagged blood.' },
  'Blood Leech': { disciplines: ['Celerity', 'Protean'], humanity: -1, specialty: ['Brawl', 'Stealth'], blurb: 'Feeds on other vampires. Dangerous and despised.' },
  Cleaver: { disciplines: ['Dominate', 'Animalism'], humanity: 0, specialty: ['Persuasion', 'Subterfuge'], blurb: 'Feeds on a mortal family that doesn’t know the truth.' },
  Consensualist: { disciplines: ['Auspex', 'Fortitude'], humanity: 1, specialty: ['Medicine', 'Persuasion'], blurb: 'Only feeds with permission, however that is won.' },
  Farmer: { disciplines: ['Animalism', 'Protean'], humanity: 1, specialty: ['Animal Ken', 'Survival'], blurb: 'Refuses human blood and lives on animals.' },
  Osiris: { disciplines: ['Blood Sorcery', 'Presence'], humanity: 0, specialty: ['Occult', 'Performance'], blurb: 'Feeds on admirers, followers or worshippers.' },
  Sandman: { disciplines: ['Auspex', 'Obfuscate'], humanity: 0, specialty: ['Medicine', 'Stealth'], blurb: 'Feeds on sleepers, unseen in the night.' },
  'Scene Queen': { disciplines: ['Dominate', 'Potence'], humanity: 0, specialty: ['Etiquette', 'Leadership', 'Streetwise'], blurb: 'Rules a scene or subculture and feeds within it.' },
  Siren: { disciplines: ['Fortitude', 'Presence'], humanity: 0, specialty: ['Persuasion', 'Subterfuge'], blurb: 'Feeds through seduction.' },
};
// Only these clans may take Blood Sorcery from their predator type.
const SORCERERS = ['Tremere', 'Banu Haqim'];

export type Wizard = {
  sheet: Sheet;
  spread?: SpreadKey;
  // Vampire: the clan Disciplines at 2 and 1, and the predator type's dot.
  clanTwo?: string;
  clanOne?: string;
  predatorDiscipline?: string;
};

const counts = (values: number[]) => values.reduce<Record<number, number>>((a, v) => ((a[v] = (a[v] ?? 0) + 1), a), {});

// "two more 3s, one too many 2s" style feedback for a dot spread.
function spreadProblems(values: number[], wanted: Record<number, number>, what: string) {
  const have = counts(values.filter((v) => v > 0));
  const problems: string[] = [];
  for (const level of Object.keys({ ...wanted, ...have }).map(Number).sort((a, b) => b - a)) {
    const diff = (wanted[level] ?? 0) - (have[level] ?? 0);
    const n = Math.abs(diff);
    const noun = n === 1 ? what : `${what}s`;
    if (diff > 0) problems.push(`${n} more ${noun} at ${level} dot${level === 1 ? '' : 's'}.`);
    if (diff < 0) problems.push(`${n} ${noun} too many at ${level} dot${level === 1 ? '' : 's'}.`);
  }
  return problems;
}

export function attributeSpreadLeft(sheet: Sheet) {
  return spreadProblems(Object.values(sheet.attributes), ATTRIBUTE_SPREAD, 'Attribute');
}

export function skillSpreadLeft(sheet: Sheet, spread: SpreadKey) {
  const values = Object.values(SKILLS).flat().map((s) => sheet.skills[s]?.dots ?? 0);
  return spreadProblems(values, SKILL_SPREADS[spread].spread, 'skill');
}

export const clanDisciplines = (sheet: Sheet) => CLAN_DISCIPLINES[sheet.profile.clan ?? ''] ?? [];

export function predatorOptions(sheet: Sheet, predator: string) {
  const p = PREDATORS[predator];
  if (!p) return [];
  return p.disciplines.filter((d) => d !== 'Blood Sorcery' || SORCERERS.includes(sheet.profile.clan ?? ''));
}

export function specialtiesNeeded(game: Game, sheet: Sheet) {
  if (game !== 'vampire') return { required: [] as Skill[], total: 3 };
  const required = REQUIRED_SPECIALTY.filter((s) => (sheet.skills[s]?.dots ?? 0) > 0);
  return { required, total: required.length + 2 };
}

export function advantageBudget(sheet: Sheet) {
  const budget = sheet.advantages.filter((a) => !a.source);
  return {
    merits: budget.filter((a) => a.kind !== 'flaw').reduce((n, a) => n + a.dots, 0),
    flaws: budget.filter((a) => a.kind === 'flaw').reduce((n, a) => n + a.dots, 0),
  };
}

// ------------------------------------------------------------------ steps

export type StepKey =
  | 'concept'
  | 'faction'
  | 'attributes'
  | 'skills'
  | 'disciplines'
  | 'predator'
  | 'renown'
  | 'edges'
  | 'specialties'
  | 'convictions'
  | 'advantages'
  | 'review';

export const STEPS: Record<Game, StepKey[]> = {
  vampire: ['concept', 'faction', 'attributes', 'skills', 'disciplines', 'predator', 'specialties', 'convictions', 'advantages', 'review'],
  werewolf: ['concept', 'faction', 'attributes', 'skills', 'renown', 'specialties', 'convictions', 'advantages', 'review'],
  hunter: ['concept', 'faction', 'attributes', 'skills', 'edges', 'specialties', 'convictions', 'advantages', 'review'],
};

// What still needs doing on a step, in friendly words. Empty means done.
export function problems(game: Game, step: StepKey, w: Wizard): string[] {
  const s = w.sheet;
  const p = s.profile;
  switch (step) {
    case 'concept':
      return [!p.name?.trim() && 'Give your character a name.', !p.concept?.trim() && 'Sum them up in a few words (the concept).'].filter(Boolean) as string[];
    case 'faction':
      if (game === 'vampire') return p.clan ? [] : ['Choose a clan.'];
      if (game === 'werewolf')
        return [!p.tribe && 'Choose a tribe.', !p.auspice && 'Choose an auspice.', !p.breed && 'Choose your breed: born human or born wolf.'].filter(Boolean) as string[];
      return [!p.creed && 'Choose a creed.', !p.drive && 'Choose a Drive.'].filter(Boolean) as string[];
    case 'attributes':
      return attributeSpreadLeft(s);
    case 'skills':
      return w.spread ? skillSpreadLeft(s, w.spread) : ['Pick how you want to spread your skills.'];
    case 'disciplines': {
      const clan = clanDisciplines(s);
      if (!clan.length) return [];
      if (!w.clanTwo || !w.clanOne) return ['Pick one clan Discipline at two dots and another at one dot.'];
      return w.clanTwo === w.clanOne ? ['Pick two different Disciplines.'] : [];
    }
    case 'predator':
      if (!p.predator) return ['Choose how your character feeds.'];
      return w.predatorDiscipline ? [] : ['Pick which Discipline your predator type adds a dot to.'];
    case 'renown': {
      const r = s.renown ?? { glory: 0, honor: 0, wisdom: 0 };
      const total = r.glory + r.honor + r.wisdom;
      const out: string[] = [];
      if (total !== 3) out.push(total < 3 ? `Place ${3 - total} more Renown.` : `Remove ${total - 3} Renown.`);
      if (Math.max(r.glory, r.honor, r.wisdom) > 2) out.push('No more than 2 dots in one kind of Renown.');
      const gifts = s.gifts ?? [];
      for (const src of ['Native', 'Auspice', 'Tribe'] as const) {
        const g = gifts.find((x) => x.source === src);
        if (!g?.name.trim()) out.push(`Name your ${src} Gift.`);
        else if (!g.renown) out.push(`Pick the Renown your ${src} Gift uses.`);
        else if ((r[g.renown.toLowerCase() as keyof typeof r] ?? 0) < 1) out.push(`${g.name} needs at least one dot of ${g.renown}.`);
      }
      return out;
    }
    case 'edges': {
      const edges = (s.edges ?? []).filter((e) => e.name.trim());
      const perks = edges.reduce((n, e) => n + e.perks.filter((x) => x.trim()).length, 0);
      const ok = (edges.length === 2 && perks === 1) || (edges.length === 1 && perks === 2);
      return ok ? [] : ['Take two Edges and one Perk, or one Edge and two Perks.'];
    }
    case 'specialties': {
      const { required, total } = specialtiesNeeded(game, s);
      const have = Object.entries(s.skills).filter(([, v]) => v?.specialty?.trim());
      const out = required.filter((k) => !s.skills[k]?.specialty?.trim()).map((k) => `${k} needs a specialty.`);
      if (game === 'vampire') {
        const pred = PREDATORS[p.predator ?? ''];
        if (pred && !have.some(([k]) => pred.specialty.includes(k as Skill)))
          out.push(`Your predator type gives a specialty in ${pred.specialty.join(' or ')}.`);
      }
      if (have.length < total) out.push(`Add ${total - have.length} more ${total - have.length === 1 ? 'specialty' : 'specialties'}.`);
      if (have.length > total) out.push(`That’s ${have.length - total} too many specialties.`);
      return out;
    }
    case 'convictions':
      return s.convictions.some((c) => c.conviction.trim() && c.touchstone.trim()) ? [] : ['Write at least one conviction and the touchstone it’s tied to.'];
    case 'advantages': {
      const { merits, flaws } = advantageBudget(s);
      const out: string[] = [];
      if (s.advantages.some((a) => !a.name.trim() && a.dots > 0)) out.push('Give every advantage and flaw a name.');
      if (merits !== 7) out.push(merits < 7 ? `Spend ${7 - merits} more dots on merits and backgrounds.` : `That’s ${merits - 7} dots too many on merits and backgrounds.`);
      if (flaws !== 2) out.push(flaws < 2 ? `Take ${2 - flaws} more dots of flaws.` : `That’s ${flaws - 2} dots too many of flaws.`);
      return out;
    }
    case 'review':
      return [];
  }
}

// The finished sheet: derived tracks and the game's starting values.
export function finalSheet(game: Game, w: Wizard): Sheet {
  const s: Sheet = structuredClone(w.sheet);
  const a = s.attributes;
  s.trackers.health = a.Stamina + 3;
  s.trackers.willpower = a.Composure + a.Resolve;
  s.convictions = s.convictions.filter((c) => c.conviction.trim() || c.touchstone.trim());
  s.advantages = s.advantages.filter((x) => x.name.trim() && x.dots > 0);
  if (game === 'vampire') {
    const dots = new Map<string, number>();
    if (w.clanTwo) dots.set(w.clanTwo, 2);
    if (w.clanOne) dots.set(w.clanOne, 1);
    if (w.predatorDiscipline) dots.set(w.predatorDiscipline, (dots.get(w.predatorDiscipline) ?? 0) + 1);
    s.disciplines = [...dots].map(([name, n]) => ({ name, dots: n, powers: [] }));
    s.trackers.humanity = 7 + (PREDATORS[s.profile.predator ?? '']?.humanity ?? 0);
    s.trackers.hunger = 1;
    s.bloodPotency = 1;
    Object.assign(s.profile, BLOOD_POTENCY_1);
  }
  if (game === 'hunter') s.edges = (s.edges ?? []).filter((e) => e.name.trim()).map((e) => ({ ...e, perks: e.perks.filter((x) => x.trim()) }));
  return s;
}

export const attributeGroups = Object.entries(ATTRIBUTES) as [string, readonly Attribute[]][];

// ------------------------------------------------------------------ tracker

export type BudgetItem = { label: string; have: number; want: number };

const sum = (values: number[]) => values.reduce((n, v) => n + v, 0);
const levelItems = (values: number[], spread: Record<number, number>) =>
  Object.keys(spread)
    .map(Number)
    .sort((a, b) => b - a)
    .map((level) => ({ label: `at ${level}`, have: values.filter((v) => v === level).length, want: spread[level] }));

// What the points tracker shows for a step: placed versus allowed.
export function budget(game: Game, step: StepKey, w: Wizard): BudgetItem[] {
  const s = w.sheet;
  switch (step) {
    case 'attributes': {
      const values = Object.values(s.attributes);
      const total = sum(Object.entries(ATTRIBUTE_SPREAD).map(([lvl, n]) => Number(lvl) * n));
      return [{ label: 'Dots', have: sum(values), want: total }, ...levelItems(values, ATTRIBUTE_SPREAD)];
    }
    case 'skills': {
      if (!w.spread) return [];
      const spread = SKILL_SPREADS[w.spread].spread as Record<number, number>;
      const values = Object.values(SKILLS).flat().map((sk) => s.skills[sk]?.dots ?? 0);
      const total = sum(Object.entries(spread).map(([lvl, n]) => Number(lvl) * n));
      return [{ label: 'Dots', have: sum(values), want: total }, ...levelItems(values.filter((v) => v > 0), spread)];
    }
    case 'specialties': {
      const { total } = specialtiesNeeded(game, s);
      return [{ label: 'Specialties', have: Object.values(s.skills).filter((v) => v?.specialty?.trim()).length, want: total }];
    }
    case 'renown': {
      const r = s.renown ?? { glory: 0, honor: 0, wisdom: 0 };
      return [
        { label: 'Renown', have: r.glory + r.honor + r.wisdom, want: 3 },
        { label: 'Gifts', have: (s.gifts ?? []).filter((g) => g.name.trim()).length, want: 3 },
      ];
    }
    case 'edges': {
      const edges = (s.edges ?? []).filter((e) => e.name.trim());
      return [
        { label: 'Edges', have: edges.length, want: edges.length >= 2 ? 2 : edges.length === 1 && edges[0].perks.filter((p) => p.trim()).length >= 2 ? 1 : 2 },
        { label: 'Perks', have: edges.reduce((n, e) => n + e.perks.filter((p) => p.trim()).length, 0), want: edges.length >= 2 ? 1 : 2 },
      ];
    }
    case 'advantages': {
      const { merits, flaws } = advantageBudget(s);
      return [
        { label: 'Merits & backgrounds', have: merits, want: 7 },
        { label: 'Flaws', have: flaws, want: 2 },
      ];
    }
    case 'disciplines':
      return clanDisciplines(s).length ? [{ label: 'Clan Disciplines', have: [w.clanTwo, w.clanOne].filter(Boolean).length, want: 2 }] : [];
    default:
      return [];
  }
}
