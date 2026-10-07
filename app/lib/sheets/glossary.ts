// Plain-language explanations for the sheet's traits, shown as tooltips and in
// guided creation.
//
// DARK PACK RULE: these are written in our own words for Elysium. Never paste
// or closely paraphrase descriptions from the rulebooks (see
// plans/dark-pack-compliance.md). Keep them short: what the trait is about and
// when it comes up at the table.

import type { Game } from '@/app/lib/games';

type Entry = string | Partial<Record<Game | 'any', string>>;

const GLOSSARY: Record<string, Entry> = {
  // Attributes
  Strength: 'Raw physical power: lifting, hitting, forcing doors.',
  Dexterity: 'Speed, balance and fine control, from dodging to picking a pocket.',
  Stamina: 'Toughness and endurance. It also sets how many Health boxes you have.',
  Charisma: 'Presence and charm: how easily people warm to you or follow you.',
  Manipulation: 'Steering people where you want them, by persuasion, pressure or lies.',
  Composure: 'Keeping your nerve and your poker face. Part of your Willpower.',
  Intelligence: 'Knowledge, memory and reasoning.',
  Wits: 'Quick thinking: reacting, noticing, improvising.',
  Resolve: 'Focus and determination when things drag on. Part of your Willpower.',

  // Skills
  Athletics: 'Running, climbing, jumping, swimming and throwing.',
  Brawl: 'Fighting without weapons (or with fists, teeth and claws).',
  Craft: 'Making and fixing things with your hands. Pick a specialty: a craft you know.',
  Drive: 'Handling vehicles under pressure.',
  Firearms: 'Shooting, and knowing your way around guns.',
  Melee: 'Fighting with blades, clubs and anything else you can swing.',
  Larceny: 'Locks, alarms, sleight of hand and other light-fingered work.',
  Stealth: 'Moving unseen and unheard, and staying hidden.',
  Survival: 'Living rough: tracking, shelter, finding your way outdoors.',
  'Animal Ken': 'Reading, calming and handling animals.',
  Etiquette: 'Knowing how to behave, whatever the room.',
  Insight: 'Reading people: their moods, motives and lies.',
  Intimidation: 'Getting your way through threats, real or implied.',
  Leadership: 'Inspiring and directing other people.',
  Performance: 'Music, acting, oratory and other arts on a stage. Pick a specialty: your art.',
  Persuasion: 'Convincing people with reasons, charm or a good deal.',
  Streetwise: 'Knowing the streets: who to ask, where to buy, what to avoid.',
  Subterfuge: 'Lying well, keeping secrets and spotting other people’s lies.',
  Academics: 'Book learning: history, languages, the humanities. Pick a specialty: a field.',
  Awareness: 'Noticing what is around you, especially danger.',
  Finance: 'Money: how it moves, where it hides, how to make more.',
  Investigation: 'Finding clues and putting them together.',
  Medicine: 'First aid, diagnosis and treatment.',
  Occult: 'Knowledge of the supernatural, both the real and the rumoured.',
  Politics: 'How power works: officials, factions and favours.',
  Science: 'Scientific knowledge and method. Pick a specialty: a field.',
  Technology: 'Computers, networks and modern electronics.',

  // Tracks
  Health: 'How much harm you can take. Superficial damage heals easily; aggravated damage is serious.',
  Willpower: 'Your inner reserve. Spend it to reroll dice; it also takes mental and social damage.',
  Humanity: 'How much of your human self remains. Cruel acts leave Stains that can wear it down.',
  Hunger: 'How badly the Beast wants blood. Hunger dice replace normal dice in your rolls.',
  'Blood Potency': 'The strength of your vampiric blood. It grows with age and changes several of your blood’s effects.',
  Rage: 'The wolf’s fury, used to fuel Gifts and changing shape. Rage dice can turn a roll brutal.',
  Harano: 'Creeping despair about the state of the world.',
  Hauglosk: 'Fanatical, unbending zeal: the danger of being too sure you are right.',
  Desperation: 'How desperate the cell has become. Add these dice when a roll serves your Drive, at a risk.',
  Danger: 'How aware the quarry is of the hunt. The higher it is, the harder it hits back.',

  // Profile
  Name: 'Your character’s name.',
  Player: 'Your own name, for the Storyteller’s benefit.',
  Chronicle: 'The ongoing game this character is part of.',
  Concept: 'Your character in a few words, e.g. “burned-out paramedic”.',
  Ambition: 'A long-term goal that drives your character.',
  Desire: 'Something they want right now, in this story.',
  Sire: 'The vampire who made you one of them.',
  Clan: 'Your vampire bloodline. It shapes your Disciplines and comes with a weakness.',
  Generation: 'How many steps you are from the first of your kind. Most player characters are young.',
  Sect: 'The vampire faction you side with, if any.',
  'Predator type': 'How you prefer to feed. It shapes some starting traits.',
  Tribe: 'The werewolf tribe you belong to, with its own outlook and Gifts.',
  Auspice: 'The moon you were born under, and the role it gives you in the pack.',
  Breed: 'Whether you were born human or wolf.',
  'Patron spirit': 'The spirit that watches over your pack.',
  Pack: 'Your werewolf pack’s name.',
  Cell: 'Your group of hunters.',
  Creed: 'Your hunter’s approach to the hunt.',
  'Hunter’s Drive': 'Why you hunt. Acting on it is when Desperation helps you.',
  Resonance: 'The emotional flavour of the last blood you drank.',

  // Blood stats
  'Blood Surge': 'Extra dice you can add by rousing the blood.',
  'Mend amount': 'How much damage rousing the blood heals.',
  'Power bonus': 'Extra dice for Discipline powers.',
  'Rouse re-roll': 'Discipline levels for which a failed Rouse check can be rerolled.',
  'Bane severity': 'How hard your clan’s weakness bites.',
  'Feeding penalty': 'How much less you get from feeding on animals or bagged blood.',

  // Sections and text blocks
  Disciplines: 'Your vampiric powers, rated in dots.',
  Renown: 'Your standing in werewolf society: Glory, Honor and Wisdom.',
  Glory: 'Renown for courage and great deeds.',
  Honor: 'Renown for fairness, duty and keeping your word.',
  Wisdom: 'Renown for insight, patience and spiritual understanding.',
  'Gifts & rites': 'Your supernatural abilities and the rituals you know.',
  'Edges & perks': 'Your hunter’s special capabilities and the refinements you’ve added.',
  Advantages: 'Merits, backgrounds and flaws: resources, contacts, quirks and weaknesses.',
  'Touchstones & convictions': 'People who keep you grounded, and the principles that tie you to them.',
  Convictions: 'Principles you won’t break lightly, each tied to a touchstone.',
  'Clan bane': 'The weakness your clan carries.',
  'Chronicle tenets': 'The moral lines this chronicle draws, agreed with your Storyteller.',
  Favor: 'What your patron spirit grants the pack.',
  Ban: 'What your patron spirit asks the pack never to do.',
  Redemption: 'How your hunter could come back from Despair.',
  'Drive: what pushes you': 'The story behind your Drive.',
  Experience: 'Earned between sessions and spent to improve your traits.',
};

// The explanation for a label, if there is one for this game.
export function explain(label: string, game?: Game): string | undefined {
  const entry = GLOSSARY[label];
  if (!entry) return undefined;
  if (typeof entry === 'string') return entry;
  return (game && entry[game]) ?? entry.any;
}
