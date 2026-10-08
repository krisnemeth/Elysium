// Dice rules for the 5th edition World of Darkness games.
//
// Shared by all three: each die showing 6-10 is a success, and every pair of
// 10s is a critical worth four successes (two extra).
//
// - Vampire: Hunger dice replace regular dice. A critical that includes a
//   Hunger 10 is messy; a failure with a Hunger 1 is bestial.
// - Werewolf: Rage dice replace regular dice. A Rage die showing 1 or 2 is a
//   Brutal result; two or more make a Brutal outcome (the test fails unless
//   the goal was to cause harm). Brutal results can't be rerolled.
// - Hunter: Desperation dice are added to the pool. A Desperation 1 on a win
//   forces a choice between Overreach and Despair; on a failure, Despair.

export type Game = 'vampire' | 'werewolf' | 'hunter';
export type DieKind = 'regular' | 'special';
export type Die = { value: number; kind: DieKind };

export type Outcome =
  | 'critical'
  | 'win'
  | 'failure'
  | 'total-failure'
  // Vampire
  | 'messy-critical'
  | 'bestial-failure'
  // Werewolf
  | 'brutal'
  // Hunter
  | 'overreach'
  | 'despair';

export type RollResult = {
  dice: Die[];
  successes: number;
  outcome: Outcome;
};

// The official dice sets cap what one throw can hold. Vampire: 13 black and
// 5 Hunger dice (Hunger replaces black dice in the pool). Werewolf: 12 green
// and 5 Rage (Rage replaces green). Hunter: 10 orange, plus up to 5
// Desperation dice added on top of the pool.
export const DICE_SET: Record<Game, { pool: number; special: number }> = {
  vampire: { pool: 18, special: 5 },
  werewolf: { pool: 17, special: 5 },
  hunter: { pool: 10, special: 5 },
};

export const SPECIAL_DIE_NAME: Record<Game, string> = {
  vampire: 'Hunger',
  werewolf: 'Rage',
  hunter: 'Desperation',
};

const isBrutal = (d: Die) => d.kind === 'special' && d.value <= 2;

export function resolveRoll(game: Game, dice: Die[], difficulty: number): RollResult {
  const tens = dice.filter((d) => d.value === 10);
  const criticalPairs = Math.floor(tens.length / 2);
  const successes = dice.filter((d) => d.value >= 6).length + criticalPairs * 2;
  const won = successes > 0 && successes >= difficulty;
  const specialOne = dice.some((d) => d.kind === 'special' && d.value === 1);

  const plain = (): Outcome =>
    won ? (criticalPairs > 0 ? 'critical' : 'win') : successes === 0 ? 'total-failure' : 'failure';

  let outcome: Outcome;
  switch (game) {
    case 'vampire':
      if (won && criticalPairs > 0 && tens.some((d) => d.kind === 'special')) outcome = 'messy-critical';
      else if (!won && specialOne) outcome = 'bestial-failure';
      else outcome = plain();
      break;
    case 'werewolf':
      outcome = dice.filter(isBrutal).length >= 2 ? 'brutal' : plain();
      break;
    case 'hunter':
      outcome = specialOne ? (won ? 'overreach' : 'despair') : plain();
      break;
  }
  return { dice, successes, outcome };
}

const d10 = (random: () => number) => Math.floor(random() * 10) + 1;

/*
  Builds and resolves a pool. `special` is Hunger, Rage or Desperation:
  Vampire and Werewolf swap that many regular dice for special ones,
  Hunter adds them on top of the pool.
*/
export function rollPool(
  game: Game,
  pool: number,
  special: number,
  difficulty: number,
  random: () => number = Math.random,
): RollResult {
  const adds = game === 'hunter';
  const specials = adds ? special : Math.min(special, pool);
  const regulars = adds ? pool : pool - specials;
  const dice: Die[] = [
    ...Array.from({ length: regulars }, () => ({ value: d10(random), kind: 'regular' as const })),
    ...Array.from({ length: specials }, () => ({ value: d10(random), kind: 'special' as const })),
  ];
  return resolveRoll(game, dice, difficulty);
}

// Which dice Willpower may reroll (up to three of them).
export function canReroll(game: Game, die: Die) {
  if (die.kind === 'regular') return true;
  return game === 'werewolf' && !isBrutal(die);
}

export function rerollDice(
  game: Game,
  result: RollResult,
  indexes: number[],
  difficulty: number,
  random: () => number = Math.random,
): RollResult {
  const dice = result.dice.map((d, i) => (indexes.includes(i) ? { ...d, value: d10(random) } : d));
  return resolveRoll(game, dice, difficulty);
}
