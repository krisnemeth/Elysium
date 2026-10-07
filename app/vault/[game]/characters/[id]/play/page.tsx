import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCharacter } from '@/app/lib/data/characters';
import { isGame } from '@/app/lib/games';
import PlaySheet from '@/app/ui/play/PlaySheet';

export async function generateMetadata({ params }: PageProps<'/vault/[game]/characters/[id]/play'>): Promise<Metadata> {
  const { id } = await params;
  const c = await getCharacter(id);
  return { title: c ? `Play ${c.name || 'character'}` : 'Character not found' };
}

// Phone-first view for the table: mark damage and roll from the sheet.
export default async function Play({ params }: PageProps<'/vault/[game]/characters/[id]/play'>) {
  const { game, id } = await params;
  if (!isGame(game)) notFound();
  const character = await getCharacter(id);
  if (!character || character.game !== game) notFound();
  return <PlaySheet game={game} id={character.id} name={character.name || 'Unnamed'} initialSheet={character.sheet} />;
}
