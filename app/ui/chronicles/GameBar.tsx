'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import clsx from 'clsx';
import { MdLogout, MdPause } from 'react-icons/md';
import { leaveChronicle } from '@/app/lib/actions/social';
import { buttonGhost, buttonPrimary } from '@/app/ui/kit/styles';
import { Elysium1 } from '@/app/ui/svgs';

/*
  Saving before the page goes away: the player's seat registers its autosave
  here, and the bar waits for it before leaving or pausing.
*/
const flushers = new Set<() => Promise<void>>();
export function registerFlush(fn: () => Promise<void>) {
  flushers.add(fn);
  return () => void flushers.delete(fn);
}
const flushAll = () => Promise.all([...flushers].map((f) => f()));

/*
  The game's own bar, between the two sidebars: the chronicle, the act, and
  the way out. A chronicle is self-contained, so there's no site navigation.
  Playing alone, leaving just pauses the game. With others, leaving the game
  takes you out of the party (confirmed in a dialog); a party member can
  invite you back, and you return with your character as it was.
*/
export default function GameBar({
  chronicleId,
  eyebrow,
  title,
  act,
  acts,
  solo,
}: {
  chronicleId: string;
  eyebrow: string;
  title: string;
  // Bot chronicles: the current act (0-based) and how many there are.
  act?: number;
  acts?: number;
  solo: boolean;
}) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState('');

  const pause = () =>
    start(async () => {
      await flushAll();
      router.push('/vault/chronicles');
    });
  const leave = () =>
    start(async () => {
      await flushAll();
      const r = await leaveChronicle(chronicleId);
      if (r?.error) setError(r.error);
    });

  return (
    <header className='frame relative flex h-14 shrink-0 items-center gap-3 rounded-2xl sm:gap-4 border border-bone/15 bg-ink/70 px-4 shadow-[0_8px_32px_-8px_rgb(0_0_0/0.6),inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl'>
      <Elysium1 aria-hidden className='mt-1 h-auto w-16 shrink-0 text-bone/90' />
      <span aria-hidden className='h-6 w-px shrink-0 bg-bone/15' />
      <div className='min-w-0 grow'>
        <p className='truncate text-[0.6rem] tracking-[0.25em] text-accent uppercase'>{eyebrow}</p>
        <h1 className='truncate font-display text-xl leading-tight'>{title}</h1>
      </div>

      {acts !== undefined && act !== undefined && (
        <ol aria-label={`Act ${act + 1} of ${acts}`} className='hidden shrink-0 items-center gap-1.5 sm:flex'>
          {Array.from({ length: acts }, (_, i) => (
            <li
              key={i}
              aria-hidden
              className={clsx('h-1.5 rounded-full transition-all duration-700', i === act ? 'w-6 bg-accent' : i < act ? 'w-1.5 bg-bone/60' : 'w-1.5 bg-bone/20')}
            />
          ))}
        </ol>
      )}

      {solo ? (
        <button type='button' onClick={pause} disabled={pending} aria-label='Pause and exit' className={`${buttonGhost} shrink-0 px-3 py-1.5 text-xs sm:px-4`}>
          <MdPause aria-hidden className='size-4' /> <span className='hidden sm:inline'>{pending ? 'Saving…' : 'Pause and exit'}</span>
        </button>
      ) : (
        <button type='button' onClick={() => dialog.current?.showModal()} aria-label='Leave the game' className={`${buttonGhost} shrink-0 px-3 py-1.5 text-xs sm:px-4`}>
          <MdLogout aria-hidden className='size-4' /> <span className='hidden sm:inline'>Leave the game</span>
        </button>
      )}

      <dialog
        ref={dialog}
        aria-labelledby='leave-title'
        onClick={(e) => {
          if (e.target === dialog.current && !pending) dialog.current.close();
        }}
        className='m-auto w-[min(28rem,92vw)] rounded-2xl border border-bone/15 bg-ink p-0 text-bone shadow-[0_2rem_6rem_rgb(0_0_0/0.8)] backdrop:bg-black/55 backdrop:backdrop-blur-md'
      >
        <div className='flex flex-col gap-4 p-6'>
          <h2 id='leave-title' className='font-display text-3xl'>Leave the game?</h2>
          <p className='leading-relaxed text-bone/75'>
            You’ll leave the table and the party plays on without you. Your character keeps everything they have right now.
          </p>
          <p className='leading-relaxed text-bone/75'>
            To come back, a party member invites you again, and you rejoin exactly as you left.
          </p>
          {error && <p role='status' className='text-sm text-accent'>{error}</p>}
          <div className='mt-2 flex flex-wrap justify-end gap-3'>
            <button type='button' autoFocus disabled={pending} onClick={() => dialog.current?.close()} className={buttonGhost}>
              Stay
            </button>
            <button type='button' disabled={pending} onClick={leave} className={buttonPrimary}>
              {pending ? 'Leaving…' : 'Leave the game'}
            </button>
          </div>
        </div>
      </dialog>
    </header>
  );
}
