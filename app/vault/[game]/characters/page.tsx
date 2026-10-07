import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MdAdd } from 'react-icons/md';
import PageHeader from '@/app/ui/kit/PageHeader';
import Stagger from '@/app/ui/kit/Stagger';
import { buttonPrimary } from '@/app/ui/kit/styles';
import EmptyState from '@/app/ui/kit/EmptyState';
import CharacterCard from '@/app/ui/characters/CharacterCard';
import Pack from '@/app/ui/game/werewolf/Pack';
import CellFiles from '@/app/ui/game/hunter/CellFiles';
import { getCharacters, toCharacter } from '@/app/lib/data/characters';
import { GAMES, gamePath, isGame } from '@/app/lib/games';

export const metadata: Metadata = { title: 'Characters' };

const TITLES = { vampire: 'Your coterie.', werewolf: 'Your pack.', hunter: 'The cell.' };

const EMPTY = {
  vampire: { title: 'The coterie is empty.', text: 'Every Kindred starts with an Embrace. Create one and their sheet will wait here between sessions.' },
  werewolf: { title: 'No Garou answer the howl.', text: 'Bring the first wolf to the pack. Their tribe, auspice and Gifts will be kept here.' },
  hunter: { title: 'No files on the desk.', text: 'Open a file on your first hunter: their creed, drive and Edges, ready for the night.' },
};

export default async function Characters({ params }: PageProps<'/vault/[game]/characters'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  const list = (await getCharacters(game)).map(toCharacter);
  const { noun } = GAMES[game];

  return (
    <div className='flex flex-col gap-10'>
      <PageHeader
        eyebrow={`${GAMES[game].name} · ${noun.group}`}
        title={TITLES[game]}
        description={
          list.length === 0
            ? `No ${noun.many} on file yet.`
            : `${list.length} ${list.length === 1 ? noun.one : noun.many} on file.${game === 'hunter' ? ' Scroll to leaf through the files.' : ' Open a sheet to update it between sessions.'}`
        }
        actions={
          <Link href={gamePath(game, '/new')} className={buttonPrimary}>
            <MdAdd aria-hidden className='size-4 transition-transform duration-300 group-hover:rotate-90' />
            New {noun.one}
          </Link>
        }
      />
      {list.length === 0 ? (
        <EmptyState title={EMPTY[game].title} action={{ href: gamePath(game, '/new'), label: `Create your first ${noun.one}` }}>
          {EMPTY[game].text}
        </EmptyState>
      ) : game === 'hunter' ? (
        <CellFiles files={list} />
      ) : game === 'werewolf' ? (
        <Pack members={list} />
      ) : (
        <Stagger className='grid gap-5 sm:grid-cols-2 xl:grid-cols-3'>
          {list.map((c) => (
            <CharacterCard key={c.slug} character={c} />
          ))}
        </Stagger>
      )}
    </div>
  );
}
