import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { FaPowerOff } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import { signOut } from '@/app/lib/actions/auth';
import { GAMES, GAMES_ORDER, gamePath } from '@/app/lib/games';
import type { Preferences } from '@/app/lib/preferences';
import { Drawer, DrawerButton, DrawerProvider } from '@/app/ui/dashboard/Drawer';
import { SideNavLinks } from '@/app/ui/dashboard/nav-links';
import ForceDark from '@/app/ui/ForceDark';
import { PreferencesProvider } from '@/app/ui/PreferencesContext';
import type { Cover } from '@/app/ui/landing/covers';
import { Elysium1 } from '@/app/ui/svgs';

// The outside pages' glass (the site navbar, SiteIsland.tsx), for the navbar and sidebar here.
const glass = 'rounded-2xl border border-bone/15 bg-ink/70 shadow-[0_8px_32px_-8px_rgb(0_0_0/0.6),inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl';
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone';

/*
  The first page past login, and the pages it leads to directly (a new
  character, Settings, Friends). It looks like the outside pages: the top navbar,
  plain glass with no theme frames, and the scene of the cover you came in through
  (its game and mode set the colours and fonts). A short sidebar; the full one, with themes, is
  in each game. Phones and tablets get the sidebar as a drawer.
*/
export default function OverviewShell({ cover, preferences, children }: { cover: Cover; preferences: Preferences; children: ReactNode }) {
  return (
    <div
      data-game={cover.game}
      data-frames={preferences.simpleFrames ? 'simple' : undefined}
      className='relative isolate min-h-svh bg-ink text-bone'
      style={{ '--accent': cover.glow } as CSSProperties}
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
        <header className='fixed inset-x-0 top-[max(0.5rem,env(safe-area-inset-top))] z-50 px-2 md:top-[max(0.75rem,env(safe-area-inset-top))] md:px-4'>
          <nav aria-label='Main' className={`flex h-14 items-center justify-between px-2 pl-4 ${glass}`}>
            <Link href='/' aria-label='Elysium home' className={`rounded-md ${focus}`}>
              <Elysium1 aria-hidden className='mt-1 h-auto w-20 text-bone/90' />
            </Link>
            <div className='flex items-center gap-1'>
              <ul className='mr-3 hidden items-center gap-6 text-sm text-bone/70 md:flex'>
                {GAMES_ORDER.map((g) => (
                  <li key={g}>
                    <Link href={gamePath(g)} className={`rounded-sm py-1 transition-colors duration-200 hover:text-bone ${focus}`}>
                      {GAMES[g].name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href='/vault/new'
                className={`group inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_0_1.5rem_-0.5rem_var(--accent)] transition duration-300 hover:brightness-110 active:scale-[0.98] ${focus}`}
              >
                <MdAdd aria-hidden className='transition-transform duration-300 group-hover:rotate-90' />
                New character
              </Link>
              <DrawerButton />
            </div>
          </nav>
        </header>

        <Drawer label='Overview menu' className={`p-3 undesk:pt-14 desk:top-[calc(max(0.75rem,env(safe-area-inset-top))+4.5rem)] desk:bottom-4 desk:left-4 desk:w-60 ${glass}`}>
          <nav aria-label='Overview' className='flex min-h-0 grow flex-col overflow-y-auto'>
            <SideNavLinks group='overview' />
            <div className='grow' />
            <div aria-hidden className='mx-4 my-2 border-t border-bone/10' />
            <SideNavLinks group='overview-account' />
          </nav>
          <form action={signOut} className='mt-1'>
            <button className='flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-bone/60 transition-colors duration-300 hover:bg-bone/[0.04] hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'>
              <FaPowerOff aria-hidden className='size-4' />
              Log out
            </button>
          </form>
        </Drawer>
      </DrawerProvider>

      <main id='main' className='relative px-4 pt-[calc(5.5rem+env(safe-area-inset-top))] pb-16 md:pt-[calc(6.5rem+env(safe-area-inset-top))] md:pr-8 desk:pl-72'>
        <div className='mx-auto max-w-6xl'>
          <PreferencesProvider value={preferences}>{children}</PreferencesProvider>
        </div>
      </main>
    </div>
  );
}
