import Link from 'next/link';
import { Elysium1 } from '@/app/ui/svgs';
import ThemeToggle from '@/app/ui/ThemeToggle';
import IndexNav from '../_app/IndexNav';

// The concept version of the app: a case-file masthead instead of a sidebar.
export default function ConceptAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className='sticky top-0 z-40 border-b border-paper/15 bg-night/85 backdrop-blur-xl'>
        <div className='flex items-center justify-between border-b border-paper/10 px-5 py-3 font-c-mono text-[0.65rem] tracking-[0.2em] text-paper/60 uppercase md:px-10'>
          <Link
            href='/concept'
            aria-label='Elysium concept home'
            className='focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blood'
          >
            <Elysium1 aria-hidden className='h-auto w-20 text-paper' />
          </Link>
          <p className='hidden md:block'>
            Case files &middot; <span className='hidden dark:inline'>Night</span>
            <span className='dark:hidden'>Day</span> desk &middot; Vol. V
          </p>
          <div className='flex items-center gap-5'>
            <ThemeToggle
              labels={{ light: 'Day', dark: 'Night' }}
              className='tracking-[0.2em] uppercase transition-colors hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blood'
            />
            <form
              action={async () => {
                'use server';
              }}
            >
              <button className='tracking-[0.2em] uppercase transition-colors hover:text-blood focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blood'>
                Log out
              </button>
            </form>
          </div>
        </div>
        <nav aria-label='Case files'>
          <IndexNav />
        </nav>
      </header>
      <main id='main' className='px-5 pt-12 pb-24 md:px-10 md:pt-16'>
        <div className='mx-auto max-w-7xl'>{children}</div>
      </main>
    </>
  );
}
