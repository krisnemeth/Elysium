import Image from 'next/image';
import Link from 'next/link';
import { MdAdd } from 'react-icons/md';
import { FactionMark, factionName } from '@/app/ui/game/FactionMark';
import { panel } from '@/app/ui/kit/styles';
import { GAMES, GAMES_ORDER, gamePath, type Game } from '@/app/lib/games';
import type { Character } from '@/app/lib/sample-characters';
import type { VaultView } from '@/app/lib/vault-view';
import CharacterRow from '@/app/ui/dashboard/CharacterRow';
import ViewSwitch from './ViewSwitch';

function GroupHead({ game, count }: { game: Game; count: number }) {
  const { Logo, title, noun } = GAMES[game];
  return (
    <div className='flex items-center justify-between gap-3'>
      <Link href={gamePath(game)} aria-label={title} className='rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'>
        <Logo aria-hidden className='h-10 w-auto text-bone transition-colors hover:text-accent' />
      </Link>
      <p className='text-xs tracking-[0.2em] text-bone/50 uppercase'>
        {count} {count === 1 ? noun.one : noun.many}
      </p>
    </div>
  );
}

function NoneYet({ game }: { game: Game }) {
  return (
    <p className='mt-3 text-sm leading-relaxed text-bone/55'>
      No {GAMES[game].noun.many} yet.{' '}
      <Link href={gamePath(game, '/new')} className='text-bone underline underline-offset-4 hover:text-accent'>
        Create one
      </Link>
    </p>
  );
}

function Card({ character: c }: { character: Character }) {
  return (
    <li>
      <Link
        href={gamePath(c.game, `/characters/${c.slug}`)}
        className={`group block overflow-hidden transition-[translate,box-shadow] duration-500 ease-(--ease-out-expo) hover:-translate-y-1 hover:shadow-[0_1.5rem_3rem_-1.5rem_var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${panel}`}
      >
        <span className='relative block aspect-[3/4] overflow-hidden bg-bone/[0.04]'>
          <Image
            src={c.image.src}
            unoptimized={c.image.unoptimized}
            alt=''
            fill
            sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16rem'
            className='object-cover object-top transition-transform duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-105'
          />
          {c.status === 'draft' && (
            <span className='absolute top-2 left-2 rounded-full border border-bone/20 bg-ink/70 px-2.5 py-0.5 text-[0.6rem] tracking-[0.2em] uppercase backdrop-blur-md'>Draft</span>
          )}
        </span>
        <span className='flex items-center gap-3 p-3'>
          <span className='min-w-0 grow'>
            <span className='block truncate font-display text-lg leading-tight'>{c.name}</span>
            <span className='block truncate text-[0.65rem] tracking-[0.15em] text-bone/45 uppercase'>{factionName(c)}</span>
          </span>
          <FactionMark character={c} className='h-6 max-w-7 shrink-0 text-bone/35 [--knockout:transparent] group-hover:text-accent' />
        </span>
      </Link>
    </li>
  );
}

/*
  Everyone in the vault, across all three games, the current game first. Grid
  is portrait cards, list is compact rows side by side; the choice is remembered.
*/
export default function EveryCharacter({ game, characters, view }: { game: Game; characters: Character[]; view: VaultView }) {
  const groups = [game, ...GAMES_ORDER.filter((g) => g !== game)].map((g) => ({ game: g, list: characters.filter((c) => c.game === g) }));
  return (
    <section aria-labelledby='vault-characters-title' className='flex flex-col gap-6'>
      <ViewSwitch
        initial={view}
        title={
          <h2 id='vault-characters-title' className='font-display text-3xl'>
            Every character
          </h2>
        }
        grid={
          <div className='flex flex-col gap-10'>
            {groups.map(({ game: g, list }) => (
              <div key={g}>
                <GroupHead game={g} count={list.length} />
                {list.length === 0 ? (
                  <NoneYet game={g} />
                ) : (
                  <ul className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4'>
                    {list.map((c) => (
                      <Card key={c.slug} character={c} />
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        }
        list={
          <div className='grid gap-4 xl:grid-cols-3'>
            {groups.map(({ game: g, list }) => (
              <div key={g} className={`flex flex-col p-5 ${panel}`}>
                <GroupHead game={g} count={list.length} />
                {list.length === 0 ? (
                  <NoneYet game={g} />
                ) : (
                  <ul className='mt-3 flex flex-col'>
                    {list.map((c) => (
                      <CharacterRow key={c.slug} character={c} showStatus />
                    ))}
                  </ul>
                )}
                <Link href={gamePath(g, '/new')} className='group mt-auto inline-flex items-center gap-1.5 pt-4 text-sm text-bone/70 transition-colors hover:text-accent'>
                  <MdAdd aria-hidden className='transition-transform duration-300 group-hover:rotate-90' />
                  New {GAMES[g].noun.one}
                </Link>
              </div>
            ))}
          </div>
        }
      />
    </section>
  );
}
