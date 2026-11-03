import Image from 'next/image';
import Link from 'next/link';
import { GAMES, GAMES_ORDER, gamePath } from '@/app/lib/games';
import type { Handover } from './covers';

/*
  "Three games. One night.", the section that takes over from the cover. It
  starts a full screen up (-mt-[100svh]) over the cover's held stage, so it
  covers the whole hero before the page scrolls on; how it arrives (its shape
  and the accent rim along its edge) is the hand-over in landing.css.
*/
export default function GamesSection({ glow, handover }: { glow: string; handover: Handover }) {
  return (
    <div data-handover={handover} style={{ '--accent': `var(--lc-scene-glow, ${glow})` } as React.CSSProperties} className='lc-handover relative z-40 -mt-[100svh]'>
      <div aria-hidden className='lc-handover-rim pointer-events-none absolute inset-0' />
      <section id='games' aria-labelledby='lc-games' className='lc-handover-sheet lc-grain relative scroll-mt-0 overflow-hidden bg-[#0a0809] px-5 pt-24 pb-28 md:pt-32'>
        <div aria-hidden className='pointer-events-none absolute inset-x-0 top-0 h-96 opacity-60' style={{ background: 'radial-gradient(ellipse at top, color-mix(in oklab, var(--accent) 30%, transparent), transparent 70%)' }} />
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
              const tone = { vampire: 'lc-glow-v', werewolf: 'lc-glow-w', hunter: 'lc-glow-h' }[g];
              return (
                <Link key={g} href={gamePath(g)} aria-label={`Enter ${title}`} className={`lc-b-card lc-reveal ${tone}`}>
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
    </div>
  );
}
