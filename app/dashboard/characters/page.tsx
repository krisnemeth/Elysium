import type { Metadata } from 'next';
import Link from 'next/link';
import { MdAdd } from 'react-icons/md';
import PageHeader from '@/app/ui/kit/PageHeader';
import Stagger from '@/app/ui/kit/Stagger';
import CharacterCard from '@/app/ui/characters/CharacterCard';
import { buttonPrimary } from '@/app/ui/kit/styles';
import { CHARACTERS } from '@/app/lib/sample-characters';

export const metadata: Metadata = {
  title: 'Characters',
};

export default function Page() {
  return (
    <div className='flex flex-col gap-10'>
      <PageHeader
        eyebrow='Characters'
        title='Your coterie.'
        description={`${CHARACTERS.length} Kindred on file. Open a sheet to update it between sessions.`}
        actions={
          <Link href='/dashboard/sheets/create' className={buttonPrimary}>
            <MdAdd aria-hidden className='size-4 transition-transform duration-300 group-hover:rotate-90' />
            New character
          </Link>
        }
      />
      <Stagger className='grid gap-5 sm:grid-cols-2 xl:grid-cols-3'>
        {CHARACTERS.map((c) => (
          <CharacterCard key={c.slug} character={c} />
        ))}
      </Stagger>
    </div>
  );
}
