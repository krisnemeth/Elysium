import Link from 'next/link';
import { MdAdd } from 'react-icons/md';
import PageHeader from '@/app/ui/kit/PageHeader';
import Stagger from '@/app/ui/kit/Stagger';
import { panel, buttonPrimary } from '@/app/ui/kit/styles';
import type { Character } from '@/app/lib/sample-characters';

// The top of Vampire's vault: the tallies.
export default function VampireOverview({ characters: mine, loresheets }: { characters: Character[]; loresheets: number }) {
  const stats = [
    { label: 'Characters finished', value: mine.filter((c) => c.status === 'finished').length },
    { label: 'Drafts in progress', value: mine.filter((c) => c.status === 'draft').length },
    { label: 'Loresheets', value: loresheets },
  ];

  return (
    <div className='flex flex-col gap-10'>
      <PageHeader
        eyebrow='Your vault'
        title='Good evening.'
        description='Your coterie, as you left it. Pick up a draft, open a sheet or roll a few dice before the session.'
        actions={
          <Link href='/vault/vampire/new' className={buttonPrimary}>
            <MdAdd aria-hidden className='size-4 transition-transform duration-300 group-hover:rotate-90' />
            New character
          </Link>
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
    </div>
  );
}
