import type React from 'react';

// Shared bits for the screens (Screens.tsx, GamesSection.tsx).

// A screen's content column, above its wash and weather.
export const BODY = 'relative z-2 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col';

// A stagger index for the entrances (.lc-in, landing.css).
export const at = (i: number) => ({ '--i': i }) as React.CSSProperties;

// The badge on whatever matches the chosen cover: shown where --here is 1
// (set in landing.css from <html data-lc-scene / data-lc-game>).
export function Here({ children }: { children: React.ReactNode }) {
  return (
    <span className='absolute top-3 left-3 z-3 inline-flex translate-y-[calc((1-var(--here,0))*-0.5rem)] items-center gap-2 rounded-full border border-(--lc-glow)/60 bg-[#0a0809]/60 py-1.5 pr-3 pl-2.5 text-[0.6rem] tracking-[0.22em] text-bone uppercase opacity-[var(--here,0)] backdrop-blur-md transition-[opacity,translate] delay-600 duration-800 ease-(--lc-ease)'>
      <span aria-hidden className='size-1.5 rounded-full bg-(--lc-glow) shadow-[0_0_0.6rem_var(--lc-glow)]' />
      {children}
    </span>
  );
}
