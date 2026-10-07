import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/ui/navbar';
import { GAMES, GAMES_ORDER, gamePath } from '@/app/lib/games';

export const metadata: Metadata = { title: 'Create a character' };

const WHAT = {
  vampire: 'Clan, disciplines, Hunger, Humanity and Blood Potency.',
  werewolf: 'Tribe, auspice, Rage, Renown, Gifts and rites.',
  hunter: 'Creed, Drive, Desperation, Danger, Edges and perks.',
};

export default function ChooseGame() {
  return (
    <div data-game='wod' className='flex min-h-svh flex-col bg-ink text-bone transition-colors duration-500'>
      <Navbar
        sections={[{ href: '/vault', label: 'Your vault' }]}
        signUpHref='/vault'
        logInHref='/'
        themeLabels={{ light: 'Light', dark: 'Dark' }}
        ctaLabel='Your vault'
      />
      <main id='main' className='page-in flex grow flex-col px-4 pt-28 pb-8 md:px-6'>
        <header className='mx-auto max-w-3xl text-center'>
          <p className='text-xs tracking-[0.3em] text-accent uppercase'>New character</p>
          <h1 className='mt-3 font-display text-5xl leading-[0.95] tracking-tight text-balance md:text-7xl'>Who are you bringing into the night?</h1>
        </header>
        <ul className='mt-10 flex min-h-[70svh] grow flex-col gap-3 md:flex-row'>
          {GAMES_ORDER.map((g) => {
            const { Logo, title, figure, tagline } = GAMES[g];
            return (
              <li key={g} className='group relative min-h-56 flex-1 overflow-hidden rounded-2xl transition-[flex-grow] duration-1000 ease-(--ease-out-expo) hover:flex-[1.5] focus-within:flex-[1.5]'>
                <Link href={gamePath(g, '/new')} className='absolute inset-0 flex flex-col justify-end p-6 text-[#ece8e1] focus-visible:outline-none md:p-8'>
                  <Image src={figure.src} alt='' fill sizes='(max-width: 768px) 100vw, 40vw' className='-z-10 object-cover object-top opacity-70 grayscale transition duration-1000 ease-(--ease-out-expo) group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 group-focus-within:grayscale-0' />
                  <span className='absolute inset-0 -z-10 bg-linear-to-t from-black via-black/40 to-transparent' />
                  <span className='absolute inset-0 rounded-2xl ring-1 ring-white/10 transition group-hover:ring-white/40 group-focus-within:ring-2 group-focus-within:ring-white' />
                  <Logo aria-label={title} role='img' className='h-14 w-auto self-start md:h-16' />
                  <span className='mt-4 max-w-sm text-sm leading-relaxed text-[#ece8e1]/80'>{tagline}</span>
                  <span className='mt-2 max-h-0 max-w-sm overflow-hidden text-sm leading-relaxed text-[#ece8e1]/60 transition-[max-height] duration-700 group-hover:max-h-20 group-focus-within:max-h-20'>
                    The sheet: {WHAT[g]}
                  </span>
                  <span className='mt-5 inline-flex items-center gap-2 self-start rounded-full bg-[#ece8e1] px-5 py-2.5 text-sm font-semibold text-[#0c0c0d] transition group-hover:-translate-y-0.5'>
                    Create a {g === 'vampire' ? 'vampire' : g === 'werewolf' ? 'Garou' : 'hunter'} &rarr;
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
