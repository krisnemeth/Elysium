import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { MdArrowBack, MdEdit } from 'react-icons/md';
import { getCharacter, toCharacter } from '@/app/lib/data/characters';
import { GAMES, isGame } from '@/app/lib/games';
import { ATTRIBUTES, SKILLS } from '@/app/lib/sheets/types';
import { buttonGhost, buttonPrimary, panel } from '@/app/ui/kit/styles';
import { FactionMark, factionName } from '@/app/ui/game/FactionMark';
import Dots from '@/app/ui/characters/Dots';
import DeleteCharacter from '@/app/ui/characters/DeleteCharacter';
import Stagger from '@/app/ui/kit/Stagger';

export async function generateMetadata({ params }: PageProps<'/vault/[game]/characters/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const c = await getCharacter(id);
  return { title: c?.name || 'Character' };
}

const label = 'text-[0.7rem] tracking-[0.2em] text-bone/50 uppercase';

function Block({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`p-6 ${panel} ${className}`}>
      <h2 className='font-display text-2xl'>{title}</h2>
      <div className='mt-4'>{children}</div>
    </section>
  );
}

function Prose({ text }: { text?: string }) {
  if (!text) return <p className='text-sm text-bone/35'>Not written yet.</p>;
  return <p className='leading-relaxed whitespace-pre-line text-pretty text-bone/80'>{text}</p>;
}

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

const PROFILE_LABELS: Record<string, string> = {
  concept: 'Concept',
  chronicle: 'Chronicle',
  ambition: 'Ambition',
  desire: 'Desire',
  predator: 'Predator type',
  sire: 'Sire',
  clan: 'Clan',
  generation: 'Generation',
  sect: 'Sect',
  pack: 'Pack',
  patron: 'Patron spirit',
  tribe: 'Tribe',
  auspice: 'Auspice',
  breed: 'Breed',
  cell: 'Cell',
  creed: 'Creed',
  drive: 'Drive',
  player: 'Player',
  resonance: 'Resonance',
};

const TRACK_LABELS: Record<string, [string, number, 'dot' | 'box']> = {
  health: ['Health', 10, 'box'],
  willpower: ['Willpower', 10, 'box'],
  humanity: ['Humanity', 10, 'dot'],
  hunger: ['Hunger', 5, 'box'],
  rage: ['Rage', 5, 'box'],
  harano: ['Harano', 5, 'dot'],
  hauglosk: ['Hauglosk', 5, 'dot'],
  desperation: ['Desperation', 5, 'dot'],
  danger: ['Danger', 5, 'dot'],
};

