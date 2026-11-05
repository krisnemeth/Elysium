import { cookies } from 'next/headers';
import { getCharacters } from '@/app/lib/data/characters';
import { getChronicle } from '@/app/lib/data/social';
import { gamePath } from '@/app/lib/games';
import { LAST_PLACE_COOKIE, parsePlace } from '@/app/lib/last-place';

// What Continue opens: the last character or chronicle you were in if it's still yours, else the character you last changed.
export async function getContinue(): Promise<{ href: string; name: string } | null> {
  const path = (await cookies()).get(LAST_PLACE_COOKIE)?.value;
  const place = parsePlace(path);
  const characters = await getCharacters();
  if (path && place?.character) {
    const character = characters.find((c) => c.id === place.character);
    if (character) return { href: path, name: character.name || 'Unnamed' };
  }
  if (path && place?.chronicle) {
    const found = await getChronicle(place.chronicle).catch(() => null);
    if (found?.chronicle) return { href: path, name: found.chronicle.name };
  }
  const latest = characters[0];
  return latest ? { href: gamePath(latest.game, `/characters/${latest.id}`), name: latest.name || 'Unnamed' } : null;
}
