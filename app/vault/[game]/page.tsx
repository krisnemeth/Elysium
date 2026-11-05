import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import VaultHome from '@/app/ui/dashboard/VaultHome';
import { getCharacters, toCharacter } from '@/app/lib/data/characters';
import { getLoresheets } from '@/app/lib/data/loresheets';
import { isGame } from '@/app/lib/games';
import { toVaultView, VAULT_VIEW_COOKIE } from '@/app/lib/vault-view';

export const metadata: Metadata = { title: 'Your vault' };

export default async function GameVault({ params }: PageProps<'/vault/[game]'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  const [characters, loresheets, jar] = await Promise.all([getCharacters(), getLoresheets(game), cookies()]);
  return (
    <VaultHome
      game={game}
      characters={characters.map(toCharacter)}
      loresheets={loresheets.map((l) => ({ id: l.id, title: l.title, kind: l.kind }))}
      view={toVaultView(jar.get(VAULT_VIEW_COOKIE)?.value)}
    />
  );
}
