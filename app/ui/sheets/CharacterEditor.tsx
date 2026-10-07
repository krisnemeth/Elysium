'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { GiD10 } from 'react-icons/gi';
import { MdVisibility } from 'react-icons/md';
import { GAMES, type Game } from '@/app/lib/games';
import type { Sheet } from '@/app/lib/sheets/types';
import { setCharacterStatus } from '@/app/lib/actions/characters';
import { buttonGhost } from '@/app/ui/kit/styles';
import PortraitPicker from '@/app/ui/characters/PortraitPicker';
import { SheetProvider } from './SheetContext';
import SaveStatus from './SaveStatus';
import { useCharacterSave } from './useCharacterSave';

const chip = `${buttonGhost} bg-ink/70 px-4 py-1.5 text-xs backdrop-blur-md`;

/*
  Holds the sheet being edited and autosaves it. A new character is created
  on its first save; after that, changes update the same row.
*/
export default function CharacterEditor({
  game,
  id: initialId,
  initialSheet,
  initialStatus = 'draft',
  portrait,
  children,
}: {
  game: Game;
  id: string | null;
  initialSheet: Sheet;
  initialStatus?: 'draft' | 'finished';
  portrait?: string | null;
  children: ReactNode;
}) {
  const { sheet, update, state, error, id, retry } = useCharacterSave(game, initialId, initialSheet, (newId) =>
    // Keep editing in place; the URL now points at the saved character.
    window.history.replaceState(null, '', `/vault/${game}/characters/${newId}/edit`),
  );
  const [status, setStatus] = useState(initialStatus);

  const toggleStatus = async () => {
    if (!id) return;
    const next = status === 'draft' ? 'finished' : 'draft';
    setStatus(next);
    const result = await setCharacterStatus(id, game, next);
    if (!result.ok) setStatus(status);
  };

  return (
    <SheetProvider value={{ sheet, update }}>
      <div className='sticky top-36 z-30 -mx-1 mb-2 flex flex-wrap items-center justify-end gap-2 md:top-20'>
        <SaveStatus
          className='mr-auto'
          state={state}
          error={error}
          saved={id ? 'All changes saved' : 'Start typing to create this character'}
          onRetry={() => void retry()}
        />
        {id && (
          <>
            <button type='button' onClick={toggleStatus} className={chip} aria-pressed={status === 'finished'}>
              {status === 'finished' ? 'Finished · mark as draft' : 'Draft · mark as finished'}
            </button>
            <Link href={`/vault/${game}/characters/${id}/play`} className={chip}>
              <GiD10 aria-hidden /> Play
            </Link>
            <Link href={`/vault/${game}/characters/${id}`} className={chip}>
              <MdVisibility aria-hidden /> View
            </Link>
          </>
        )}
      </div>
      {id && (
        <div className='mb-6'>
          <PortraitPicker id={id} game={game} name={sheet.profile.name ?? ''} src={portrait ?? GAMES[game].figure.src} />
        </div>
      )}
      {children}
    </SheetProvider>
  );
}
