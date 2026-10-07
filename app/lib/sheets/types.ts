// The stored character sheet (characters.sheet, JSONB). One shape for all
// three games; game-specific sections are optional.

export type GameKey = 'vampire' | 'werewolf' | 'hunter';

export const ATTRIBUTES = {
  Physical: ['Strength', 'Dexterity', 'Stamina'],
  Social: ['Charisma', 'Manipulation', 'Composure'],
  Mental: ['Intelligence', 'Wits', 'Resolve'],
} as const;

export const SKILLS = {
  Physical: ['Athletics', 'Brawl', 'Craft', 'Drive', 'Firearms', 'Melee', 'Larceny', 'Stealth', 'Survival'],
  Social: ['Animal Ken', 'Etiquette', 'Insight', 'Intimidation', 'Leadership', 'Performance', 'Persuasion', 'Streetwise', 'Subterfuge'],
  Mental: ['Academics', 'Awareness', 'Finance', 'Investigation', 'Medicine', 'Occult', 'Politics', 'Science', 'Technology'],
} as const;

export type Attribute = (typeof ATTRIBUTES)[keyof typeof ATTRIBUTES][number];
export type Skill = (typeof SKILLS)[keyof typeof SKILLS][number];

export type Advantage = {
  name: string;
  dots: number;
  kind: 'background' | 'merit' | 'flaw';
  note?: string;
  // e.g. "Predator type" or "Creed" when it doesn't come from the starting budget.
  source?: string;
};

export type Sheet = {
  // Name, concept, chronicle, ambition, desire, plus game fields
  // (clan, sire, generation, predator / tribe, auspice, patron / creed, drive…).
  profile: Record<string, string>;
  attributes: Record<Attribute, number>;
  skills: Partial<Record<Skill, { dots: number; specialty?: string }>>;
  // health, willpower and the game's own tracks (humanity, hunger, rage,
  // harano, hauglosk, desperation, danger).
  trackers: Record<string, number>;
  advantages: Advantage[];
  convictions: { conviction: string; touchstone: string }[];
  biography: {
    born?: string; // ISO date
    turned?: string; // Embrace, First Change or the Reckoning (ISO date)
    appearance: string;
    features?: string;
    history: string;
  };
  notes?: string;

  // Vampire
  disciplines?: { name: string; dots: number; powers: string[] }[];
  bloodPotency?: number;
  bane?: string;
  tenets?: string;

  // Werewolf
  renown?: { glory: number; honor: number; wisdom: number };
  gifts?: { name: string; source: 'Native' | 'Auspice' | 'Tribe'; renown: string }[];
  rites?: string[];
  favor?: string;
  ban?: string;

  // Hunter
  edges?: { name: string; perks: string[] }[];
};

export type Starter = {
  key: string;
  game: GameKey;
  sort: number;
  name: string;
  faction: string;
  portrait: string;
  summary: string;
  sheet: Sheet;
};
