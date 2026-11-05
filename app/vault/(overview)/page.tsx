import type { Metadata } from 'next';
import { getCharacters, toCharacter } from '@/app/lib/data/characters';
import { getLoresheets } from '@/app/lib/data/loresheets';
import { getMe } from '@/app/lib/data/social';
import OverviewPage from '@/app/ui/overview/OverviewPage';

export const metadata: Metadata = { title: 'Overview' };

export default async function Overview() {
  const [me, characters, loresheets] = await Promise.all([getMe(), getCharacters(), getLoresheets()]);
  return (
    <OverviewPage
      name={me?.display_name}
      characters={characters.map(toCharacter)}
      loresheets={loresheets.map((l) => ({ id: l.id, game: l.game, title: l.title, kind: l.kind }))}
    />
  );
}
