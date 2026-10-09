import type { Sheet } from './types';

/*
  Values the 5th edition rules derive from Attributes (the same in all three
  games): Health is Stamina + 3, Willpower is Composure + Resolve. Powers that
  add boxes (e.g. Fortitude's Resilience) are left to the player.
*/
export const healthMax = (s: Sheet) => (s.attributes.Stamina ?? 0) + 3;
export const willpowerMax = (s: Sheet) => (s.attributes.Composure ?? 0) + (s.attributes.Resolve ?? 0);

export const healthRule = (s: Sheet) => `Stamina ${s.attributes.Stamina ?? 0} + 3`;
export const willpowerRule = (s: Sheet) => `Composure ${s.attributes.Composure ?? 0} + Resolve ${s.attributes.Resolve ?? 0}`;
