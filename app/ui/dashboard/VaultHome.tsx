import type { ComponentProps } from 'react';
import HunterOverview from '@/app/ui/game/hunter/Overview';
import VampireOverview from '@/app/ui/game/vampire/Overview';
import WerewolfOverview from '@/app/ui/game/werewolf/Overview';
import type { Game } from '@/app/lib/games';
import type { Character } from '@/app/lib/sample-characters';
import type { VaultView } from '@/app/lib/vault-view';
import VaultCharacters from './VaultCharacters';
import VaultShelves from './VaultShelves';

/*
  Your vault, in one game: the game's own piece up top (Vampire's tallies,
  Werewolf's moons, Hunter's case board), its drafts and loresheets, then every
  character across all three games.
*/
export default function VaultHome({
  game,
  characters,
  loresheets,
  view,
}: {
  game: Game;
  characters: Character[];
  loresheets: ComponentProps<typeof VaultShelves>['loresheets'];
  view: VaultView;
}) {
  const own = characters.filter((c) => c.game === game);
  return (
    <div className='flex flex-col gap-10'>
      {game === 'werewolf' ? (
        <WerewolfOverview />
      ) : game === 'hunter' ? (
        <HunterOverview characters={own} />
      ) : (
        <VampireOverview characters={own} loresheets={loresheets.length} />
      )}
      <VaultShelves game={game} drafts={own.filter((c) => c.status === 'draft')} loresheets={loresheets} />
      <VaultCharacters game={game} characters={characters} view={view} />
    </div>
  );
}
