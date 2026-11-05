import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getCharacters, toCharacter } from '@/app/lib/data/characters';
import { getLoresheets } from '@/app/lib/data/loresheets';
import { getChronicles, getMe } from '@/app/lib/data/social';
import { enteredCover } from '@/app/lib/entry-cover';
import { toVaultView, VAULT_VIEW_COOKIE } from '@/app/lib/vault-view';
import OverviewPage from '@/app/ui/overview/OverviewPage';

export const metadata: Metadata = { title: 'Overview' };

export default async function Overview() {
  const [me, cover, characters, loresheets, chronicles, jar] = await Promise.all([getMe(), enteredCover(), getCharacters(), getLoresheets(), getChronicles(), cookies()]);
  return (
    <OverviewPage
      name={me?.display_name}
      cover={cover}
      characters={characters.map(toCharacter)}
      loresheets={loresheets.map((l) => ({ id: l.id, game: l.game, title: l.title, kind: l.kind }))}
      chronicles={chronicles.length}
      view={toVaultView(jar.get(VAULT_VIEW_COOKIE)?.value)}
    />
  );
}
