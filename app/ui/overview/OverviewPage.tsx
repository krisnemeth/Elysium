import Link from 'next/link';
import { MdAdd } from 'react-icons/md';
import CharacterRow from '@/app/ui/dashboard/CharacterRow';
import { panel } from '@/app/ui/kit/styles';
import Stagger from '@/app/ui/kit/Stagger';
import type { Cover } from '@/app/ui/landing/covers';
import NewLoresheet from '@/app/ui/loresheets/NewLoresheet';
import { GAMES, GAMES_ORDER, gamePath } from '@/app/lib/games';
import type { Character } from '@/app/lib/sample-characters';
import GameCard from './GameCard';
import OverviewShelves, { type LoresheetLink } from './OverviewShelves';

// Everything in one place, sized to fit a desktop screen: the totals, each game with its characters, the drafts and loresheets.
export default function OverviewPage({ name, cover, characters, loresheets, chronicles }: { name?: string; cover: Cover; characters: Character[]; loresheets: LoresheetLink[]; chronicles: number }) {
  const drafts = characters.filter((c) => c.status === 'draft');
  const stats = [
    { label: 'Characters finished', value: characters.length - drafts.length },
    { label: 'Drafts in progress', value: drafts.length },
    { label: 'Loresheets', value: loresheets.length },
    { label: 'Chronicles', value: chronicles },
  ];

  return (
    <div className='page-in flex flex-col gap-4 desk:h-[calc(100svh-2rem)] desk:min-h-[36rem]'>
      <header className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div>
          <p className='text-xs tracking-[0.3em] text-accent uppercase'>Overview</p>
          <h1 className='mt-2 font-display text-4xl leading-none font-medium tracking-tight text-balance md:text-5xl'>Good evening{name ? `, ${name}` : ''}.</h1>
        </div>
        <div className='flex shrink-0 flex-wrap gap-3'>
          <Link href='/vault/new' className='lc-btn lc-btn-cover lc-btn-ghost lc-btn-glow'>
            <MdAdd aria-hidden className='size-4' />
            New character
          </Link>
          <NewLoresheet initialGame={cover.game} buttonClass='lc-btn lc-btn-cover lc-btn-ghost' />
        </div>
      </header>

      <Stagger className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        {stats.map(({ label, value }) => (
          <div key={label} className={`flex items-center gap-3 px-4 py-3 ${panel}`}>
            <p className='font-display text-4xl leading-none tabular-nums'>{value}</p>
            <p className='text-[0.6rem] leading-snug tracking-[0.15em] text-bone/50 uppercase'>{label}</p>
          </div>
        ))}
      </Stagger>

      <div className='grid items-start gap-3 md:grid-cols-3'>
        {GAMES_ORDER.map((g) => {
          const { noun } = GAMES[g];
          const list = characters.filter((c) => c.game === g);
          return (
            <GameCard key={g} game={g} count={list.length}>
              {list.length > 0 ? (
                <ul className='flex max-h-[min(16rem,30svh)] flex-col overflow-y-auto'>
                  {list.map((c) => (
                    <CharacterRow key={c.slug} character={c} showStatus />
                  ))}
                </ul>
              ) : (
                <p className='px-2 py-2 text-sm text-bone/55'>No {noun.many} yet.</p>
              )}
              <div className='flex flex-wrap justify-between gap-2 px-2 pt-2 pb-1 text-sm'>
                <Link href={gamePath(g, '/new')} className='inline-flex items-center gap-1 text-bone/70 transition-colors hover:text-accent'>
                  <MdAdd aria-hidden /> New {noun.one}
                </Link>
                <Link href={gamePath(g, '/characters')} className='text-bone/70 capitalize transition-colors hover:text-accent'>
                  The {noun.group}
                </Link>
              </div>
            </GameCard>
          );
        })}
      </div>

      <OverviewShelves drafts={drafts} loresheets={loresheets} />
    </div>
  );
}
