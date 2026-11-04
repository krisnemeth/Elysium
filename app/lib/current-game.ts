import { cookies } from 'next/headers';
import { DEFAULT_GAME, GAME_COOKIE, isGame, type Game } from '@/app/lib/games';

// Which game's look the pages spanning all three wear: the last one you were in.
export async function currentGame(): Promise<Game> {
  const saved = (await cookies()).get(GAME_COOKIE)?.value;
  return saved && isGame(saved) ? saved : DEFAULT_GAME;
}
