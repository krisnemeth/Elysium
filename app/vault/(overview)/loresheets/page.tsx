import type { Metadata } from 'next';
import { getLoresheets } from '@/app/lib/data/loresheets';
import { isGame } from '@/app/lib/games';
import LoresheetsPage from '@/app/ui/loresheets/LoresheetsPage';

export const metadata: Metadata = { title: 'Loresheets' };

export default async function Loresheets({ searchParams }: { searchParams: Promise<{ game?: string }> }) {
  const { game } = await searchParams;
  return <LoresheetsPage list={await getLoresheets()} game={game && isGame(game) ? game : undefined} />;
}
