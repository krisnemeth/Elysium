'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useId, useRef, useState, useTransition } from 'react';
import clsx from 'clsx';
import { MdCheck, MdExpandMore, MdLogout, MdOutlinePalette, MdPause } from 'react-icons/md';
import { leaveChronicle } from '@/app/lib/actions/social';
import { GAMES } from '@/app/lib/games';
import { SKINS } from '@/app/lib/table-skin';
import { PREVIEWS } from '@/app/ui/dashboard/ThemePicker';
import { IslandBackdrop, IslandSection, useIsland } from '@/app/ui/kit/Island';
import { buttonGhost, buttonPrimary } from '@/app/ui/kit/styles';
import { Elysium1 } from '@/app/ui/svgs';
import { useTableSkin } from './TableSkin';

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
  The game's own bar, between the two sidebars: the chronicle, the act, the
  table's theme (any of the six scenes; the bar grows to show them,
  dynamic-island style) and the way out. A chronicle is self-contained, so there's no site navigation.
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
  const table = useTableSkin();
  const [themesOpen, setThemesOpen] = useState(false);
  const themesId = useId();
  const themesTrigger = useRef<HTMLButtonElement>(null);
  const closeThemes = useCallback(() => setThemesOpen(false), []);
  useIsland({ open: themesOpen, onEscape: closeThemes, trigger: themesTrigger, lockScroll: false });
  const current = SKINS.find((s) => s.skin === table?.skin);

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
    // The bar keeps its place in the layout; the island grows over the table.
    <div className={clsx('relative h-14 shrink-0', themesOpen && 'z-40')}>
      <IslandBackdrop open={themesOpen} onClose={closeThemes} className='z-0' />
      <header className='absolute inset-x-0 top-0 z-10 rounded-2xl border border-bone/10 bg-ink/80 shadow-[0_8px_32px_-8px_rgb(0_0_0/0.6)] backdrop-blur-xl'>
        <div className='flex h-14 items-center gap-3 px-4 sm:gap-4'>
          <Elysium1 aria-hidden className='mt-1 h-auto w-16 shrink-0 text-bone/90' />
          <span aria-hidden className='h-6 w-px shrink-0 bg-bone/15' />
          <div className='min-w-0 grow'>
            <p className='truncate text-[0.6rem] tracking-[0.25em] text-accent uppercase'>{eyebrow}</p>
            <h1 className='truncate font-display text-xl leading-tight'>{title}</h1>
          </div>

          {acts !== undefined && act !== undefined && (
            <ol aria-label={`Act ${act + 1} of ${acts}`} className='hidden shrink-0 items-center gap-1.5 md:flex'>
              {Array.from({ length: acts }, (_, i) => (
                <li
                  key={i}
                  aria-hidden
                  className={clsx('h-1.5 rounded-full transition-all duration-700', i === act ? 'w-6 bg-accent' : i < act ? 'w-1.5 bg-bone/60' : 'w-1.5 bg-bone/20')}
                />
              ))}
            </ol>
          )}

          {table && (
            <button
              ref={themesTrigger}
              type='button'
              aria-expanded={themesOpen}
              aria-controls={themesId}
              aria-label='Table theme'
              onClick={() => setThemesOpen((o) => !o)}
              className={`${buttonGhost} shrink-0 px-3 py-1.5 text-xs sm:px-4`}
            >
              <MdOutlinePalette aria-hidden className='size-4' />
              <span className='hidden xl:inline'>{current ? GAMES[current.game].modes[current.mode] : 'Theme'}</span>
              <MdExpandMore aria-hidden className={clsx('size-4 transition-transform duration-300', themesOpen && 'rotate-180')} />
            </button>
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
        </div>

        {/* The six scenes, three games by two moods. */}
        {table && (
          <IslandSection open={themesOpen} id={themesId}>
            <div className='border-t border-bone/10 p-3'>
              <p className='mb-2 px-1 text-xs text-bone/55'>Colours and sidebar frames for this table. Your fonts and dice stay with the chronicle’s game.</p>
              <ul className='grid gap-2 sm:grid-cols-3'>
                {SKINS.map(({ skin, game, mode }) => {
                  const p = PREVIEWS[game][mode];
                  const active = table.skin === skin;
                  return (
                    <li key={skin}>
                      <button
                        type='button'
                        aria-pressed={active}
                        onClick={() => {
                          table.setSkin(skin);
                          closeThemes();
                        }}
                        className={clsx(
                          'flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent',
                          active ? 'border-accent/60 bg-accent/10' : 'border-bone/10 hover:border-bone/30',
                        )}
                      >
                        <span aria-hidden className='relative grid h-10 w-14 shrink-0 place-items-center overflow-hidden rounded-lg' style={{ background: p.bg }}>
                          <span className='h-7 w-4 rounded-[4px] bg-black/40' style={p.frame} />
                          <span className='absolute right-1.5 bottom-1.5 size-1.5 rounded-full' style={{ background: p.accent }} />
                        </span>
                        <span className='min-w-0'>
                          <span className='flex items-center gap-1.5 font-display text-base leading-tight'>
                            {GAMES[game].modes[mode]}
                            {active && <MdCheck aria-hidden className='size-4 shrink-0 text-accent' />}
                          </span>
                          <span className='block text-[0.65rem] tracking-[0.15em] text-bone/50 uppercase'>{GAMES[game].name}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </IslandSection>
        )}
      </header>

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
    </div>
  );
}
