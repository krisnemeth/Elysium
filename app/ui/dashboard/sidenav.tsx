import Link from 'next/link';
import { FaPowerOff } from 'react-icons/fa';
import { Elysium1 } from '@/app/ui/svgs';
import ThemePicker from '@/app/ui/dashboard/ThemePicker';
import PhoneIsland from '@/app/ui/dashboard/PhoneIsland';
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
  const { Logo } = GAMES[game];
  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`group/side frame fixed inset-y-4 left-4 z-40 hidden w-60 flex-col p-4 md:flex ${panel}`}>
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

        {/* Scrolls inside the sidebar if needed; the sidebar itself must not clip, or the frame's corner ornaments (drawn outside its edge) get cut off. */}
        <nav aria-label='Dashboard' className='flex min-h-0 grow flex-col overflow-y-auto'>
          <SideNavLinks game={game} />
          <div aria-hidden className='mx-4 my-2 border-t border-bone/10' />
          <SideNavLinks game={game} group='chronicles' />
          {/* The logo shrinks to fit, and steps aside while Themes is open. */}
          <div className='flex min-h-0 grow items-center justify-center overflow-hidden px-2 group-has-[[data-themes=open]]/side:invisible'>
            <Logo aria-label={GAMES[game].title} role='img' className='h-auto max-h-full w-full max-w-40 text-bone/40' />
          </div>
          <ThemePicker game={game} />
          <div aria-hidden className='mx-4 my-2 border-t border-bone/10' />
          <SideNavLinks game={game} group='account' />
        </nav>
        <div className='mt-1'>
          <LogOut />
        </div>
      </aside>

      {/* Phone top bar: grows into a menu (Settings, Friends, Themes, Log out). */}
      <PhoneIsland game={game} />

      {/* Phone tab bar */}
      <nav aria-label='Dashboard' className='fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden'>
        <div className={`frame ${panel}`}>
          <TabBarLinks game={game} />
        </div>
      </nav>
    </>
  );
}
