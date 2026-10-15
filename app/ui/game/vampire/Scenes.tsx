import Image from 'next/image';
import type { CSSProperties } from 'react';
import './vampire.css';

/*
  Vampire's two scenes. `dark:` is Masquerade, the rest is Neon Nights.
  Both sit behind everything (fixed, -z-10), so ornament here is atmosphere
  only; the keyframes are in vampire.css (and games.css) and stop under
  prefers-reduced-motion through the shared `.ambience *` rule.
*/

const fixed = 'pointer-events-none fixed inset-0 -z-10';

function Backdrop({ className }: { className: string }) {
  return <Image src='/art/city-night.webp' alt='' fill sizes='100vw' className={`object-cover ${className}`} />;
}

// A few specks that drift through a beam of light or a haze of neon.
function Specks({ count, className, anim = 'motes' }: { count: number; className: string; anim?: string }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`absolute rounded-full ${className}`}
          style={
            {
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              animation: `${anim} ${8 + (i % 5) * 2}s ease-in-out ${(i * 1.1) % 9}s infinite`,
              '--dx': `${((i % 3) - 1) * 2}rem`,
              '--dy': `${-2 - (i % 4)}rem`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}

// Three tall pointed windows (a lancet group), drawn as one silhouette.
const LANCETS = 'M10 300V120Q10 50 40 8Q70 50 70 120V300ZM90 300V90Q90 30 120 0Q150 30 150 90V300ZM170 300V120Q170 50 200 8Q230 50 230 120V300Z';

function Masquerade() {
  return (
    <div className='absolute inset-0 hidden dark:block'>
      {/* The city from a high window, in blood-red monochrome */}
      <div className='absolute inset-0 bg-[#3a0a10]' />
      <Backdrop className='opacity-60 mix-blend-luminosity' />
      <div className='absolute inset-0 bg-[linear-gradient(to_bottom,rgb(13_10_11/0.35),var(--ink)_88%)]' />
      <div className='grain absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_60%_-10%,var(--accent-deep),transparent_70%),radial-gradient(ellipse_50%_40%_at_0%_100%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)] opacity-70' />

      {/* Moonlight through a lancet window, falling aslant with dust in it */}
      <div className='absolute top-0 right-[3%] hidden h-[92vh] w-[34vw] max-w-[34rem] lg:block'>
        <div className='absolute inset-x-0 top-0 h-[55%] opacity-[0.24]'>
          <svg aria-hidden viewBox='0 0 240 300' preserveAspectRatio='xMidYMin meet' className='size-full fill-[#05020a]'>
            <path d={LANCETS} />
          </svg>
          <svg aria-hidden viewBox='0 0 240 300' preserveAspectRatio='xMidYMin meet' className='absolute inset-0 size-full fill-none stroke-bone/80' strokeWidth='1.2'>
            <path d={LANCETS} />
            <path d='M40 8V300M120 0V300M200 8V300M10 150H70M90 150H150M170 150H230' strokeWidth='0.6' />
          </svg>
        </div>
        <div
          className='absolute top-[8%] -left-[10%] h-[120%] w-[90%] origin-top -rotate-[24deg] bg-[linear-gradient(to_right,transparent,rgb(210_190_200/0.11),transparent)] blur-md [clip-path:polygon(30%_0,70%_0,100%_100%,0_100%)]'
          style={{ animation: 'beam-sway 14s ease-in-out infinite alternate' }}
        />
        <div className='absolute inset-0 -rotate-[24deg]'>
          <Specks count={14} className='size-[3px] bg-[#e9d6d9]/60' />
        </div>
      </div>

      {/* Candlelight, low in the corner, guttering */}
      <div
        className='absolute -bottom-[12%] -left-[6%] size-[46vmax] rounded-full bg-[radial-gradient(circle,rgb(226_92_52/0.26),rgb(160_30_40/0.12)_40%,transparent_65%)]'
        style={{ animation: 'firelight 4.2s ease-in-out infinite' }}
      />

      {/* Two banks of mist, drifting opposite ways */}
      <div className='absolute -bottom-1/4 left-0 h-2/3 w-[140%] rounded-[50%] bg-accent/10 blur-3xl' style={{ animation: 'drift-x 38s ease-in-out infinite alternate' }} />
      <div className='absolute -bottom-[10%] -left-[20%] h-1/2 w-[130%] rounded-[50%] bg-[#d9c6c9]/[0.05] blur-3xl' style={{ animation: 'drift-x 52s ease-in-out infinite alternate-reverse' }} />

      {/* Embers of the Blood: a slow heartbeat in the vignette */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_40%,rgb(60_6_14/0.6)_100%)]' style={{ animation: 'heartbeat 7s ease-in-out infinite' }} />
    </div>
  );
}

