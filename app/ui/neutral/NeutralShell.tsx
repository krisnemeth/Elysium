import Link from 'next/link';
import type { ReactNode } from 'react';
import { Drawer, DrawerButton, DrawerProvider } from '@/app/ui/dashboard/Drawer';
import { OverviewAccountLinks, OverviewLinks } from '@/app/ui/dashboard/nav-links';
import { LogOut } from '@/app/ui/dashboard/sidenav';
import ForceDark from '@/app/ui/ForceDark';
import { panel } from '@/app/ui/kit/styles';
import '@/app/ui/landing/buttons.css';
import { DEFAULT_PREFERENCES, type Preferences } from '@/app/lib/preferences';
import { PreferencesProvider } from '@/app/ui/PreferencesContext';
import { Elysium1 } from '@/app/ui/svgs';
import NeutralGround from './NeutralGround';

// The sidebar and page around neutral ground: no game's logo and no theme to choose.
export default function NeutralShell({
  preferences = DEFAULT_PREFERENCES,
  friendRequests = 0,
  children,
}: {
  preferences?: Preferences;
  friendRequests?: number;
  children: ReactNode;
}) {
  return (
    <NeutralGround>
      <ForceDark />
      <DrawerProvider>
        <Drawer label='Menu' className={`group/side p-4 desk:inset-y-4 desk:left-4 desk:w-60 ${panel}`}>
          <Link href='/' aria-label='Elysium home' className='mt-2 flex justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'>
            <Elysium1 aria-hidden className='h-auto w-32 text-bone/90' />
          </Link>
          <nav aria-label='Vault' className='mt-6 flex min-h-0 grow flex-col overflow-y-auto'>
            <OverviewLinks />
            <div className='grow' />
            <div aria-hidden className='mx-4 my-2 border-t border-bone/10' />
            <OverviewAccountLinks friendRequests={friendRequests} />
          </nav>
          <div className='mt-1'>
            <LogOut />
          </div>
        </Drawer>
        <header className='fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-40 px-3 desk:hidden'>
          <div className={`flex h-14 items-center justify-between px-3 ${panel}`}>
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
    </NeutralGround>
  );
}
