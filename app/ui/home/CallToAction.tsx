import Image from 'next/image';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';

export default function CallToAction() {
  return (
    <section
      aria-labelledby='cta-title'
      className='grain relative z-10 overflow-hidden bg-ink text-bone'
    >
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_60%,var(--accent-deep),transparent_60%)] opacity-70' />

      <div className='relative mx-auto grid max-w-6xl items-center gap-16 px-6 py-28 md:grid-cols-12 md:py-36'>
        <div className='reveal md:col-span-6'>
          <p className='text-xs tracking-[0.3em] text-accent uppercase'>
            Manage your characters
          </p>
          <h2
            id='cta-title'
            className='mt-4 font-display text-5xl leading-[0.95] font-medium tracking-tight text-balance md:text-6xl'
          >
            Your chronicle deserves better than a crumpled sheet.
          </h2>
          <p className='mt-6 max-w-[48ch] leading-relaxed text-pretty text-bone/70'>
            Whether you&apos;ve played since the nineties or you&apos;re
            building your first neonate, Elysium keeps every character, sheet
            and backstory in one place, ready for the next session.
          </p>
          <Link
            href='/vault/vampire'
            className='group mt-10 inline-flex items-center gap-2 rounded-full bg-bone px-7 py-3.5 text-sm font-semibold text-ink shadow-[0_0_2.5rem_-0.5rem_var(--accent)] transition duration-300 hover:bg-white hover:shadow-[0_0_3rem_-0.25rem_var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone active:scale-[0.98]'
          >
            Create your first character
            <MdArrowOutward className='transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
          </Link>
        </div>

        <figure className='reveal md:col-span-6'>
          <Image
            src='/iPadDark.png'
            width={1920}
            height={1080}
            alt='Elysium running on an iPad in the Classic Masquerade theme.'
            sizes='(max-width: 768px) 100vw, 36rem'
            className='w-full rounded-2xl shadow-[0_3rem_6rem_-2rem_var(--accent)] ring-1 ring-bone/10 md:rotate-2'
          />
        </figure>
      </div>
    </section>
  );
}
