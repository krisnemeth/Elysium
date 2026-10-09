'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useEffect, useState, type ReactNode } from 'react';
import { GAMES, type Game } from '@/app/lib/games';
import type { Damage, Sheet } from '@/app/lib/sheets/types';
import { NO_DAMAGE } from '@/app/lib/play/damage';
import { panel } from '@/app/ui/kit/styles';
import PoolRoller from '@/app/ui/play/PoolRoller';
import { MiniDamageTrack, MiniPointTrack } from '@/app/ui/play/tracks';
import SaveStatus from '@/app/ui/sheets/SaveStatus';
import { useCharacterSave } from '@/app/ui/sheets/useCharacterSave';
import { registerFlush } from './GameBar';
import SheetDialog from './SheetDialog';
import { useRollLock } from './turns';

/*
  The chronicle table: the character on the left, the story and the turns in
  the middle, the dice on the right. From lg up the three columns fill the
  screen and only panels scroll inside themselves; on smaller screens one
  column shows at a time, picked from tabs.
*/

const COLUMNS = [
  { id: 'left', label: 'Character' },
  { id: 'middle', label: 'Table' },
  { id: 'right', label: 'Dice' },
] as const;
type Column = (typeof COLUMNS)[number]['id'];

const column = 'min-h-0 flex-col gap-2 lg:flex';

/*
  `bar` is the game's own bar: over the middle column from lg up (the
  sidebars run the full height either side of it), above the tabs below lg.
  The sidebars are wide; the story column stays a comfortable reading width.
*/
export function TableColumns({ bar, left, right, children, leftLabel = 'Character' }: { bar: ReactNode; left: ReactNode; right: ReactNode; children: ReactNode; leftLabel?: string }) {
  const [shown, setShown] = useState<Column>('middle');
  return (
    <div className='flex min-h-0 grow flex-col gap-2'>
      <div className='lg:hidden'>{bar}</div>
      <div role='tablist' aria-label='Table' className='flex gap-1 self-center rounded-full border border-bone/10 bg-ink/50 p-1 lg:hidden'>
        {COLUMNS.map((c) => (
          <button
            key={c.id}
            type='button'
            role='tab'
            aria-selected={shown === c.id}
            onClick={() => setShown(c.id)}
            className={clsx('rounded-full px-4 py-1.5 text-sm transition-colors', shown === c.id ? 'bg-accent text-white' : 'text-bone/70 hover:text-bone')}
          >
            {c.id === 'left' ? leftLabel : c.label}
          </button>
        ))}
      </div>
      <div className='grid min-h-0 grow gap-2 lg:grid-cols-[18rem_minmax(0,1fr)_18rem] xl:grid-cols-[22rem_minmax(0,1fr)_22rem]'>
        <aside aria-label={leftLabel} className={clsx(column, shown === 'left' ? 'flex' : 'hidden')}>{left}</aside>
        <div className={clsx(column, shown === 'middle' ? 'flex' : 'hidden')}>
          <div className='hidden lg:block'>{bar}</div>
          {children}
        </div>
        <aside aria-label='Dice' className={clsx(column, shown === 'right' ? 'flex' : 'hidden')}>{right}</aside>
      </div>
    </div>
  );
}