function NeonNights() {
  return (
    <div className='absolute inset-0 dark:hidden'>
      {/* The city, pushed into violet and magenta */}
      <div className='absolute inset-0 bg-[linear-gradient(to_bottom,#1a0b33,var(--ink)_70%)]' />
      <Backdrop className='opacity-45 mix-blend-screen [filter:hue-rotate(40deg)_saturate(1.9)_brightness(0.8)]' />
      <div className='absolute inset-0 bg-[linear-gradient(to_bottom,rgb(13_7_23/0.4),transparent_35%,var(--ink)_92%)]' />
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_80%_0%,rgb(76_29_149/0.55),transparent_70%),radial-gradient(ellipse_50%_40%_at_0%_100%,color-mix(in_oklab,var(--accent)_26%,transparent),transparent_70%)]' />

      {/* Neon signs across the skyline: a ring and a slash, flickering */}
      <div
        className='absolute -top-[16vmin] right-[6%] size-[44vmin] rounded-full border-[3px] border-[#7ff3ff]/70 shadow-[0_0_1rem_#22d3ee,0_0_3rem_rgb(34_211_238/0.5),inset_0_0_1.5rem_rgb(34_211_238/0.45)] opacity-30 md:opacity-40'
        style={{ animation: 'neon-flicker 9s steps(1,end) infinite' }}
      />
      <div
        className='absolute top-[22%] right-[2%] h-[3px] w-[22vmin] -rotate-[28deg] rounded-full bg-[#ff9ec0] shadow-[0_0_0.6rem_var(--accent),0_0_2rem_var(--accent)] opacity-40'
        style={{ animation: 'neon-flicker 6s steps(1,end) 1.4s infinite' }}
      />

      {/* Rain, slanted and faint */}
      <div className='absolute inset-0 opacity-[0.13] [background-image:repeating-linear-gradient(104deg,transparent_0_11px,rgb(255_190_225/0.7)_11px_12px)] [background-size:56px_180px]' style={{ animation: 'rain 0.7s linear infinite' }} />

      {/* The floor: a perspective grid running toward the horizon */}
      <div className='absolute inset-x-0 bottom-0 h-[34vh] [mask-image:linear-gradient(to_bottom,transparent,rgb(0_0_0/0.6)_70%)] [perspective:26rem]'>
        <div
          className='absolute inset-x-[-50%] top-0 h-[200%] origin-top [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--accent)_70%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--accent)_70%,transparent)_1px,transparent_1px)] [background-size:4.5rem_4.5rem] [transform:rotateX(62deg)]'
          style={{ animation: 'grid-run 3.2s linear infinite' }}
        />
      </div>
      <div className='absolute inset-x-0 bottom-[34vh] h-px bg-[color-mix(in_oklab,var(--accent)_80%,white)] opacity-60 shadow-[0_0_1.2rem_0.2rem_var(--accent)]' />
      <div className='absolute inset-x-0 bottom-[33vh] h-24 bg-linear-to-t from-accent/20 to-transparent' />

      {/* Haze with a few drifting lights, and scanlines for the screen feel */}
      <div className='absolute inset-0 overflow-hidden'>
        <Specks count={12} className='size-1 bg-[#ff9ec0]/60 shadow-[0_0_0.6rem_var(--accent)]' />
      </div>
      <div className='absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(to_bottom,#000_0_1px,transparent_1px_3px)]' />
    </div>
  );
}

export default function VampireAmbience() {
  return (
    <div className={`${fixed} ambience overflow-hidden`}>
      <Masquerade />
      <NeonNights />
    </div>
  );
}
