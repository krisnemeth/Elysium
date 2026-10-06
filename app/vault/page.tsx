import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MdAdd, MdArrowOutward } from 'react-icons/md';
import Navbar from '@/app/ui/navbar';
import Stagger from '@/app/ui/kit/Stagger';
import { FactionMark, factionName } from '@/app/ui/game/FactionMark';
import { GAMES, GAMES_ORDER, gamePath } from '@/app/lib/games';
import { CHARACTERS } from '@/app/lib/sample-characters';

export const metadata: Metadata = { title: 'Your vault' };

export default function Vault() {
  return (
    <div data-game='wod' className='min-h-svh bg-ink text-bone transition-colors duration-500'>
      <Navbar
        sections={GAMES_ORDER.map((g) => ({ href: gamePath(g), label: GAMES[g].name }))}
        signUpHref='/vault/new'
        logInHref='/'
        themeLabels={{ light: 'Light', dark: 'Dark' }}
        ctaLabel='New character'
      />
      <main id='main' className='page-in mx-auto max-w-6xl px-6 pt-32 pb-24'>
        <header className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='text-xs tracking-[0.3em] text-accent uppercase'>Your vault</p>
            <h1 className='mt-3 font-display text-6xl leading-[0.95] tracking-tight'>Every creature, one vault.</h1>
            <p className='mt-4 max-w-[56ch] leading-relaxed text-bone/65'>
              {CHARACTERS.length} characters across three games. Step into a game to see its dashboard, or start someone new.
            </p>
          </div>
          <Link href='/vault/new' className='group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-bone px-6 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 active:scale-[0.98] md:self-auto'>
            <MdAdd aria-hidden className='transition-transform duration-300 group-hover:rotate-90' /> Create a character
          </Link>
        </header>

        <Stagger className='mt-14 grid gap-5 lg:grid-cols-3'>
          {GAMES_ORDER.map((g) => {
            const { Logo, title, noun } = GAMES[g];
            const list = CHARACTERS.filter((c) => c.game === g);
            return (
              <section key={g} aria-label={title} className='flex flex-col rounded-2xl border border-bone/10 bg-bone/[0.03] p-6'>
                <Logo aria-label={title} role='img' className='h-12 w-auto self-start text-bone' />
                <p className='mt-4 text-xs tracking-[0.2em] text-bone/50 uppercase'>
                  {list.length} {list.length === 1 ? noun.one : noun.many}
                </p>
                <ul className='mt-4 flex flex-col'>
                  {list.map((c) => (
                    <li key={c.slug}>
                      <Link href={gamePath(g, '/characters')} className='group flex items-center gap-3 rounded-xl p-2 transition hover:translate-x-1 hover:bg-bone/[0.05]'>
                        <Image src={c.image.src} width={80} height={100} alt='' className='size-11 rounded-lg object-cover' />
                        <span className='min-w-0 grow'>
                          <span className='block truncate font-display text-lg leading-tight'>{c.name}</span>
                          <span className='block text-[0.65rem] tracking-[0.15em] text-bone/45 uppercase'>{factionName(c)}</span>
                        </span>
                        <FactionMark character={c} className='h-6 max-w-7 shrink-0 text-bone/35 [--knockout:transparent] group-hover:text-accent' />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={gamePath(g)} className='group mt-auto inline-flex items-center gap-1.5 pt-6 text-sm text-bone transition-colors hover:text-accent'>
                  Open the {GAMES[g].name.toLowerCase()} dashboard
                  <MdArrowOutward aria-hidden className='transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                </Link>
              </section>
            );
          })}
        </Stagger>
      </main>
    </div>
  );
}
