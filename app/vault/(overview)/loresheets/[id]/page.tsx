import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MdArrowBack } from 'react-icons/md';
import { getCharacters } from '@/app/lib/data/characters';
import { getLoresheet } from '@/app/lib/data/loresheets';
import { GAMES } from '@/app/lib/games';
import { LORE_KINDS } from '@/app/lib/loresheets';
import PageHeader from '@/app/ui/kit/PageHeader';
import LoresheetEditor from '@/app/ui/loresheets/LoresheetEditor';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const sheet = await getLoresheet(id);
  return { title: sheet?.title || 'Loresheet' };
}

export default async function LoresheetPage({ params }: Props) {
  const { id } = await params;
  const sheet = await getLoresheet(id);
  if (!sheet) notFound();
  const characters = sheet.kind === 'pc' ? (await getCharacters(sheet.game)).map((c) => ({ id: c.id, name: c.name })) : [];
  const spec = LORE_KINDS[sheet.kind];

  return (
    <div className='flex flex-col gap-8'>
      <Link href='/vault/loresheets' className='inline-flex items-center gap-1.5 self-start text-sm text-bone/60 transition-colors hover:text-bone'>
        <MdArrowBack aria-hidden /> All loresheets
      </Link>
      <PageHeader eyebrow={`${GAMES[sheet.game].name} · ${spec.label}`} title={sheet.title || `New ${spec.noun}`} description={spec.blurb} />
      <LoresheetEditor
        id={sheet.id}
        kind={sheet.kind}
        initial={{ title: sheet.title, character_id: sheet.character_id, content: sheet.content }}
        characters={characters}
      />
    </div>
  );
}
