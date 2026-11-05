import type { Metadata } from 'next';
import { getCharacters, toCharacter } from '@/app/lib/data/characters';
import { getLoresheets } from '@/app/lib/data/loresheets';
import { getMe } from '@/app/lib/data/social';
import { enteredCover } from '@/app/lib/entry-cover';
import OverviewPage from '@/app/ui/overview/OverviewPage';

export const metadata: Metadata = { title: 'Overview' };

export default async function Overview() {
  const [me, cover, characters, loresheets] = await Promise.all([getMe(), enteredCover(), getCharacters(), getLoresheets()]);
  return (
    <OverviewPage
      name={me?.display_name}
      cover={cover}
      characters={characters.map(toCharacter)}
      loresheets={loresheets.map((l) => ({ id: l.id, game: l.game, title: l.title, kind: l.kind }))}
    />
  );
}
