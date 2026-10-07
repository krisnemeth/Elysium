import { notFound } from 'next/navigation';
import SideNav from '@/app/ui/dashboard/sidenav';
import Ambience from '@/app/ui/game/Ambience';
import { GAMES_ORDER, isGame } from '@/app/lib/games';
import { getPreferences } from '@/app/lib/data/social';
import { PreferencesProvider } from '@/app/ui/PreferencesContext';

export function generateStaticParams() {
  return GAMES_ORDER.map((game) => ({ game }));
}

// Each game's dashboard: same functionality, its own look (app/games.css).
export default async function GameLayout({ children, params }: LayoutProps<'/vault/[game]'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  const preferences = await getPreferences();

  return (
    <div data-game={game} className='relative isolate min-h-svh bg-ink text-bone transition-colors duration-500'>
      <Ambience game={game} />
      <SideNav game={game} />
      <main id='main' className='relative px-4 pt-32 pb-32 md:pt-10 md:pr-8 md:pb-16 md:pl-72'>
        <div className='mx-auto max-w-6xl'>
          <PreferencesProvider value={preferences}>{children}</PreferencesProvider>
        </div>
      </main>
    </div>
  );
}
