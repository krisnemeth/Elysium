import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isGame } from '@/app/lib/games';
import { getCharacters, toCharacter } from '@/app/lib/data/characters';
import VampireOverview from '@/app/ui/game/vampire/Overview';
import WerewolfOverview from '@/app/ui/game/werewolf/Overview';
import HunterOverview from '@/app/ui/game/hunter/Overview';

export const metadata: Metadata = { title: 'Overview' };

export default async function Overview({ params }: PageProps<'/vault/[game]'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  const characters = (await getCharacters(game)).map(toCharacter);
  if (game === 'werewolf') return <WerewolfOverview characters={characters} />;
  if (game === 'hunter') return <HunterOverview characters={characters} />;
  return <VampireOverview characters={characters} />;
}
