import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Game } from '@/app/lib/games';

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
      <div className='grain absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_60%_-10%,var(--accent-deep),transparent_70%),radial-gradient(ellipse_50%_40%_at_0%_100%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_70%)] opacity-70' />
      {/* Crimson mist drifting slowly across */}
      <div
        className='absolute -bottom-1/4 left-0 h-2/3 w-[140%] rounded-[50%] bg-accent/10 blur-3xl'
        style={{ animation: 'drift-x 38s ease-in-out infinite alternate' }}
      />
    </div>
  );
}

function Werewolf() {
  return (
    <div className={`${fixed} ambience overflow-hidden`}>
      {/* Moonlit forest */}
      <div className='absolute inset-0 hidden dark:block'>
        <Backdrop src='/art/ww-forest.webp' className='opacity-30 grayscale' />
        <div className='absolute inset-0 bg-[linear-gradient(to_bottom,rgb(20_45_40/0.55),var(--ink)_85%)]' />
        <div
          className='absolute top-10 right-[12%] size-28 rounded-full bg-[radial-gradient(circle_at_40%_40%,#fbf8ec,#d9dccb_60%,#a9b0a0)] shadow-[0_0_4rem_1rem_rgb(230_235_215/0.35),0_0_10rem_4rem_rgb(160_190_170/0.15)] md:size-36'
          style={{ animation: 'moon-glow 9s ease-in-out infinite' }}
        />
        <div className='absolute top-8 right-0 h-24 w-2/3 rounded-[50%] bg-[#0a110e]/70 blur-2xl' style={{ animation: 'drift-x 30s ease-in-out infinite alternate' }} />
        <Particles count={14} anim='float-up' className='size-1.5 bg-[#e8f5a8] shadow-[0_0_0.6rem_0.15rem_#d8f07a]' />
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

// The inn's wallpaper as an inline SVG texture.
const WALLPAPER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='88'%3E%3Cg fill='none' stroke='%23c9b48c' stroke-width='1.2' opacity='.55'%3E%3Cpath d='M32 8c8 10 8 22 0 32-8-10-8-22 0-32zM32 48c8 10 8 22 0 32-8-10-8-22 0-32z'/%3E%3Cpath d='M0 44c10-6 22-6 32 0M32 44c10 6 22 6 32 0'/%3E%3C/g%3E%3Ccircle cx='0' cy='0' r='2' fill='%23c9b48c' opacity='.5'/%3E%3Ccircle cx='64' cy='88' r='2' fill='%23c9b48c' opacity='.5'/%3E%3C/svg%3E")`;

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

      {/* The inn: wallpaper and wainscot, a sunlit window onto the city, curtains, a fire */}
      <div className='absolute inset-0 dark:hidden'>
        <div className='absolute inset-0 bg-[#efe4cf]' style={{ backgroundImage: WALLPAPER }} />
        <div className='absolute inset-x-0 bottom-0 h-[22vh] border-t-[6px] border-[#8a6440] bg-[repeating-linear-gradient(to_right,#b98f62_0_2px,#a77e53_2px_120px)] opacity-80' />
        <Backdrop src='/art/sheet-study.webp' className='opacity-[0.08] mix-blend-multiply sepia' />

        {/* Window with curtains */}
        <div className='absolute top-[10%] right-[4%] hidden h-[42vh] w-[26vw] max-w-[24rem] lg:block'>
          <div className='absolute inset-0 overflow-hidden rounded-t-[999px] bg-[linear-gradient(to_bottom,#cfe3ef,#eef3ee_70%,#f6efe0)]'>
            <svg aria-hidden viewBox='0 0 300 100' preserveAspectRatio='none' className='absolute inset-x-0 bottom-0 h-2/5 w-full fill-[#9fb2bd]/70'>
              <path d='M0 100V60h18V40h14v20h10V25h20v35h12V50h16V30h8V15h6v15h10v40h14V45h18v15h12V35h22v25h10V48h16v52z' />
            </svg>
            <div className='absolute top-[12%] left-[20%] size-14 rounded-full bg-[#fff6d8] blur-md' />
          </div>
          <div className='absolute -inset-2 rounded-t-[999px] border-[10px] border-[#8a6440] shadow-[0_0.75rem_2rem_-0.5rem_rgb(80_55_30/0.5)]' />
          <div className='absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 bg-[#8a6440]' />
          {/* Curtains, swaying a little */}
          <div className='absolute -top-6 -left-10 h-[115%] w-1/3 origin-top rounded-b-[40%] bg-[linear-gradient(to_right,#8f3a2c,#b4553f_40%,#8f3a2c)] shadow-lg' style={{ animation: 'curtain 6s ease-in-out infinite' }} />
          <div className='absolute -top-6 -right-10 h-[115%] w-1/3 origin-top rounded-b-[40%] bg-[linear-gradient(to_right,#8f3a2c,#b4553f_60%,#8f3a2c)] shadow-lg' style={{ animation: 'curtain 6s ease-in-out 1.5s infinite reverse' }} />
        </div>

        {/* Sunbeam from the window, with dust */}
        <div className='absolute -top-1/4 right-[16%] h-[150%] w-[30rem] -rotate-[28deg] bg-[linear-gradient(to_right,transparent,rgb(255_244_214/0.5),transparent)] blur-xl' />
        <div className='absolute top-0 right-[18%] h-full w-[34rem] -rotate-[28deg]'>
          <Particles count={18} anim='motes' spread={90} className='size-1 bg-[#b9874a]/60' />
        </div>
        {/* Fire in the hearth, bottom left */}
        <div className='absolute -bottom-1/4 -left-[10%] size-[50vmax] rounded-full bg-[radial-gradient(circle,rgb(240_140_60/0.28),transparent_60%)]' style={{ animation: 'firelight 3s ease-in-out infinite' }} />
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_60%_30%,transparent_40%,rgb(120_85_50/0.18))]' />
      </div>
    </div>
  );
}

export default function Ambience({ game }: { game: Game }) {
  if (game === 'werewolf') return <Werewolf />;
  if (game === 'hunter') return <Hunter />;
  return <Vampire />;
}
