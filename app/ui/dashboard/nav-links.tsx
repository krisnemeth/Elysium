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
              'flex h-[48px] grow items-center justify-center gap-2 bg-black p-3 text-base text-slate-300/80 font-medium hover:bg-rose-600 dark:hover:bg-red-800 dark:hover:border-red-800 duration-500 ease-in-out md:flex-none md:justify-start md:p-2 md:px-3 border border-slate-300/50 rounded-md',
              {
                'border-2 border-rose-600 dark:border-red-800':
                  pathname === link.href,
              }
            )}
          >
            <LinkIcon className='w-4' />
            <p className='hidden md:block  md:mt-1'>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
