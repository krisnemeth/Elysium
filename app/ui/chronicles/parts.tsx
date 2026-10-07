'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useId, useRef, useState, useTransition } from 'react';
import clsx from 'clsx';
import { addNote, chooseBotPath, inviteFriend, setChronicleCharacter } from '@/app/lib/actions/social';
import type { Approach } from '@/app/lib/storyteller/content';
import type { PartyMember, Roll } from '@/app/lib/data/social';
import { GAMES, type Game } from '@/app/lib/games';
import { SPECIAL_DIE_NAME } from '@/app/lib/dice/rules';
import { subscribe } from '@/app/lib/supabase/browser';
import { buttonGhost, buttonPrimary, fieldInput, fieldLabel } from '@/app/ui/kit/styles';

// ------------------------------------------------------------------ your character

export function CharacterPicker({
  chronicleId,
  current,
  characters,
}: {
  chronicleId: string;
  current: string | null;
  characters: { id: string; name: string; game: Game }[];
}) {
  const id = useId();
  const [pending, start] = useTransition();
  const [error, setError] = useState('');
  return (
    <div className='flex flex-col gap-1'>
      <label htmlFor={id} className={fieldLabel}>Your character here</label>
      <select
        id={id}
        defaultValue={current ?? ''}
        disabled={pending}
        onChange={(e) =>
          start(async () => {
            const r = await setChronicleCharacter(chronicleId, e.target.value || null);
            setError(r.error ?? '');
          })
        }
        className={`${fieldInput} cursor-pointer [&_option]:bg-ink`}
      >
        <option value=''>No character yet</option>
        {characters.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name || 'Unnamed'} ({GAMES[c.game].name})
          </option>
        ))}
      </select>
      {error && <p role='status' className='text-sm text-accent'>{error}</p>}
    </div>
  );
}

// ------------------------------------------------------------------ invites

export function InviteFriends({ chronicleId, friends }: { chronicleId: string; friends: { id: string; name: string }[] }) {
  const id = useId();
  const [choice, setChoice] = useState('');
  const [message, setMessage] = useState('');
  const [pending, start] = useTransition();
  if (!friends.length) return <p className='text-sm text-bone/50'>Everyone on your friends list is already here.</p>;
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={id} className={fieldLabel}>Invite a friend</label>
      <div className='flex items-end gap-3'>
        <select id={id} value={choice} onChange={(e) => setChoice(e.target.value)} className={`${fieldInput} cursor-pointer [&_option]:bg-ink`}>
          <option value=''>Choose…</option>
          {friends.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        <button
          type='button'
          disabled={!choice || pending}
          className={buttonGhost}
          onClick={() =>
            start(async () => {
              const r = await inviteFriend(chronicleId, choice);
              setMessage(r.error ?? 'Invited. They’ll see it on their Chronicles page.');
              setChoice('');
            })
          }
        >
          Invite
        </button>
      </div>
      {message && <p role='status' className='text-sm text-bone/65'>{message}</p>}
    </div>
  );
}

// ------------------------------------------------------------------ Storyteller bot