// Tabs inside a column. Every tab stays mounted (the dice keep their state).
// `footer` stays in view under every tab (e.g. the group's vote).
// `tight` is for the narrow sidebars.
export function ColumnTabs({ label, tabs, footer, tight = false, className = '' }: { label: string; tabs: { id: string; label: string; content: ReactNode }[]; footer?: ReactNode; tight?: boolean; className?: string }) {
  const [shown, setShown] = useState(tabs[0]?.id);
  return (
    <section aria-label={label} className={`flex min-h-0 grow flex-col ${panel} ${className}`}>
      {tabs.length > 1 ? (
        <div role='tablist' aria-label={label} className='flex shrink-0 gap-4 border-b border-bone/10 px-4'>
          {tabs.map((t) => (
            <button
              key={t.id}
              type='button'
              role='tab'
              aria-selected={shown === t.id}
              onClick={() => setShown(t.id)}
              className={clsx(
                '-mb-px border-b-2 py-3 font-display text-lg transition-colors',
                shown === t.id ? 'border-accent text-bone' : 'border-transparent text-bone/50 hover:text-bone',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      ) : (
        <h2 className='shrink-0 border-b border-bone/10 px-4 py-3 font-display text-lg'>{tabs[0]?.label}</h2>
      )}
      {tabs.map((t) => (
        <div key={t.id} role={tabs.length > 1 ? 'tabpanel' : undefined} hidden={shown !== t.id} className={clsx('min-h-0 grow overflow-y-auto p-4 [&:not([hidden])]:flex [&:not([hidden])]:flex-col', !tight && 'lg:p-5')}>
          {t.content}
        </div>
      ))}
      {footer && <div className='shrink-0 border-t border-bone/10 px-5 pt-3 pb-4'>{footer}</div>}
    </section>
  );
}

const label = 'text-[0.6rem] tracking-[0.2em] text-bone/50 uppercase';

// A player's seat at the table: their character on the left, their dice on the right.
export function PlayTable({
  chronicleId,
  game,
  id,
  name,
  initialSheet,
  portrait,
  faction,
  log,
  bar,
  children,
}: {
  chronicleId: string;
  game: Game;
  id: string;
  name: string;
  initialSheet: Sheet;
  portrait: { src: string; unoptimized: boolean };
  faction: string;
  // The chronicle's shared dice log.
  log: ReactNode;
  bar: ReactNode;
  children: ReactNode;
}) {
  const { sheet, update, state, error, retry, flush } = useCharacterSave(game, id, initialSheet);
  useEffect(() => registerFlush(flush), [flush]);
  const locked = useRollLock();
  const t = sheet.trackers;
  const setDamage = (track: 'health' | 'willpower') => (d: Damage) =>
    update((s) => {
      s.damage = { ...s.damage, [track]: d };
    });
  const setTracker = (key: string) => (v: number) =>
    update((s) => {
      s.trackers[key] = v;
    });

  // Only what changes at the table: the full, editable sheet is one tap away.
  const special =
    game === 'vampire'
      ? { label: 'Hunger', key: 'hunger', shape: 'box' as const }
      : game === 'werewolf'
        ? { label: 'Rage', key: 'rage', shape: 'box' as const }
        : { label: 'Desperation', key: 'desperation', shape: 'dot' as const };

  const character = (
    // The frame draws just outside the panel, so the scrolling happens inside it.
    <section aria-label='Your character' className={`skin-frame flex min-h-0 grow flex-col ${panel}`}>
      <div className='flex min-h-0 grow flex-col gap-5 overflow-y-auto p-4'>
        {/* The character card. */}
        <div className='relative aspect-[4/3] shrink-0 overflow-hidden rounded-xl short:aspect-[16/9]'>
          <Image src={portrait.src} unoptimized={portrait.unoptimized} alt='' fill sizes='22rem' className='object-cover object-top' />
          <div className='absolute inset-0 bg-linear-to-t from-ink via-ink/30 to-transparent' />
          <div className='absolute inset-x-0 bottom-0 p-3'>
            <p className={label}>{faction || GAMES[game].noun.one}</p>
            <h2 className='line-clamp-2 font-display text-2xl leading-tight'>{sheet.profile.name || name}</h2>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <MiniDamageTrack label='Health' max={t.health ?? 0} damage={sheet.damage?.health ?? NO_DAMAGE} onChange={setDamage('health')} downLabel={game === 'vampire' ? 'Torpor' : 'Down'} />
          <MiniDamageTrack label='Willpower' max={t.willpower ?? 0} damage={sheet.damage?.willpower ?? NO_DAMAGE} onChange={setDamage('willpower')} downLabel='Impaired' />
          <MiniPointTrack label={special.label} value={t[special.key] ?? 0} onChange={setTracker(special.key)} shape={special.shape} />
        </div>

        <div className='mt-auto flex flex-col gap-2'>
          <SheetDialog game={game} label={`${sheet.profile.name || name}’s sheet`} sheet={sheet} update={update} />
          <SaveStatus className='self-center' state={state} error={error} onRetry={() => void retry()} />
        </div>
      </div>
    </section>
  );

  return (
    <TableColumns
      bar={bar}
      left={character}
      right={
        <ColumnTabs
          label='Dice'
          tight
          className='skin-frame'
          tabs={[
            { id: 'roll', label: 'Roll', content: <PoolRoller game={game} name={name} sheet={sheet} update={update} shareTo={chronicleId} compact locked={locked} /> },
            { id: 'log', label: 'Dice log', content: log },
          ]}
        />
      }
    >
      {children}
    </TableColumns>
  );
}
