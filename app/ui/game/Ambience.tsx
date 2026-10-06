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

// Velvet drape folds for the Masquerade salon.
const DRAPE =
  'repeating-linear-gradient(to right, rgb(40 2 8) 0 14px, rgb(92 10 22) 22px, rgb(58 4 12) 34px, rgb(30 1 6) 44px)';

function Vampire() {
  return (
    <div className={`${fixed} ambience overflow-hidden`}>
      {/* Masquerade: an Elysium salon by chandelier light */}
      <div className='absolute inset-0 hidden dark:block'>
        <Backdrop src='/art/sheet-study.webp' className='opacity-35 saturate-50' />
        <div className='absolute inset-0 bg-[#5c0a14] mix-blend-multiply' />
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_55%_15%,transparent,rgb(8_2_3/0.92)_80%)]' />
        {/* Chandelier: a cluster of candle glows and glinting crystals */}
        <div className='absolute top-0 left-[58%] h-56 w-72 -translate-x-1/2'>
          <div className='mx-auto h-14 w-px bg-[#c9a35c]/40' />
          <div className='absolute top-10 left-1/2 h-24 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgb(255_200_120/0.35),transparent_70%)]' style={{ animation: 'firelight 4s ease-in-out infinite' }} />
          {Array.from({ length: 9 }, (_, i) => (
            <span
              key={i}
              className='absolute size-1 rounded-full bg-[#fff1d0] shadow-[0_0_0.5rem_0.15rem_rgb(255_220_160/0.8)]'
              style={{ left: `${18 + i * 8}%`, top: `${38 + Math.abs(4 - i) * 6}%`, animation: `twinkle ${2.2 + (i % 4) * 0.7}s ease-in-out ${i * 0.31}s infinite` }}
            />
          ))}
        </div>
        {/* Incense smoke rising */}
        {[22, 64].map((x, i) => (
          <div
            key={x}
            className='absolute bottom-0 h-1/2 w-40 rounded-full bg-[#d8c8c0]/[0.06] blur-2xl'
            style={{ left: `${x}%`, animation: `smoke ${16 + i * 5}s ease-in-out ${i * 4}s infinite` }}
          />
        ))}
        {/* Velvet drapes at the edges */}
        <div className='absolute inset-y-0 -left-6 w-24 opacity-90 shadow-[1rem_0_2rem_rgb(0_0_0/0.7)] md:w-36' style={{ background: DRAPE, animation: 'curtain 9s ease-in-out infinite', transformOrigin: 'top' }} />
        <div className='absolute inset-y-0 -right-6 w-24 opacity-90 shadow-[-1rem_0_2rem_rgb(0_0_0/0.7)] md:w-36' style={{ background: DRAPE, animation: 'curtain 9s ease-in-out 2s infinite reverse', transformOrigin: 'top' }} />
      </div>

      {/* Neon Nights: the back alley of a club */}
      <div className='absolute inset-0 dark:hidden'>
        <Backdrop src='/art/vtm-alley.webp' className='opacity-45' />
        <div className='absolute inset-0 bg-[#2a0a4a] mix-blend-color opacity-70' />
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_60%_40%,transparent,rgb(10_4_20/0.9)_85%)]' />
        {/* The club door: light pulsing to the bass, spilling onto wet ground */}
        <div className='absolute bottom-[18%] left-[32%] hidden h-40 w-16 bg-[#ff2d7a] blur-[2px] md:block' style={{ animation: 'bass 0.5s ease-in-out infinite' }} />
        <div className='absolute bottom-0 left-[22%] hidden h-[18%] w-[36%] bg-[radial-gradient(ellipse_at_top,rgb(255_45_122/0.4),transparent_70%)] md:block' style={{ animation: 'bass 0.5s ease-in-out infinite' }} />
        {/* Neon sign */}
        <p
          aria-hidden
          className='absolute right-[4%] bottom-[6%] hidden rotate-[-4deg] font-display text-6xl text-[#ffd6f0] italic [text-shadow:0_0_0.2rem_#fff,0_0_0.6rem_#ff4fb0,0_0_1.5rem_#ff4fb0,0_0_3rem_#b02bff] lg:block'
          style={{ animation: 'neon-flicker 6s steps(1,end) infinite' }}
        >
          Elysium
        </p>
        {/* Rain and a wet sheen on the ground */}
        <div className='absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(100deg,transparent_0_12px,rgb(220_200_255/0.4)_12px_13px)] [background-size:60px_160px]' style={{ animation: 'rain 0.45s linear infinite' }} />
        <div className='absolute inset-x-0 bottom-0 h-1/4 bg-[linear-gradient(to_top,rgb(160_80_255/0.18),transparent)]' />
      </div>
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
      {/* The cave: moonlight through the roof, glyphs glowing with the caern's spirit-light */}
      <div className='absolute inset-0 dark:hidden'>
        <Backdrop src='/art/ww-cave.webp' className='opacity-40 saturate-[0.6]' />
        <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--ink)_80%)]' />
        {/* Luna's light through an opening in the rock */}
        <div className='absolute -top-[10%] left-[40%] h-[120%] w-[18rem] rotate-[14deg] bg-[linear-gradient(to_bottom,rgb(220_232_240/0.32),rgb(200_220_235/0.08)_70%,transparent)] blur-xl' style={{ animation: 'moon-glow 11s ease-in-out infinite' }} />
        {/* Glyphs on the walls */}
        {[
          { g: 'luna', x: 2, y: 30, s: 'size-24' },
          { g: 'gaia', x: 88, y: 18, s: 'size-28' },
          { g: 'caern', x: 4, y: 78, s: 'size-24' },
          { g: 'spirit', x: 93, y: 70, s: 'size-20' },
        ].map(({ g, x, y, s }, i) => (
          <span
            key={g}
            className={`absolute ${s} bg-[#8ff0dc] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] drop-shadow-[0_0_0.75rem_#5fe0c8]`}
            style={{ left: `${x}%`, top: `${y}%`, maskImage: `url(/werewolf/other/${g}.png)`, WebkitMaskImage: `url(/werewolf/other/${g}.png)`, animation: `spirit-glow ${7 + i * 1.6}s ease-in-out ${i * 1.4}s infinite` } as CSSProperties}
          />
        ))}
        <Particles count={14} anim='float-up' className='size-1 bg-[#bff7ea] shadow-[0_0_0.5rem_0.1rem_#7fe8d2]' />
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

