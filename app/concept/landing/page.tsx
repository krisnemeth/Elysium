import Image from 'next/image';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';
import Navbar from '@/app/ui/navbar';
import { LogoWod } from '@/app/ui/svgs/official';
import { GAMES, GAMES_ORDER, gamePath } from '@/app/lib/games';
import Footer from './Footer';

/*
  Direction A, "Three doors": one dim night city, three tall arches of equal
  weight, one per game. On scroll the doors lift at different speeds, the head
  dissolves and the first section rises over the pinned scene on a curved edge.
*/

const GLOW = { vampire: 'lc-glow-v', werewolf: 'lc-glow-w', hunter: 'lc-glow-h' } as const;
const ROMAN = ['I', 'II', 'III'];

export default function LandingA() {
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
            <div className='lc-a-bg'>
              <div className='lc-a-bg-s absolute inset-0'>
                <Image src='/locations/location-53.webp' alt='' fill preload sizes='100vw' />
              </div>
            </div>
            <div aria-hidden className='lc-a-veil' />
            <div aria-hidden className='lc-a-moon' />

            <div className='lc-a-layout'>
              <div className='lc-a-head lc-a-head-s'>
                <div className='lc-in-1'>
                  <LogoWod role='img' aria-label='World of Darkness' className='h-auto w-32 text-[#ece8e1]/85 sm:w-40' />
                </div>
                <h1 id='lc-title' className='lc-display lc-a-h1 lc-in-2'>
                  A vault for the <em>creatures</em> of the dark.
                </h1>
                <div className='lc-a-actions lc-in-3'>
                  <Link href='/vault/new' className='lc-btn lc-btn-solid'>
                    Create a character
                    <MdArrowOutward aria-hidden />
                  </Link>
                  <Link href='/vault' className='lc-btn lc-btn-ghost'>
                    Open your vault
                  </Link>
                </div>
              </div>

              <div className='lc-a-doors'>
                {GAMES_ORDER.map((g, i) => {
                  const { Logo, title, figure } = GAMES[g];
                  return (
                    <div key={g} className='lc-door-wrap'>
                      <Link href={gamePath(g)} aria-label={`Enter ${title}`} className={`lc-door ${GLOW[g]}`}>
                        <Image src={figure.src} alt='' fill preload={i === 0} sizes='(max-width: 1120px) 33vw, 370px' />
                        <span aria-hidden className='lc-door-tint' />
                        <span aria-hidden className='lc-door-fade' />
                        <span aria-hidden className='lc-door-ring' />
                        <span className='lc-door-label'>
                          <Logo aria-hidden className='text-[#ece8e1]' />
                        </span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        <section id='games' aria-labelledby='lc-games' className='lc-a-next'>
          <div className='lc-a-inner'>
            <p className='lc-eyebrow lc-reveal'>Three games, one vault</p>
            <h2 id='lc-games' className='lc-display lc-a-h2 lc-reveal'>
              Three games. One night.
            </h2>
            <p className='lc-a-lede lc-reveal'>
              Each game has its own sheet, its own dice and a room of its own. Step through a door and the whole vault changes around you.
            </p>
            <div className='lc-a-cols'>
              {GAMES_ORDER.map((g, i) => {
                const { title, tagline, modes } = GAMES[g];
                return (
                  <Link key={g} href={gamePath(g)} className={`lc-a-col lc-reveal ${GLOW[g]}`}>
                    <span className='lc-num'>{ROMAN[i]}</span>
                    <h3 className='lc-display'>{title}</h3>
                    <p>{tagline}</p>
                    <span className='lc-modes'>
                      {modes.dark} · {modes.light}
                    </span>
                    <span className='lc-enter'>
                      Enter <span aria-hidden><MdArrowOutward /></span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
