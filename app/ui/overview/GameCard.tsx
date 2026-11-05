'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useId, useState, type ReactNode } from 'react';
import { MdArrowOutward, MdExpandMore } from 'react-icons/md';
import { IslandSection } from '@/app/ui/kit/Island';
import { panel } from '@/app/ui/kit/styles';
import { GAMES, gamePath, type Game } from '@/app/lib/games';

// A game on the overview: its logo and character count, the way into it, and its characters, which unfold in place.
export default function GameCard({ game, count, children }: { game: Game; count: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const { Logo, title, figure, noun } = GAMES[game];
  return (
    <section aria-label={title} className={`overflow-hidden ${panel}`}>
      <div className='relative isolate flex h-32 flex-col justify-between overflow-hidden p-4'>
        <Image
          src={figure.src}
          alt=''
          width={figure.width}
          height={figure.height}
          sizes='9rem'
          className='absolute top-0 -right-2 -z-10 w-32 opacity-70 [mask-image:linear-gradient(to_left,black_40%,transparent)]'
        />
        <Link href={gamePath(game)} aria-label={`Enter ${title}`} className='group self-start rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'>
          <Logo aria-hidden className='h-10 w-auto text-bone transition-colors group-hover:text-accent' />
        </Link>
        <div className='flex items-center gap-1'>
          <button
            type='button'
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((o) => !o)}
            className='-ml-2 flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs tracking-[0.2em] text-bone/70 uppercase transition-colors hover:bg-bone/[0.06] hover:text-bone focus-visible:outline-2 focus-visible:outline-accent'
          >
            {count} {count === 1 ? noun.one : noun.many}
            <MdExpandMore aria-hidden className={`size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </button>
          <Link href={gamePath(game)} className='group flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs tracking-[0.2em] text-bone/70 uppercase transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent'>
            Enter
            <MdArrowOutward aria-hidden className='transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
          </Link>
        </div>
      </div>
      <IslandSection open={open} id={id}>
        <div className='border-t border-bone/10 p-2'>{children}</div>
      </IslandSection>
    </section>
  );
}
