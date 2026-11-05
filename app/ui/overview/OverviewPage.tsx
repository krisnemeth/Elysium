import Image from 'next/image';
import Link from 'next/link';
import { MdAdd, MdArrowOutward } from 'react-icons/md';
import EveryCharacter from './EveryCharacter';
import OverviewShelves, { type LoresheetLink } from './OverviewShelves';
import { panel, buttonPrimary } from '@/app/ui/kit/styles';
import Stagger from '@/app/ui/kit/Stagger';
import type { Cover } from '@/app/ui/landing/covers';
import NewLoresheet from '@/app/ui/loresheets/NewLoresheet';
import { GAMES, GAMES_ORDER, gamePath } from '@/app/lib/games';
import type { Character } from '@/app/lib/sample-characters';
import type { VaultView } from '@/app/lib/vault-view';

// Everything in one place: the totals, the way into each game, the drafts and loresheets, and every character.
export default function OverviewPage({
  name,
  cover,
  characters,
  loresheets,
  chronicles,
  view,
}: {
  name?: string;
  cover: Cover;
  characters: Character[];
  loresheets: LoresheetLink[];
  chronicles: number;
  view: VaultView;
}) {
  const drafts = characters.filter((c) => c.status === 'draft');
  const stats = [
    { label: 'Characters finished', value: characters.length - drafts.length },
    { label: 'Drafts in progress', value: drafts.length },
    { label: 'Loresheets', value: loresheets.length },
    { label: 'Chronicles', value: chronicles },
  ];

  return (
    <div className='page-in flex flex-col gap-10'>
      <header className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
        <div className='max-w-2xl'>
          <p className='text-xs tracking-[0.3em] text-accent uppercase'>Overview</p>
          <h1 className='mt-3 font-display text-5xl leading-[0.95] font-medium tracking-tight text-balance md:text-6xl'>Good evening{name ? `, ${name}` : ''}.</h1>
          <p className='mt-4 max-w-[56ch] leading-relaxed text-pretty text-bone/65'>Everyone and everything you keep, across all three games. Start something new, or step into a game.</p>
        </div>
        <div className='flex shrink-0 flex-wrap gap-3'>
          <Link href='/vault/new' className={buttonPrimary}>
            <MdAdd aria-hidden className='size-4 transition-transform duration-300 group-hover:rotate-90' />
            New character
          </Link>
          <NewLoresheet initialGame={cover.game} ghost />
        </div>
      </header>

      <Stagger className='grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4'>
        {stats.map(({ label, value }) => (
          <div key={label} className={`p-4 md:p-6 ${panel}`}>
            <p className='font-display text-4xl leading-none tabular-nums md:text-6xl'>{value}</p>
            <p className='mt-2 text-[0.6rem] tracking-[0.15em] text-bone/50 uppercase md:mt-3 md:text-xs md:tracking-[0.2em]'>{label}</p>
          </div>
        ))}
      </Stagger>

      <nav aria-label='Games' className='grid gap-3 md:grid-cols-3 md:gap-4'>
        {GAMES_ORDER.map((g) => {
          const { Logo, title, figure, noun } = GAMES[g];
          const count = characters.filter((c) => c.game === g).length;
          return (
            <Link
              key={g}
              href={gamePath(g)}
              aria-label={`Enter ${title}`}
              className={`group relative isolate flex h-36 flex-col justify-between overflow-hidden p-5 transition-[translate,box-shadow] duration-500 ease-(--ease-out-expo) hover:-translate-y-1 hover:shadow-[0_1.5rem_3rem_-1.5rem_var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${panel}`}
            >
              <Image
                src={figure.src}
                alt=''
                width={figure.width}
                height={figure.height}
                sizes='9rem'
                className='absolute top-0 -right-2 -z-10 w-36 opacity-70 [mask-image:linear-gradient(to_left,black_40%,transparent)] transition-transform duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-105'
              />
              <Logo aria-hidden className='h-10 w-auto self-start text-bone' />
              <span className='flex items-center gap-1.5 text-xs tracking-[0.2em] text-bone/60 uppercase transition-colors group-hover:text-accent'>
                {count} {count === 1 ? noun.one : noun.many}
                <MdArrowOutward aria-hidden className='transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
              </span>
            </Link>
          );
        })}
      </nav>

      <OverviewShelves drafts={drafts} loresheets={loresheets} />
      <EveryCharacter game={cover.game} characters={characters} view={view} />
    </div>
  );
}
