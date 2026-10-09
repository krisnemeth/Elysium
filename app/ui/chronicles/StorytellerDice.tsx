'use client';

import { shareRoll } from '@/app/lib/actions/social';
import type { Game } from '@/app/lib/games';
import DiceRoller from '@/app/ui/dice/DiceRoller';

// A Storyteller's roller: every roll is shared to the chronicle's dice log.
export default function StorytellerDice({ chronicleId, game }: { chronicleId: string; game: Game }) {
  return (
    <DiceRoller
      game={game}
      compact
      onResult={(r, info) => void shareRoll(chronicleId, game, 'Storyteller', info.reroll ? 'Willpower reroll' : 'Storyteller roll', r, info.difficulty)}
    />
  );
}
