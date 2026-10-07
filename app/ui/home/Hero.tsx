import type React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MdArrowOutward, MdKeyboardArrowDown } from 'react-icons/md';
import { Elysium1, VtmAnkh } from '@/app/ui/svgs';
import {
  ClanNameBanuHaqim,
  ClanNameBrujah,
  ClanNameGangrel,
  ClanNameHecata,
  ClanNameLasombra,
  ClanNameMalkavian,
  ClanNameNosferatu,
  ClanNameRavnos,
  ClanNameToreador,
  ClanNameTremere,
  ClanNameTzimisce,
  ClanNameVentrue,
} from '@/app/ui/svgs/official';

type CoverArt = {
  src: string;
  width: number;
  height: number;
  alt: string;
  // Optional second frame faded in on scroll (same size and framing as src).
  awakeSrc?: string;
  // Distance from the top of the hero to the art, and from the art's top to
  // the ankh's top as a fraction of --cover: puts the ankh loop behind the head.
  top: string;
  ankhOffset: number;
  mask: string;
};

const COVERS = {
  // Official World of Darkness illustration (Dark Pack): eyes open on scroll.
  paleVampire: {
    src: '/art/pale-vampire.webp',
    awakeSrc: '/art/pale-vampire-2.webp',
    width: 1200,
    height: 1600,
    alt: 'A pale vampire with long dark hair and blood on her lips.',
    top: 'calc(var(--cover-top) + 12svh)',
    ankhOffset: 0.16,
    mask: '[mask-image:radial-gradient(closest-side_at_50%_46%,black_62%,transparent)]',
  },
  // The original 2023 cover art.
  original: {
    src: '/HomePageArtLeftMobile.webp',
    width: 1080,
    height: 1920,
    alt: '',
    top: 'var(--cover-top)',
    ankhOffset: 0.35,
    mask: '[mask-image:linear-gradient(to_bottom,black_75%,transparent)]',
  },
} satisfies Record<string, CoverArt>;

const COVER: CoverArt = COVERS.paleVampire;

// Official clan name logos. Left column reads bottom-to-top, right top-to-bottom.
const LEFT_CLANS = [ClanNameToreador, ClanNameVentrue, ClanNameNosferatu, ClanNameBrujah, ClanNameMalkavian, ClanNameGangrel];
const RIGHT_CLANS = [ClanNameLasombra, ClanNameRavnos, ClanNameTzimisce, ClanNameTremere, ClanNameHecata, ClanNameBanuHaqim];

/*
  --cover is the portrait width. The ankh is sized and placed relative to it
  (ratios taken from the original layout) so its loop always sits behind her
  head as a halo.
*/

