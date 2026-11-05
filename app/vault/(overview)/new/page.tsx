import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { GAMES, GAMES_ORDER, gamePath } from '@/app/lib/games';
import { buttonGhost } from '@/app/ui/kit/styles';

export const metadata: Metadata = { title: 'Create a character' };

const WHAT = {
  vampire: 'Clan, disciplines, Hunger, Humanity and Blood Potency.',
  werewolf: 'Tribe, auspice, Rage, Renown, Gifts and rites.',
  hunter: 'Creed, Drive, Desperation, Danger, Edges and perks.',
};

const NOUN = { vampire: 'vampire', werewolf: 'Garou', hunter: 'hunter' };

export default function ChooseGame() {
  return (
    <div className='page-in flex flex-col overflow-x-clip'>
      <header className='relative z-20 mx-auto max-w-3xl text-center'>
        <p className='text-xs tracking-[0.3em] text-accent uppercase'>New character</p>
        <h1 className='mt-2 font-display text-3xl leading-tight tracking-tight text-balance md:text-4xl'>Who are you bringing into the night?</h1>
      </header>
      <ul className='mt-8 flex min-h-[70svh] grow flex-col gap-3 lg:mt-20 lg:flex-row'>
        {GAMES_ORDER.map((g) => {
          const { Logo, title, figure, tagline, color } = GAMES[g];
          return (
            <li
              key={g}
              data-tint={g}
              style={{ '--accent': color } as CSSProperties}
              className='group relative isolate min-h-56 flex-1 overflow-hidden rounded-2xl transition-[flex-grow] duration-1000 ease-(--ease-out-expo) hover:z-10 hover:flex-[1.5] focus-within:z-10 focus-within:flex-[1.5] lg:overflow-visible'
            >
              <Link href={gamePath(g, '/new')} className='absolute inset-0 flex flex-col justify-end p-6 text-[#ece8e1] focus-visible:outline-none md:p-8'>
                <span className='absolute inset-0 -z-10 rounded-2xl ring-1 ring-white/10 transition group-hover:ring-(--accent)/60 group-focus-within:ring-2 group-focus-within:ring-white' />
                {/* From lg up the character is taller than the card and stands out of it: this box has room above and to the sides, and fades them out at the card's foot. */}
                <span aria-hidden className='absolute inset-0 -z-10 lg:-inset-x-[20%] lg:-top-[20svh] lg:mask-[linear-gradient(to_top,transparent,black_30%)]'>
                  <Image
                    src={figure.src}
                    alt=''
                    width={figure.width}
                    height={figure.height}
                    sizes='(max-width: 1024px) 100vw, 50vw'
                    className='absolute top-0 left-[72%] w-[62%] max-w-none origin-[50%_70%] -translate-x-1/2 opacity-70 grayscale transition duration-1000 ease-(--ease-out-expo) group-hover:opacity-100 group-hover:grayscale-0 group-focus-within:opacity-100 group-focus-within:grayscale-0 lg:top-[calc(20svh+1.5rem)] lg:left-1/2 lg:h-[min(100svh,calc((100vw-20rem)*0.62))] lg:w-auto lg:group-hover:scale-110 lg:group-focus-within:scale-110'
                  />
                </span>
                <span className='absolute inset-0 -z-10 rounded-2xl bg-linear-to-t from-black via-black/40 to-transparent' />
                <Logo aria-label={title} role='img' className='h-14 w-auto self-start md:h-16' />
                <span className='mt-4 max-w-sm text-sm leading-relaxed text-[#ece8e1]/80'>{tagline}</span>
                <span className='mt-2 max-h-0 max-w-sm overflow-hidden text-sm leading-relaxed text-[#ece8e1]/60 transition-[max-height] duration-700 group-hover:max-h-20 group-focus-within:max-h-20'>
                  The sheet: {WHAT[g]}
                </span>
                <span className={`mt-5 self-start ${buttonGhost} group-hover:-translate-y-0.5 group-hover:border-(--accent)/85 group-hover:bg-(--accent)/10 group-hover:shadow-[0_0_2.5rem_-0.3rem_var(--accent)]`}>
                  Create a {NOUN[g]} &rarr;
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
