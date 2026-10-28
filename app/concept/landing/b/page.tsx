import type React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';
import Navbar from '@/app/ui/navbar';
import { Elysium1 } from '@/app/ui/svgs';
import { LogoWodCircle } from '@/app/ui/svgs/official';
import { GAMES, GAMES_ORDER, gamePath } from '@/app/lib/games';
import { CREEDS, TRIBES } from '@/app/lib/factions';
import Footer from '../Footer';
import Sections, { SECTIONS } from '../Sections';

/*
  Direction B, "The cover": the original Elysium hero brought to all three
  games. A book cover built from stacked layers in one grid cell: the backdrop,
  the character and the World of Darkness mark behind them are sticky. The
  mark (a brushed moon with WoD cut into it) rises from behind the character's
  head as the page opens and climbs a little further, waking, on scroll; the
  cover text scrolls away, and the first section slides up over the character
  from the front. The shared
  sections (Sections.tsx) follow.
*/

type Cover = {
  name: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  // The backdrop's colour around the art, and the glow the mark wakes into.
  tint: string;
  glow: string;
  // How far above the art's top edge the risen moon's centre sits, as a
  // fraction of --cover: it clears the head, just touching the hair.
  moonLift: number;
};

const COVERS = {
  claire: {
    name: 'Claire',
    src: '/Malkavian.jpg',
    width: 735,
    height: 1034,
    alt: 'Claire Voyant, a Malkavian seer, pressing her fingers to her temples.',
    tint: '#18213a',
    glow: '#6d8fd8',
    moonLift: 0.2,
  },
  trixx: {
    name: 'Trixx',
    src: '/Female1.jpg',
    width: 700,
    height: 920,
    alt: 'Trixx Laveau, a Brujah enforcer in a spiked collar and leather jacket.',
    tint: '#5a0d16',
    glow: '#ff2a3d',
    moonLift: 0.17,
  },
} satisfies Record<string, Cover>;

type CoverKey = keyof typeof COVERS;

// Book spines: Vampire clans down the left, Garou tribes and hunter creeds down the right.
const LEFT_SPINE = ['Toreador', 'Ventrue', 'Nosferatu', 'Brujah', 'Malkavian', 'Gangrel', 'Tremere'];
const RIGHT_SPINE = [TRIBES[7], CREEDS[1], TRIBES[5], CREEDS[3], TRIBES[0], CREEDS[2]];

