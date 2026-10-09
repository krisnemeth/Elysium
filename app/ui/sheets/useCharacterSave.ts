'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Game } from '@/app/lib/games';
import type { Sheet } from '@/app/lib/sheets/types';
import { createCharacter, updateCharacter } from '@/app/lib/actions/characters';

export type SaveState = 'saved' | 'dirty' | 'saving' | 'error';

const SAVE_DELAY = 900;

/*
  Holds a sheet and autosaves it shortly after each change. A character
  without an id is created on its first save. Used by the editor and play mode.
*/
export function useCharacterSave(game: Game, initialId: string | null, initialSheet: Sheet, onCreated?: (id: string) => void) {
  const [sheet, setSheet] = useState(initialSheet);
  const [state, setState] = useState<SaveState>('saved');
  const [error, setError] = useState('');
  const [id, setId] = useState(initialId);

  // Refs so the save loop always sees the latest values.
  const latest = useRef(sheet);
  const idRef = useRef(initialId);
  const inFlight = useRef(false);
  const pending = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const created = useRef(onCreated);
  useEffect(() => {
    created.current = onCreated;
  });

  // Saves the latest sheet, then keeps going while edits arrived mid-save.
  const save = useCallback(async () => {
    clearTimeout(timer.current);
    timer.current = undefined;
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
        const result = idRef.current ? await updateCharacter(idRef.current, game, snapshot) : await createCharacter(game, snapshot);
        if (!result.ok) {
          setState('error');
          setError(result.error);
          return;
        }
        if (!idRef.current) {
          idRef.current = result.id;
          setId(result.id);
          created.current?.(result.id);
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

  // The character's id, saving it first if it's new (e.g. before a portrait upload).
  const ensureId = useCallback(async () => {
    if (idRef.current) return idRef.current;
    await save();
    while (inFlight.current) await new Promise((r) => setTimeout(r, 100));
    return idRef.current;
  }, [save]);

  // Saves anything still waiting on the autosave, e.g. before leaving the page.
  const flush = useCallback(async () => {
    if (timer.current) await save();
    while (inFlight.current) await new Promise((r) => setTimeout(r, 100));
  }, [save]);

  return { sheet, update, state, error, id, retry: save, ensureId, flush };
}
