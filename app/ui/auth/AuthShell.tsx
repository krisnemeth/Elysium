import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Elysium1 } from '@/app/ui/svgs';
import ForceDark from '@/app/ui/ForceDark';
import { GAMES, GAMES_ORDER } from '@/app/lib/games';

// Shared frame for login, sign-up and the other auth screens. Dark only, like
// the rest of the site pages (the saved theme is for the game dashboards).
export default function AuthShell({ title, lead, children }: { title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <div data-game='wod' className='relative isolate grid min-h-svh bg-ink text-bone transition-colors duration-500 lg:grid-cols-[1fr_minmax(26rem,32rem)]'>
      {/* The three worlds, faint, behind the form on phones and beside it on desktop */}
      <div aria-hidden className='absolute inset-0 -z-10 flex lg:relative lg:z-0'>
        {GAMES_ORDER.map((g) => (
          <div key={g} className='relative flex-1 overflow-hidden'>
            <Image src={GAMES[g].figure.src} alt='' fill sizes='(max-width: 1024px) 33vw, 22vw' className='object-cover object-top opacity-25 grayscale lg:opacity-45' />
          </div>
        ))}
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--ink)_85%)] lg:bg-[linear-gradient(to_right,transparent_40%,var(--ink))]' />
      </div>

      <main id='main' className='page-in relative flex flex-col px-6 py-8 md:px-12'>
        <ForceDark />
        <div className='flex items-center'>
          <Link href='/' aria-label='Elysium home' className='rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone'>
            <Elysium1 aria-hidden className='h-auto w-24 text-bone' />
          </Link>
        </div>
        <div className='my-auto w-full max-w-sm self-center py-12'>
          <h1 className='font-display text-5xl leading-tight tracking-tight'>{title}</h1>
          {lead && <p className='mt-3 leading-relaxed text-bone/65'>{lead}</p>}
          <div className='mt-8'>{children}</div>
        </div>
      </main>
    </div>
  );
}
