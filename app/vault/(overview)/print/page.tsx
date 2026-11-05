import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlinePrint } from 'react-icons/md';
import { getCharacters, toCharacter } from '@/app/lib/data/characters';
import { GAMES, GAMES_ORDER, gamePath } from '@/app/lib/games';
import { factionName } from '@/app/ui/game/FactionMark';
import PageHeader from '@/app/ui/kit/PageHeader';
import { panel } from '@/app/ui/kit/styles';

export const metadata: Metadata = { title: 'Printable sheets' };

// Every character's A4 sheet (/vault/print/[id]), by game.
export default async function PrintableSheets() {
  const characters = (await getCharacters()).map(toCharacter);
  return (
    <div className='page-in flex flex-col gap-8'>
      <PageHeader eyebrow='Overview' title='Printable sheets.' description='Pick a character to open their sheet, ready for A4 paper.' />
      <div className='grid gap-4 xl:grid-cols-3'>
        {GAMES_ORDER.map((g) => {
          const { Logo, title, noun } = GAMES[g];
          const list = characters.filter((c) => c.game === g);
          return (
            <section key={g} aria-label={title} className={`p-5 ${panel}`}>
              <Logo aria-hidden className='h-10 w-auto text-bone' />
              {list.length === 0 ? (
                <p className='mt-3 text-sm text-bone/55'>
                  No {noun.many} yet.{' '}
                  <Link href={gamePath(g, '/new')} className='text-bone underline underline-offset-4 hover:text-accent'>
                    Create one
                  </Link>
                </p>
              ) : (
                <ul className='mt-3 flex flex-col'>
                  {list.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/vault/print/${c.slug}`} className='group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-bone/[0.05] focus-visible:outline-2 focus-visible:outline-accent'>
                        <span className='relative size-11 shrink-0 overflow-hidden rounded-lg bg-bone/[0.06]'>
                          <span className={`block size-full origin-top ${c.image.unoptimized ? '' : 'scale-[1.7]'}`}>
                            <Image src={c.image.src} unoptimized={c.image.unoptimized} width={160} height={160} alt='' className='size-full object-cover object-top' />
                          </span>
                        </span>
                        <span className='min-w-0 grow'>
                          <span className='block truncate font-display text-lg leading-tight'>{c.name}</span>
                          <span className='block truncate text-[0.65rem] tracking-[0.15em] text-bone/45 uppercase'>{factionName(c)}</span>
                        </span>
                        <MdOutlinePrint aria-hidden className='size-5 shrink-0 text-bone/40 transition-colors group-hover:text-accent' />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
