import Image from 'next/image';
import Link from 'next/link';
import { GAMES, GAMES_ORDER, gamePath, type Game } from '@/app/lib/games';
import { at, BODY, Here } from './kit';

/*
  "Three games. One night.", the section that takes over from the cover. It
  starts a full screen up (at 100lvh: the stage reaches under Safari's toolbar) over the cover's held stage, so it
  covers the whole hero before the page scrolls on; how it arrives (its shape
  and the accent rim along its edge) is the hand-over in landing.css. One
  screen tall like the sections after it (Screens.tsx), the chosen cover's
  game lit among the three. Each card has a character of its own (none of
  them on the cover), a cut-out standing in their game's scene.
*/

const FACES: Record<Game, { src: string; width: number; height: number; scene: string }> = {
  vampire: { src: '/art/vault/toreador.webp', width: 800, height: 1400, scene: '/art/city-night.webp' },
  werewolf: { src: '/art/vault/garou-brawler.webp', width: 791, height: 1400, scene: '/art/ww-forest.webp' },
  hunter: { src: '/art/vault/hunter-tablet.webp', width: 791, height: 1400, scene: '/locations/location-3.webp' },
};
export default function GamesSection({ glow }: { glow: string }) {
  return (
    <div style={{ '--accent': `var(--lc-scene-glow, ${glow})` } as React.CSSProperties} className='lc-handover relative z-40 -mt-[calc(200svh-100lvh)]'>
      <div aria-hidden className='lc-handover-rim pointer-events-none absolute inset-0' />
      <section id='games' aria-labelledby='lc-games' className='lc-handover-sheet lc-grain lc-screen relative overflow-hidden bg-[#0a0809] [--wash-at:50%_0%]'>
        <div className={BODY}>
          <div className='grid gap-x-12 gap-y-4 lg:grid-cols-12 lg:items-end'>
            <header className='lg:col-span-7'>
              <p className='lc-eyebrow text-(--lc-glow-text) lc-in' style={at(0)}>
                Three games, one vault
              </p>
              <h2 id='lc-games' className='lc-display lc-scene-type lc-in lc-in-curtain mt-[clamp(0.75rem,2svh,1.25rem)] max-w-[16ch] text-[clamp(2.6rem,7.5svh,4.5rem)] leading-[0.95] text-balance' style={at(1)}>
                Three games. One night.
              </h2>
            </header>
            <p className='lc-in max-w-[46ch] leading-relaxed text-bone/65 lg:col-span-5 lg:pb-2' style={at(2)}>
              Each game has its own sheet, its own dice and a room of its own. Step inside one and the whole vault changes around you.
            </p>
          </div>
          <div className='lc-b-cards'>
            {GAMES_ORDER.map((g, i) => {
              const { Logo, title, modes } = GAMES[g];
              const face = FACES[g];
              const tone = { vampire: 'lc-glow-v', werewolf: 'lc-glow-w', hunter: 'lc-glow-h' }[g];
              return (
                <Link key={g} href={gamePath(g)} data-game={g} aria-label={`Enter ${title}`} className={`lc-b-card lc-in lc-in-wipe ${tone}`} style={at(i + 3)}>
                  <Image src={face.scene} alt='' fill sizes='(max-width: 1248px) 33vw, 400px' className='lc-b-card-scene' />
                  <Image src={face.src} alt='' width={face.width} height={face.height} sizes='(max-width: 1248px) 40vw, 480px' className='lc-b-card-face' />
                  <Here>Your game</Here>
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
