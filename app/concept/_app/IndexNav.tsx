'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/concept/dashboard', label: 'Board' },
  { href: '/concept/dashboard/characters', label: 'Dossiers' },
  { href: '/concept/dashboard/sheets', label: 'Sheets' },
  { href: '/concept/dashboard/dice', label: 'Dice' },
];

export default function IndexNav() {
  const pathname = usePathname();
  return (
    <ul className='flex gap-8 overflow-x-auto px-5 [scrollbar-width:none] md:px-10'>
      {LINKS.map(({ href, label }, i) => {
        const active = href === '/concept/dashboard' ? pathname === href : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? 'page' : undefined}
              className='group relative flex items-baseline gap-2 py-3 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blood'
            >
              <span className={`font-c-mono text-[0.65rem] transition-colors ${active ? 'text-blood' : 'text-paper/40'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`font-c-sans text-2xl font-black uppercase transition-colors duration-300 [font-variation-settings:"wdth"_62] md:text-3xl ${
                  active ? 'text-paper' : 'text-paper/45 group-hover:text-paper'
                }`}
              >
                {label}
              </span>
              <span
                aria-hidden
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-blood transition-transform duration-500 ease-(--ease-out-expo) ${
                  active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                }`}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
