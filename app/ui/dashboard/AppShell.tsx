import type { ReactNode } from 'react';
import SideNav from '@/app/ui/dashboard/sidenav';
import Ambience from '@/app/ui/game/Ambience';
import { getPreferences } from '@/app/lib/data/social';
import type { Game } from '@/app/lib/games';
import { PreferencesProvider } from '@/app/ui/PreferencesContext';

/*
  The inside of the app, past login: the game's look and scene, the sidebar (on
  phones the top bar and tabs). The game's dashboard and the pages spanning all
  three (vault, chronicles) share it. Focus screens stay out of it: the
  chronicle table and the printable sheet.
*/
export default async function AppShell({ game, children }: { game: Game; children: ReactNode }) {
  const preferences = await getPreferences();
  return (
    <div data-game={game} data-frames={preferences.simpleFrames ? 'simple' : undefined} className='relative isolate min-h-svh bg-ink text-bone transition-colors duration-500'>
      <Ambience game={game} />
      <SideNav game={game} />
      <main id='main' className='relative px-4 pt-[calc(10.5rem+env(safe-area-inset-top))] pb-32 md:pt-10 md:pr-8 md:pb-16 md:pl-72'>
        <div className='mx-auto max-w-6xl'>
          <PreferencesProvider value={preferences}>{children}</PreferencesProvider>
        </div>
      </main>
    </div>
  );
}
