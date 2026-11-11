import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DicePage from '@/app/ui/dice/DicePage';
import { isGame } from '@/app/lib/games';

export const metadata: Metadata = { title: 'Dice' };

export default async function Page({ params }: PageProps<'/vault/[game]/dice'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  return <DicePage game={game} />;
}
