'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GiCastle, GiVampireCape, GiScrollUnfurled, GiD10 } from 'react-icons/gi';

export const NAV_LINKS = [
  { name: 'Overview', href: '/dashboard', icon: GiCastle },
  { name: 'Characters', href: '/dashboard/characters', icon: GiVampireCape },
  { name: 'Sheets', href: '/dashboard/sheets', icon: GiScrollUnfurled },
  { name: 'Dice', href: '/dashboard/dice', icon: GiD10 },
];

function isActive(pathname: string, href: string) {
  return href === '/dashboard' ? pathname === href : pathname.startsWith(href);
}

// Vertical list for the desktop sidebar.
export function SideNavLinks() {
  const pathname = usePathname();
  return (
    <ul className='flex flex-col gap-1'>
      {NAV_LINKS.map(({ name, href, icon: Icon }) => {
        const active = isActive(pathname, href);
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
              <Icon
                aria-hidden
                className={`size-5 transition-[color,scale] duration-300 ease-(--ease-spring) group-hover:scale-110 ${active ? 'text-accent' : ''}`}
              />
              {name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// Bottom tab bar for phones.
export function TabBarLinks() {
  const pathname = usePathname();
  return (
    <ul className='grid grid-cols-4'>
      {NAV_LINKS.map(({ name, href, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 py-2.5 text-[0.65rem] tracking-wide transition-colors duration-300 ${
                active ? 'text-bone' : 'text-bone/50'
              }`}
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
