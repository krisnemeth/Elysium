import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import Navbar from '@/app/ui/navbar';
import { SECTIONS } from '@/app/ui/landing/sections';
import { GAMES, GAMES_ORDER } from '@/app/lib/games';
import NeutralGround from '@/app/ui/neutral/NeutralGround';

// Shared frame for login, sign-up and the other auth screens, on neutral ground.
export default function AuthShell({ title, lead, children }: { title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <NeutralGround>
    <div data-game='wod' className='relative isolate grid min-h-svh text-bone lg:grid-cols-[1fr_minmax(26rem,32rem)]'>
      <Navbar sections={SECTIONS.map((s) => ({ ...s, href: `/${s.href}` }))} />
      {/* The three worlds, faint, behind the form on phones and beside it on desktop. Each fades at its sides into the next, and the group into the ground under the form. */}
      <div aria-hidden style={{ '--n-rest': 0.45 } as CSSProperties} className='absolute inset-0 -z-10 flex overflow-hidden lg:relative lg:z-0 lg:mask-[linear-gradient(to_right,black_65%,transparent)]'>
        {GAMES_ORDER.map((g) => (
          <div key={g} data-tint={g} className='relative -mx-[3%] flex-1 overflow-hidden mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]'>
            <Image src={GAMES[g].figure.src} alt='' fill sizes='(max-width: 1024px) 33vw, 28vw' className='object-cover object-top' />
          </div>
        ))}
        <div className='pointer-events-none absolute inset-0 bg-ink/55 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--ink)_85%)] lg:hidden' />
      </div>

      <main id='main' className='page-in relative flex flex-col px-6 pt-24 pb-8 md:px-12'>
        <div className='my-auto w-full max-w-sm self-center py-12'>
          <h1 className='font-display text-5xl leading-tight tracking-tight'>{title}</h1>
          {lead && <p className='mt-3 leading-relaxed text-bone/65'>{lead}</p>}
          <div className='mt-8'>{children}</div>
        </div>
      </main>
    </div>
    </NeutralGround>
  );
}
