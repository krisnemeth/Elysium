'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { createContext, use, useEffect, useRef, useState, useTransition, type ReactNode } from 'react';
import { giveTurn, passTurn } from '@/app/lib/actions/social';
import type { Turn } from '@/app/lib/data/social';
import { GAMES, type Game } from '@/app/lib/games';
import { subscribe } from '@/app/lib/supabase/browser';

/*
  Turns at the table. A Storyteller (person) hands them out; with the
  Storyteller bot the turn holder passes, and an idle turn burns down like a
  fuse and passes itself on when it runs out. The server decides when a turn
  has run out; the browser only shows it (`skew` corrects for its clock).
*/

export type Seat = { userId: string; player: string; character: string; game: Game; faction: string | null; portrait: string | null; uploaded: boolean };

type TurnState = {
  turn: Turn | null;
  seats: Seat[];
  holder: Seat | null;
  me: string;
  bot: boolean;
  isStoryteller: boolean;
  myTurn: boolean;
  // Bot chronicles: seconds left in this turn.
  left: number | null;
  pending: boolean;
  error: string;
  pass: () => void;
  give: (userId: string | null) => void;
};

const TurnContext = createContext<TurnState | null>(null);

export function useTurn() {
  return use(TurnContext);
}

// When the fuse starts to burn, in seconds.
const FUSE = 20;

