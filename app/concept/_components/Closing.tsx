import Link from 'next/link';
import { VtmAnkh } from '@/app/ui/svgs';

export default function Closing() {
  const year = new Date().getFullYear();

  return (
    <>
      <section
        aria-labelledby='closing-title'
        className='relative overflow-hidden border-t border-paper/15 px-5 py-28 md:px-10 md:py-40'
      >
        <VtmAnkh
          aria-hidden
          className='pointer-events-none absolute -right-24 -bottom-40 h-auto w-[34rem] text-blood/15 md:right-10'
        />
        <blockquote className='relative max-w-5xl font-c-serif text-[clamp(2.25rem,5.5vw,5rem)] leading-[1.05] text-balance'>
          &ldquo;Elysium is neutral ground. Leave your grudges at the door, and
          your character sheet <em className='text-blood'>in the vault</em>
          .&rdquo;
        </blockquote>

        <Link
          href='/dashboard'
          className='group relative mt-20 inline-flex items-baseline gap-6 font-c-sans text-[clamp(3.5rem,12vw,11rem)] leading-[0.85] font-black uppercase [font-variation-settings:"wdth"_62] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-blood'
        >
          <span className='bg-[linear-gradient(var(--color-blood),var(--color-blood))] bg-[length:0%_100%] bg-no-repeat transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_100%]'>
            Enter Elysium
          </span>
          <span className='font-c-serif text-[0.5em] font-normal transition-transform duration-500 group-hover:translate-x-3'>
            &rarr;
          </span>
        </Link>
      </section>

      <footer className='flex flex-col gap-6 border-t border-paper/15 px-5 py-10 font-c-mono text-[0.65rem] leading-relaxed tracking-[0.1em] text-paper/45 uppercase md:flex-row md:justify-between md:px-10'>
        <p className='max-w-[70ch]'>
          Vampire: The Masquerade and associated logos, icons and characters are
          the property of Paradox Interactive and White Wolf Entertainment.
          &copy; {year} Elysium &middot; Built by Krisztian Nemeth.
        </p>
        <Link
          href='/'
          className='shrink-0 text-paper/70 transition-colors hover:text-blood focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blood'
        >
          &larr; Classic landing page
        </Link>
      </footer>
    </>
  );
}
