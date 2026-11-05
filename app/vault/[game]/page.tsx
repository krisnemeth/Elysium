import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GAMES, isGame } from '@/app/lib/games';
import { getCharacters, toCharacter } from '@/app/lib/data/characters';
import { getLoresheets } from '@/app/lib/data/loresheets';
import VampireOverview from '@/app/ui/game/vampire/Overview';
import WerewolfOverview from '@/app/ui/game/werewolf/Overview';
import HunterOverview from '@/app/ui/game/hunter/Overview';

export async function generateMetadata({ params }: PageProps<'/vault/[game]'>): Promise<Metadata> {
  const { game } = await params;
  return { title: isGame(game) ? GAMES[game].name : undefined };
}

export default async function GameHome({ params }: PageProps<'/vault/[game]'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  const characters = (await getCharacters(game)).map(toCharacter);
  if (game === 'werewolf') return <WerewolfOverview characters={characters} />;
  if (game === 'hunter') return <HunterOverview characters={characters} />;
  const lore = (await getLoresheets('vampire')).map((l) => ({ id: l.id, title: l.title, kind: l.kind }));
  return <VampireOverview characters={characters} loresheets={lore} />;
}
