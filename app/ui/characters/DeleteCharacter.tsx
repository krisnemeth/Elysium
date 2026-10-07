'use client';

import { useState, useTransition } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { deleteCharacter } from '@/app/lib/actions/characters';
import type { Game } from '@/app/lib/games';
import { buttonGhost } from '@/app/ui/kit/styles';

// Two-step delete: the first click asks, the second deletes.
export default function DeleteCharacter({ id, game, name }: { id: string; game: Game; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();

  if (!confirming) {
    return (
      <button type='button' onClick={() => setConfirming(true)} className={buttonGhost}>
        <MdDeleteOutline aria-hidden className='size-4' /> Delete
      </button>
    );
  }
  return (
    <div role='group' aria-label={`Delete ${name}?`} className='inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 p-1 pl-4 text-sm'>
      <span>Delete {name} for good?</span>
      <button
        type='button'
        disabled={pending}
        onClick={() => start(() => deleteCharacter(id, game))}
        className='rounded-full bg-accent px-4 py-1.5 font-semibold text-white transition hover:brightness-110 disabled:opacity-50'
      >
        {pending ? 'Deleting…' : 'Delete'}
      </button>
      <button type='button' onClick={() => setConfirming(false)} className='rounded-full px-3 py-1.5 text-bone/70 hover:text-bone'>
        Cancel
      </button>
    </div>
  );
}
