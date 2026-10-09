import type { ReactNode } from 'react';
import ForceDark from '@/app/ui/ForceDark';
import ActBackdrop from './ActBackdrop';

// A chronicle's page: the act's location behind the table, which fills the screen from lg up.
export default function TableShell({ game, act, children }: { game: string; act: number; children: ReactNode }) {
  return (
    <div data-game={game} className='relative min-h-svh bg-ink text-bone'>
      <ForceDark />
      <ActBackdrop act={act} />
      {/* .chronicle-table (app/games.css) lightens the panels' glass. */}
      <main id='main' className='chronicle-table page-in relative flex flex-col gap-2 p-2 lg:h-svh'>
        {children}
      </main>
    </div>
  );
}
