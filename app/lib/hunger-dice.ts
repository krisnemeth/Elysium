// Vampire: The Masquerade 5th Edition dice rules.
//
// - Each die showing 6–10 is one success.
// - Every pair of 10s is a critical and counts as four successes (two extra).
// - A critical where at least one of the 10s is on a Hunger die is a messy critical.
// - A failed roll with at least one 1 on a Hunger die is a bestial failure.

export type Die = { value: number; hunger: boolean };

export type Outcome =
  | 'critical'
  | 'messy-critical'
  | 'win'
  | 'failure'
  | 'total-failure'
  | 'bestial-failure';

export type RollResult = {
  dice: Die[];
  successes: number;
  outcome: Outcome;
};

export function resolveRoll(dice: Die[], difficulty: number): RollResult {
  const tens = dice.filter((d) => d.value === 10);
  const criticalPairs = Math.floor(tens.length / 2);
  const successes =
    dice.filter((d) => d.value >= 6).length + criticalPairs * 2;

  const won = successes >= difficulty && successes > 0;
  const hungerSkull = dice.some((d) => d.hunger && d.value === 1);

  let outcome: Outcome;
  if (won) {
    if (criticalPairs > 0) {
      outcome = tens.some((d) => d.hunger) ? 'messy-critical' : 'critical';
    } else {
      outcome = 'win';
    }
  } else if (hungerSkull) {
    outcome = 'bestial-failure';
  } else {
    outcome = successes === 0 ? 'total-failure' : 'failure';
  }

  return { dice, successes, outcome };
}

export function rollPool(
  pool: number,
  hunger: number,
  difficulty: number,
  random: () => number = Math.random,
): RollResult {
  const hungerDice = Math.min(hunger, pool);
  const dice: Die[] = Array.from({ length: pool }, (_, i) => ({
    value: Math.floor(random() * 10) + 1,
    hunger: i >= pool - hungerDice,
  }));
  return resolveRoll(dice, difficulty);
}
