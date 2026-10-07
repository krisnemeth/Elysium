import Link from 'next/link';
import { FaPowerOff } from 'react-icons/fa';
import { Elysium1 } from '@/app/ui/svgs';
import ThemeToggle from '@/app/ui/ThemeToggle';
import { signOut } from '@/app/lib/actions/auth';
import { SideNavLinks, TabBarLinks, GameSwitcher } from '@/app/ui/dashboard/nav-links';
import { panel } from '@/app/ui/kit/styles';
import { GAMES, type Game } from '@/app/lib/games';

function LogOut({ compact = false }: { compact?: boolean }) {
  return (
    <form action={signOut}>
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

// The same navigation for every game; each game and mode gives it a different frame (.frame).
export default function SideNav({ game }: { game: Game }) {
  const { Logo, modes } = GAMES[game];
  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`frame fixed inset-y-4 left-4 z-40 hidden w-60 flex-col p-4 md:flex ${panel}`}>
        <Link
          href='/vault'
          aria-label='Your vault'
          className='mt-2 flex justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
        >
          <Elysium1 aria-hidden className='h-auto w-32 text-bone/90 drop-shadow-[0_0_0.6rem_var(--accent)]' />
        </Link>

        <div className='mt-6 mb-6'>
          <GameSwitcher game={game} />
        </div>

        <nav aria-label='Dashboard'>
          <SideNavLinks game={game} />
        </nav>

        <div className='flex grow items-center justify-center px-2'>
          <Logo aria-label={GAMES[game].title} role='img' className='h-auto w-full max-w-40 text-bone/40' />
        </div>

        <div className='flex flex-col gap-1 border-t border-bone/10 pt-3'>
          <ThemeToggle
            labels={modes}
            className='rounded-xl px-4 py-3 text-sm text-bone/60 transition-colors duration-300 hover:bg-bone/[0.04] hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
          />
          <LogOut />
        </div>
      </aside>

      {/* Phone top bar */}
      <header className='fixed inset-x-0 top-0 z-40 px-3 pt-3 md:hidden'>
        <div className={`frame flex flex-col gap-2 px-3 py-2 ${panel}`}>
          <div className='flex h-10 items-center justify-between'>
            <Link href='/vault' aria-label='Your vault'>
              <Elysium1 aria-hidden className='h-auto w-24 text-bone/90' />
            </Link>
            <div className='flex items-center gap-1'>
              <ThemeToggle labels={modes} labelClassName='sr-only' className='rounded-xl p-2 text-bone/70' />
              <LogOut compact />
            </div>
          </div>
          <GameSwitcher game={game} compact />
        </div>
      </header>

      {/* Phone tab bar */}
      <nav aria-label='Dashboard' className='fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden'>
        <div className={`frame ${panel}`}>
          <TabBarLinks game={game} />
        </div>
      </nav>
    </>
  );
}
