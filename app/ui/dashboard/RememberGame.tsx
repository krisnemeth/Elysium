'use client';

import { useEffect } from 'react';
import { GAME_COOKIE, type Game } from '@/app/lib/games';

// Notes the game you're in, so the vault, chronicles, Friends and Settings stay in it (app/lib/current-game.ts).
export default function RememberGame({ game }: { game: Game }) {
  useEffect(() => {
    document.cookie = `${GAME_COOKIE}=${game}; path=/; max-age=31536000; samesite=lax`;
  }, [game]);
  return null;
}
