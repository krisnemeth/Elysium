import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { getCharacter } from '@/app/lib/data/characters';
import { GAMES } from '@/app/lib/games';
import { ATTRIBUTES, SKILLS } from '@/app/lib/sheets/types';
import { xpTotals } from '@/app/lib/xp/costs';
import { DARK_PACK_NOTICE, NOT_OFFICIAL_NOTICE } from '@/app/lib/dark-pack';
import PrintButton from '@/app/ui/characters/PrintButton';

export async function generateMetadata({ params }: PageProps<'/vault/print/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const c = await getCharacter(id);
  return { title: c ? `${c.name || 'Character'} · printable sheet` : 'Not found' };
}

// Printed dots and boxes, ink-friendly.
function Dots({ value, max = 5, box = false }: { value: number; max?: number; box?: boolean }) {
  return (
    <span className='inline-flex gap-[3px]' aria-label={`${value} of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`inline-block size-[9px] border border-black ${box ? '' : 'rounded-full'} ${i < value ? 'bg-black' : ''}`} />
      ))}
    </span>
  );
}

function Box({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`break-inside-avoid ${className}`}>
      <h2 className='mb-1.5 border-b-2 border-black pb-0.5 text-center font-display text-[13px] font-bold tracking-[0.25em] uppercase'>{title}</h2>
      {children}
    </section>
  );
}

const PROFILE: Record<string, [string, string][]> = {
  vampire: [['name', 'Name'], ['concept', 'Concept'], ['predator', 'Predator'], ['player', 'Player'], ['ambition', 'Ambition'], ['clan', 'Clan'], ['chronicle', 'Chronicle'], ['desire', 'Desire'], ['generation', 'Generation'], ['sire', 'Sire'], ['sect', 'Sect']],
  werewolf: [['name', 'Name'], ['concept', 'Concept'], ['tribe', 'Tribe'], ['player', 'Player'], ['ambition', 'Ambition'], ['auspice', 'Auspice'], ['chronicle', 'Chronicle'], ['desire', 'Desire'], ['patron', 'Patron spirit'], ['pack', 'Pack'], ['breed', 'Breed']],
  hunter: [['name', 'Name'], ['concept', 'Concept'], ['creed', 'Creed'], ['player', 'Player'], ['ambition', 'Ambition'], ['drive', 'Drive'], ['chronicle', 'Chronicle'], ['desire', 'Desire'], ['cell', 'Cell']],
};

export default async function PrintSheet({ params }: PageProps<'/vault/print/[id]'>) {
  const { id } = await params;
  const record = await getCharacter(id);
  if (!record) notFound();
  const { game, sheet: s } = record;
  const { Logo, title } = GAMES[game];
  const xp = xpTotals(s);
  const tracks: [string, number, boolean][] = [
    ['Health', s.trackers.health ?? 0, true],
    ['Willpower', s.trackers.willpower ?? 0, true],
    ...(game === 'vampire'
      ? ([['Humanity', s.trackers.humanity ?? 0, false], ['Hunger', s.trackers.hunger ?? 0, true]] as [string, number, boolean][])
      : game === 'werewolf'
        ? ([['Rage', s.trackers.rage ?? 0, true], ['Harano', s.trackers.harano ?? 0, false], ['Hauglosk', s.trackers.hauglosk ?? 0, false]] as [string, number, boolean][])
        : ([['Desperation', s.trackers.desperation ?? 0, false], ['Danger', s.trackers.danger ?? 0, true]] as [string, number, boolean][])),
  ];
  const maxFor = (t: string) => (['Health', 'Willpower', 'Humanity'].includes(t) ? 10 : 5);

  return (
    <div className='min-h-svh bg-neutral-200 py-8 text-black print:bg-white print:py-0 [color-scheme:light]'>
      <style>{`@page { size: A4; margin: 10mm; } @media print { html, body { background: #fff !important; } }`}</style>
      <div className='mx-auto mb-6 flex max-w-[210mm] items-center justify-between px-4 print:hidden'>
        <Link href={`/vault/${game}/characters/${id}`} className='text-sm text-neutral-700 underline-offset-4 hover:underline'>
          ← Back to {record.name || 'the character'}
        </Link>
        <PrintButton />
      </div>

      <article className='mx-auto flex max-w-[210mm] flex-col gap-4 bg-white p-[10mm] font-sans text-[11px] leading-snug shadow-xl print:max-w-none print:p-0 print:shadow-none'>
        <header className='flex flex-col items-center gap-2'>
          <Logo aria-label={title} role='img' className='h-14 w-auto text-black [--knockout:#fff]' />
        </header>

        <dl className='grid grid-cols-3 gap-x-6 gap-y-1'>
          {PROFILE[game].map(([k, l]) => (
            <div key={k} className='flex items-baseline gap-2 border-b border-neutral-400'>
              <dt className='shrink-0 font-bold uppercase'>{l}</dt>
              <dd className='min-w-0 break-words'>{s.profile[k] ?? ''}</dd>
            </div>
          ))}
        </dl>

        <Box title='Attributes'>
          <div className='grid grid-cols-3 gap-x-6'>
            {Object.entries(ATTRIBUTES).map(([group, list]) => (
              <div key={group}>
                <p className='text-center font-bold uppercase'>{group}</p>
                {list.map((a) => (
                  <div key={a} className='flex items-center justify-between py-px'>
                    {a} <Dots value={s.attributes[a]} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className='mt-2 grid grid-cols-2 gap-x-6 gap-y-1'>
            {tracks.map(([t, v, box]) => (
              <div key={t} className='flex items-center justify-between'>
                <span className='font-bold uppercase'>{t}</span>
                <Dots value={v} max={maxFor(t)} box={box} />
              </div>
            ))}
          </div>
        </Box>

        <Box title='Skills'>
          <div className='grid grid-cols-3 gap-x-6'>
            {Object.entries(SKILLS).map(([group, list]) => (
              <div key={group}>
                {list.map((sk) => (
                  <div key={sk} className='flex items-center justify-between gap-2 border-b border-neutral-200 py-px'>
                    <span className='truncate'>
                      {sk}
                      {s.skills[sk]?.specialty && <span className='italic text-neutral-600'> ({s.skills[sk]!.specialty})</span>}
                    </span>
                    <Dots value={s.skills[sk]?.dots ?? 0} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Box>

        <div className='grid grid-cols-2 gap-x-6 gap-y-4'>
          {s.disciplines && (
            <Box title='Disciplines'>
              {s.disciplines.map((d) => (
                <div key={d.name} className='mb-1'>
                  <div className='flex justify-between font-bold'>{d.name} <Dots value={d.dots} /></div>
                  <p className='text-neutral-700'>{d.powers.filter(Boolean).join(' · ')}</p>
                </div>
              ))}
              {s.bloodPotency !== undefined && (
                <div className='mt-1 flex justify-between font-bold uppercase'>Blood Potency <Dots value={s.bloodPotency} max={10} /></div>
              )}
            </Box>
          )}
          {s.gifts && (
            <Box title='Renown, Gifts & Rites'>
              {s.renown && (
                <div className='mb-1 grid grid-cols-3 gap-2'>
                  {(['glory', 'honor', 'wisdom'] as const).map((r) => (
                    <div key={r} className='flex flex-col items-center capitalize'>{r} <Dots value={s.renown![r]} /></div>
                  ))}
                </div>
              )}
              {s.gifts.map((g) => (
                <div key={g.name} className='flex justify-between border-b border-neutral-200'>{g.name} <span className='text-neutral-600'>{g.source}{g.renown && ` · ${g.renown}`}</span></div>
              ))}
              {!!s.rites?.length && <p className='mt-1'>Rites: {s.rites.join(' · ')}</p>}
            </Box>
          )}
          {s.edges && (
            <Box title='Edges & Perks'>
              {s.edges.map((e) => (
                <div key={e.name} className='mb-1'>
                  <p className='font-bold'>{e.name}</p>
                  {e.perks.map((pk) => <p key={pk} className='pl-3 text-neutral-700'>{pk}</p>)}
                </div>
              ))}
            </Box>
          )}
          <Box title='Advantages & Flaws'>
            {s.advantages.map((a, i) => (
              <div key={i} className='flex justify-between border-b border-neutral-200'>
                <span>{a.name}{a.kind === 'flaw' && ' (flaw)'}</span> <Dots value={a.dots} />
              </div>
            ))}
          </Box>
          <Box title='Convictions & Touchstones'>
            {s.convictions.map((c, i) => (
              <p key={i} className='mb-1'><span className='font-bold'>{c.conviction}</span> — {c.touchstone}</p>
            ))}
          </Box>
          {(s.bane || s.tenets || s.favor || s.ban) && (
            <Box title={s.bane ? 'Bane & Tenets' : 'Favor & Ban'}>
              {s.bane && <p className='mb-1'><span className='font-bold'>Bane: </span>{s.bane}</p>}
              {s.tenets && <p className='mb-1 whitespace-pre-line'><span className='font-bold'>Tenets: </span>{s.tenets}</p>}
              {s.favor && <p className='mb-1'><span className='font-bold'>Favor: </span>{s.favor}</p>}
              {s.ban && <p><span className='font-bold'>Ban: </span>{s.ban}</p>}
            </Box>
          )}
          <Box title='Experience'>
            <p>Total {xp.earned} · Spent {xp.spent} · Available {xp.available}</p>
          </Box>
        </div>

        {(s.biography.appearance || s.biography.history) && (
          <Box title='Biography'>
            {s.biography.appearance && <p className='mb-1'><span className='font-bold'>Appearance: </span>{s.biography.appearance}</p>}
            {s.biography.history && <p className='whitespace-pre-line'><span className='font-bold'>History: </span>{s.biography.history}</p>}
          </Box>
        )}

        <footer className='mt-2 border-t border-neutral-300 pt-2 text-[8px] text-neutral-500'>
          {NOT_OFFICIAL_NOTICE} {DARK_PACK_NOTICE}
        </footer>
      </article>
    </div>
  );
}
