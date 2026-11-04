import { notFound } from 'next/navigation';
import AppShell from '@/app/ui/dashboard/AppShell';
import RememberGame from '@/app/ui/dashboard/RememberGame';
import { GAMES_ORDER, isGame } from '@/app/lib/games';

export function generateStaticParams() {
  return GAMES_ORDER.map((game) => ({ game }));
}

// Each game's dashboard: same functionality, its own look (app/games.css).
export default async function GameLayout({ children, params }: LayoutProps<'/vault/[game]'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();

  return (
    <AppShell game={game}>
      <RememberGame game={game} />
      {children}
    </AppShell>
  );
}