export default async function CharacterPage({ params }: PageProps<'/vault/[game]/characters/[id]'>) {
  const { game, id } = await params;
  if (!isGame(game)) notFound();
  const record = await getCharacter(id);
  if (!record || record.game !== game) notFound();

  const c = toCharacter(record);
  const s = record.sheet;
  const profileRows = Object.entries(PROFILE_LABELS).filter(([k]) => s.profile[k]);
  const skillRows = Object.entries(SKILLS).map(([group, list]) => [group, list.filter((sk) => s.skills[sk]?.dots)] as const);
  const advantages = s.advantages.filter((a) => a.kind !== 'flaw');
  const flaws = s.advantages.filter((a) => a.kind === 'flaw');

  return (
    <div className='flex flex-col gap-8'>
      <Link href={`/vault/${game}/characters`} className='inline-flex items-center gap-1.5 self-start text-sm text-bone/60 transition-colors hover:text-bone'>
        <MdArrowBack aria-hidden /> All {GAMES[game].noun.many}
      </Link>

      {/* Identity */}
      <header className={`relative grid overflow-hidden md:grid-cols-[18rem_1fr] ${panel}`}>
        <div className='relative aspect-[3/4] md:aspect-auto md:min-h-96'>
          <Image src={c.image.src} alt={`Portrait of ${c.name}.`} fill sizes='(max-width: 768px) 100vw, 18rem' className='object-cover' preload />
          <div className='absolute inset-0 bg-linear-to-t from-ink/80 to-transparent md:bg-linear-to-r md:from-transparent md:to-ink/30' />
        </div>
        <div className='flex flex-col gap-5 p-6 md:p-8'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-xs tracking-[0.25em] text-accent uppercase'>
                {GAMES[game].name} · {factionName(c) || GAMES[game].noun.one}
                {record.status === 'draft' && ' · draft'}
              </p>
              <h1 className='mt-2 font-display text-5xl leading-none tracking-tight md:text-6xl'>{c.name}</h1>
            </div>
            <FactionMark character={c} className='h-12 max-w-14 shrink-0 text-bone/60 [--knockout:transparent]' />
          </div>
          {record.summary && <p className='max-w-[60ch] leading-relaxed text-pretty text-bone/70'>{record.summary}</p>}
          <dl className='grid gap-x-8 gap-y-3 sm:grid-cols-2'>
            {profileRows.map(([k, l]) => (
              <div key={k}>
                <dt className={label}>{l}</dt>
                <dd className='mt-0.5 text-bone/90'>{s.profile[k]}</dd>
              </div>
            ))}
          </dl>
          <div className='mt-auto flex flex-wrap gap-3 pt-2'>
            <Link href={`/vault/${game}/characters/${id}/edit`} className={buttonPrimary}>
              <MdEdit aria-hidden className='size-4' /> Edit sheet
            </Link>
            <Link href={`/vault/${game}/dice`} className={buttonGhost}>Roll dice</Link>
            <DeleteCharacter id={id} game={game} name={c.name} />
          </div>
        </div>
      </header>

      <Stagger className='grid gap-5 lg:grid-cols-2'>
        <Block title='Attributes'>
          <div className='grid gap-6 sm:grid-cols-3'>
            {Object.entries(ATTRIBUTES).map(([group, attrs]) => (
              <div key={group}>
                <p className={`${label} text-accent`}>{group}</p>
                <ul className='mt-2 flex flex-col gap-2'>
                  {attrs.map((a) => (
                    <li key={a} className='flex items-center justify-between gap-2 text-sm'>
                      {a} <Dots label={a} value={s.attributes[a]} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>

        <Block title='Trackers'>
          <ul className='flex flex-col gap-3'>
            {Object.entries(TRACK_LABELS)
              .filter(([k]) => k in s.trackers)
              .map(([k, [l, max, shape]]) => (
                <li key={k} className='flex items-center justify-between gap-4 text-sm'>
                  <span>{l}</span>
                  <Dots label={l} value={s.trackers[k]} max={max} shape={shape} />
                </li>
              ))}
            {s.bloodPotency !== undefined && (
              <li className='flex items-center justify-between gap-4 text-sm'>
                <span>Blood Potency</span>
                <Dots label='Blood Potency' value={s.bloodPotency} max={10} />
              </li>
            )}
          </ul>
        </Block>

        <Block title='Skills' className='lg:col-span-2'>
          <div className='grid gap-6 sm:grid-cols-3'>
            {skillRows.map(([group, list]) => (
              <div key={group}>
                <p className={`${label} text-accent`}>{group}</p>
                <ul className='mt-2 flex flex-col gap-2'>
                  {list.length ? (
                    list.map((sk) => (
                      <li key={sk} className='flex items-center justify-between gap-2 text-sm'>
                        <span>
                          {sk}
                          {s.skills[sk]?.specialty && <span className='block text-xs text-bone/50 italic'>{s.skills[sk]!.specialty}</span>}
                        </span>
                        <Dots label={sk} value={s.skills[sk]!.dots} />
                      </li>
                    ))
                  ) : (
                    <li className='text-sm text-bone/35'>None</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </Block>

        {s.disciplines && (
          <Block title='Disciplines'>
            <ul className='flex flex-col gap-4'>
              {s.disciplines.map((d) => (
                <li key={d.name}>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='font-display text-lg'>{d.name}</span>
                    <Dots label={d.name} value={d.dots} />
                  </div>
                  <p className='text-sm text-bone/60'>{d.powers.filter(Boolean).join(' · ')}</p>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {s.gifts && (
          <Block title='Renown, gifts & rites'>
            {s.renown && (
              <ul className='mb-5 grid grid-cols-3 gap-3'>
                {(['glory', 'honor', 'wisdom'] as const).map((r) => (
                  <li key={r} className='flex flex-col items-start gap-1 text-sm capitalize'>
                    {r} <Dots label={r} value={s.renown![r]} />
                  </li>
                ))}
              </ul>
            )}
            <ul className='flex flex-col gap-2'>
              {s.gifts.map((g) => (
                <li key={g.name} className='flex items-baseline justify-between gap-3 border-b border-bone/[0.07] pb-2'>
                  <span className='font-display text-lg'>{g.name}</span>
                  <span className={label}>{g.source}</span>
                </li>
              ))}
            </ul>
            {!!s.rites?.length && <p className='mt-3 text-sm text-bone/60'>Rites: {s.rites.join(' · ')}</p>}
          </Block>
        )}

        {s.edges && (
          <Block title='Edges & perks'>
            <ul className='flex flex-col gap-3'>
              {s.edges.map((e) => (
                <li key={e.name}>
                  <span className='font-display text-lg'>{e.name}</span>
                  {e.perks.map((p) => (
                    <p key={p} className='text-sm text-bone/60'>Perk: {p}</p>
                  ))}
                </li>
              ))}
            </ul>
          </Block>
        )}

        <Block title='Advantages & flaws'>
          <ul className='flex flex-col gap-2'>
            {[...advantages, ...flaws].map((a, i) => (
              <li key={i} className='flex items-start justify-between gap-3 border-b border-bone/[0.07] pb-2 text-sm'>
                <span>
                  <span className={a.kind === 'flaw' ? 'text-accent' : ''}>{a.name}</span>
                  {a.note && <span className='block text-xs text-bone/50'>{a.note}</span>}
                </span>
                <Dots label={a.name} value={a.dots} />
              </li>
            ))}
          </ul>
        </Block>

        <Block title='Convictions & touchstones'>
          <ul className='flex flex-col gap-3'>
            {s.convictions.map((cv, i) => (
              <li key={i}>
                <p className='font-display text-lg leading-snug'>“{cv.conviction}”</p>
                <p className='text-sm text-bone/60'>{cv.touchstone}</p>
              </li>
            ))}
            {!s.convictions.length && <li className='text-sm text-bone/35'>None yet.</li>}
          </ul>
        </Block>

        {(s.bane || s.favor || s.ban || s.tenets) && (
          <Block title={s.bane ? 'Bane & tenets' : 'Favor & ban'}>
            <div className='flex flex-col gap-4 text-sm'>
              {s.bane && <div><p className={label}>Clan bane</p><Prose text={s.bane} /></div>}
              {s.tenets && <div><p className={label}>Chronicle tenets</p><Prose text={s.tenets} /></div>}
              {(s.favor || s.ban) && (
                <>
                  <div><p className={label}>Favor</p><Prose text={s.favor} /></div>
                  <div><p className={label}>Ban</p><Prose text={s.ban} /></div>
                </>
              )}
            </div>
          </Block>
        )}

        <Block title='Biography' className='lg:col-span-2'>
          <dl className='mb-5 grid gap-4 sm:grid-cols-2'>
            <div>
              <dt className={label}>Born</dt>
              <dd>{fmtDate(s.biography.born)}</dd>
            </div>
            <div>
              <dt className={label}>{game === 'vampire' ? 'Embraced' : game === 'werewolf' ? 'First Change' : 'The Reckoning'}</dt>
              <dd>{fmtDate(s.biography.turned)}</dd>
            </div>
          </dl>
          <div className='grid gap-6 md:grid-cols-2'>
            <div>
              <p className={label}>Appearance</p>
              <Prose text={[s.biography.appearance, s.biography.features].filter(Boolean).join('\n\n')} />
            </div>
            <div>
              <p className={label}>History</p>
              <Prose text={s.biography.history} />
            </div>
          </div>
          {s.notes && (
            <div className='mt-6'>
              <p className={label}>Notes</p>
              <Prose text={s.notes} />
            </div>
          )}
        </Block>
      </Stagger>
    </div>
  );
}
