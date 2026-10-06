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

function Hunter() {
  return (
    <div className={`${fixed} ambience overflow-hidden`}>
      {/* The cabin */}
      <div className='absolute inset-0 hidden dark:block'>
        <Backdrop src='/art/htr-cabin.webp' className='opacity-25' />
        <div className='absolute inset-0 bg-[linear-gradient(to_bottom,rgb(18_13_9/0.4),var(--ink)_80%)]' />
        {/* A bare bulb swinging on its wire */}
        <div className='absolute top-0 left-1/2 h-[70vh] w-[60vw] -translate-x-1/2 origin-top' style={{ animation: 'lamp-swing 7s ease-in-out infinite' }}>
          <div className='mx-auto h-16 w-px bg-[#c7b49a]/40' />
          <div className='mx-auto size-3 rounded-full bg-[#ffd9a0] shadow-[0_0_2rem_0.75rem_rgb(255_190_110/0.5)]' style={{ animation: 'firelight 2.6s ease-in-out infinite' }} />
          <div className='mx-auto h-[60vh] w-full bg-[radial-gradient(ellipse_50%_80%_at_50%_0%,rgb(240_160_70/0.16),transparent_70%)] [clip-path:polygon(45%_0,55%_0,100%_100%,0_100%)]' />
        </div>
      </div>
      {/* The inn */}
      <div className='absolute inset-0 dark:hidden'>
        <Backdrop src='/art/sheet-study.webp' className='opacity-[0.16] mix-blend-multiply sepia' />
        <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--ink)_75%)]' />
        <div className='absolute -top-1/4 left-[10%] h-[150%] w-[28rem] rotate-[25deg] bg-[linear-gradient(to_right,transparent,rgb(255_244_214/0.55),transparent)] blur-xl' />
        <div className='absolute top-0 left-[14%] h-full w-[34rem] rotate-[25deg]'>
          <Particles count={16} anim='motes' spread={90} className='size-1 bg-[#b9874a]/60' />
        </div>
      </div>
    </div>
  );
}

export default function Ambience({ game }: { game: Game }) {
  if (game === 'werewolf') return <Werewolf />;
  if (game === 'hunter') return <Hunter />;
  return <Vampire />;
}
