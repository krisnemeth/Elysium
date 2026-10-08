import Link from 'next/link';
import { MdAdd, MdArrowOutward } from 'react-icons/md';
import { GiD10, GiScrollUnfurled } from 'react-icons/gi';
import PageHeader from '@/app/ui/kit/PageHeader';
import Stagger from '@/app/ui/kit/Stagger';
import EmptyState from '@/app/ui/kit/EmptyState';
import CharacterRow from '@/app/ui/dashboard/CharacterRow';
import { panel, buttonPrimary, buttonGhost } from '@/app/ui/kit/styles';
import type { Character } from '@/app/lib/sample-characters';
import { LORE_KINDS, type LoreKind } from '@/app/lib/loresheets';
import { LORE_ICONS } from '@/app/ui/loresheets/icons';

// Vampire dashboard overview (the revamp design).
export default function VampireOverview({
  characters: mine,
  loresheets = [],
}: {
  characters: Character[];
  loresheets?: { id: string; title: string; kind: LoreKind }[];
}) {
  const finished = mine.filter((c) => c.status === 'finished');
  const drafts = mine.filter((c) => c.status === 'draft');

  const stats = [
    { label: 'Characters finished', value: finished.length },
    { label: 'Drafts in progress', value: drafts.length },
    { label: 'Loresheets', value: loresheets.length },
  ];

  return (
    <div className='flex flex-col gap-10'>
      <PageHeader
        eyebrow='Overview'
        title='Good evening.'
        description='Your coterie, as you left it. Pick up a draft, open a sheet or roll a few dice before the session.'
        actions={
          <>
            <Link href='/vault/vampire/new' className={buttonPrimary}>
              <MdAdd aria-hidden className='size-4 transition-transform duration-300 group-hover:rotate-90' />
              New character
            </Link>
            <Link href='/vault/vampire/dice' className={buttonGhost}>
              <GiD10 aria-hidden className='size-4 transition-transform duration-500 ease-(--ease-spring) group-hover:rotate-180' />
              Roll dice
            </Link>
          </>
        }
      />

      <Stagger className='grid grid-cols-3 gap-3 md:gap-4'>
        {stats.map(({ label, value }) => (
          <div key={label} className={`p-4 md:p-6 ${panel}`}>
            <p className='font-display text-4xl leading-none tabular-nums md:text-6xl'>{value}</p>
            <p className='mt-2 text-[0.6rem] tracking-[0.15em] text-bone/50 uppercase md:mt-3 md:text-xs md:tracking-[0.2em]'>{label}</p>
          </div>
        ))}
      </Stagger>

      <div className='grid gap-4 lg:grid-cols-5'>
        <section aria-labelledby='finished-title' className={`p-5 lg:col-span-3 ${panel}`}>
          <div className='flex items-baseline justify-between px-2'>
            <h2 id='finished-title' className='font-display text-2xl'>Finished</h2>
            <Link
              href='/vault/vampire/characters'
              className='group inline-flex items-center gap-1 text-xs tracking-[0.2em] text-bone/50 uppercase transition-colors hover:text-bone'
            >
              All characters
              <MdArrowOutward aria-hidden className='transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
            </Link>
          </div>
          {finished.length > 0 ? (
            <Stagger as='ul' className='mt-3 flex flex-col'>
              {finished.map((c) => (
                <CharacterRow key={c.slug} character={c} />
              ))}
            </Stagger>
          ) : mine.length === 0 ? (
            <EmptyState bare title='The night is young.' action={{ href: '/vault/vampire/new', label: 'Create your first Kindred' }}>
              No Kindred in your coterie yet. Start a sheet and it will wait here, saved as you go.
            </EmptyState>
          ) : (
            <p className='px-2 py-6 text-sm text-bone/50'>Nothing finished yet. Mark a draft as finished from its sheet.</p>
          )}
        </section>

        <div className='flex flex-col gap-4 lg:col-span-2'>
          <section aria-labelledby='drafts-title' className={`p-5 ${panel}`}>
            <h2 id='drafts-title' className='px-2 font-display text-2xl'>Drafts</h2>
            {drafts.length > 0 ? (
              <Stagger as='ul' className='mt-3 flex flex-col'>
                {drafts.map((c) => (
                  <CharacterRow key={c.slug} character={c} />
                ))}
              </Stagger>
            ) : (
              <p className='px-2 py-6 text-sm text-bone/50'>No drafts in progress. New characters start here.</p>
            )}
          </section>

          <section aria-labelledby='lore-title' className={`flex grow flex-col p-5 ${panel}`}>
            <div className='flex items-baseline justify-between px-2'>
              <h2 id='lore-title' className='font-display text-2xl'>Loresheets</h2>
              <Link href='/vault/vampire/loresheets' className='text-xs tracking-[0.2em] text-bone/50 uppercase transition-colors hover:text-bone'>
                All
              </Link>
            </div>
            {loresheets.length ? (
              <ul className='mt-3 flex flex-col'>
                {loresheets.slice(0, 4).map((l) => {
                  const Icon = LORE_ICONS[l.kind];
                  return (
                  <li key={l.id}>
                    <Link href={`/vault/vampire/loresheets/${l.id}`} className='flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition hover:bg-bone/[0.05]'>
                      <Icon aria-hidden className='size-5 shrink-0 text-accent/80' />
                      <span className='grow truncate'>{l.title || `Untitled ${LORE_KINDS[l.kind].noun}`}</span>
                      <span className='shrink-0 text-[0.65rem] tracking-[0.15em] text-bone/45 uppercase'>{LORE_KINDS[l.kind].label}</span>
                    </Link>
                  </li>
                  );
                })}
              </ul>
            ) : (
              <div className='flex grow flex-col items-center justify-center gap-3 px-4 py-8 text-center'>
                <GiScrollUnfurled aria-hidden className='size-10 text-accent/70' />
                <p className='max-w-[32ch] text-sm leading-relaxed text-bone/55'>
                  Loresheets hold the histories, places and grudges your sheets have no room for.
                </p>
                <Link href='/vault/vampire/new' className={buttonGhost}>Write one</Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
