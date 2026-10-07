import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from '@/app/ui/kit/PageHeader';
import CharacterEditor from '@/app/ui/sheets/CharacterEditor';
import SheetForm from '@/app/ui/sheets/SheetForm';
import { getCharacter } from '@/app/lib/data/characters';
import { GAMES, isGame } from '@/app/lib/games';

export async function generateMetadata({ params }: PageProps<'/vault/[game]/characters/[id]/edit'>): Promise<Metadata> {
  const { id } = await params;
  const c = await getCharacter(id);
  return { title: c ? `Edit ${c.name || 'character'}` : 'Character not found' };
}

export default async function EditCharacter({ params }: PageProps<'/vault/[game]/characters/[id]/edit'>) {
  const { game, id } = await params;
  if (!isGame(game)) notFound();
  const character = await getCharacter(id);
  if (!character || character.game !== game) notFound();
  return (
    <div className='flex flex-col gap-8'>
      <PageHeader eyebrow={`Editing · ${GAMES[game].name}`} title={character.name || 'Unnamed'} description={character.summary ?? undefined} />
      <CharacterEditor game={game} id={character.id} initialSheet={character.sheet} initialStatus={character.status}>
        <SheetForm game={game} />
      </CharacterEditor>
    </div>
  );
}
