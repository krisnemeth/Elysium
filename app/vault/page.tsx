import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MdAdd, MdArrowOutward } from 'react-icons/md';
import AppShell from '@/app/ui/dashboard/AppShell';
import PageHeader from '@/app/ui/kit/PageHeader';
import { buttonPrimary, panel } from '@/app/ui/kit/styles';
import Stagger from '@/app/ui/kit/Stagger';
import { FactionMark, factionName } from '@/app/ui/game/FactionMark';
import { GAMES, GAMES_ORDER, gamePath } from '@/app/lib/games';
import { currentGame } from '@/app/lib/current-game';
import { getCharacters, toCharacter } from '@/app/lib/data/characters';

export const metadata: Metadata = { title: 'Your vault' };

export default async function Vault() {
  const CHARACTERS = (await getCharacters()).map(toCharacter);
  return (
    <AppShell game={await currentGame()}>
      <div className='page-in'>
        <PageHeader
          eyebrow='Your vault'
          title='Every creature, one vault.'
          description={
            CHARACTERS.length === 0
              ? 'Nobody here yet. Pick a game and create your first character; it saves as you go.'
              : `${CHARACTERS.length} character${CHARACTERS.length === 1 ? '' : 's'} across three games. Step into a game to see its dashboard, or start someone new.`
          }
          actions={
            <Link href='/vault/new' className={buttonPrimary}>
              <MdAdd aria-hidden className='transition-transform duration-300 group-hover:rotate-90' /> Create a character
            </Link>
          }
        />

        <Stagger className='mt-14 grid gap-5 lg:grid-cols-3'>
          {GAMES_ORDER.map((g) => {
            const { Logo, title, noun } = GAMES[g];
            const list = CHARACTERS.filter((c) => c.game === g);
            return (
              <section key={g} aria-label={title} className={`flex flex-col p-6 ${panel}`}>
                <Logo aria-label={title} role='img' className='h-12 w-auto self-start text-bone' />
                <p className='mt-4 text-xs tracking-[0.2em] text-bone/50 uppercase'>
                  {list.length} {list.length === 1 ? noun.one : noun.many}
                </p>
                {list.length === 0 && (
                  <p className='mt-4 text-sm leading-relaxed text-bone/55'>
                    No {noun.many} yet.{' '}
                    <Link href={gamePath(g, '/new')} className='text-bone underline underline-offset-4 hover:text-accent'>
                      Create one
                    </Link>
                  </p>
                )}
                <ul className='mt-4 flex flex-col'>
                  {list.map((c) => (
                    <li key={c.slug}>
                      <Link href={gamePath(g, `/characters/${c.slug}`)} className='group flex items-center gap-3 rounded-xl p-2 transition hover:translate-x-1 hover:bg-bone/[0.05]'>
                        <Image src={c.image.src} unoptimized={c.image.unoptimized} width={80} height={100} alt='' className='size-11 rounded-lg object-cover' />
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
      </div>
    </AppShell>
  );
}
