import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import { deleteChronicle, deleteNote, leaveChronicle, removeMember, respondToInvite } from '@/app/lib/actions/social';
import { getCharacter, getCharacters } from '@/app/lib/data/characters';
import { getChronicle, getFriends, getNotes, getRolls, getVotes } from '@/app/lib/data/social';
import { GAMES } from '@/app/lib/games';
import { isUploadedPortrait } from '@/app/lib/portraits';
import { ACT_COUNT, buildArc, knownNpcs, sceneFor, storySoFar } from '@/app/lib/storyteller/generate';
import { SUPABASE_KEY, SUPABASE_URL } from '@/app/lib/supabase/env';
import { panel } from '@/app/ui/kit/styles';
import SocialShell from '@/app/ui/social/SocialShell';
import { ActionButton } from '@/app/ui/social/forms';
import { BotVote, CharacterPicker, InviteFriends, LiveRefresh, LiveRolls, NoteComposer } from '@/app/ui/chronicles/parts';
import ChronicleCharacter from '@/app/ui/chronicles/ChronicleCharacter';
import StorytellerDice from '@/app/ui/chronicles/StorytellerDice';
import PlaySheet from '@/app/ui/play/PlaySheet';

export async function generateMetadata({ params }: PageProps<'/vault/chronicles/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const data = await getChronicle(id);
  return { title: data?.chronicle.name ?? 'Chronicle' };
}

const small = 'rounded-full border border-bone/20 px-4 py-1.5 text-xs text-bone/80 transition hover:border-bone/50 hover:text-bone';
const smallPrimary = 'rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white transition hover:brightness-110';

function Panel({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section aria-label={title} className={`flex flex-col gap-4 p-6 ${panel} ${className}`}>
      <h2 className='font-display text-2xl'>{title}</h2>
      {children}
    </section>
  );
}

