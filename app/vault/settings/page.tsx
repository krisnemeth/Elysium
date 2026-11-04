import { redirect } from 'next/navigation';
import { currentGame } from '@/app/lib/current-game';
import { gamePath } from '@/app/lib/games';

// Settings live in each game's dashboard: this goes to the one you were last in.
export default async function Settings() {
  redirect(gamePath(await currentGame(), '/settings'));
}