export function BotChoices({ chronicleId, step, choices }: { chronicleId: string; step: number; choices: { id: Approach; label: string }[] }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState('');
  return (
    <div className='flex flex-col gap-3'>
      <p className={fieldLabel}>What does the group do?</p>
      <div className='flex flex-wrap gap-3'>
        {choices.map((c) => (
          <button
            key={c.id}
            type='button'
            disabled={pending}
            className={buttonPrimary}
            onClick={() =>
              start(async () => {
                const r = await chooseBotPath(chronicleId, step, c.id);
                setError(r.error ?? '');
              })
            }
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className='text-xs text-bone/45'>Talk it over first: whoever clicks decides for the group. Make the suggested rolls in play mode.</p>
      {error && <p role='status' className='text-sm text-accent'>{error}</p>}
    </div>
  );
}

// ------------------------------------------------------------------ notes

export function NoteComposer({ chronicleId, isStoryteller }: { chronicleId: string; isStoryteller: boolean }) {
  const form = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (prev: Awaited<ReturnType<typeof addNote>>, data: FormData) => {
    const result = await addNote(chronicleId, prev, data);
    // Clear the form after a successful save.
    if (result.ok) form.current?.reset();
    return result;
  }, {});
  const ids = { title: useId(), body: useId() };
  return (
    <form ref={form} action={action} className='flex flex-col gap-4'>
      <div className='flex flex-wrap gap-4'>
        <label className='flex cursor-pointer items-center gap-2 text-sm text-bone/75'>
          <input type='radio' name='kind' value='note' defaultChecked className='accent-[var(--accent)]' /> Note
        </label>
        <label className='flex cursor-pointer items-center gap-2 text-sm text-bone/75'>
          <input type='radio' name='kind' value='session' className='accent-[var(--accent)]' /> Session log
        </label>
        <label className='ml-auto flex cursor-pointer items-center gap-2 text-sm text-bone/75'>
          <input type='checkbox' name='private' className='accent-[var(--accent)]' />
          {isStoryteller ? 'Only me' : 'Only me and the Storyteller'}
        </label>
      </div>
      <div className='flex flex-col gap-1'>
        <label htmlFor={ids.title} className={fieldLabel}>Title</label>
        <input id={ids.title} name='title' maxLength={200} placeholder='Session 3: The Weir' className={fieldInput} />
      </div>
      <div className='flex flex-col gap-1'>
        <label htmlFor={ids.body} className={fieldLabel}>Note</label>
        <textarea id={ids.body} name='body' rows={4} required maxLength={20000} className={`${fieldInput} resize-y`} />
      </div>
      {state.error && <p role='status' className='text-sm text-accent'>{state.error}</p>}
      <button disabled={pending} className={`${buttonGhost} self-start`}>Add</button>
    </form>
  );
}

// ------------------------------------------------------------------ live updates

type Live = { url: string; anonKey: string };

// Reloads the page's server data when notes (including the bot's) change.
export function LiveRefresh({ chronicleId, live }: { chronicleId: string; live: Live }) {
  const router = useRouter();
  useEffect(
    () => subscribe(live.url, live.anonKey, `notes:${chronicleId}`, 'chronicle_notes', `chronicle_id=eq.${chronicleId}`, () => router.refresh()),
    [chronicleId, live.url, live.anonKey, router],
  );
  return null;
}

const OUTCOMES: Record<string, string> = {
  critical: 'Critical win',
  win: 'Win',
  failure: 'Failure',
  'total-failure': 'Total failure',
  'messy-critical': 'Messy critical',
  'bestial-failure': 'Bestial failure',
  brutal: 'Brutal outcome',
  overreach: 'Overreach or Despair',
  despair: 'Despair',
};
const GRIM = new Set(['messy-critical', 'bestial-failure', 'brutal', 'overreach', 'despair', 'total-failure']);

export function LiveRolls({ chronicleId, initial, party, live }: { chronicleId: string; initial: Roll[]; party: PartyMember[]; live: Live }) {
  const [rolls, setRolls] = useState(initial);
  const [status, setStatus] = useState('connecting');
  const names = new Map(party.map((p) => [p.user_id, p.display_name]));

  useEffect(
    () =>
      subscribe(
        live.url,
        live.anonKey,
        `rolls:${chronicleId}`,
        'chronicle_rolls',
        `chronicle_id=eq.${chronicleId}`,
        ({ new: row, eventType }) => {
          if (eventType !== 'INSERT') return;
          const roll = row as unknown as Roll;
          setRolls((r) => [roll, ...r.filter((x) => x.id !== roll.id)].slice(0, 50));
        },
        (s) => setStatus(s === 'SUBSCRIBED' ? 'live' : s === 'CHANNEL_ERROR' || s === 'TIMED_OUT' ? 'offline' : 'connecting'),
      ),
    [chronicleId, live.url, live.anonKey],
  );

  return (
    <div className='flex flex-col gap-3'>
      <p className='flex items-center gap-2 text-xs text-bone/45'>
        <span className={clsx('size-2 rounded-full', status === 'live' ? 'animate-pulse bg-accent' : 'bg-bone/30')} />
        {status === 'live' ? 'Live: rolls appear as they happen' : status === 'offline' ? 'Offline: reload to catch up' : 'Connecting…'}
      </p>
      {rolls.length ? (
        <ol className='flex flex-col'>
          {rolls.map((r) => (
            <li key={r.id} className='result-in flex flex-col gap-1 border-b border-bone/[0.07] py-3'>
              <div className='flex items-baseline justify-between gap-3'>
                <span className='text-sm'>
                  <span className='font-display text-lg'>{r.character_name || names.get(r.user_id) || 'Someone'}</span>
                  <span className='text-bone/50'> · {r.label}</span>
                </span>
                <span className={clsx('shrink-0 text-sm', GRIM.has(r.outcome) ? 'text-accent' : 'text-bone')}>{OUTCOMES[r.outcome] ?? r.outcome}</span>
              </div>
              <div className='flex flex-wrap items-center gap-1.5'>
                {r.dice.map((d, i) => (
                  <span
                    key={i}
                    title={d.kind === 'special' ? `${SPECIAL_DIE_NAME[r.game]} die` : 'Die'}
                    className={clsx(
                      'grid size-6 place-items-center rounded-md text-[0.7rem] tabular-nums',
                      d.kind === 'special' ? 'bg-accent/80 text-white' : 'bg-bone/10',
                      d.value < 6 && 'opacity-50',
                    )}
                  >
                    {d.value}
                  </span>
                ))}
                <span className='ml-2 text-xs text-bone/50 tabular-nums'>
                  {r.successes} vs {r.difficulty} ·{' '}
                  {/* Server and browser can be in different time zones. */}
                  <time dateTime={r.created_at} suppressHydrationWarning>
                    {new Date(r.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </time>
                </span>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className='text-sm text-bone/50'>No rolls yet. Rolls made in play mode with this chronicle selected show up here for everyone.</p>
      )}
    </div>
  );
}