export default async function ChroniclePage({ params }: PageProps<'/vault/chronicles/[id]'>) {
  const { id } = await params;
  const data = await getChronicle(id);
  if (!data) notFound();
  const { chronicle: c, party, membership, me } = data;
  const isOwner = c.owner_id === me;

  // Invited but not joined yet: just the invitation.
  if (membership?.status !== 'joined') {
    return (
      <SocialShell game={c.game} eyebrow='Invitation' title={c.name} description={`You’ve been invited to this ${GAMES[c.game].name} chronicle.`}>
        <div className='flex gap-3'>
          <ActionButton action={respondToInvite.bind(null, c.id, true)} className={smallPrimary}>Join the chronicle</ActionButton>
          <ActionButton action={respondToInvite.bind(null, c.id, false)} className={small}>Decline</ActionButton>
        </div>
      </SocialShell>
    );
  }

  const isStoryteller = membership.role === 'storyteller';
  const [rolls, notes, myCharacters, friends] = await Promise.all([getRolls(c.id), getNotes(c.id), getCharacters(), getFriends()]);
  const inParty = new Set(party.map((p) => p.user_id));
  const invitable = friends.filter((f) => f.status === 'accepted' && !inParty.has(f.userId)).map((f) => ({ id: f.userId, name: f.name }));
  const live = { url: SUPABASE_URL, anonKey: SUPABASE_KEY };
  const names = new Map(party.map((p) => [p.user_id, p.user_id === me ? 'You' : p.display_name]));

  const bot = c.storyteller === 'bot' && c.bot ? c.bot : null;
  const arc = bot ? buildArc(bot) : null;
  const scene = bot ? sceneFor(bot) : null;
  const earlier = bot ? storySoFar(bot).slice(0, -1) : [];
  const known = bot ? knownNpcs(bot) : new Set<string>();
  const [votes, myCharacter] = await Promise.all([
    bot ? getVotes(c.id, bot.path.length) : Promise.resolve([]),
    membership.character_id ? getCharacter(membership.character_id) : Promise.resolve(null),
  ]);
  const joined = party.filter((p) => p.status === 'joined').map((p) => ({ id: p.user_id, name: p.display_name }));

  return (
    <SocialShell
      game={c.game}
      eyebrow={`${GAMES[c.game].name} chronicle · ${bot ? 'Storyteller bot' : isStoryteller ? 'You’re the Storyteller' : 'Player'}`}
      title={c.name}
      actions={
        isOwner ? (
          <ActionButton action={deleteChronicle.bind(null, c.id)} className={small} confirm='Delete this chronicle for everyone?'>
            Delete chronicle
          </ActionButton>
        ) : (
          <ActionButton action={leaveChronicle.bind(null, c.id)} className={small} confirm='Leave this chronicle?'>
            Leave
          </ActionButton>
        )
      }
    >
      <LiveRefresh chronicleId={c.id} live={live} />
      <div className='grid gap-5 lg:grid-cols-3'>
        <div className='flex flex-col gap-5 lg:col-span-2'>
          {bot && arc && scene && (
            <Panel title={`${arc.title} · Act ${scene.act + 1} of ${ACT_COUNT}: ${scene.title}`}>
              <p className='text-sm leading-relaxed text-bone/60 italic'>{scene.location}</p>
              <div className='flex flex-col gap-3 text-lg leading-relaxed text-pretty text-bone/85'>
                {scene.narration.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {scene.clues.length > 0 && (
                <ul className='flex flex-col gap-2'>
                  {scene.clues.map((clue, i) => (
                    <li key={i} className='rounded-xl border border-accent/30 bg-accent/[0.06] p-3 text-sm leading-relaxed text-bone/85'>
                      <span className='mr-2 text-[0.6rem] tracking-[0.2em] text-accent uppercase'>Clue</span>
                      {clue}
                    </li>
                  ))}
                </ul>
              )}
              {!!scene.pressure.length && <p className='border-l-2 border-accent/60 pl-4 text-sm text-bone/65'>{scene.pressure.join(' ')}</p>}
              {scene.finished ? (
                <p className='font-display text-xl text-accent'>The story is told. Start a new chronicle for the next one.</p>
              ) : (
                <BotVote chronicleId={c.id} step={bot.path.length} choices={scene.choices} votes={votes} members={joined} me={me} isOwner={isOwner} />
              )}
              {earlier.length > 0 && (
                <details className='group border-t border-bone/10 pt-4'>
                  <summary className='cursor-pointer text-sm text-bone/60 hover:text-bone'>The story so far</summary>
                  <ol className='mt-4 flex flex-col gap-5'>
                    {earlier.map((s) => (
                      <li key={s.act}>
                        <p className='font-display text-lg'>{s.title}</p>
                        {[s.location, ...s.narration, ...s.clues].map((p, i) => (
                          <p key={i} className='mt-1 text-sm leading-relaxed text-bone/65'>{p}</p>
                        ))}
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </Panel>
          )}

          {arc && (
            <Panel title='Who’s who'>
              <ul className='grid gap-4 sm:grid-cols-2'>
                {arc.npcs.filter((n) => known.has(n.role)).map((n) => (
                  <li key={n.name} className='rounded-xl border border-bone/10 bg-bone/[0.02] p-4'>
                    <p className='text-[0.65rem] tracking-[0.2em] text-accent uppercase'>{n.roleLabel}</p>
                    <p className='mt-1 font-display text-xl'>{n.name}</p>
                    <p className='text-sm text-bone/60'>{n.affiliation}</p>
                    <p className='mt-2 text-sm leading-relaxed text-bone/75'>Wants {n.want}. {n.look[0].toUpperCase() + n.look.slice(1)}.</p>
                    {scene?.finished && <p className='mt-2 text-xs text-bone/55 italic'>Their secret: {n.secret}.</p>}
                  </li>
                ))}
              </ul>
              <p className='text-xs text-bone/40'>
                {arc.npcs.length - known.size > 0 && `${arc.npcs.length - known.size} more ${arc.npcs.length - known.size === 1 ? 'person is' : 'people are'} involved. Search for clues to find them. `}
                {!scene?.finished && 'Everyone is hiding something; secrets come out when the story ends.'}
              </p>
            </Panel>
          )}

          {myCharacter ? (
            <Panel title='Play'>
              <PlaySheet game={myCharacter.game} id={myCharacter.id} name={myCharacter.name || 'Unnamed'} initialSheet={myCharacter.sheet} embeddedIn={c.id} />
            </Panel>
          ) : isStoryteller ? (
            <Panel title='Storyteller’s dice'>
              <StorytellerDice chronicleId={c.id} game={c.game} />
            </Panel>
          ) : (
            <Panel title='Play'>
              <p className='text-sm text-bone/60'>Choose the character you’re bringing (under The party) to get your sheet and dice here.</p>
            </Panel>
          )}

          <Panel title='Notes & session log'>
            <NoteComposer chronicleId={c.id} isStoryteller={isStoryteller} />
            <ol className='flex flex-col'>
              {notes.map((n) => (
                <li key={n.id} className='border-t border-bone/[0.07] py-4'>
                  <div className='flex items-baseline justify-between gap-3'>
                    <p className={clsx('font-display text-lg', n.kind === 'bot' && 'text-accent')}>
                      {n.title || (n.kind === 'session' ? 'Session' : 'Note')}
                    </p>
                    <span className='shrink-0 text-xs text-bone/45'>
                      {n.kind === 'bot' ? 'Storyteller bot' : `${names.get(n.author_id) ?? 'Someone'} · ${n.kind === 'session' ? 'session log' : 'note'}`}
                      {n.private && ' · private'} · {new Date(n.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className='mt-1 leading-relaxed whitespace-pre-line text-bone/75'>{n.body}</p>
                  {n.kind !== 'bot' && (n.author_id === me || isOwner) && (
                    <div className='mt-2'>
                      <ActionButton action={deleteNote.bind(null, c.id, n.id)} className='text-xs text-bone/45 underline-offset-2 hover:text-bone hover:underline' confirm='Delete this note?'>
                        Delete
                      </ActionButton>
                    </div>
                  )}
                </li>
              ))}
              {!notes.length && <li className='text-sm text-bone/50'>Nothing written yet.</li>}
            </ol>
          </Panel>
        </div>

        <div className='flex flex-col gap-5'>
          {myCharacter && <ChronicleCharacter record={myCharacter} />}
          <Panel title='The party'>
            <ul className='flex flex-col gap-3'>
              {party.map((p) => (
                <li key={p.user_id} className='flex items-center gap-3'>
                  <span className='relative size-12 shrink-0 overflow-hidden rounded-xl bg-bone/5'>
                    {p.character_id && p.game && (
                      <Image
                        src={p.portrait ?? GAMES[p.game].figure.src}
                        alt=''
                        fill
                        sizes='3rem'
                        unoptimized={isUploadedPortrait(p.portrait)}
                        className='object-cover'
                      />
                    )}
                  </span>
                  <span className='min-w-0 grow'>
                    <span className='block truncate font-display text-lg leading-tight'>
                      {p.character_name ?? (p.status === 'invited' ? 'Invited' : p.role === 'storyteller' ? p.display_name : 'No character yet')}
                    </span>
                    <span className='block truncate text-xs text-bone/50'>
                      {p.display_name}
                      {p.role === 'storyteller' && ' · Storyteller'}
                      {p.status === 'invited' && ' · hasn’t joined'}
                      {p.game && ` · ${GAMES[p.game].name}`}
                    </span>
                  </span>
                  {isStoryteller && p.character_id && p.user_id !== me && (
                    <Link href={`/vault/chronicles/${c.id}/characters/${p.character_id}`} className={small}>Sheet</Link>
                  )}
                  {isOwner && p.user_id !== me && (
                    <ActionButton action={removeMember.bind(null, c.id, p.user_id)} className='text-xs text-bone/40 hover:text-bone' confirm='Remove?'>
                      ✕<span className='sr-only'>Remove {p.display_name}</span>
                    </ActionButton>
                  )}
                </li>
              ))}
            </ul>
            {!isStoryteller && (
              <CharacterPicker
                chronicleId={c.id}
                current={membership.character_id}
                characters={myCharacters.map((ch) => ({ id: ch.id, name: ch.name, game: ch.game }))}
              />
            )}
            <InviteFriends chronicleId={c.id} friends={invitable} />
          </Panel>

          <Panel title='Dice log'>
            <LiveRolls chronicleId={c.id} initial={rolls} party={party} live={live} />
          </Panel>
        </div>
      </div>
    </SocialShell>
  );
}
