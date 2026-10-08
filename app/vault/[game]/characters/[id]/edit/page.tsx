import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from '@/app/ui/kit/PageHeader';
import { panel } from '@/app/ui/kit/styles';
import CharacterEditor from '@/app/ui/sheets/CharacterEditor';
import SheetForm from '@/app/ui/sheets/SheetForm';
import { getCharacter } from '@/app/lib/data/characters';
import { GAMES, isGame } from '@/app/lib/games';

export async function generateMetadata({ params }: PageProps<'/vault/[game]/characters/[id]/edit'>): Promise<Metadata> {
  const { id } = await params;
  const c = await getCharacter(id);
  return { title: c ? `Edit ${c.name || 'character'}` : 'Character not found' };
}

export default async function EditCharacter({ params, searchParams }: PageProps<'/vault/[game]/characters/[id]/edit'>) {
  const { game, id } = await params;
  const fromGuide = (await searchParams).guided === '1';
  if (!isGame(game)) notFound();
  const character = await getCharacter(id);
  if (!character || character.game !== game) notFound();
  return (
    <div className='flex flex-col gap-8'>
      <PageHeader eyebrow={`Editing · ${GAMES[game].name}`} title={character.name || 'Unnamed'} description={character.summary ?? undefined} />
      {fromGuide && (
        <div role='status' className={`flex flex-col gap-2 p-5 ${panel}`}>
          <p className='font-display text-2xl'>Your character is ready.</p>
          <p className='max-w-[70ch] text-sm leading-relaxed text-bone/70'>
            This is the full sheet, filled in from your answers. Hover any trait’s name for a reminder of what it means (you can turn that off in
            Settings). {game === 'vampire' && 'Name the powers for each Discipline dot, then '}
            {game === 'werewolf' && 'Add any rites you know, then '}
            {game === 'hunter' && 'Add your notes and Redemption, then '}
            write their history in Biography when you’re ready.
          </p>
        </div>
      )}
      <CharacterEditor game={game} id={character.id} initialSheet={character.sheet} initialStatus={character.status} portrait={character.portrait}>
        <SheetForm game={game} />
      </CharacterEditor>
    </div>
  );
}
