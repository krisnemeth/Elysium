'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useId, useRef, useState, useTransition } from 'react';
import clsx from 'clsx';
import { addNote, callBotVote, inviteFriend, setChronicleCharacter, voteBotChoice } from '@/app/lib/actions/social';
import type { Choice } from '@/app/lib/storyteller/generate';
import type { PartyMember, Roll } from '@/app/lib/data/social';
import { GAMES, type Game } from '@/app/lib/games';
import { SPECIAL_DIE_NAME } from '@/app/lib/dice/rules';
import { DICE_STYLES, glyphFor } from '@/app/lib/dice/faces';
import Glyph from '@/app/ui/dice/Glyph';
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

export function BotVote({
  chronicleId,
  step,
  choices,
  votes,
  members,
  me,
  isOwner,
}: {
  chronicleId: string;
  step: number;
  choices: { id: Choice; label: string; test?: string }[];
  votes: { user_id: string; choice: string }[];
  // Joined members, by id, with display names.
  members: { id: string; name: string }[];
  me: string;
  isOwner: boolean;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState('');
  const mine = votes.find((v) => v.user_id === me)?.choice;
  const names = new Map(members.map((m) => [m.id, m.id === me ? 'You' : m.name]));
  const waiting = members.filter((m) => !votes.some((v) => v.user_id === m.id));
  const run = (fn: () => Promise<{ error?: string }>) =>
    start(async () => {
      const r = await fn();
      setError(r.error ?? '');
    });

  return (
    <div className='flex flex-col gap-2.5'>
      <p className={fieldLabel}>What does the group do? Everyone votes.</p>
      <ul className='grid gap-2 sm:grid-cols-2 2xl:grid-cols-4'>
        {choices.map((c) => {
          const voters = votes.filter((v) => v.choice === c.id);
          const chosen = mine === c.id;
          return (
            <li key={c.id}>
              <button
                type='button'
                disabled={pending}
                aria-pressed={chosen}
                onClick={() => run(() => voteBotChoice(chronicleId, step, c.id))}
                className={clsx(
                  'flex h-full w-full flex-col items-start gap-0.5 rounded-xl border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-60',
                  chosen ? 'border-accent bg-accent/15' : 'border-bone/15 hover:border-bone/40',
                )}
              >
                <span className='flex w-full items-baseline justify-between gap-2'>
                  <span className='font-display text-lg leading-tight'>{c.label}</span>
                  {voters.length > 0 && <span className='text-xs text-accent tabular-nums'>{voters.length}</span>}
                </span>
                {c.test && <span className='text-xs text-bone/55 short:line-clamp-1' title={`Roll: ${c.test}`}>Roll: {c.test}</span>}
                {voters.length > 0 && <span className='text-xs text-bone/70'>{voters.map((v) => names.get(v.user_id) ?? 'Someone').join(', ')}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-bone/55'>
        <span role='status'>
          {votes.length} of {members.length} voted
          {waiting.length > 0 && ` · waiting for ${waiting.map((m) => names.get(m.id)).join(', ')}`}
        </span>
        <span className='short:hidden'>You can change your vote until everyone has voted; ties go to the creator.</span>
        {isOwner && votes.length > 0 && waiting.length > 0 && (
          <button type='button' disabled={pending} onClick={() => run(() => callBotVote(chronicleId, step))} className='rounded-full border border-bone/20 px-3 py-1 text-bone/80 hover:border-bone/50 hover:text-bone'>
            End the vote now
          </button>
        )}
      </div>
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

// Reloads the page's server data when notes (including the bot's), votes or the party change.
export function LiveRefresh({ chronicleId, live }: { chronicleId: string; live: Live }) {
  const router = useRouter();
  useEffect(() => {
    const filter = `chronicle_id=eq.${chronicleId}`;
    const stopNotes = subscribe(live.url, live.anonKey, `notes:${chronicleId}`, 'chronicle_notes', filter, () => router.refresh());
    const stopVotes = subscribe(live.url, live.anonKey, `votes:${chronicleId}`, 'chronicle_votes', filter, () => router.refresh());
    const stopParty = subscribe(live.url, live.anonKey, `party:${chronicleId}`, 'chronicle_members', filter, () => router.refresh());
    return () => {
      stopNotes();
      stopVotes();
      stopParty();
    };
  }, [chronicleId, live.url, live.anonKey, router]);
  return null;
}

/*
  One die as the official dice show it: a d10's kite-shaped face in the
  game's colours, with the symbol that value shows (none on a blank face).
  Faces that score nothing are dimmed, unless they carry a grim symbol.
*/
function DieFace({ game, kind, value }: { game: Game; kind: 'regular' | 'special'; value: number }) {
  const style = DICE_STYLES[game][kind];
  const glyph = glyphFor(game, kind, value);
  const name = `${kind === 'special' ? `${SPECIAL_DIE_NAME[game]} die` : 'Die'}: ${value}`;
  return (
    <span
      role='img'
      aria-label={name}
      title={name}
      className={clsx('relative grid h-8 w-7 place-items-center pt-1', value < 6 && !glyph && 'opacity-45')}
      // The symbol is drawn in currentColor: the die's own ink.
      style={{ backgroundColor: style.face, color: style.glyph, clipPath: 'polygon(50% 0, 100% 70%, 50% 100%, 0 70%)' }}
    >
      {glyph && <Glyph name={glyph} className='inline-block size-4.5' />}
    </span>
  );
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
                  <DieFace key={i} game={r.game} kind={d.kind} value={d.value} />
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
