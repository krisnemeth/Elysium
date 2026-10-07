import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from '@/app/ui/kit/PageHeader';
import CharacterEditor from '@/app/ui/sheets/CharacterEditor';
import SheetForm from '@/app/ui/sheets/SheetForm';
import { emptySheet } from '@/app/lib/sheets/empty';
import { GAMES, isGame } from '@/app/lib/games';

export const metadata: Metadata = { title: 'New character sheet' };

export default async function NewSheet({ params }: PageProps<'/vault/[game]/new'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  return (
    <div className='flex flex-col gap-8'>
      <PageHeader
        eyebrow={`New ${GAMES[game].noun.one}`}
        title='Character sheet'
        description='Fill it in as you would the printed sheet. It saves as you go; click a dot to set a rating, or use the arrow keys.'
      />
      <CharacterEditor game={game} id={null} initialSheet={emptySheet(game)}>
        <SheetForm game={game} />
      </CharacterEditor>
    </div>
  );
}