// Weathered boards, cold and grey; the gaps between them are black.
const BOARDS = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='400'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.012 .3' numOctaves='3' seed='9'/%3E%3CfeColorMatrix values='0 0 0 0 .16 0 0 0 0 .14 0 0 0 0 .12 0 0 0 1.1 -.4'/%3E%3C/filter%3E%3Crect width='120' height='400' fill='%23141210'/%3E%3Crect width='120' height='400' filter='url(%23g)'/%3E%3Crect x='117' width='3' height='400' fill='%23040302'/%3E%3C/svg%3E")`;

function Hunter() {
  return (
    <div className={`${fixed} ambience overflow-hidden`}>
      {/* The cabin: bare boards, one cold window, a weak bulb. Hard and lonely. */}
      <div className='absolute inset-0 hidden bg-[#070605] dark:block'>
        <div className='absolute inset-0 opacity-60' style={{ backgroundImage: BOARDS }} />
        <Backdrop src='/art/htr-cabin.webp' className='opacity-[0.12] grayscale' />

        {/* Window: rain and the odd lightning flash, the only light from outside */}
        <div className='absolute top-[16%] left-[4%] hidden h-[26vh] w-[17vw] max-w-[16rem] lg:block'>
          <div className='absolute inset-0 overflow-hidden bg-[linear-gradient(to_bottom,#070c12,#0d1822)] shadow-[inset_0_0_2rem_rgb(0_0_0/0.9)]'>
            <svg aria-hidden viewBox='0 0 300 120' preserveAspectRatio='none' className='absolute inset-x-0 bottom-0 h-1/2 w-full fill-[#020305]'>
              <path d='M0 120V70l12-30 12 30 10-45 12 45 14-60 14 60 9-35 11 35 13-50 13 50 10-25 12 25 15-55 14 55 9-30 12 30 14-48 13 48 10-28 12 28 15-58 13 58 11-36 12 36V120z' />
            </svg>
            <div className='absolute inset-0 opacity-40 [background-image:repeating-linear-gradient(105deg,transparent_0_9px,rgb(150_170_190/0.35)_9px_10px)] [background-size:40px_140px]' style={{ animation: 'rain 0.5s linear infinite' }} />
            <div className='absolute inset-0 bg-[#dfe8ff]' style={{ animation: 'lightning 11s linear infinite' }} />
          </div>
          <div className='absolute -inset-2 border-[9px] border-[#1a130d]' />
          <div className='absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 bg-[#1a130d]' />
          <div className='absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-[#1a130d]' />
        </div>
        <div className='absolute inset-0 bg-[#cfe0ff] mix-blend-overlay' style={{ animation: 'lightning-room 11s linear infinite' }} />

        {/* A weak bulb swinging on its wire, top right */}
        <div className='absolute top-0 right-[6%] h-[70vh] w-[46vw] translate-x-1/2 origin-top md:right-[12%]' style={{ animation: 'lamp-swing 7s ease-in-out infinite' }}>
          <div className='mx-auto h-16 w-px bg-[#8a7a66]/40' />
          <div className='mx-auto size-2.5 rounded-full bg-[#ffcf8a] shadow-[0_0_1.5rem_0.5rem_rgb(255_170_90/0.35)]' style={{ animation: 'firelight 2.6s ease-in-out infinite' }} />
          <div className='relative mx-auto h-[60vh] w-full bg-[radial-gradient(ellipse_50%_80%_at_50%_0%,rgb(230_150_70/0.1),transparent_70%)] [clip-path:polygon(45%_0,55%_0,100%_100%,0_100%)]'>
            <Particles count={8} anim='motes' spread={80} className='size-0.5 bg-[#e8c79a]/50' />
          </div>
        </div>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_72%_18%,transparent_5%,rgb(4_3_2/0.92)_65%)]' />
      </div>

      {/* The inn: a small attic room under the eaves, lit by one candle */}
      <div className='absolute inset-0 overflow-hidden bg-[#dccbab] dark:hidden'>
        {/* Plaster, warmest around the candle */}
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_70%_75%_at_22%_88%,#f3e6c9,#dccbab_45%,#8f7656)]' style={{ animation: 'candle-room 4s ease-in-out infinite' }} />
        {/* Sloping ceiling and rafters */}
        <svg aria-hidden viewBox='0 0 1600 900' preserveAspectRatio='none' className='absolute inset-0 size-full'>
          <polygon points='0,0 620,0 0,380' fill='#5a4430' fillOpacity='.32' />
          <polygon points='1600,0 980,0 1600,380' fill='#5a4430' fillOpacity='.32' />
          <g stroke='#3e2d1d' strokeOpacity='.45' strokeWidth='22'>
            <line x1='0' y1='380' x2='620' y2='0' />
            <line x1='1600' y1='380' x2='980' y2='0' />
          </g>
          <g stroke='#3e2d1d' strokeOpacity='.28' strokeWidth='10'>
            <line x1='0' y1='250' x2='408' y2='0' />
            <line x1='0' y1='120' x2='196' y2='0' />
            <line x1='1600' y1='250' x2='1192' y2='0' />
            <line x1='1600' y1='120' x2='1404' y2='0' />
          </g>
        </svg>
        {/* A small round window: a night of stars */}
        <div className='absolute top-[4%] right-[3%] hidden size-24 overflow-hidden rounded-full border-[8px] border-[#4a3524] bg-[radial-gradient(circle_at_40%_35%,#22324a,#0c1422)] shadow-[0_0.5rem_1.5rem_rgb(60_40_20/0.5)] lg:block'>
          {[[30, 30], [62, 22], [48, 58], [72, 64], [24, 70]].map(([x, y], i) => (
            <span key={i} className='absolute size-0.5 rounded-full bg-white' style={{ left: `${x}%`, top: `${y}%`, animation: `twinkle ${3 + i}s ease-in-out ${i * 0.7}s infinite` }} />
          ))}
          <div className='absolute inset-y-0 left-1/2 w-1.5 -translate-x-1/2 bg-[#4a3524]' />
          <div className='absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 bg-[#4a3524]' />
        </div>
        {/* A single iron bed */}
        <svg aria-hidden viewBox='0 0 400 200' className='absolute bottom-[3%] left-[2%] hidden w-[34vw] max-w-[30rem] opacity-60 lg:block'>
          <rect x='30' y='110' width='340' height='40' rx='6' fill='#cfc0a2' />
          <rect x='40' y='96' width='90' height='22' rx='10' fill='#e6dcc6' />
          <path d='M30 150V40M30 60h0M370 150V80' stroke='#2b2016' strokeWidth='7' strokeLinecap='round' fill='none' />
          <path d='M30 46q40 -26 0 0M30 70h20M30 90h20' stroke='#2b2016' strokeWidth='4' fill='none' />
          <path d='M20 150h360' stroke='#2b2016' strokeWidth='6' />
          <path d='M40 150v30M360 150v30' stroke='#2b2016' strokeWidth='6' />
        </svg>
        {/* The candle */}
        <div className='absolute bottom-[14%] left-[30%] hidden lg:block'>
          <div className='absolute -top-36 left-1/2 size-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_200_120/0.5),transparent_65%)]' style={{ animation: 'firelight 3s ease-in-out infinite' }} />
          <div className='relative mx-auto h-5 w-2.5 origin-bottom rounded-[50%_50%_45%_45%] bg-[radial-gradient(ellipse_at_50%_75%,#fff7d6,#ffc04d_60%,#ff8a1c)] shadow-[0_0_1rem_0.3rem_rgb(255_190_90/0.6)]' style={{ animation: 'flame 1.8s ease-in-out infinite' }} />
          <div className='mx-auto h-14 w-6 rounded-t-sm bg-[linear-gradient(to_right,#e9dcc0,#fffaf0,#d9c9a6)]' />
          <div className='mx-auto h-2 w-14 rounded-full bg-[#5a4430]' />
        </div>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_40%_60%,transparent_45%,rgb(60_40_20/0.45))]' />
      </div>
    </div>
  );
}

export default function Ambience({ game }: { game: Game }) {
  if (game === 'werewolf') return <Werewolf />;
  if (game === 'hunter') return <Hunter />;
  return <Vampire />;
}
