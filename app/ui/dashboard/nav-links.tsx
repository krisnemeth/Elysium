'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GiCastle, GiVampireCape, GiQuillInk, GiD10, GiBatWing, GiWolfHowl, GiCrossbow } from 'react-icons/gi';
import { GAMES, GAMES_ORDER, gamePath, type Game } from '@/app/lib/games';

const linksFor = (game: Game) => [
  { name: 'Overview', href: gamePath(game), icon: GiCastle },
  { name: GAMES[game].noun.many === 'Hunters' ? 'Cell' : 'Characters', href: gamePath(game, '/characters'), icon: GiVampireCape },
  { name: 'New sheet', href: gamePath(game, '/new'), icon: GiQuillInk },
  { name: 'Dice', href: gamePath(game, '/dice'), icon: GiD10 },
];

function isActive(pathname: string, href: string, game: Game) {
  return href === gamePath(game) ? pathname === href : pathname.startsWith(href);
}

// Vertical list for the desktop sidebar.
export function SideNavLinks({ game }: { game: Game }) {
  const pathname = usePathname();
  return (
    <ul className='flex flex-col gap-1'>
      {linksFor(game).map(({ name, href, icon: Icon }) => {
        const active = isActive(pathname, href, game);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                active ? 'bg-bone/[0.07] text-bone' : 'text-bone/60 hover:bg-bone/[0.04] hover:text-bone'
              }`}
            >
              <span
                aria-hidden
                className={`absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0.75rem_var(--accent)] transition-[scale,opacity] duration-500 ease-(--ease-spring) ${
                  active ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
                }`}
              />
              <Icon aria-hidden className={`size-5 transition-[color,scale] duration-300 ease-(--ease-spring) group-hover:scale-110 ${active ? 'text-accent' : ''}`} />
              {name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// Bottom tab bar for phones.
export function TabBarLinks({ game }: { game: Game }) {
  const pathname = usePathname();
  return (
    <ul className='grid grid-cols-4'>
      {linksFor(game).map(({ name, href, icon: Icon }) => {
        const active = isActive(pathname, href, game);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 py-2.5 text-[0.65rem] tracking-wide transition-colors duration-300 ${active ? 'text-bone' : 'text-bone/50'}`}
            >
              <span
                className={`grid h-8 w-12 place-items-center rounded-full transition-[background-color,scale] duration-500 ease-(--ease-spring) ${
                  active ? 'scale-100 bg-accent/90 text-white shadow-[0_0_1rem_-0.25rem_var(--accent)]' : 'scale-90'
                }`}
              >
                <Icon aria-hidden className='size-5' />
              </span>
              {name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

const GAME_ICON = { vampire: GiBatWing, werewolf: GiWolfHowl, hunter: GiCrossbow };

// Jump between the three games' dashboards; the vault keeps one list of characters.
export function GameSwitcher({ game, compact = false }: { game: Game; compact?: boolean }) {
  return (
    <ul aria-label='Game' className={`grid grid-cols-3 gap-1 rounded-xl bg-bone/[0.04] p-1 ${compact ? 'w-full' : ''}`}>
      {GAMES_ORDER.map((g) => {
        const Icon = GAME_ICON[g];
        return (
          <li key={g}>
            <Link
              href={gamePath(g)}
              title={GAMES[g].title}
              aria-current={g === game ? 'true' : undefined}
              className={`grid place-items-center rounded-lg py-2 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-accent ${
                g === game ? 'bg-accent text-white shadow-[0_0_1rem_-0.4rem_var(--accent)]' : 'text-bone/55 hover:bg-bone/[0.05] hover:text-bone'
              }`}
            >
              <Icon aria-hidden className='size-5' />
              <span className='sr-only'>{GAMES[g].name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