/*
  A "book cover" hero built from stacked layers in a single grid cell:
  the backdrop and portrait are sticky, while the ankh and cover text
  scroll normally, so the ankh rises from behind the portrait as you scroll.
*/
export default function Hero() {
  return (
    <section
      aria-labelledby='hero-title'
      style={{ '--art-top': COVER.top, '--ankh-offset': COVER.ankhOffset } as React.CSSProperties}
      className='relative isolate grid h-[160svh] overflow-x-clip text-bone [--cover:min(100vw,78svh,48rem)] [--cover-top:2.5rem] md:[--cover-top:0rem]'
    >
      {/* Backdrop */}
      <div className='grain sticky top-0 -z-10 h-svh [grid-area:1/1] bg-[radial-gradient(ellipse_at_50%_40%,var(--background-middle-hex),var(--background-start-hex)_45%,var(--color-ink)_85%)]' />

      {/* Ankh, behind the portrait */}
      <div className='z-0 flex justify-center self-start pt-[calc(var(--art-top)+var(--cover)*var(--ankh-offset))] [grid-area:1/1]'>
        <VtmAnkh
          aria-hidden
          className='ankh-wake h-auto w-[calc(var(--cover)*0.86)] text-accent/70 dark:text-black'
        />
      </div>

      {/* Portrait */}
      <div className='pointer-events-none sticky top-0 z-10 flex h-svh justify-center overflow-hidden [grid-area:1/1]'>
        <div className={`portrait-recede relative mt-(--art-top) w-(--cover) self-start ${COVER.mask}`}>
          <Image
            src={COVER.src}
            width={COVER.width}
            height={COVER.height}
            alt={COVER.alt}
            preload
            sizes='(max-width: 768px) 100vw, 48rem'
            className='h-auto w-full'
          />
          {COVER.awakeSrc && (
            <Image
              src={COVER.awakeSrc}
              width={COVER.width}
              height={COVER.height}
              alt=''
              sizes='(max-width: 768px) 100vw, 48rem'
              className='eyes-open absolute inset-0 h-full w-full opacity-0'
            />
          )}
        </div>
      </div>

      {/* Clan spines */}
      <div
        aria-hidden
        className='pointer-events-none sticky top-0 z-20 hidden h-svh text-accent/70 [grid-area:1/1] md:block dark:text-bone/50'
      >
        <div className='absolute top-[84svh] left-7 flex w-[68svh] origin-top-left -rotate-90 items-center justify-between'>
          {LEFT_CLANS.map((Name, i) => (
            <Name key={i} className='h-4 w-auto max-w-28 drop-shadow-[0_0_0.6rem_var(--accent)] dark:drop-shadow-[0_0_0.6rem_#000]' />
          ))}
        </div>
        <div className='absolute top-[16svh] left-[calc(100%-1.75rem)] flex w-[68svh] origin-top-left rotate-90 items-center justify-between'>
          {RIGHT_CLANS.map((Name, i) => (
            <Name key={i} className='h-4 w-auto max-w-28 drop-shadow-[0_0_0.6rem_var(--accent)] dark:drop-shadow-[0_0_0.6rem_#000]' />
          ))}
        </div>
        <span className='absolute bottom-0 left-[2.375rem] h-[12svh] w-px bg-current' />
        <span className='absolute right-[2.375rem] bottom-0 h-[12svh] w-px bg-current' />
      </div>

      {/* Cover text */}
      <div className='cover-fade relative z-30 flex h-svh flex-col items-center self-start px-6 [grid-area:1/1]'>
        <div className='pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[40svh] bg-linear-to-t from-ink/90 via-ink/50 to-transparent' />
        <div className='mt-[calc(4rem+1.5svh)] flex flex-col items-center text-center'>
          <p className='text-xs tracking-[0.4em] text-bone/80 uppercase md:text-sm'>
            Welcome to
          </p>
          <h1 id='hero-title' className='mt-2'>
            <span className='sr-only'>Elysium</span>
            <Elysium1
              aria-hidden
              className='h-auto w-[min(72vw,44svh,28rem)] text-bone drop-shadow-[0_0_1.2rem_#000]'
            />
          </h1>
        </div>

        <div className='mt-auto mb-[5svh] flex w-full max-w-md flex-col items-center gap-5 text-center'>
          <p className='font-display text-xl text-balance text-bone italic drop-shadow-[0_1px_8px_#000] md:text-2xl'>
            A character vault for Vampire:&nbsp;The&nbsp;Masquerade
          </p>
          <div className='flex flex-wrap items-center justify-center gap-3'>
            <Link
              href='/vault/vampire'
              className='group inline-flex items-center gap-2 rounded-full bg-bone px-6 py-3 text-sm font-semibold text-ink shadow-[0_0_2rem_-0.5rem_var(--accent)] transition duration-300 hover:bg-white hover:shadow-[0_0_2.5rem_-0.25rem_var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone active:scale-[0.98]'
            >
              Begin your chronicle
              <MdArrowOutward className='transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
            </Link>
            <a
              href='#features'
              className='inline-flex items-center gap-1 rounded-full border border-bone/30 bg-ink/40 px-5 py-3 text-sm text-bone backdrop-blur-md transition duration-300 hover:border-bone/70 hover:bg-ink/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone active:scale-[0.98]'
            >
              See what&apos;s inside
              <MdKeyboardArrowDown className='text-lg' />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
