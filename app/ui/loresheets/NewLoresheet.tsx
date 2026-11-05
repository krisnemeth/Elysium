'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { GAMES, GAMES_ORDER, type Game } from '@/app/lib/games';
import { LORE_KINDS, type LoreKind } from '@/app/lib/loresheets';
import { createLoresheet } from '@/app/lib/actions/loresheets';
import { buttonPrimary } from '@/app/ui/kit/styles';
import { LORE_ICONS } from './icons';

// "+ New loresheet" with a small menu of the three kinds; from the overview (no `game`) it also asks which game.
export default function NewLoresheet({ game, initialGame = 'vampire', buttonClass = buttonPrimary }: { game?: Game; initialGame?: Game; buttonClass?: string }) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState(initialGame);
  const target = game ?? picked;
  const menuId = useId();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  return (
    <div ref={root} className='relative'>
      <button type='button' aria-expanded={open} aria-controls={menuId} onClick={() => setOpen((o) => !o)} className={buttonClass}>
        <MdAdd aria-hidden className='size-4' />
        New loresheet
      </button>
      {open && (
        <div id={menuId} className='absolute left-0 z-30 mt-2 w-72 rounded-2xl border border-bone/15 bg-ink/95 p-2 shadow-[0_1.5rem_3rem_-0.5rem_rgb(0_0_0/0.8)] backdrop-blur-xl md:right-0 md:left-auto'>
          {!game && (
            <div role='group' aria-label='Game' className='mb-2 grid grid-cols-3 gap-1 rounded-xl bg-bone/[0.05] p-1'>
              {GAMES_ORDER.map((g) => (
                <button
                  key={g}
                  type='button'
                  aria-pressed={picked === g}
                  onClick={() => setPicked(g)}
                  className={`rounded-lg py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-accent ${picked === g ? 'bg-accent text-white' : 'text-bone/60 hover:text-bone'}`}
                >
                  {GAMES[g].name}
                </button>
              ))}
            </div>
          )}
          <ul>
          {(Object.keys(LORE_KINDS) as LoreKind[]).map((k) => {
            const Icon = LORE_ICONS[k];
            return (
              <li key={k}>
                <form action={createLoresheet.bind(null, target, k)}>
                  <button className='flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-bone/[0.06] focus-visible:outline-2 focus-visible:outline-accent'>
                    <Icon aria-hidden className='mt-0.5 size-5 shrink-0 text-accent' />
                    <span>
                      <span className='block font-display text-lg leading-tight'>{LORE_KINDS[k].label}</span>
                      <span className='block text-xs leading-snug text-bone/55'>{LORE_KINDS[k].blurb}</span>
                    </span>
                  </button>
                </form>
              </li>
            );
          })}
          </ul>
        </div>
      )}
    </div>
  );
}
