'use client';

import { MdCheck, MdErrorOutline } from 'react-icons/md';
import type { SaveState } from './useCharacterSave';

// The "Saving… / All changes saved" chip shown while editing or playing.
export default function SaveStatus({
  state,
  error,
  saved = 'All changes saved',
  onRetry,
  className = '',
}: {
  state: SaveState;
  error: string;
  saved?: string;
  onRetry: () => void;
  className?: string;
}) {
  return (
    <span role='status' className={`inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1.5 text-xs text-bone/60 backdrop-blur-md ${className}`}>
      {state === 'saving' && <span className='size-2 animate-pulse rounded-full bg-accent' />}
      {state === 'saved' && <MdCheck aria-hidden className='size-4 text-accent' />}
      {state === 'error' && <MdErrorOutline aria-hidden className='size-4 text-accent' />}
      {state === 'saving' ? 'Saving…' : state === 'dirty' ? 'Unsaved changes' : state === 'error' ? error : saved}
      {state === 'error' && (
        <button type='button' onClick={onRetry} className='ml-1 underline underline-offset-2 hover:text-bone'>
          Retry
        </button>
      )}
    </span>
  );
}
