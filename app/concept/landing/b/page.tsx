import Image from 'next/image';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';
import Navbar from '@/app/ui/navbar';
import { LogoWod } from '@/app/ui/svgs/official';
import { GAMES, GAMES_ORDER, gamePath } from '@/app/lib/games';
import Footer from '../Footer';

/*
  Direction B, "The vigil": one wide establishing shot with the name set large
  in the lower third and the three games as an equal strip beneath it. On
  scroll the camera pushes in, the title lifts away and a second scene wipes
  up from the bottom edge carrying the first section.
*/

const GLOW = { vampire: 'lc-glow-v', werewolf: 'lc-glow-w', hunter: 'lc-glow-h' } as const;
const ROMAN = ['I', 'II', 'III'];

export default function LandingB() {
  return (
    <>
      <Navbar
        sections={[
          { href: '#games', label: 'Games' },
        ]}
      />
      <main id='main'>
        <div className='lc-stage'>
          <section aria-labelledby='lc-title' className='lc-sticky lc-grain'>
            <div className='lc-b-bg'>
              <div className='lc-b-bg-s absolute inset-0'>
                <Image src='/art/city-night.webp' alt='' fill preload sizes='100vw' />
              </div>
            </div>
            <div aria-hidden className='lc-b-veil' />
            <div aria-hidden className='lc-b-fog' />

            <div className='lc-b-layout'>
              <div className='lc-b-title lc-b-title-s'>
                <div className='lc-in-1'>
                  <LogoWod role='img' aria-label='World of Darkness' className='lc-b-mark' />
                </div>
                <h1 id='lc-title' className='lc-display lc-b-h1 lc-in-2'>
                  Elysium
                  <span>A vault for the creatures of the dark.</span>
                </h1>
                <div className='lc-b-actions lc-in-3'>
                  <Link href='/vault/new' className='lc-btn lc-btn-solid'>
                    Create a character
                    <MdArrowOutward aria-hidden />
                  </Link>
                  <Link href='/vault' className='lc-btn lc-btn-ghost'>
                    Open your vault
                  </Link>
                </div>
              </div>

              <div className='lc-b-strip lc-b-strip-s'>
                {GAMES_ORDER.map((g, i) => {
                  const { Logo, title, tagline } = GAMES[g];
                  return (
                    <Link key={g} href={gamePath(g)} aria-label={`Enter ${title}`} className={`lc-b-game ${GLOW[g]}`}>
                      <span aria-hidden className='lc-num'>{ROMAN[i]}</span>
                      <Logo aria-hidden />
                      <p>{tagline}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        <section id='games' aria-labelledby='lc-games' className='lc-b-next'>
          <div className='lc-b-next-pin'>
            <div aria-hidden className='lc-b-next-bg'>
              <Image src='/acts/hook.webp' alt='' fill sizes='100vw' />
            </div>
            <div aria-hidden className='lc-b-next-veil' />
            <div className='lc-b-next-body'>
              <p className='lc-eyebrow'>Three games, one vault</p>
              <h2 id='lc-games' className='lc-display lc-b-h2'>
                Three games. One night.
              </h2>
              <p className='lc-b-lede'>
                Each game has its own sheet, its own dice and a room of its own. Step through a door and the whole vault changes around you.
              </p>
              <div className='lc-b-cards'>
                {GAMES_ORDER.map((g) => {
                  const { Logo, title, figure, modes } = GAMES[g];
                  return (
                    <Link key={g} href={gamePath(g)} aria-label={`Enter ${title}`} className={`lc-b-card ${GLOW[g]}`}>
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
          </div>
        </section>
        <div className='lc-b-after' />
      </main>
      <Footer />
    </>
  );
}