export function TurnProvider({
  chronicleId,
  initial,
  seats,
  me,
  bot,
  isStoryteller,
  serverNow,
  live,
  children,
}: {
  chronicleId: string;
  initial: Turn | null;
  seats: Seat[];
  me: string;
  bot: boolean;
  isStoryteller: boolean;
  // Date.now() on the server when the page was made.
  serverNow: number;
  live: { url: string; anonKey: string };
  children: ReactNode;
}) {
  const [turn, setTurn] = useState(initial);
  const [pending, start] = useTransition();
  const [error, setError] = useState('');
  const [skew] = useState(() => serverNow - Date.now());
  const [now, setNow] = useState(() => serverNow);

  useEffect(
    () =>
      subscribe(live.url, live.anonKey, `turns:${chronicleId}`, 'chronicle_turns', `chronicle_id=eq.${chronicleId}`, ({ new: row }) => {
        if (row && 'started_at' in row) setTurn(row as unknown as Turn);
      }),
    [chronicleId, live.url, live.anonKey],
  );

  const holder = seats.find((s) => s.userId === turn?.user_id) ?? null;
  // Playing alone, turns don't time out: the game waits for you.
  const deadline = bot && turn && holder && seats.length > 1 ? Date.parse(turn.started_at) + turn.seconds * 1000 : null;
  const left = deadline === null ? null : Math.max(0, Math.ceil((deadline - now) / 1000));

  // The clock, for the fuse (bot chronicles only).
  useEffect(() => {
    if (deadline === null) return;
    const tick = setInterval(() => setNow(Date.now() + skew), 250);
    return () => clearInterval(tick);
  }, [deadline, skew]);

  const apply = (r: { error?: string; turn?: Turn | null }) => {
    setError(r.error ?? '');
    if (r.turn) setTurn((t) => (!t || Date.parse(r.turn!.started_at) >= Date.parse(t.started_at) ? r.turn! : t));
  };
  const pass = () => start(async () => apply(await passTurn(chronicleId, turn?.user_id ?? null)));
  const give = (userId: string | null) => start(async () => apply(await giveTurn(chronicleId, userId)));

  // Bot chronicles start the first turn by themselves, and move on from a
  // player who has left. Every open page tries; the server takes the first.
  const startKey = bot && seats.length && !holder ? `${turn?.user_id ?? ''}|${turn?.started_at ?? ''}` : null;
  useEffect(() => {
    if (startKey === null) return;
    void passTurn(chronicleId, turn?.user_id ?? null).then(apply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startKey]);

  // When the fuse runs out, pass the turn on. The server may still disagree
  // for a moment (clocks), so try again shortly.
  const expired = left === 0 && turn ? `${turn.user_id}|${turn.started_at}` : null;
  const tries = useRef(0);
  useEffect(() => {
    if (expired === null) return;
    tries.current = 0;
    const attempt = () => {
      tries.current++;
      void passTurn(chronicleId, turn?.user_id ?? null).then(apply);
    };
    attempt();
    const again = setInterval(() => (tries.current < 5 ? attempt() : clearInterval(again)), 2000);
    return () => clearInterval(again);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired]);

  const value: TurnState = {
    turn,
    seats,
    holder,
    me,
    bot,
    isStoryteller,
    myTurn: !!holder && holder.userId === me,
    left,
    pending,
    error,
    pass,
    give,
  };
  return <TurnContext value={value}>{children}</TurnContext>;
}

// Why the dice are locked, if they are: with the bot, only the turn holder rolls.
export function useRollLock() {
  const t = useTurn();
  if (!t?.bot || !t.holder || t.myTurn) return undefined;
  return `It’s ${t.holder.character}’s turn. Your dice wake on your turn.`;
}

// The players' character cards; the one whose turn it is rises.
export function TurnTracker() {
  const t = useTurn();
  if (!t) return null;
  const { seats, holder, myTurn, bot, isStoryteller, left, turn, pending } = t;
  const solo = seats.length === 1 && !isStoryteller;
  const burning = left !== null && left <= FUSE;

  if (!seats.length)
    return <p className='text-center text-sm text-bone/50'>Turns start once a player brings a character.</p>;

  const controls = (
    <div className='flex min-w-0 flex-col gap-2'>
      <p role='status' className='text-sm text-bone/70'>
        {solo && myTurn ? (
          <>
            <span className='block font-display text-xl leading-tight text-accent'>Playing alone</span>
            <span className='text-bone/45'>No turns to wait for. The game pauses when you leave.</span>
          </>
        ) : holder ? (
          <>
            <span className={clsx('block font-display text-xl leading-tight', myTurn ? 'text-accent' : 'text-bone')}>
              {myTurn ? 'Your turn' : `${holder.character}’s turn`}
            </span>
            {turn && <span className='text-bone/45'>Round {turn.round}</span>}
            {left !== null && (
              <span className={clsx('tabular-nums', burning ? 'text-accent' : 'text-bone/45')}>
                {' '}· {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')} left
              </span>
            )}
          </>
        ) : isStoryteller ? (
          'Nobody’s turn. Choose a player to start.'
        ) : (
          'Nobody’s turn yet. The Storyteller starts them.'
        )}
      </p>
      <span className='flex flex-wrap gap-2'>
        {((myTurn && !solo) || (isStoryteller && holder)) && (
          <button type='button' disabled={pending} onClick={t.pass} className='rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-60'>
            {myTurn ? 'End your turn' : 'Next player'}
          </button>
        )}
        {isStoryteller && holder && (
          <button type='button' disabled={pending} onClick={() => t.give(null)} className='rounded-full border border-bone/20 px-4 py-1.5 text-xs text-bone/80 transition hover:border-bone/50 hover:text-bone'>
            Pause turns
          </button>
        )}
      </span>
    </div>
  );

  return (
    <section aria-label='Turns' className='flex flex-col gap-2'>
      {/* The fuse: burns down over the whole turn, glowing in its last seconds. */}
      {left !== null && turn && (
        <div aria-hidden className='relative h-1 rounded-full bg-bone/10'>
          <div
            className={clsx('absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 ease-linear', burning ? 'bg-accent' : 'bg-bone/35')}
            style={{ width: `${(left / turn.seconds) * 100}%` }}
          >
            {burning && <span className='fuse-spark absolute top-1/2 right-0 size-2.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-accent' />}
          </div>
        </div>
      )}

      <div className='flex flex-wrap items-center justify-between gap-x-6 gap-y-3'>
        {controls}
        <ol className='flex items-end gap-2.5 pt-3'>
          {seats.map((s) => {
            const active = holder?.userId === s.userId;
            const body = (
              <>
                <span className='relative block aspect-[3/4] w-full overflow-hidden rounded-md bg-bone/5'>
                  <Image src={s.portrait ?? GAMES[s.game].figure.src} alt='' fill sizes='5rem' unoptimized={s.uploaded} className='object-cover object-top' />
                </span>
                <span className='mt-1 block truncate font-display text-sm leading-tight'>{s.character}</span>
                <span className='block truncate text-[0.6rem] text-bone/50 short:hidden'>{s.userId === t.me ? 'You' : s.player}</span>
              </>
            );
            const card = clsx(
              'block w-20 rounded-lg border p-1 text-left short:w-16 transition duration-500 ease-(--ease-spring)',
              active ? '-translate-y-3 border-accent bg-accent/10 shadow-[0_0.75rem_2rem_-0.5rem_var(--accent)]' : 'border-bone/10 bg-ink/40',
            );
            return (
              <li key={s.userId} aria-current={active ? 'true' : undefined}>
                {isStoryteller && !bot ? (
                  <button type='button' disabled={pending} onClick={() => t.give(s.userId)} title={`Give ${s.character} the turn`} className={clsx(card, !active && 'hover:-translate-y-1 hover:border-bone/30')}>
                    {body}
                    <span className='sr-only'>{active ? ' (their turn)' : ' (give them the turn)'}</span>
                  </button>
                ) : (
                  <div className={card}>
                    {body}
                    {active && <span className='sr-only'> (their turn)</span>}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      {t.error && <p role='status' className='text-center text-sm text-accent'>{t.error}</p>}
    </section>
  );
}