export default async function LandingB({ searchParams }: PageProps<'/concept/landing/b'>) {
  const { cover: wanted } = await searchParams;
  const key: CoverKey = wanted === 'trixx' ? 'trixx' : 'claire';
  const cover = COVERS[key];

  return (
    <>
      <Navbar sections={SECTIONS} />
      <main id='main'>
        <section
          aria-labelledby='lc-title'
          style={{ '--moon-lift': cover.moonLift, '--tint': cover.tint, '--accent': cover.glow } as React.CSSProperties}
          className='relative isolate grid h-[160svh] overflow-x-clip [--art-top:32svh] [--cover:min(100vw,62svh,40rem)]'
        >
          {/* Backdrop */}
          <div className='lc-grain sticky top-0 -z-10 h-svh overflow-hidden [grid-area:1/1] bg-[radial-gradient(ellipse_at_50%_42%,var(--tint),color-mix(in_oklab,var(--tint)_35%,var(--lc-ink))_42%,var(--lc-ink)_80%)]' />

          {/* The World of Darkness moon, rising from behind the character's head.
              The disc is 0.357 of the logo's width and centred 0.351 of that width
              from its top, so a 1.29 x --cover logo gives a 0.46 x --cover moon
              whose centre is 0.452 x --cover below the logo's top. */}
          <div className='pointer-events-none sticky top-0 z-0 flex h-svh justify-center overflow-hidden [grid-area:1/1]'>
            <div className='lc-moon-in mt-[calc(var(--art-top)-var(--cover)*(0.452+var(--moon-lift)))] shrink-0 self-start'>
              <div className='lc-mark-rise'>
                <LogoWodCircle aria-hidden className='ankh-wake h-auto w-[calc(var(--cover)*1.29)] text-[color-mix(in_oklab,var(--accent)_45%,#ece8e1)] [--knockout:var(--lc-ink)]' />
              </div>
            </div>
          </div>

          {/* The character */}
          <div className='pointer-events-none sticky top-0 z-10 flex h-svh justify-center overflow-hidden [grid-area:1/1]'>
            <div className='portrait-recede relative mt-(--art-top) w-(--cover) self-start [mask-image:radial-gradient(closest-side_at_50%_40%,black_64%,transparent)]'>
              <Image src={cover.src} width={cover.width} height={cover.height} alt={cover.alt} preload sizes='(max-width: 768px) 100vw, 40rem' className='h-auto w-full' />
            </div>
          </div>

          {/* Spines */}
          <div aria-hidden className='lc-spines pointer-events-none sticky top-0 z-20 hidden h-svh [grid-area:1/1] md:block'>
            <p className='absolute top-[86svh] left-7 flex w-[72svh] origin-top-left -rotate-90 justify-between'>
              {LEFT_SPINE.map((n) => (
                <span key={n} className='whitespace-nowrap'>{n}</span>
              ))}
            </p>
            <p className='absolute top-[14svh] left-[calc(100%-1.75rem)] flex w-[72svh] origin-top-left rotate-90 justify-between'>
              {RIGHT_SPINE.map((n) => (
                <span key={n} className='whitespace-nowrap'>{n}</span>
              ))}
            </p>
            <span className='absolute bottom-0 left-[2.4rem] h-[10svh] w-px bg-current' />
            <span className='absolute right-[2.4rem] bottom-0 h-[10svh] w-px bg-current' />
          </div>

          {/* Cover text */}
          <div className='cover-fade relative z-30 flex h-svh flex-col items-center self-start px-5 [grid-area:1/1]'>
            <div className='pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[38svh] bg-linear-to-t from-[#0a0809] via-[#0a0809]/50 to-transparent' />
            <div className='mt-auto mb-[4svh] flex w-full max-w-xl flex-col items-center gap-4 text-center'>
              <div className='flex flex-col items-center'>
                <p className='lc-eyebrow text-bone/80'>Welcome to</p>
                <h1 id='lc-title' className='mt-1'>
                  <span className='sr-only'>Elysium</span>
                  <Elysium1 aria-hidden className='h-auto w-[min(64vw,26svh,20rem)] text-bone drop-shadow-[0_0_1.2rem_#000]' />
                </h1>
              </div>
              <ul className='flex items-center justify-center gap-5 sm:gap-8'>
                {GAMES_ORDER.map((g) => {
                  const { Logo, title } = GAMES[g];
                  return (
                    <li key={g}>
                      <Link href={gamePath(g)} aria-label={`Enter ${title}`} className='block opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone'>
                        <Logo aria-hidden className='h-7 w-auto max-w-24 text-bone drop-shadow-[0_0_0.8rem_#000] sm:h-9 sm:max-w-32' />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className='lc-display text-xl text-balance text-bone italic drop-shadow-[0_1px_8px_#000] md:text-2xl'>A character vault for the World of Darkness</p>
              <div className='flex flex-wrap items-center justify-center gap-3'>
                <Link href='/vault/new' className='lc-btn lc-btn-solid shadow-[0_0_2rem_-0.5rem_var(--accent)]'>
                  Create a character
                  <MdArrowOutward aria-hidden />
                </Link>
                <Link href='/vault' className='lc-btn lc-btn-ghost'>
                  Open your vault
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Three games: slides up over the character */}
        <section id='games' aria-labelledby='lc-games' className='lc-grain relative z-40 -mt-[45svh] scroll-mt-0 overflow-hidden rounded-t-[2rem] border-t border-bone/10 bg-[#0a0809] px-5 pt-24 pb-28 shadow-[0_-2rem_4rem_-1rem_rgb(0_0_0/0.9)] md:rounded-t-[3rem] md:pt-32'>
          <div aria-hidden className='pointer-events-none absolute inset-x-0 top-0 h-96 opacity-60' style={{ background: `radial-gradient(ellipse at top, ${cover.glow}4d, transparent 70%)` }} />
          <div className='relative mx-auto max-w-6xl'>
            <p className='lc-eyebrow lc-reveal'>Three games, one vault</p>
            <h2 id='lc-games' className='lc-display lc-reveal mt-5 max-w-[16ch] text-5xl leading-[0.95] text-balance md:text-7xl'>
              Three games. One night.
            </h2>
            <p className='lc-reveal mt-5 max-w-[52ch] leading-relaxed text-bone/65'>
              Each game has its own sheet, its own dice and a room of its own. Step inside one and the whole vault changes around you.
            </p>
            <div className='lc-b-cards'>
              {GAMES_ORDER.map((g) => {
                const { Logo, title, figure, modes } = GAMES[g];
                const glow = { vampire: 'lc-glow-v', werewolf: 'lc-glow-w', hunter: 'lc-glow-h' }[g];
                return (
                  <Link key={g} href={gamePath(g)} aria-label={`Enter ${title}`} className={`lc-b-card lc-reveal ${glow}`}>
                    <Image src={figure.src} alt='' fill sizes='(max-width: 1248px) 33vw, 400px' />
                    <span className='lc-b-cap'>
                      <Logo aria-hidden className='text-[#ece8e1]' />
                      <small>
                        {modes.dark} · {modes.light}
                      </small>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
        <Sections />
      </main>
      <Footer />

      {/* Review aid: swap the cover character */}
      <nav aria-label='Cover character' className='lc-switch lc-switch-cover'>
        {(Object.keys(COVERS) as CoverKey[]).map((k) => (
          <Link key={k} href={k === 'claire' ? '/concept/landing/b' : `/concept/landing/b?cover=${k}`} aria-current={k === key ? 'page' : undefined} scroll={false}>
            {COVERS[k].name}
          </Link>
        ))}
      </nav>
    </>
  );
}
