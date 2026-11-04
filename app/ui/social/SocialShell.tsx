import Link from 'next/link';
import type { ReactNode } from 'react';
import AppShell from '@/app/ui/dashboard/AppShell';
import PageHeader from '@/app/ui/kit/PageHeader';
import { currentGame } from '@/app/lib/current-game';
import type { Game } from '@/app/lib/games';

// Chronicle pages outside the table: the app shell in the chronicle's game, or the last game you were in.
export default async function SocialShell({
  eyebrow,
  title,
  description,
  actions,
  game,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  game?: Game;
  children: ReactNode;
}) {
  return (
    <AppShell game={game ?? (await currentGame())}>
      <div className='page-in'>
        <PageHeader eyebrow={eyebrow} title={title} description={description} actions={actions} />
        <div className='mt-12'>{children}</div>
      </div>
    </AppShell>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className='text-bone underline underline-offset-4 transition-colors hover:text-accent'>
      {children}
    </Link>
  );
}
