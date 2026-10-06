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

// Wood grain and wallpaper as inline SVG textures.
const PLANKS = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='400'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.015 .35' numOctaves='3' seed='4'/%3E%3CfeColorMatrix values='0 0 0 0 .3 0 0 0 0 .18 0 0 0 0 .09 0 0 0 1.2 -.35'/%3E%3C/filter%3E%3Crect width='140' height='400' fill='%23281a10'/%3E%3Crect width='140' height='400' filter='url(%23g)'/%3E%3Crect x='138' width='2' height='400' fill='%23100a05'/%3E%3C/svg%3E")`;
const WALLPAPER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='88'%3E%3Cg fill='none' stroke='%23c9b48c' stroke-width='1.2' opacity='.55'%3E%3Cpath d='M32 8c8 10 8 22 0 32-8-10-8-22 0-32zM32 48c8 10 8 22 0 32-8-10-8-22 0-32z'/%3E%3Cpath d='M0 44c10-6 22-6 32 0M32 44c10 6 22 6 32 0'/%3E%3C/g%3E%3Ccircle cx='0' cy='0' r='2' fill='%23c9b48c' opacity='.5'/%3E%3Ccircle cx='64' cy='88' r='2' fill='%23c9b48c' opacity='.5'/%3E%3C/svg%3E")`;

function Hunter() {
  return (
    <div className={`${fixed} ambience overflow-hidden`}>
      {/* The cabin: timber walls, a rain-streaked window with lightning, a swinging bulb */}
      <div className='absolute inset-0 hidden dark:block'>
        <div className='absolute inset-0 opacity-70' style={{ backgroundImage: PLANKS }} />
        <Backdrop src='/art/htr-cabin.webp' className='opacity-20 mix-blend-luminosity' />

        {/* Window */}
        <div className='absolute top-[14%] left-[3%] hidden h-[34vh] w-[24vw] max-w-[22rem] lg:block'>
          <div className='absolute inset-0 overflow-hidden rounded-sm bg-[linear-gradient(to_bottom,#0b1a2b,#16304a_60%,#1d3a52)] shadow-[inset_0_0_2rem_rgb(0_0_0/0.8)]'>
            <div className='absolute top-[14%] right-[18%] size-10 rounded-full bg-[#dfe6ea]/70 blur-[2px] shadow-[0_0_2.5rem_1rem_rgb(180_200_215/0.25)]' />
            <svg aria-hidden viewBox='0 0 300 120' preserveAspectRatio='none' className='absolute inset-x-0 bottom-0 h-1/2 w-full fill-[#05090e]'>
              <path d='M0 120V70l12-30 12 30 10-45 12 45 14-60 14 60 9-35 11 35 13-50 13 50 10-25 12 25 15-55 14 55 9-30 12 30 14-48 13 48 10-28 12 28 15-58 13 58 11-36 12 36V120z' />
            </svg>
            <div className='absolute inset-0 opacity-50 [background-image:repeating-linear-gradient(105deg,transparent_0_9px,rgb(190_210_225/0.35)_9px_10px)] [background-size:40px_140px]' style={{ animation: 'rain 0.5s linear infinite' }} />
            <div className='absolute inset-0 bg-[#e8f0ff]' style={{ animation: 'lightning 9s linear infinite' }} />
          </div>
          {/* Frame and mullions */}
          <div className='absolute -inset-2 rounded-sm border-[10px] border-[#3a2616] shadow-[0_0.75rem_2rem_rgb(0_0_0/0.6)]' />
          <div className='absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 bg-[#3a2616]' />
          <div className='absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-[#3a2616]' />
        </div>
        {/* The lightning washes faintly over the room too */}
        <div className='absolute inset-0 bg-[#cfe0ff] mix-blend-overlay' style={{ animation: 'lightning-room 9s linear infinite' }} />

        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,transparent_10%,rgb(10_7_4/0.85)_75%)]' />

        {/* A bare bulb swinging on its wire, top right */}
        <div className='absolute top-0 right-[6%] h-[70vh] w-[46vw] translate-x-1/2 origin-top md:right-[12%]' style={{ animation: 'lamp-swing 7s ease-in-out infinite' }}>
          <div className='mx-auto h-16 w-px bg-[#c7b49a]/40' />
          <div className='mx-auto size-3 rounded-full bg-[#ffd9a0] shadow-[0_0_2rem_0.75rem_rgb(255_190_110/0.5)]' style={{ animation: 'firelight 2.6s ease-in-out infinite' }} />
          <div className='relative mx-auto h-[60vh] w-full bg-[radial-gradient(ellipse_50%_80%_at_50%_0%,rgb(240_160_70/0.18),transparent_70%)] [clip-path:polygon(45%_0,55%_0,100%_100%,0_100%)]'>
            <Particles count={12} anim='motes' spread={80} className='size-1 bg-[#ffd9a0]/60' />
          </div>
        </div>
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
