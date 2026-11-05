'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useId, useRef, useState, useTransition } from 'react';
import { MdCheck, MdExpandMore, MdOutlinePalette } from 'react-icons/md';
import { PREVIEWS } from '@/app/ui/dashboard/ThemePicker';
import { IslandSection, useIsland } from '@/app/ui/kit/Island';
import { COVERS, rememberCover } from '@/app/ui/landing/covers';

/*
  Themes in the overview's sidebar: all six scenes, grown in place like a game's
  ThemePicker. Picking one changes the remembered cover, the same one the landing
  opens on; a game's own saved theme stays as it is.
*/
export default function CoverThemes({ current }: { current: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
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
        <ul className={`flex flex-col gap-1.5 px-2 pt-1 pb-2 transition-opacity ${pending ? 'opacity-60' : ''}`}>
          {COVERS.map((c) => {
            const preview = PREVIEWS[c.game][c.mode];
            const active = c.id === current;
            return (
              <li key={c.id}>
                <button
                  type='button'
                  aria-pressed={active}
                  onClick={() => {
                    rememberCover(c.id);
                    startTransition(() => router.refresh());
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl border p-1.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                    active ? 'border-accent/60 bg-accent/10' : 'border-bone/10 hover:border-bone/30'
                  }`}
                >
                  <span aria-hidden className='relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg' style={{ background: preview.bg }}>
                    <span className='h-5 w-3.5 rounded-[3px] bg-black/40' style={preview.frame} />
                    <span className='absolute right-1 bottom-1 size-1.5 rounded-full' style={{ background: preview.accent }} />
                  </span>
                  <span className='min-w-0 grow font-display text-xs leading-tight'>{c.name}</span>
                  {active && <MdCheck aria-hidden className='size-4 shrink-0 text-accent' />}
                </button>
              </li>
            );
          })}
        </ul>
      </IslandSection>
    </div>
  );
}
