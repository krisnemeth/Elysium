'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GiLockedChest, GiVampireCape, GiD10, GiBatWing, GiWolfHowl, GiCrossbow, GiCampfire, GiScrollUnfurled } from 'react-icons/gi';
import { MdOutlineSettings, MdPeopleOutline } from 'react-icons/md';
import type { IconType } from 'react-icons';
import { GAMES, GAMES_ORDER, gamePath, type Game } from '@/app/lib/games';

const GAME_ICON = { vampire: GiBatWing, werewolf: GiWolfHowl, hunter: GiCrossbow };

// The characters page is named after the game's group: Coterie, Pack, Cell.
const groupName = (game: Game) => GAMES[game].noun.group[0].toUpperCase() + GAMES[game].noun.group.slice(1);

const linksFor = (game: Game) => [
  { name: GAMES[game].name, href: gamePath(game), icon: GAME_ICON[game] },
  { name: groupName(game), href: gamePath(game, '/characters'), icon: GiVampireCape },
  { name: 'Loresheets', href: `/vault/loresheets?game=${game}`, icon: GiScrollUnfurled },
  { name: 'Dice', href: gamePath(game, '/dice'), icon: GiD10 },
];

type NavLink = { name: string; href: string; icon: IconType };

const OVERVIEW = { name: 'Overview', href: '/vault', icon: GiLockedChest };
const LORESHEETS = { name: 'Loresheets', href: '/vault/loresheets', icon: GiScrollUnfurled };
const ACCOUNT = [
  { name: 'Settings', href: '/vault/settings', icon: MdOutlineSettings },
  { name: 'Friends', href: '/vault/friends', icon: MdPeopleOutline },
];

function isActive(pathname: string, href: string, game: Game) {
  return href === OVERVIEW.href || href === gamePath(game) ? pathname === href : pathname.startsWith(href);
}

function NavItem({ link: { name, href, icon: Icon }, active, badge }: { link: NavLink; active: boolean; badge?: number }) {
  return (
    <li>
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
        <Icon aria-hidden className={`size-5 shrink-0 transition-[color,scale] duration-300 ease-(--ease-spring) group-hover:scale-110 ${active ? 'text-accent' : ''}`} />
        <span className='min-w-0 grow'>{name}</span>
        {badge ? (
          <span className='grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-accent px-1.5 text-[0.65rem] font-semibold text-on-accent'>
            {badge}
            <span className='sr-only'> waiting</span>
          </span>
        ) : null}
      </Link>
    </li>
  );
}

// Chronicles are being reworked: no link in any navigation for now. The pages still work, for open tables and shared links.
function ChroniclesSoon() {
  return (
    <li className='flex cursor-not-allowed items-center gap-2 rounded-xl py-3 pr-1 pl-4 text-sm text-bone/30'>
      <GiCampfire aria-hidden className='mr-1 size-5 shrink-0' />
      <span className='min-w-0 grow truncate'>Chronicles</span>
      <span className='shrink-0 rounded-full border border-bone/15 px-1.5 py-0.5 text-[0.55rem] tracking-widest text-bone/40 uppercase'>Soon</span>
    </li>
  );
}

// Vertical list for a game's sidebar.
export function SideNavLinks({ game, group = 'main' }: { game: Game; group?: 'main' | 'chronicles' | 'account' }) {
  const pathname = usePathname();
  if (group === 'chronicles') {
    return (
      <ul className='flex flex-col gap-1'>
        <ChroniclesSoon />
      </ul>
    );
  }
  const links = group === 'main' ? [OVERVIEW, ...linksFor(game)] : ACCOUNT;
  return (
    <ul className='flex flex-col gap-1'>
      {links.map((link) => (
        <NavItem key={link.href} link={link} active={isActive(pathname, link.href, game)} />
      ))}
    </ul>
  );
}

// The neutral pages' sidebar.
export function OverviewLinks() {
  const pathname = usePathname();
  return (
    <ul className='flex flex-col gap-1'>
      <NavItem link={OVERVIEW} active={pathname === OVERVIEW.href} />
      <NavItem link={LORESHEETS} active={pathname.startsWith(LORESHEETS.href)} />
      <ChroniclesSoon />
    </ul>
  );
}

export function OverviewAccountLinks({ friendRequests }: { friendRequests: number }) {
  const pathname = usePathname();
  return (
    <ul className='flex flex-col gap-1'>
      <NavItem link={{ name: 'Settings', href: '/vault/settings', icon: MdOutlineSettings }} active={pathname === '/vault/settings'} />
      <NavItem link={{ name: 'Friends', href: '/vault/friends', icon: MdPeopleOutline }} active={pathname === '/vault/friends'} badge={friendRequests} />
    </ul>
  );
}

// Jump between the three games' vaults.
export function GameSwitcher({ game, compact = false }: { game?: Game; compact?: boolean }) {
  return (
    <ul aria-label='Game' className={`grid grid-cols-3 gap-1 rounded-xl bg-bone/[0.04] p-1 ${compact ? 'w-full' : ''}`}>
      {GAMES_ORDER.map((g) => {
        const Icon = GAME_ICON[g];
        return (
          <li key={g}>
            <Link
              href={gamePath(g)}
              data-tint={g}
              title={GAMES[g].title}
              aria-current={g === game ? 'true' : undefined}
              className={`grid place-items-center rounded-lg py-2 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-accent ${
                g === game ? 'bg-accent text-on-accent shadow-[0_0_1rem_-0.4rem_var(--accent)]' : 'text-bone/55 hover:bg-bone/[0.05] hover:text-bone'
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
