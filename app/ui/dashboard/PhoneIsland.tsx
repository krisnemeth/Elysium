'use client';

import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { FaPowerOff } from 'react-icons/fa';
import { MdClose, MdExpandMore, MdMenu, MdOutlinePalette, MdOutlineSettings, MdPeopleOutline } from 'react-icons/md';
import { signOut } from '@/app/lib/actions/auth';
import { gamePath, type Game } from '@/app/lib/games';
import { Elysium1 } from '@/app/ui/svgs';
import { panel } from '@/app/ui/kit/styles';
import { IslandBackdrop, IslandSection, useIsland } from '@/app/ui/kit/Island';
import { GameSwitcher } from './nav-links';
import { ThemeTiles } from './ThemePicker';

const row =
  'flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-base text-bone/85 transition-colors hover:bg-bone/[0.06] focus-visible:outline-2 focus-visible:outline-accent';

/*
  The phone top bar as a "dynamic island": the menu button grows the bar
  itself to show Settings, Friends, Themes and Log out; Themes grows it
  further with the scene tiles. The page behind blurs while it's open.
*/
export default function PhoneIsland({ game }: { game: Game }) {
  const [open, setOpen] = useState(false);
  const [themes, setThemes] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const themesButton = useRef<HTMLButtonElement>(null);
  const expanded = open || themes;
  const closeAll = useCallback(() => {
    setOpen(false);
    setThemes(false);
  }, []);
  // Escape closes the themes panel first, then the menu.
  const onEscape = useCallback(() => {
    if (themes) setThemes(false);
    else setOpen(false);
  }, [themes]);
  useIsland({ open: expanded, onEscape, onBreakpoint: closeAll, trigger: themes ? themesButton : menuButton });

  return (
    <header className='fixed inset-x-0 top-0 z-40 px-3 pt-3 md:hidden'>
      <IslandBackdrop open={expanded} onClose={closeAll} />
      <div className={`frame relative flex flex-col gap-2 px-3 py-2 ${panel}`}>
        <div className='flex h-10 items-center justify-between'>
          <Link href='/vault' aria-label='Your vault' onClick={closeAll}>
            <Elysium1 aria-hidden className='h-auto w-24 text-bone/90' />
          </Link>
          <button
            ref={menuButton}
            type='button'
            aria-expanded={open}
            aria-controls='phone-menu'
            aria-label={open ? 'Close menu' : 'Menu'}
            onClick={() => {
              setOpen((o) => !o);
              setThemes(false);
            }}
            className='grid size-10 place-items-center rounded-xl text-bone/80 transition-colors hover:bg-bone/[0.06] hover:text-bone'
          >
            {open ? <MdClose aria-hidden className='size-6' /> : <MdMenu aria-hidden className='size-6' />}
          </button>
        </div>
        <GameSwitcher game={game} compact />

        <IslandSection open={open} id='phone-menu'>
          <nav aria-label='Account' className='flex flex-col gap-1 pt-2 pb-1'>
            <Link href={gamePath(game, '/settings')} onClick={closeAll} className={row}>
              <MdOutlineSettings aria-hidden className='size-5' /> Settings
            </Link>
            <Link href={gamePath(game, '/friends')} onClick={closeAll} className={row}>
              <MdPeopleOutline aria-hidden className='size-5' /> Friends
            </Link>
            <button ref={themesButton} type='button' aria-expanded={themes} aria-controls='phone-themes' onClick={() => setThemes((t) => !t)} className={row}>
              <MdOutlinePalette aria-hidden className='size-5' />
              <span className='grow text-left'>Themes</span>
              <MdExpandMore aria-hidden className={`size-5 transition-transform duration-300 ${themes ? 'rotate-180' : ''}`} />
            </button>
          </nav>
        </IslandSection>
        <IslandSection open={themes} id='phone-themes'>
          <div className='px-1 pb-2'>
            <ThemeTiles game={game} />
          </div>
        </IslandSection>
        <IslandSection open={open}>
          <form action={signOut} className='border-t border-bone/10 pt-1 pb-1'>
            <button className={`${row} text-bone/65`}>
              <FaPowerOff aria-hidden className='size-4' /> Log out
            </button>
          </form>
        </IslandSection>
      </div>
    </header>
  );
}
