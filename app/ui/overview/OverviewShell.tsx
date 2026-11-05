import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { GAMES } from '@/app/lib/games';
import type { Preferences } from '@/app/lib/preferences';
import { Drawer, DrawerButton, DrawerProvider } from '@/app/ui/dashboard/Drawer';
import { GameSwitcher, OverviewAccountLinks, OverviewLinks } from '@/app/ui/dashboard/nav-links';
import { LogOut } from '@/app/ui/dashboard/sidenav';
import ForceDark from '@/app/ui/ForceDark';
import { panel } from '@/app/ui/kit/styles';
import type { Cover } from '@/app/ui/landing/covers';
import '@/app/ui/landing/buttons.css';
import { PreferencesProvider } from '@/app/ui/PreferencesContext';
import { Elysium1 } from '@/app/ui/svgs';
import CoverThemes from './CoverThemes';

/*
  The first page past login, and the pages it leads to directly (a new character,
  Printable sheets, Settings, Friends): the scene of the cover you came in through
  (its game and mode set the colours and fonts), with the games' sidebar layout.
  Phones and tablets have a small top bar for the drawer's button.
*/
export default function OverviewShell({
  cover,
  preferences,
  resume,
  friendRequests,
  children,
}: {
  cover: Cover;
  preferences: Preferences;
  resume: { href: string; name: string } | null;
  friendRequests: number;
  children: ReactNode;
}) {
  const { Logo, title } = GAMES[cover.game];
  return (
    <div
      data-game={cover.game}
      data-frames={preferences.simpleFrames ? 'simple' : undefined}
      className='relative isolate min-h-svh bg-ink text-bone'
      style={{ '--accent': cover.glow, '--lc-scene-glow': cover.glow } as CSSProperties}
    >
      <ForceDark theme={cover.mode} />
      {/* The cover's scene, as on the landing: dimmed, its colour washed over, sinking into the page's ink. */}
      <div aria-hidden className='fixed inset-0 -z-10 overflow-hidden'>
        <Image
          src={cover.scene.src}
          alt=''
          fill
          sizes='100vw'
          style={{ objectPosition: cover.scene.position }}
          className={`object-cover brightness-[.55] saturate-[.75] ${cover.scene.flip ? '-scale-x-100' : ''}`}
        />
        <div className='absolute inset-0' style={{ background: `radial-gradient(ellipse 75% 65% at 50% 0%, color-mix(in oklab, ${cover.tint} 30%, transparent), transparent)` }} />
        <div className='absolute inset-0 bg-linear-to-b from-ink/30 via-ink/70 to-ink' />
      </div>

      <DrawerProvider>
        <Drawer label='Overview menu' className={`group/side frame frame-tall p-4 desk:inset-y-4 desk:left-4 desk:w-60 ${panel}`}>
          <Link href='/' aria-label='Elysium home' className='mt-2 flex justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'>
            <Elysium1 aria-hidden className='h-auto w-32 text-bone/90 drop-shadow-[0_0_0.6rem_var(--accent)]' />
          </Link>
          <div className='mt-6 mb-6'>
            <GameSwitcher />
          </div>
          <nav aria-label='Overview' className='flex min-h-0 grow flex-col overflow-y-auto'>
            <OverviewLinks resume={resume} />
            {/* As in a game's sidebar: the logo shrinks to fit, and steps aside while Themes is open. */}
            <div className='flex min-h-0 grow items-center justify-center overflow-hidden px-2 group-has-[[data-themes=open]]/side:hidden'>
              <Logo aria-label={title} role='img' className='h-auto max-h-full w-full max-w-40 text-bone/40' />
            </div>
            <CoverThemes current={cover.id} />
            <div aria-hidden className='mx-4 my-2 border-t border-bone/10' />
            <OverviewAccountLinks friendRequests={friendRequests} />
          </nav>
          <div className='mt-1'>
            <LogOut />
          </div>
        </Drawer>

        <header className='fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-40 px-3 desk:hidden'>
          <div className={`frame flex h-14 items-center justify-between px-3 ${panel}`}>
            <Link href='/' aria-label='Elysium home'>
              <Elysium1 aria-hidden className='h-auto w-24 text-bone/90' />
            </Link>
            <DrawerButton />
          </div>
        </header>
      </DrawerProvider>

      <main id='main' className='relative px-4 pt-[calc(5.5rem+env(safe-area-inset-top))] pb-8 desk:pt-4 desk:pb-4 desk:pl-[17.25rem]'>
        <div className='mx-auto max-w-[100rem]'>
          <PreferencesProvider value={preferences}>{children}</PreferencesProvider>
        </div>
      </main>
    </div>
  );
}
