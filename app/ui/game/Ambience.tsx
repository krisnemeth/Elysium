import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Game } from '@/app/lib/games';
import { BlownLeaves, Fireflies, Searchlights, Steam, VeiledMoon } from './SceneBits';

/*
  Backdrop art plus one looping animated element per game and mode.
  `dark:` styles are the game's dark mode, the rest its light mode.
  Keyframes live in app/games.css; all of it stops under reduced motion.
*/

const fixed = 'pointer-events-none fixed inset-0 -z-10';

function Backdrop({ src, className }: { src: string; className: string }) {
  return <Image src={src} alt='' fill sizes='100vw' className={`object-cover ${className}`} />;
}

function Particles({ count, className, anim, spread = 100 }: { count: number; className: string; anim: string; spread?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        // Deterministic scatter so server and client render the same markup.
        const x = (i * 37) % spread;
        const y = 30 + ((i * 53) % 60);
        return (
          <span
            key={i}
            className={`absolute rounded-full ${className}`}
            style={
              {
                left: `${x}%`,
                top: `${y}%`,
                animation: `${anim} ${6 + (i % 5) * 1.7}s ease-in-out ${(i * 0.9) % 7}s infinite`,
                '--dx': `${((i % 3) - 1) * 2.5}rem`,
                '--dy': `${-2 - (i % 4)}rem`,
              } as CSSProperties
            }
          />
        );
      })}
    </>
  );
}

function Vampire() {
  return (
    <div className={`${fixed} ambience overflow-hidden`}>
      {/* Masquerade: the city at night from above, as on the landing cover, searchlights sweeping its cloud */}
      <div className='absolute inset-0 hidden dark:block'>
        <Backdrop src='/art/city-night.webp' className='object-[center_70%] opacity-45 saturate-[.7]' />
        <div className='absolute inset-0 bg-[linear-gradient(to_bottom,rgb(10_8_9/0.3),var(--ink)_88%)]' />
        <Searchlights className='opacity-80' />
      </div>
      {/* Neon Nights: an alley under rose neon that stutters now and then */}
      <div className='absolute inset-0 dark:hidden'>
        <Backdrop src='/locations/location-1.webp' className='object-[center_38%] opacity-45 saturate-[.8]' />
        <div className='absolute inset-0 bg-[linear-gradient(to_bottom,rgb(20_8_30/0.3),var(--ink)_88%)]' />
        <div
          className='absolute -top-1/4 right-[6%] size-[60vmax] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_32%,transparent),transparent_60%)] mix-blend-screen'
          style={{ animation: 'neon-flicker 7s steps(1) infinite' }}
        />
      </div>
      <div className='grain absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_60%_-10%,var(--accent-deep),transparent_70%),radial-gradient(ellipse_50%_40%_at_0%_100%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_70%)] opacity-60' />
      {/* Crimson mist drifting slowly across, and low smoke rolling along the street */}
      <div
        className='absolute -bottom-1/4 left-0 h-2/3 w-[140%] rounded-[50%] bg-accent/10 blur-3xl'
        style={{ animation: 'drift-x 38s ease-in-out infinite alternate' }}
      />
      <div className='absolute -bottom-[12%] -left-1/4 h-[38%] w-[150%] rounded-[50%] bg-black/55 blur-3xl' style={{ animation: 'drift-x 26s ease-in-out infinite alternate-reverse' }} />
    </div>
  );
}

