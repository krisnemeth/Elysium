import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';
import PageHeader from '@/app/ui/kit/PageHeader';
import Stagger from '@/app/ui/kit/Stagger';
import { panel } from '@/app/ui/kit/styles';
import study from '@/public/art/sheet-study.webp';
import lore from '@/public/art/lore-dark.webp';

export const metadata: Metadata = {
  title: 'Sheets',
};

const SHEETS = [
  {
    title: 'Character sheet',
    body: 'Stats, skills, disciplines, merits, flaws and the trackers you mark during play. The mechanical heart of every character.',
    image: study,
    href: '/dashboard/sheets/create',
    cta: 'Create a character sheet',
  },
  {
    title: 'Loresheet',
    body: 'Backstory, Embrace, relationships, lovers and ghouls, in as much detail as you like. The creative side of character development.',
    image: lore,
    href: null,
    cta: 'Coming soon',
  },
];

export default function Sheets() {
  return (
    <div className='flex flex-col gap-10'>
      <PageHeader
        eyebrow='Sheets'
        title='What are you writing tonight?'
        description='Every character has two sides: the numbers on the sheet and the story behind them.'
      />
      <Stagger className='grid gap-5 lg:grid-cols-2'>
        {SHEETS.map(({ title, body, image, href, cta }) => {
          const card = (
            <>
              <div className='relative aspect-[16/9] overflow-hidden'>
                <Image
                  src={image}
                  alt=''
                  placeholder='blur'
                  sizes='(max-width: 1024px) 100vw, 36rem'
                  className={`size-full object-cover transition-[scale,filter] duration-[1.4s] ease-(--ease-out-expo) group-hover:scale-105 ${href ? '' : 'grayscale'}`}
                />
                <div className='absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-transparent' />
              </div>
              <div className='relative -mt-16 flex grow flex-col p-6'>
                <h2 className='font-display text-4xl'>{title}</h2>
                <p className='mt-3 max-w-[48ch] leading-relaxed text-pretty text-bone/65'>{body}</p>
                <span
                  className={`mt-6 inline-flex items-center gap-1.5 text-sm ${href ? 'text-bone transition-colors group-hover:text-accent' : 'text-bone/35'}`}
                >
                  {cta}
                  {href && (
                    <MdArrowOutward aria-hidden className='transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                  )}
                </span>
              </div>
            </>
          );
          const cls = `group flex flex-col overflow-hidden ${panel}`;
          return href ? (
            <Link
              key={title}
              href={href}
              className={`${cls} transition-[translate,box-shadow,border-color] duration-500 ease-(--ease-out-expo) hover:-translate-y-1 hover:border-bone/25 hover:shadow-[0_2rem_4rem_-1.5rem_var(--accent-deep)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent`}
            >
              {card}
            </Link>
          ) : (
            <div key={title} aria-disabled className={`${cls} opacity-80`}>
              {card}
            </div>
          );
        })}
      </Stagger>
    </div>
  );
}
