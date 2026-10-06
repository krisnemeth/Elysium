import Link from 'next/link';
import { Elysium1 } from '@/app/ui/svgs';
import ThemeToggle from '@/app/ui/ThemeToggle';
import MaskedPortrait from './MaskedPortrait';

const META = [
  ['13', 'clans on file'],
  ['1', 'sheet per vampire'],
  ['0', 'erasers required'],
];

export default function Hero() {
  return (
    <header className='relative overflow-hidden'>
      {/* Masthead */}
      <div className='flex items-center justify-between border-b border-paper/15 px-5 py-4 font-c-mono text-[0.65rem] tracking-[0.2em] text-paper/60 uppercase md:px-10'>
        <Link
          href='/concept'
          aria-label='Elysium'
          className='focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blood'
        >
          <Elysium1 aria-hidden className='h-auto w-20 text-paper' />
        </Link>
        <p className='hidden md:block'>
          <span className='hidden dark:inline'>Nightly</span>
          <span className='dark:hidden'>Daylight</span> edition &middot; Vol. V
          &middot; Vampire: The Masquerade
        </p>
        <div className='flex items-center gap-6'>
          <ThemeToggle
            labels={{ light: 'Day', dark: 'Night' }}
            className='tracking-[0.2em] text-paper/70 uppercase transition-colors hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blood'
          />
          <Link
            href='/concept/dashboard'
            className='text-paper transition-colors hover:text-blood focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blood'
          >
            Enter the vault &rarr;
          </Link>
        </div>
      </div>

      {/* Blood line */}
      <div
        aria-hidden
        className='drip absolute top-0 left-[58%] z-10 hidden h-[78%] w-0.5 bg-blood md:block after:absolute after:-bottom-1.5 after:-left-[5px] after:size-3 after:rounded-full after:bg-blood'
      />

      <div className='grid gap-12 px-5 pt-14 pb-16 md:grid-cols-12 md:gap-8 md:px-10 md:pt-20'>
        <div className='flex flex-col md:col-span-7'>
          <p className='font-c-mono text-xs tracking-[0.25em] text-blood uppercase'>
            A character vault for the Kindred
          </p>
          <h1 className='mt-6 font-c-sans text-[clamp(4.5rem,15vw,13rem)] leading-[0.8] font-black tracking-[-0.02em] uppercase [font-variation-settings:"wdth"_62]'>
            The blood
            <span className='block font-c-serif text-[0.62em] leading-[0.95] font-normal tracking-normal text-blood normal-case italic'>
              remembers.
            </span>
          </h1>
          <p className='mt-10 max-w-[44ch] text-lg leading-relaxed text-pretty text-paper/75'>
            Elysium keeps everything else. Build your vampire, track every point
            of Hunger and Humanity, and carry the sheet to any table, on any
            device.
          </p>
          <div className='mt-10 flex flex-wrap items-center gap-4'>
            <Link
              href='/concept/dashboard'
              className='group inline-flex items-center gap-3 bg-blood px-7 py-4 font-c-sans text-sm font-bold tracking-[0.15em] text-chalk uppercase transition duration-300 [font-variation-settings:"wdth"_85] hover:bg-paper hover:text-night focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper active:scale-[0.98]'
            >
              Begin your chronicle
              <span className='transition-transform duration-300 group-hover:translate-x-1'>
                &rarr;
              </span>
            </Link>
            <a
              href='#dossier'
              className='border-b border-paper/40 pb-1 font-c-mono text-xs tracking-[0.2em] text-paper/80 uppercase transition-colors hover:border-blood hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blood'
            >
              Read the file
            </a>
          </div>
        </div>

        <figure className='md:col-span-5 md:pl-6'>
          <MaskedPortrait
            src='/art/pale-vampire.webp'
            revealSrc='/art/pale-vampire-2.webp'
            width={1200}
            height={1600}
            alt='A pale vampire with long dark hair, eyes closed, blood on her lips.'
            sizes='(max-width: 768px) 100vw, 40vw'
            preload
            className='aspect-[3/4]'
          />
          <figcaption className='mt-3 flex flex-wrap justify-between gap-x-4 gap-y-1 font-c-mono text-[0.65rem] tracking-[0.2em] text-paper/50 uppercase'>
            <span>Fig. 01 &mdash; After the feeding</span>
            <span>Hover to wake her</span>
          </figcaption>
        </figure>
      </div>

      <dl className='grid grid-cols-3 border-y border-paper/15'>
        {META.map(([value, label]) => (
          <div
            key={label}
            className='flex flex-col gap-1 border-r border-paper/15 px-5 py-6 last:border-r-0 md:flex-row md:items-baseline md:gap-4 md:px-10'
          >
            <dt className='order-2 font-c-mono text-[0.6rem] tracking-[0.2em] text-paper/50 uppercase md:text-xs'>
              {label}
            </dt>
            <dd className='font-c-serif text-4xl text-paper md:text-6xl'>
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
