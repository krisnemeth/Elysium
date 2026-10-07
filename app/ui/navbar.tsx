import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';
import { Elysium1 } from '@/app/ui/svgs';
import ThemeToggle from '@/app/ui/ThemeToggle';
import { createClient } from '@/app/lib/supabase/server';
import { hasSupabase } from '@/app/lib/supabase/env';
import { signOut } from '@/app/lib/actions/auth';

type Props = {
  sections?: { href: string; label: string }[];
  themeLabels?: { light: string; dark: string };
};

// The site navbar, shared by every landing page; the surrounding
// [data-game] gives it that theme's frame (.frame in app/games.css).
export default async function Navbar({
  sections = [
    { href: '#features', label: 'Features' },
    { href: '#clans', label: 'Clans' },
  ],
  themeLabels = { light: 'Neon Nights', dark: 'Masquerade' },
}: Props) {
  // Signed in: link to the vault and offer log out. Signed out: log in / sign up.
  let signedIn = false;
  if (hasSupabase) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    signedIn = Boolean(data?.claims);
  }

  return (
    <header className='fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3'>
      <nav
        aria-label='Main'
        className='frame relative mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-bone/15 bg-ink/55 pr-2 pl-4 shadow-[0_8px_32px_-8px_rgb(0_0_0/0.6),inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl'
      >
        <Link
          href='/'
          aria-label='Elysium home'
          className='rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone'
        >
          <Elysium1 aria-hidden className='mt-1 h-auto w-20 text-bone/90' />
        </Link>

        <ul className='hidden items-center gap-8 text-sm text-bone/70 md:flex'>
          {sections.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className='rounded-sm transition-colors duration-200 hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone'
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className='flex items-center gap-1'>
          <ThemeToggle
            labels={themeLabels}
            labelClassName='max-lg:sr-only'
            className='mr-1 rounded-xl px-2 py-2 text-xs text-bone/70 transition-colors hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone'
          />
          {signedIn ? (
            <form action={signOut}>
              <button className='rounded-xl px-3 py-2 text-sm text-bone/80 transition-colors duration-200 hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone'>
                Log out
              </button>
            </form>
          ) : (
            <Link
              href='/login'
              className='rounded-xl px-3 py-2 text-sm text-bone/80 transition-colors duration-200 hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone'
            >
              Log in
            </Link>
          )}
          <Link
            href={signedIn ? '/vault' : '/signup'}
            className='group inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_0_1.5rem_-0.5rem_var(--accent)] transition duration-300 hover:brightness-110 hover:shadow-[0_0_2rem_-0.25rem_var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone active:scale-[0.98]'
          >
            {signedIn ? 'Your vault' : 'Sign up'}
            <MdArrowOutward className='transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
          </Link>
        </div>
      </nav>
    </header>
  );
}
