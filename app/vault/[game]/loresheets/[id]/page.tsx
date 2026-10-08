import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MdArrowBack } from 'react-icons/md';
import { getCharacters } from '@/app/lib/data/characters';
import { getLoresheet } from '@/app/lib/data/loresheets';
import { isGame } from '@/app/lib/games';
import { LORE_KINDS } from '@/app/lib/loresheets';
import PageHeader from '@/app/ui/kit/PageHeader';
import LoresheetEditor from '@/app/ui/loresheets/LoresheetEditor';

export async function generateMetadata({ params }: PageProps<'/vault/[game]/loresheets/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const sheet = await getLoresheet(id);
  return { title: sheet?.title || 'Loresheet' };
}

export default async function LoresheetPage({ params }: PageProps<'/vault/[game]/loresheets/[id]'>) {
  const { game, id } = await params;
  if (!isGame(game)) notFound();
  const sheet = await getLoresheet(id);
  if (!sheet || sheet.game !== game) notFound();
  const characters = sheet.kind === 'pc' ? (await getCharacters(game)).map((c) => ({ id: c.id, name: c.name })) : [];
  const spec = LORE_KINDS[sheet.kind];

  return (
    <div className='flex flex-col gap-8'>
      <Link href={`/vault/${game}/loresheets`} className='inline-flex items-center gap-1.5 self-start text-sm text-bone/60 transition-colors hover:text-bone'>
        <MdArrowBack aria-hidden /> All loresheets
      </Link>
      <PageHeader eyebrow={`Loresheet · ${spec.label}`} title={sheet.title || `New ${spec.noun}`} description={spec.blurb} />
      <LoresheetEditor
        id={sheet.id}
        game={game}
        kind={sheet.kind}
        initial={{ title: sheet.title, character_id: sheet.character_id, content: sheet.content }}
        characters={characters}
      />
    </div>
  );
}
