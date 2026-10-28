'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Review aid for the two directions; not part of the real landing.
export default function Switcher() {
  const path = usePathname();
  return (
    <nav aria-label='Concept direction' className='lc-switch'>
      <Link href='/concept/landing' aria-current={path === '/concept/landing' ? 'page' : undefined}>
        A · Three doors
      </Link>
      <Link href='/concept/landing/b' aria-current={path === '/concept/landing/b' ? 'page' : undefined}>
        B · The cover
      </Link>
    </nav>
  );
}