function Werewolf() {
  return (
    <div className={`${fixed} ambience overflow-hidden`}>
      {/* Moonlit forest: the moon behind passing cloud, fireflies, leaves on the wind */}
      <div className='absolute inset-0 hidden dark:block'>
        <Backdrop src='/art/ww-forest.webp' className='opacity-30 grayscale' />
        <div className='absolute inset-0 bg-[linear-gradient(to_bottom,rgb(20_45_40/0.55),var(--ink)_85%)]' />
        <VeiledMoon className='top-12 right-[14%] size-24 md:size-32' />
        <Fireflies count={14} />
        <BlownLeaves count={10} />
      </div>
      {/* The cave */}
      <div className='absolute inset-0 dark:hidden'>
        <Backdrop src='/art/ww-cave.webp' className='opacity-35 sepia' />
        <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--ink)_80%)]' />
        <div
          className='absolute -bottom-1/3 -left-1/4 size-[80vmax] rounded-full bg-[radial-gradient(circle,rgb(239_138_60/0.35),transparent_60%)]'
          style={{ animation: 'firelight 3.2s ease-in-out infinite' }}
        />
        {[18, 46, 71].map((x, i) => (
          <span
            key={x}
            className='absolute top-0 h-3 w-1 rounded-full bg-[#9fc7d6]/70'
            style={{ left: `${x}%`, animation: `drip ${4 + i * 1.3}s ease-in ${i * 1.1}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

// Rain on the city: thin slanted streaks, tiled and scrolled down (rain-fall).
const RAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='192'%3E%3Cg stroke='%23c8d4e0' stroke-width='1' stroke-linecap='round'%3E%3Cpath d='M12 8l-5 20' opacity='.5'/%3E%3Cpath d='M58 40l-5 20' opacity='.35'/%3E%3Cpath d='M84 96l-5 20' opacity='.45'/%3E%3Cpath d='M30 120l-5 20' opacity='.3'/%3E%3Cpath d='M70 160l-5 20' opacity='.4'/%3E%3C/g%3E%3C/svg%3E")`;

// Lamps on the waterfront, as fractions of the art; each flickers on its own clock.
const LAMPS = [
  { x: 41, y: 74, size: 'size-[9vh]', delay: '0s' },
  { x: 35, y: 72, size: 'size-[6vh]', delay: '-1.3s' },
  { x: 44, y: 44, size: 'size-[7vh]', delay: '-2.6s' },
  { x: 65, y: 54, size: 'size-[8vh]', delay: '-5.1s' },
  { x: 71.5, y: 51, size: 'size-[6vh]', delay: '-3.7s' },
];

function Hunter() {
  return (
    <div className={`${fixed} ambience overflow-hidden`}>
      {/* The hideout: the cell's basement den under its one lamp, a cigarette left burning on the desk */}
      <div className='absolute inset-0 hidden dark:block'>
        {/*
          The art (mirrored) keeps its proportions, placed so its lamp hangs at the top right,
          over the pages' actions rather than behind their headings. Only a little larger than
          the screen, as the painting is small: its left and bottom edges fade into the dark
          (the sidebar and the panels cover them anyway).
        */}
        <div
          className='absolute top-0 aspect-[1000/603] w-[max(105vw,170vh)] -translate-y-[18.6%]'
          style={{
            left: 'calc(85vw - 0.606 * max(105vw, 170vh))',
            maskImage: 'linear-gradient(to right, transparent, #000 12%), linear-gradient(to top, transparent, #000 22%)',
            maskComposite: 'intersect',
          }}
        >
          <Image src='/art/htr-den.webp' alt='' fill unoptimized className='-scale-x-100 opacity-55 brightness-90 sepia-[.45] saturate-[.85]' />
          {/* The lamp: the shade lit warm, a cone of light down onto the desk, dust and old smoke hanging in it */}
          <div className='absolute top-[30.5%] left-[60.6%] -translate-1/2' style={{ animation: 'bulb-buzz 11s linear infinite' }}>
            <div className='size-[14vh] rounded-full bg-[radial-gradient(circle,rgb(255_226_170/0.85),rgb(255_180_90/0.35)_35%,transparent_70%)] mix-blend-screen' />
            <div className='absolute top-1/2 left-1/2 size-[70vh] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_190_110/0.22),transparent_60%)]' />
          </div>
          <div className='absolute top-[31%] left-[60.6%] h-[52%] w-[46%] -translate-x-1/2 mix-blend-screen' style={{ animation: 'bulb-buzz 11s linear infinite' }}>
            {/* Clipped to a cone, then blurred, so its edges are soft */}
            <div className='absolute inset-0 blur-xl'>
              <div className='size-full bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgb(255_200_130/0.24),transparent_85%)] [clip-path:polygon(41%_0,59%_0,100%_100%,0_100%)]' />
            </div>
            <div className='absolute inset-x-[10%] top-[8%] h-1/2 rounded-[50%] bg-[#e8dccb]/10 blur-xl' style={{ animation: 'haze-drift 26s ease-in-out infinite' }} />
            <Particles count={14} anim='motes' spread={90} className='size-1 bg-[#ffd9a0]/60' />
          </div>

          {/* A cigarette left on the desk under the lamp: its ember, and the smoke curling up into the light */}
          <div className='absolute top-[60%] left-[57%]'>
            <span className='absolute -top-0.5 -left-0.5 size-1 rounded-full bg-[#ff8a3a] shadow-[0_0_0.5rem_0.2rem_rgb(255_120_40/0.6)]' style={{ animation: 'firelight 2.4s ease-in-out infinite' }} />
            <div className='absolute bottom-0 left-1/2 h-[26rem] w-48 -translate-x-1/2 [filter:url(#smoke-curl)_blur(1.5px)]'>
              {Array.from({ length: 10 }, (_, i) => (
                <span
                  key={i}
                  className='absolute bottom-0 left-1/2 h-20 w-1.5 rounded-full bg-[#ddd6ca]'
                  style={
                    {
                      animation: `smoke-rise ${8 + (i % 4) * 0.9}s cubic-bezier(.3,.1,.6,1) ${i * 0.85}s infinite`,
                      '--sway': `${((i * 7) % 5) - 2}rem`,
                      '--o': `${0.18 + (i % 3) * 0.05}`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>
        </div>
        <svg aria-hidden className='absolute size-0'>
          <filter id='smoke-curl'>
            <feTurbulence type='fractalNoise' baseFrequency='0.03 0.06' numOctaves='2' seed='7' />
            <feDisplacementMap in='SourceGraphic' scale='46' />
          </filter>
        </svg>

        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,transparent_20%,rgb(10_7_4/0.8)_80%)]' />
      </div>

      {/* The city: the harbour at night in fog and rain, under sodium streetlamps */}
      <div className='absolute inset-0 bg-[#07090d] dark:hidden'>
        {/* The art keeps its proportions (covering the screen) so the glows sit on its lamps */}
        <div className='absolute top-[60%] left-1/2 aspect-[2400/1433] w-[max(100vw,167.5vh)] -translate-x-1/2 -translate-y-[60%]'>
          <Image src='/locations/location-3.webp' alt='' fill sizes='max(100vw, 167.5vh)' className='opacity-70 saturate-[.8]' />
          {LAMPS.map((l) => (
            <div
              key={`${l.x}-${l.y}`}
              className={`absolute ${l.size} -translate-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_206_120/0.6),rgb(242_150_40/0.2)_30%,transparent_70%)] mix-blend-screen`}
              style={{ left: `${l.x}%`, top: `${l.y}%`, animation: `bulb-buzz 9s linear ${l.delay} infinite` }}
            />
          ))}
        </div>
        <Steam count={7} opacity={0.15} />
        {/* Fog banks rolling in off the water */}
        <div className='absolute inset-x-[-20%] top-[30%] h-[40%] rounded-[50%] bg-[#9aa6b4]/10 blur-3xl' style={{ animation: 'haze-drift 34s ease-in-out infinite' }} />
        <div className='absolute inset-x-[-10%] bottom-[-10%] h-[35%] rounded-[50%] bg-[#8995a3]/12 blur-3xl' style={{ animation: 'haze-drift 26s ease-in-out -9s infinite reverse' }} />
        {/* Rain, two layers at different speeds for depth */}
        <div className='absolute inset-0 opacity-50' style={{ backgroundImage: RAIN, animation: 'rain-fall 0.9s linear infinite' }} />
        <div className='absolute inset-0 scale-150 opacity-25 blur-[0.5px]' style={{ backgroundImage: RAIN, animation: 'rain-fall 1.4s linear infinite' }} />
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_30%,rgb(5_7_10/0.75)_85%)]' />
      </div>
    </div>
  );
}

export default function Ambience({ game }: { game: Game }) {
  if (game === 'werewolf') return <Werewolf />;
  if (game === 'hunter') return <Hunter />;
  return <Vampire />;
}
