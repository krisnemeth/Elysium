import Link from 'next/link';
import { Elysium1 } from '@/app/ui/svgs';

const LINK =
  'rounded-sm transition-colors duration-200 hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='relative z-10 border-t border-bone/10 bg-ink text-sm text-bone/60'>
      <div className='mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-12'>
        <div className='md:col-span-4'>
          <Elysium1 aria-hidden className='h-auto w-28 text-bone/80' />
          <p className='mt-4 max-w-[30ch] leading-relaxed'>
            A character vault for Vampire: The Masquerade.
          </p>
        </div>

        <nav aria-label='Footer' className='md:col-span-2'>
          <p className='text-xs tracking-[0.25em] text-bone/40 uppercase'>
            Explore
          </p>
          <ul className='mt-4 flex flex-col gap-2'>
            <li>
              <a href='#features' className={LINK}>
                Features
              </a>
            </li>
            <li>
              <a href='#clans' className={LINK}>
                Clans
              </a>
            </li>
            <li>
              <Link href='/dashboard' className={LINK}>
                Log in
              </Link>
            </li>
          </ul>
        </nav>

        <div className='md:col-span-2'>
          <p className='text-xs tracking-[0.25em] text-bone/40 uppercase'>
            Contact
          </p>
          <ul className='mt-4 flex flex-col gap-2'>
            <li>
              <a href='https://krisnemeth.dev' className={LINK}>
                krisnemeth.dev
              </a>
            </li>
            <li>
              <a href='mailto:krsnmth@gmail.com' className={LINK}>
                Send feedback
              </a>
            </li>
          </ul>
        </div>

        <p className='text-xs leading-relaxed text-bone/40 md:col-span-4'>
          Vampire: The Masquerade and associated logos, icons, and characters
          are the property of Paradox Interactive and White Wolf Entertainment.
          All rights reserved. Used with permission. For more information on
          Vampire: The Masquerade, please visit the{' '}
          <a
            href='https://www.paradoxinteractive.com/games/world-of-darkness/about'
            className={`underline underline-offset-2 ${LINK}`}
          >
            official Paradox Interactive website
          </a>
          .
        </p>
      </div>

      <div className='border-t border-bone/10'>
        <p className='mx-auto max-w-6xl px-6 py-6 text-xs text-bone/40'>
          &copy; {currentYear} Elysium. Built by Krisztian Nemeth. All product
          and company names are trademarks&#8482; or registered&#174;
          trademarks of their respective holders.
        </p>
      </div>
    </footer>
  );
}
