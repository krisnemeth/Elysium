import Link from 'next/link';
import { FaPowerOff } from 'react-icons/fa';
import { Elysium1 } from '@/app/ui/svgs';
import { LogoAnkh } from '@/app/ui/svgs/official';
import ThemeToggle from '@/app/ui/ThemeToggle';
import { SideNavLinks, TabBarLinks } from '@/app/ui/dashboard/nav-links';
import { panel } from '@/app/ui/kit/styles';

const THEME_LABELS = { light: 'Neon Nights', dark: 'Masquerade' };

function LogOut({ compact = false }: { compact?: boolean }) {
  return (
    <form
      action={async () => {
        'use server';
        // await signOut();
      }}
    >
      <button
        className={`flex items-center gap-3 rounded-xl text-sm text-bone/60 transition-colors duration-300 hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          compact ? 'p-2' : 'w-full px-4 py-3 hover:bg-bone/[0.04]'
        }`}
      >
        <FaPowerOff aria-hidden className='size-4' />
        <span className={compact ? 'sr-only' : ''}>Log out</span>
      </button>
    </form>
  );
}

export default function SideNav() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-4 left-4 z-40 hidden w-60 flex-col p-4 md:flex ${panel}`}
      >
        <Link
          href='/'
          aria-label='Elysium home'
          className='mt-2 mb-8 flex justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
        >
          <Elysium1 aria-hidden className='h-auto w-32 text-bone/90 drop-shadow-[0_0_0.6rem_var(--accent)]' />
        </Link>

        <nav aria-label='Dashboard'>
          <SideNavLinks />
        </nav>

        <div className='flex grow items-center justify-center'>
          <LogoAnkh
            aria-hidden
            className='glow-pulse h-auto w-14 text-accent/50 drop-shadow-[0_0_1.5rem_var(--accent)]'
          />
        </div>

        <div className='flex flex-col gap-1 border-t border-bone/10 pt-3'>
          <ThemeToggle
            labels={THEME_LABELS}
            className='rounded-xl px-4 py-3 text-sm text-bone/60 transition-colors duration-300 hover:bg-bone/[0.04] hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
          />
          <LogOut />
        </div>
      </aside>

      {/* Phone top bar */}
      <header className='fixed inset-x-0 top-0 z-40 px-3 pt-3 md:hidden'>
        <div className={`flex h-14 items-center justify-between px-4 ${panel}`}>
          <Link href='/' aria-label='Elysium home'>
            <Elysium1 aria-hidden className='h-auto w-24 text-bone/90' />
          </Link>
          <div className='flex items-center gap-1'>
            <ThemeToggle
              labels={THEME_LABELS}
              labelClassName='sr-only'
              className='rounded-xl p-2 text-bone/70'
            />
            <LogOut compact />
          </div>
        </div>
      </header>

      {/* Phone tab bar */}
      <nav
        aria-label='Dashboard'
        className='fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden'
      >
        <div className={panel}>
          <TabBarLinks />
        </div>
      </nav>
    </>
  );
}
