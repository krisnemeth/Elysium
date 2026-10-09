'use client';

import Link from 'next/link';
import { useCallback, useId, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { MdCheck, MdExpandMore, MdOutlinePalette } from 'react-icons/md';
import { GAMES, gamePath, type Game } from '@/app/lib/games';
import type { Theme } from '@/app/lib/theme';
import { readTheme, serverTheme, subscribeTheme, switchTheme } from '@/app/lib/theme-switch';
import { IslandSection, useIsland } from '@/app/ui/kit/Island';

// A small picture of each scene: its colours and the shape of its frame.
export const PREVIEWS: Record<Game, Record<Theme, { mood: string; bg: string; frame: CSSProperties; accent: string }>> = {
  vampire: {
    dark: { mood: 'Gothic velvet and candle-red.', bg: 'linear-gradient(160deg,#450a0a,#0d0a0b 70%)', frame: { border: '1px solid #c81e2b88', outline: '1px solid #ffffff1a', outlineOffset: 2 }, accent: '#c81e2b' },
    light: { mood: 'Clubs, rain and neon.', bg: 'linear-gradient(160deg,#2e1065,#0d0717 70%)', frame: { border: '1.5px solid #fda4c4', boxShadow: '0 0 6px #e11d48, 0 0 14px #e11d4888' }, accent: '#e11d48' },
  },
  werewolf: {
    dark: { mood: 'Pines under a full moon.', bg: 'radial-gradient(circle at 75% 20%,#e7e5d6 0 8%,transparent 9%),linear-gradient(170deg,#1b2a22,#0b120e 70%)', frame: { border: '2px dashed #4f7a4c' }, accent: '#ea580c' },
    light: { mood: 'Firelight on old stone.', bg: 'radial-gradient(circle at 30% 85%,#f59e0b55,transparent 45%),linear-gradient(170deg,#3a322a,#14110e 70%)', frame: { border: '3px solid #443b31' }, accent: '#f59e0b' },
  },
  hunter: {
    dark: { mood: 'A lamp, a map, a long night.', bg: 'radial-gradient(circle at 80% 15%,#f59e0b44,transparent 40%),linear-gradient(170deg,#2a1c11,#120c07 70%)', frame: { border: '3px solid #3a2414' }, accent: '#f59e0b' },
    light: { mood: 'A warm room in town (being reworked).', bg: 'linear-gradient(170deg,#f8f1e2,#e9dcc2)', frame: { border: '1px solid #6e4b2c55' }, accent: '#b45309' },
  },
};

// One tile per scene, with a mini preview; the current one is ticked.
export function ThemeTiles({ game, onPicked, compact = false }: { game: Game; onPicked?: () => void; compact?: boolean }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, serverTheme);
  return (
    <ul className='flex flex-col gap-2'>
      {(['dark', 'light'] as const).map((t) => {
        const p = PREVIEWS[game][t];
        const active = theme === t;
        return (
          <li key={t}>
            <button
              type='button'
              aria-pressed={active}
              onClick={() => {
                switchTheme(t);
                onPicked?.();
              }}
              className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                active ? 'border-accent/60 bg-accent/10' : 'border-bone/10 hover:border-bone/30'
              }`}
            >
              {/* Mini scene with a mini frame. */}
              <span aria-hidden className={`relative grid shrink-0 place-items-center overflow-hidden rounded-lg ${compact ? 'h-9 w-10' : 'h-12 w-16'}`} style={{ background: p.bg }}>
                <span className={`rounded-[4px] bg-black/40 ${compact ? 'h-6 w-4' : 'h-8 w-5'}`} style={p.frame} />
                <span className='absolute right-1.5 bottom-1.5 size-1.5 rounded-full' style={{ background: p.accent }} />
              </span>
              <span className='min-w-0 grow'>
                <span className={`flex items-center gap-1.5 font-display leading-tight ${compact ? 'text-sm' : 'text-base'}`}>
                  <span className='min-w-0'>{GAMES[game].modes[t]}</span>
                  {active && <MdCheck aria-hidden className='size-4 shrink-0 text-accent' />}
                </span>
                {!compact && <span className='block text-xs leading-snug text-bone/55'>{p.mood}</span>}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/*
  Themes in the desktop sidebar: the item grows in place to show the tiles,
  dynamic-island style, instead of opening a separate drawer.
*/
export default function ThemePicker({ game }: { game: Game }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useIsland({ open, onEscape: close, trigger, lockScroll: false });

  return (
    <div data-themes={open ? 'open' : undefined} className={`rounded-xl transition-colors duration-300 ${open ? 'bg-bone/[0.04]' : ''}`}>
      <button
        ref={trigger}
        type='button'
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className='group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-bone/60 transition-colors duration-300 hover:bg-bone/[0.04] hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
      >
        <MdOutlinePalette aria-hidden className='size-5 transition-[scale] duration-300 ease-(--ease-spring) group-hover:scale-110' />
        <span className='grow text-left'>Themes</span>
        <MdExpandMore aria-hidden className={`size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <IslandSection open={open} id={id}>
        <div className='flex flex-col gap-2 px-2 pt-1 pb-2'>
          <ThemeTiles game={game} compact />
          <Link href={gamePath(game, '/settings')} className='px-1 text-xs text-bone/50 underline-offset-2 hover:text-bone hover:underline'>
            Simple frames in Settings
          </Link>
        </div>
      </IslandSection>
    </div>
  );
}
