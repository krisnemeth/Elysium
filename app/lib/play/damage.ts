import type { Damage } from '@/app/lib/sheets/types';

// Health and Willpower damage, as in the 5th edition core books.
//
// - Superficial damage fills an empty box; with none left, it turns a
//   Superficial box into Aggravated.
// - Aggravated damage fills an empty box; with none left, it also turns a
//   Superficial box into Aggravated.
// - With every box marked you're Impaired: −2 dice to Physical tests (Health)
//   or to Social and Mental tests (Willpower).
// - Health with every box Aggravated means torpor for a vampire and
//   incapacitation (or death) for everyone else.

export const NO_DAMAGE: Damage = { superficial: 0, aggravated: 0 };

export type DamageKind = keyof Damage;

// Keeps marked boxes within the track, e.g. after Stamina drops.
export function fit(d: Damage, max: number): Damage {
  const aggravated = Math.min(d.aggravated, max);
  return { aggravated, superficial: Math.min(d.superficial, max - aggravated) };
}

export function takeDamage(d: Damage, max: number, kind: DamageKind, amount = 1): Damage {
  let { superficial, aggravated } = fit(d, max);
  for (let i = 0; i < amount; i++) {
    if (superficial + aggravated < max) {
      if (kind === 'superficial') superficial++;
      else aggravated++;
    } else if (superficial > 0) {
      superficial--;
      aggravated++;
    }
  }
  return { superficial, aggravated };
}

export function heal(d: Damage, max: number, kind: DamageKind, amount = 1): Damage {
  const f = fit(d, max);
  return { ...f, [kind]: Math.max(0, f[kind] - amount) };
}

export type TrackState = 'fine' | 'impaired' | 'down';

export function trackState(d: Damage, max: number): TrackState {
  const f = fit(d, max);
  if (max > 0 && f.aggravated >= max) return 'down';
  if (f.superficial + f.aggravated >= max) return 'impaired';
  return 'fine';
}

// Box contents from left to right: Aggravated first, then Superficial.
export function boxes(d: Damage, max: number): ('empty' | DamageKind)[] {
  const f = fit(d, max);
  return Array.from({ length: max }, (_, i) => (i < f.aggravated ? 'aggravated' : i < f.aggravated + f.superficial ? 'superficial' : 'empty'));
}
