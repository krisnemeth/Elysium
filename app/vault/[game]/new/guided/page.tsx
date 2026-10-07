import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isGame } from '@/app/lib/games';
import GuidedLoader from '@/app/ui/guided/GuidedLoader';

export const metadata: Metadata = { title: 'Guided character creation' };

export default async function Guided({ params }: PageProps<'/vault/[game]/new/guided'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  return <GuidedLoader game={game} />;
}
