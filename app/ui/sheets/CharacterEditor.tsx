'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { MdCheck, MdErrorOutline, MdVisibility } from 'react-icons/md';
import type { Game } from '@/app/lib/games';
import type { Sheet } from '@/app/lib/sheets/types';
import { createCharacter, setCharacterStatus, updateCharacter } from '@/app/lib/actions/characters';
import { buttonGhost } from '@/app/ui/kit/styles';
import PortraitPicker from '@/app/ui/characters/PortraitPicker';
import { GAMES } from '@/app/lib/games';
import { SheetProvider } from './SheetContext';

type SaveState = 'saved' | 'dirty' | 'saving' | 'error';

const SAVE_DELAY = 900;

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
  const [sheet, setSheet] = useState(initialSheet);
  const [state, setState] = useState<SaveState>('saved');
  const [error, setError] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [id, setId] = useState(initialId);

  // Refs so the save loop always sees the latest values.
  const latest = useRef(sheet);
  const idRef = useRef(initialId);
  const inFlight = useRef(false);
  const pending = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Saves the latest sheet, then keeps going while edits arrived mid-save.
  const save = useCallback(async () => {
    clearTimeout(timer.current);
    if (inFlight.current) {
      pending.current = true;
      return;
    }
    inFlight.current = true;
    setState('saving');
    try {
      do {
        pending.current = false;
        const snapshot = latest.current;
        const result = idRef.current
          ? await updateCharacter(idRef.current, game, snapshot)
          : await createCharacter(game, snapshot);
        if (!result.ok) {
          setState('error');
          setError(result.error);
          return;
        }
        if (!idRef.current) {
          idRef.current = result.id;
          setId(result.id);
          // Keep editing in place; the URL now points at the saved character.
          window.history.replaceState(null, '', `/vault/${game}/characters/${result.id}/edit`);
        }
        if (latest.current !== snapshot) pending.current = true;
      } while (pending.current);
      setState('saved');
    } finally {
      inFlight.current = false;
    }
  }, [game]);

  const update = useCallback(
    (mutate: (draft: Sheet) => void) => {
      setSheet((s) => {
        const next = structuredClone(s);
        mutate(next);
        latest.current = next;
        return next;
      });
      setState((s) => (s === 'saving' ? s : 'dirty'));
      clearTimeout(timer.current);
      timer.current = setTimeout(() => void save(), SAVE_DELAY);
    },
    [save],
  );

  // Save straight away when the tab is hidden; warn before leaving unsaved work.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden' && timer.current) void save();
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (state === 'dirty' || state === 'saving' || state === 'error') e.preventDefault();
    };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('beforeunload', onLeave);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('beforeunload', onLeave);
    };
  }, [save, state]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const toggleStatus = async () => {
    if (!idRef.current) return;
    const next = status === 'draft' ? 'finished' : 'draft';
    setStatus(next);
    const result = await setCharacterStatus(idRef.current, game, next);
    if (!result.ok) setStatus(status);
  };

  return (
    <SheetProvider value={{ sheet, update }}>
      <div className='sticky top-36 z-30 -mx-1 mb-2 flex flex-wrap items-center justify-end gap-2 md:top-20'>
        <span
          role='status'
          className='mr-auto inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1.5 text-xs text-bone/60 backdrop-blur-md'
        >
          {state === 'saving' && <span className='size-2 animate-pulse rounded-full bg-accent' />}
          {state === 'saved' && <MdCheck aria-hidden className='size-4 text-accent' />}
          {state === 'error' && <MdErrorOutline aria-hidden className='size-4 text-accent' />}
          {state === 'saving'
            ? 'Saving…'
            : state === 'dirty'
              ? 'Unsaved changes'
              : state === 'error'
                ? error
                : id
                  ? 'All changes saved'
                  : 'Start typing to create this character'}
          {state === 'error' && (
            <button type='button' onClick={() => void save()} className='ml-1 underline underline-offset-2 hover:text-bone'>
              Retry
            </button>
          )}
        </span>
        {id && (
          <>
            <button type='button' onClick={toggleStatus} className={`${buttonGhost} bg-ink/70 px-4 py-1.5 text-xs backdrop-blur-md`} aria-pressed={status === 'finished'}>
              {status === 'finished' ? 'Finished · mark as draft' : 'Draft · mark as finished'}
            </button>
            <Link href={`/vault/${game}/characters/${id}`} className={`${buttonGhost} bg-ink/70 px-4 py-1.5 text-xs backdrop-blur-md`}>
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
