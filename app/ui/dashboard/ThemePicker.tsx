'use client';

import Link from 'next/link';
import { useId, useSyncExternalStore, type CSSProperties } from 'react';
import { MdCheck, MdOutlinePalette } from 'react-icons/md';
import { GAMES, gamePath, type Game } from '@/app/lib/games';
import { THEME_STORAGE_KEY, type Theme } from '@/app/lib/theme';

// A small picture of each scene: its colours and the shape of its frame.
const PREVIEWS: Record<Game, Record<Theme, { mood: string; bg: string; frame: CSSProperties; accent: string }>> = {
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

// The theme lives on <html data-theme>; watch it from outside React.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}
const currentTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

function choose(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, t);
  } catch {}
}

/*
  "Themes" opens a small drawer with the game's two scenes as preview tiles.
  Uses the popover API: Esc or a click outside closes it.
*/
export default function ThemePicker({ game, compact = false }: { game: Game; compact?: boolean }) {
  const id = useId();
  const theme = useSyncExternalStore(subscribe, currentTheme, () => 'dark' as Theme);

  return (
    <>
      <button
        type='button'
        popoverTarget={id}
        className={`group flex items-center gap-3 rounded-xl text-sm text-bone/60 transition-colors duration-300 hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          compact ? 'p-2' : 'w-full px-4 py-3 hover:bg-bone/[0.04]'
        }`}
      >
        <MdOutlinePalette aria-hidden className='size-5 transition-[scale] duration-300 ease-(--ease-spring) group-hover:scale-110' />
        <span className={compact ? 'sr-only' : ''}>Themes</span>
      </button>

      <div
        id={id}
        popover='auto'
        aria-label={`${GAMES[game].name} themes`}
        // Popovers default to the centre of the screen; place it by the button instead.
        className={`fixed w-72 rounded-2xl border border-bone/15 bg-ink/95 p-4 text-bone shadow-[0_1.5rem_3rem_-0.5rem_rgb(0_0_0/0.8)] backdrop-blur-xl ${
          compact ? 'inset-x-0 top-20 bottom-auto mx-auto' : 'top-auto right-auto bottom-40 left-[16.5rem] m-0'
        }`}
      >
        <p className='px-1 text-[0.65rem] tracking-[0.25em] text-bone/50 uppercase'>{GAMES[game].name} themes</p>
        <ul className='mt-3 flex flex-col gap-2'>
          {(['dark', 'light'] as const).map((t) => {
            const p = PREVIEWS[game][t];
            const active = theme === t;
            return (
              <li key={t}>
                <button
                  type='button'
                  aria-pressed={active}
                  onClick={() => choose(t)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                    active ? 'border-accent/60 bg-accent/10' : 'border-bone/10 hover:border-bone/30'
                  }`}
                >
                  {/* Mini scene with a mini frame. */}
                  <span aria-hidden className='relative grid h-14 w-20 shrink-0 place-items-center overflow-hidden rounded-lg' style={{ background: p.bg }}>
                    <span className='h-9 w-6 rounded-[4px] bg-black/40' style={p.frame} />
                    <span className='absolute right-1.5 bottom-1.5 size-1.5 rounded-full' style={{ background: p.accent }} />
                  </span>
                  <span className='min-w-0 grow'>
                    <span className='flex items-center gap-1.5 font-display text-lg leading-tight'>
                      {GAMES[game].modes[t]}
                      {active && <MdCheck aria-hidden className='size-4 text-accent' />}
                    </span>
                    <span className='block text-xs leading-snug text-bone/55'>{p.mood}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <Link href={gamePath(game, '/settings')} className='mt-3 block px-1 text-xs text-bone/50 underline-offset-2 hover:text-bone hover:underline'>
          Prefer plain borders? Simple frames in Settings
        </Link>
      </div>
    </>
  );
}
