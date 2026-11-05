import { redirect } from 'next/navigation';
import { currentGame } from '@/app/lib/current-game';
import { gamePath } from '@/app/lib/games';

// Your vault opens in the last game you were in (Vampire until then); each game has its own.
export default async function Vault() {
  redirect(gamePath(await currentGame()));
}
