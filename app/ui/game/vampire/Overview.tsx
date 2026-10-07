import Link from 'next/link';
import { MdAdd, MdArrowOutward } from 'react-icons/md';
import { GiD10, GiScrollUnfurled } from 'react-icons/gi';
import PageHeader from '@/app/ui/kit/PageHeader';
import Stagger from '@/app/ui/kit/Stagger';
import CharacterRow from '@/app/ui/dashboard/CharacterRow';
import { panel, buttonPrimary, buttonGhost } from '@/app/ui/kit/styles';
import { CHARACTERS } from '@/app/lib/sample-characters';

// Vampire dashboard overview (the revamp design).
export default function VampireOverview() {
  const mine = CHARACTERS.filter((c) => c.game === 'vampire');
  const finished = mine.filter((c) => c.status === 'finished');
  const drafts = mine.filter((c) => c.status === 'draft');

  const stats = [
    { label: 'Characters finished', value: finished.length },
    { label: 'Drafts in progress', value: drafts.length },
    { label: 'Loresheets', value: 0 },
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
          <Stagger as='ul' className='mt-3 flex flex-col'>
            {finished.map((c) => (
              <CharacterRow key={c.slug} character={c} />
            ))}
          </Stagger>
        </section>

        <div className='flex flex-col gap-4 lg:col-span-2'>
          <section aria-labelledby='drafts-title' className={`p-5 ${panel}`}>
            <h2 id='drafts-title' className='px-2 font-display text-2xl'>Drafts</h2>
            <Stagger as='ul' className='mt-3 flex flex-col'>
              {drafts.map((c) => (
                <CharacterRow key={c.slug} character={c} />
              ))}
            </Stagger>
          </section>

          <section
            aria-labelledby='lore-title'
            className={`relative flex grow flex-col items-center justify-center overflow-hidden p-8 text-center ${panel}`}
          >
            <GiScrollUnfurled aria-hidden className='size-10 text-accent/70' />
            <h2 id='lore-title' className='mt-4 font-display text-2xl'>No loresheets yet</h2>
            <p className='mt-2 max-w-[32ch] text-sm leading-relaxed text-bone/55'>
              Loresheets will hold the histories, lovers and grudges your sheets have no room for.
            </p>
            <span className='mt-5 rounded-full border border-bone/15 px-3 py-1 text-[0.65rem] tracking-[0.2em] text-bone/45 uppercase'>
              Coming soon
            </span>
          </section>
        </div>
      </div>
    </div>
  );
}
