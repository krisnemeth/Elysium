import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSharedCharacter } from '@/app/lib/data/characters';
import { getChronicle } from '@/app/lib/data/social';
import CharacterSheetView from '@/app/ui/characters/CharacterSheetView';
import SocialShell from '@/app/ui/social/SocialShell';

export const metadata: Metadata = { title: 'Player sheet' };

// A player's sheet, read-only, for the chronicle's Storyteller.
export default async function SharedSheet({ params }: PageProps<'/vault/chronicles/[id]/characters/[characterId]'>) {
  const { id, characterId } = await params;
  const [data, record] = await Promise.all([getChronicle(id), getSharedCharacter(characterId)]);
  // RLS already limits this to Storytellers; also make sure it belongs to this chronicle.
  if (!data || !record || !data.party.some((p) => p.character_id === characterId && p.status === 'joined')) notFound();

  return (
    <SocialShell game={record.game} eyebrow={`${data.chronicle.name} · read-only`} title={record.name || 'Unnamed'}>
      <CharacterSheetView record={record} back={{ href: `/vault/chronicles/${id}`, label: data.chronicle.name }} />
    </SocialShell>
  );
}
