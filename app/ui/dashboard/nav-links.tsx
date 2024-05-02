'use client';

import { GiVampireCape, GiCastle } from 'react-icons/gi';
import { FaFile } from 'react-icons/fa';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: 'Home', href: '/dashboard', icon: GiCastle },
  { name: 'Characters', href: '/dashboard/characters', icon: GiVampireCape },
  {
    name: 'Sheets',
    href: '/dashboard/sheets',
    icon: FaFile,
  },
];
export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 bg-purple-950 dark:bg-red-950 p-3 text-lg text-slate-300 font-medium hover:bg-purple-900 dark:hover:bg-red-800 duration-500 ease-in-out md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-purple-900 dark:bg-red-800': pathname === link.href,
              }
            )}
          >
            <LinkIcon className='w-6' />
            <p className='hidden md:block  md:mt-1'>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
