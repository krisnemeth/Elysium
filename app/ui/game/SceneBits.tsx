import clsx from 'clsx';
import type { CSSProperties } from 'react';

/*
  Moving pieces shared by the app's scenes (Ambience.tsx) and the landing
  cover's backdrops (app/ui/landing/CoverPicker.tsx): the moon behind
  passing cloud, fireflies, searchlights over the city, steam off the
  street, leaves blown across. CSS only; the keyframes are in app/games.css
  and stop under reduced motion (.ambience, and the landing's own rule).
  Scatter is deterministic, so server and client render the same markup.
*/

// The moon, soft and veiled, with banks of cloud passing over it. Place and size it with className (it's a square).
export function VeiledMoon({ className }: { className?: string }) {
  return (
    <div aria-hidden className={clsx('pointer-events-none absolute', className)}>
      <div className='absolute -inset-[160%] rounded-full bg-[radial-gradient(circle,rgb(200_215_200/0.16),rgb(140_170_150/0.06)_35%,transparent_65%)]' style={{ animation: 'moon-glow 11s ease-in-out infinite' }} />
      <div className='absolute inset-0 rounded-full bg-[radial-gradient(circle_at_42%_40%,#f1f0e2,#cfd3c2_55%,#a2aa9b_75%,transparent)] opacity-45 blur-[6px]' />
      {/* A thin veil always over it, then thicker banks drifting across */}
      <div className='absolute -inset-[40%] rounded-full bg-[#0c1512]/45 blur-xl' />
      {[
        { top: '-10%', h: '55%', w: '520%', o: 0.75, dur: 46, delay: 0 },
        { top: '35%', h: '45%', w: '420%', o: 0.6, dur: 58, delay: -21 },
        { top: '60%', h: '70%', w: '600%', o: 0.8, dur: 52, delay: -37 },
      ].map((c) => (
        <div
          key={c.top}
          className='absolute left-1/2 rounded-[50%] bg-[#0b1411] blur-lg'
          style={{ top: c.top, height: c.h, width: c.w, opacity: c.o, animation: `cloud-pass ${c.dur}s linear ${c.delay}s infinite` }}
        >
          {/* Its edge, lit by the moon behind it */}
          <div className='absolute inset-x-[10%] -top-[12%] h-1/3 rounded-[50%] bg-[#9fb3a6]/15 blur-md' />
        </div>
      ))}
    </div>
  );
}

// Fireflies: points of yellow-green that wander and blink, in the lower part of the box.
export function Fireflies({ count = 14, className }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={clsx('pointer-events-none absolute inset-0', className)}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className='absolute size-1.5 rounded-full bg-[#eaf6b0] shadow-[0_0_0.7rem_0.2rem_rgb(214_240_122/0.7)]'
          style={
            {
              left: `${(i * 37 + 7) % 96}%`,
              top: `${42 + ((i * 53) % 50)}%`,
              scale: `${0.6 + (i % 3) * 0.25}`,
              animation: `firefly ${7 + (i % 5) * 1.6}s ease-in-out ${-((i * 1.7) % 9)}s infinite`,
              '--dx': `${((i % 5) - 2) * 1.4}rem`,
              '--dy': `${-1.5 - (i % 4) * 0.8}rem`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

// Searchlights over the city: two beams from the streets sweeping the low cloud, one of them crimson.
export function Searchlights({ className }: { className?: string }) {
  const beams = [
    { left: '22%', color: 'rgb(255_236_225/0.12)', dur: 19, delay: 0 },
    { left: '68%', color: 'rgb(230_70_80/0.15)', dur: 23, delay: -9 },
  ];
  return (
    <div aria-hidden className={clsx('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {beams.map((b) => (
        <div
          key={b.left}
          className='absolute bottom-[12%] h-[115%] w-[14vmax] origin-bottom -translate-x-1/2 mix-blend-screen [mask-image:linear-gradient(to_top,transparent,#000_40%,#000_55%,transparent_95%)]'
          style={{ left: b.left, animation: `searchlight ${b.dur}s ease-in-out ${b.delay}s infinite alternate` }}
        >
          {/* The beam's spread, its edges lost in the haze, and a faint core. Blurred
              outside the clip (the clip on an inner box) so the edges stay soft. */}
          <div className='absolute inset-0 blur-[22px]'>
            <div
              className='size-full [clip-path:polygon(47%_100%,53%_100%,92%_0,8%_0)]'
              style={{ backgroundImage: `linear-gradient(to top, ${b.color.replaceAll('_', ' ')}, transparent 85%)` }}
            />
          </div>
          <div className='absolute inset-0 blur-[8px]'>
            <div className='size-full [clip-path:polygon(49%_100%,51%_100%,60%_0,40%_0)]' style={{ backgroundImage: 'linear-gradient(to top, rgb(255 245 240 / 0.06), transparent 70%)' }} />
          </div>
        </div>
      ))}
      {/* Where the beams meet the cloud, it glows a little */}
      <div className='absolute inset-x-0 top-0 h-1/3 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgb(200_60_70/0.08),transparent_70%)]' />
    </div>
  );
}

// Steam rising off the street: soft puffs swelling and thinning as they climb.
export function Steam({ count = 9, opacity = 0.14, className }: { count?: number; opacity?: number; className?: string }) {
  return (
    <div aria-hidden className={clsx('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className='absolute -bottom-[10vh] size-[30vh] rounded-full bg-[#d9d6cf] blur-2xl'
          style={
            {
              left: `${((i * 41 + 5) % 100) - 10}%`,
              animation: `steam-up ${13 + (i % 4) * 2.5}s ease-out ${-((i * 2.9) % 15)}s infinite`,
              '--o': opacity,
              '--sway': `${((i % 3) - 1) * 6}vw`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

const LEAF_PATHS = [
  'M10 0C16 5 17 13 10 20C3 13 4 5 10 0Z',
  'M10 0C14 3 19 6 16 11C19 14 14 17 10 20C6 17 1 14 4 11C1 6 6 3 10 0Z',
  'M10 0C13 6 13 14 10 20C7 14 7 6 10 0Z',
];
const LEAF_COLORS = ['#6e7a2e', '#a07a2c', '#c06a24', '#8a3a1e', '#4a6a3a', '#b08a34'];

// Leaves on the wind, in from the top left and falling away to the bottom right, tumbling.
export function BlownLeaves({ count = 10, className }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={clsx('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {Array.from({ length: count }, (_, i) => {
        const near = i % 3 === 0;
        return (
          <span
            key={i}
            className='absolute -left-[6vw] block'
            style={
              {
                top: `${-8 + ((i * 47) % 50)}%`,
                animation: `leaf-blow ${(near ? 9 : 14) + (i % 4) * 2}s linear ${-((i * 3.3) % 16)}s infinite`,
                '--fall': `${45 + (i % 4) * 10}vh`,
              } as CSSProperties
            }
          >
            <svg
              viewBox='0 0 20 20'
              className={clsx('block', near ? 'size-5 opacity-70 blur-[0.5px]' : 'size-3 opacity-45')}
              style={{ fill: LEAF_COLORS[i % LEAF_COLORS.length], animation: `leaf-tumble ${2.2 + (i % 3) * 0.9}s linear infinite` }}
            >
              <path d={LEAF_PATHS[i % LEAF_PATHS.length]} />
            </svg>
          </span>
        );
      })}
    </div>
  );
}
