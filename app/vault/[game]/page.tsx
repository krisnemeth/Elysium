import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isGame } from '@/app/lib/games';
import VampireOverview from '@/app/ui/game/vampire/Overview';
import WerewolfOverview from '@/app/ui/game/werewolf/Overview';
import HunterOverview from '@/app/ui/game/hunter/Overview';

export const metadata: Metadata = { title: 'Overview' };

export default async function Overview({ params }: PageProps<'/vault/[game]'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  if (game === 'werewolf') return <WerewolfOverview />;
  if (game === 'hunter') return <HunterOverview />;
  return <VampireOverview />;
}
