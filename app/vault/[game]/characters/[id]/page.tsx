import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GiD10 } from 'react-icons/gi';
import { MdEdit } from 'react-icons/md';
import { getCharacter } from '@/app/lib/data/characters';
import { GAMES, isGame } from '@/app/lib/games';
import { buttonGhost, buttonPrimary } from '@/app/ui/kit/styles';
import CharacterSheetView from '@/app/ui/characters/CharacterSheetView';
import DeleteCharacter from '@/app/ui/characters/DeleteCharacter';

export async function generateMetadata({ params }: PageProps<'/vault/[game]/characters/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const c = await getCharacter(id);
  return { title: c?.name || 'Character' };
}

export default async function CharacterPage({ params }: PageProps<'/vault/[game]/characters/[id]'>) {
  const { game, id } = await params;
  if (!isGame(game)) notFound();
  const record = await getCharacter(id);
  if (!record || record.game !== game) notFound();

  return (
    <CharacterSheetView
      record={record}
      back={{ href: `/vault/${game}/characters`, label: `All ${GAMES[game].noun.many}` }}
      editablePortrait
      actions={
        <>
          <Link href={`/vault/${game}/characters/${id}/edit`} className={buttonPrimary}>
            <MdEdit aria-hidden className='size-4' /> Edit sheet
          </Link>
          <Link href={`/vault/${game}/characters/${id}/play`} className={buttonGhost}>
            <GiD10 aria-hidden className='size-4' /> Play
          </Link>
          <DeleteCharacter id={id} game={game} name={record.name} />
        </>
      }
    />
  );
}
