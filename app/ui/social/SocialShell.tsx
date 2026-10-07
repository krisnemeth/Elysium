import Link from 'next/link';
import type { ReactNode } from 'react';
import Navbar from '@/app/ui/navbar';

export const SOCIAL_SECTIONS = [
  { href: '/vault', label: 'Your vault' },
  { href: '/vault/chronicles', label: 'Chronicles' },
  { href: '/vault/friends', label: 'Friends' },
  { href: '/vault/settings', label: 'Settings' },
];

// Pages that span all three games (vault, chronicles, friends) share this frame.
export default function SocialShell({
  eyebrow,
  title,
  description,
  actions,
  game = 'wod',
  children,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  game?: string;
  children: ReactNode;
}) {
  return (
    <div data-game={game} className='min-h-svh bg-ink text-bone transition-colors duration-500'>
      <Navbar sections={SOCIAL_SECTIONS} themeLabels={{ light: 'Light', dark: 'Dark' }} />
      <main id='main' className='page-in mx-auto max-w-6xl px-4 pt-28 pb-24 md:px-6 md:pt-32'>
        <header className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='text-xs tracking-[0.3em] text-accent uppercase'>{eyebrow}</p>
            <h1 className='mt-3 font-display text-5xl leading-[0.95] tracking-tight text-balance md:text-6xl'>{title}</h1>
            {description && <div className='mt-4 max-w-[60ch] leading-relaxed text-bone/65'>{description}</div>}
          </div>
          {actions && <div className='flex shrink-0 flex-wrap gap-3'>{actions}</div>}
        </header>
        <div className='mt-12'>{children}</div>
      </main>
    </div>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className='text-bone underline underline-offset-4 transition-colors hover:text-accent'>
      {children}
    </Link>
  );
}
