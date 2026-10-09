import type { ReactNode } from 'react';
import Navbar from '@/app/ui/navbar';
import { SOCIAL_SECTIONS } from '@/app/ui/social/SocialShell';

// A chronicle's page: a slim header, then the table, filling the screen from lg up.
export default function TableShell({ eyebrow, title, actions, game, children }: { eyebrow: string; title: string; actions?: ReactNode; game: string; children: ReactNode }) {
  return (
    <div data-game={game} className='min-h-svh bg-ink text-bone transition-colors duration-500'>
      <Navbar sections={SOCIAL_SECTIONS} />
      <main id='main' className='page-in mx-auto flex w-full max-w-[120rem] flex-col gap-4 px-4 pt-24 pb-4 md:px-6 lg:h-svh'>
        <header className='flex shrink-0 flex-wrap items-end justify-between gap-x-6 gap-y-2'>
          <div className='min-w-0'>
            <p className='text-[0.65rem] tracking-[0.3em] text-accent uppercase'>{eyebrow}</p>
            <h1 className='mt-1 truncate font-display text-3xl leading-tight tracking-tight md:text-4xl'>{title}</h1>
          </div>
          {actions && <div className='flex shrink-0 flex-wrap gap-3'>{actions}</div>}
        </header>
        {children}
      </main>
    </div>
  );
}
