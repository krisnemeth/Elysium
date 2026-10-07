'use client';

import type { IconType } from 'react-icons';
import { GiCaveEntrance, GiDominoMask, GiHouse, GiPineTree, GiStreetLight, GiWoodCabin } from 'react-icons/gi';
import { MdSwapHoriz } from 'react-icons/md';
import { GAMES, type Game } from '@/app/lib/games';
import { THEME_STORAGE_KEY, type Theme } from '@/app/lib/theme';

// Each game's two scenes, as icons from the same set as the rest of the nav.
const ICONS: Record<Game, Record<Theme, IconType>> = {
  vampire: { dark: GiDominoMask, light: GiStreetLight },
  werewolf: { dark: GiPineTree, light: GiCaveEntrance },
  hunter: { dark: GiWoodCabin, light: GiHouse },
};

function toggle() {
  const root = document.documentElement;
  const next: Theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {}
}

/*
  Switches between the game's two scenes. Shows the current scene's icon and
  name; CSS (`dark:`) picks which, so server and client markup match.
*/
export default function ThemeSwitch({ game, compact = false }: { game: Game; compact?: boolean }) {
  const modes = GAMES[game].modes;
  const { dark: Dark, light: Light } = ICONS[game];
  return (
    <button
      type='button'
      onClick={toggle}
      className={`group flex items-center gap-3 rounded-xl text-sm text-bone/60 transition-colors duration-300 hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        compact ? 'p-2' : 'w-full px-4 py-3 hover:bg-bone/[0.04]'
      }`}
    >
      <Dark aria-hidden className='hidden size-5 transition-[scale] duration-300 ease-(--ease-spring) group-hover:scale-110 dark:block' />
      <Light aria-hidden className='size-5 transition-[scale] duration-300 ease-(--ease-spring) group-hover:scale-110 dark:hidden' />
      <span className={compact ? 'sr-only' : 'min-w-0 grow truncate text-left whitespace-nowrap'}>
        <span className='dark:hidden'>
          {modes.light}
          <span className='sr-only'>. Switch to {modes.dark}.</span>
        </span>
        <span className='hidden dark:inline'>
          {modes.dark}
          <span className='sr-only'>. Switch to {modes.light}.</span>
        </span>
      </span>
      {!compact && <MdSwapHoriz aria-hidden className='size-4 opacity-40 transition-opacity group-hover:opacity-80' />}
    </button>
  );
}
