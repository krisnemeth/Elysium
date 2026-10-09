'use client';

import { GAMES, type Game } from '@/app/lib/games';
import type { Sheet } from '@/app/lib/sheets/types';
import { buttonGhost, panel } from '@/app/ui/kit/styles';
import CategoryDividers from '@/app/ui/sheets/CategoryDividers';
import { GAME_SHEETS } from '@/app/ui/sheets/game-sheets';
import { SheetProvider } from '@/app/ui/sheets/SheetContext';
import SheetModal from './SheetModal';

/*
  The full character sheet, editable, in a dialog over the table. It edits
  the same sheet the table holds (and autosaves), so the tracks, the dice and
  the sheet never disagree.
*/
export default function SheetDialog({ game, label, sheet, update }: { game: Game; label: string; sheet: Sheet; update: (fn: (s: Sheet) => void) => void }) {
  const { Logo, title } = GAMES[game];
  return (
    <SheetModal label={label} trigger='Character sheet' triggerClassName={`${buttonGhost} w-full`}>
      <SheetProvider value={{ sheet, update }}>
        <div data-game={game} className='flex flex-col gap-6'>
          <div className='flex justify-center py-2'>
            <Logo aria-label={title} role='img' className='h-auto w-56 text-bone/80' />
          </div>
          {GAME_SHEETS[game].map(({ id, label, body }) => (
            <section key={id} aria-labelledby={`sheet-${id}`} className={`p-5 md:p-8 ${panel}`}>
              <CategoryDividers id={`sheet-${id}`} title={label} />
              <div className='mt-8'>{body}</div>
            </section>
          ))}
        </div>
      </SheetProvider>
    </SheetModal>
  );
}
