// Suggested names for backgrounds, merits and flaws, per game. Names only
// (game terms); no rule text. Players can always type their own.

import type { Game } from '@/app/lib/games';
import type { Advantage } from './types';

type Lists = Record<Advantage['kind'], string[]>;

const SHARED: Lists = {
  background: ['Allies', 'Contacts', 'Fame', 'Influence', 'Mask', 'Resources', 'Retainers'],
  merit: ['Beautiful', 'Stunning', 'Linguistics'],
  flaw: ['Ugly', 'Repulsive', 'Illiterate', 'Enemy', 'Adversary', 'Dark Secret', 'Addiction'],
};

const EXTRA: Record<Game, Lists> = {
  vampire: {
    background: ['Haven', 'Herd', 'Mawla', 'Status'],
    merit: ['Bloodhound', 'Iron Gullet', 'Eat Food'],
    flaw: ['Prey Exclusion', 'Methuselah’s Thirst', 'Organovore', 'Shunned', 'Suspect', 'Known Corpse', 'Obvious Predator', 'Stake Bait'],
  },
  werewolf: {
    background: ['Safe House', 'Status'],
    merit: [],
    flaw: [],
  },
  hunter: {
    background: ['Safe House', 'Arsenal', 'Fleet', 'Library'],
    merit: [],
    flaw: [],
  },
};

export function advantageNames(game: Game): Lists {
  const extra = EXTRA[game];
  return {
    background: [...SHARED.background, ...extra.background].sort(),
    merit: [...SHARED.merit, ...extra.merit].sort(),
    flaw: [...SHARED.flaw, ...extra.flaw].sort(),
  };
}
