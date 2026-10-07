import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { MdArrowOutward } from 'react-icons/md';
import { CLANS } from '@/app/lib/clans';
import type { Character } from '@/app/lib/sample-characters';
import { FactionMark, factionName } from '@/app/ui/game/FactionMark';

/*
  Vampire character cards. Both looks are rendered; the theme shows one
  (app/games.css): Masquerade is a Gothic lancet window, Neon Nights a neon
  sign on a wet brick wall.
*/

function Portrait({ c, className = '' }: { c: Character; className?: string }) {
  return (
    <Image
      src={c.image.src}
      unoptimized={c.image.unoptimized}
      width={c.image.width}
      height={c.image.height}
      alt={`Portrait of ${c.name}.`}
      sizes='(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 22rem'
      className={`size-full object-cover object-top transition-[scale,filter] duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-105 ${className}`}
    />
  );
}

function Footer({ c }: { c: Character }) {
  return (
    <div className='mt-auto flex items-center justify-between gap-3 pt-4'>
      <Link
        href={`/vault/vampire/characters/${c.slug}`}
        className='group/link inline-flex items-center gap-1.5 text-sm text-bone transition-colors after:absolute after:inset-0 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
      >
        Open sheet
        <MdArrowOutward aria-hidden className='transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5' />
      </Link>
      {c.status === 'draft' && <span className='text-[0.65rem] tracking-[0.2em] text-bone/45 uppercase'>Draft</span>}
    </div>
  );
}

// ------------------------------------------------------------------ Masquerade

// Crockets: small hooked leaves along the arch, as on Gothic gables.
const CROCKETS = 'M19.2 136.5Q11.2 132.5 12.5 125.3 M380.8 136.5Q388.8 132.5 387.5 125.3 M54.1 88.8Q47.7 82.5 51.2 76.1 M345.9 88.8Q352.3 82.5 348.8 76.1 M101.5 50.6Q96.6 43.1 101.4 37.6 M298.5 50.6Q303.4 43.1 298.6 37.6 M148.9 24.3Q145.1 16.1 150.5 11.4 M251.1 24.3Q254.9 16.1 249.5 11.4';
const KNOTS = [[12.5, 125.3], [51.2, 76.1], [101.4, 37.6], [150.5, 11.4], [387.5, 125.3], [348.8, 76.1], [298.6, 37.6], [249.5, 11.4]] as const;

// A slim pinnacle where the arch meets the side (in viewBox units).
function Pinnacle({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x - 4} 205V150M${x + 4} 205V150`} />
      <path d={`M${x - 5} 150L${x} 112L${x + 5} 150Z`} fill='currentColor' fillOpacity='0.25' />
      <path d={`M${x - 3} 138l-3 -2M${x + 3} 138l3 -2M${x - 2} 126l-3 -2M${x + 2} 126l3 -2`} />
      <circle cx={x} cy={108} r={2.2} fill='currentColor' />
    </g>
  );
}

/*
  The card's outline: straight sides that rise into a pointed arch, drawn as
  a fine double line with crockets, a finial at the peak and a pinnacle at
  each shoulder. Drawn in a 400x500 box that matches the portrait's 4:5, so it
  scales without distorting.
*/
function GothicFrame() {
  return (
    <svg viewBox='0 0 400 500' preserveAspectRatio='none' aria-hidden className='pointer-events-none absolute inset-0 size-full overflow-visible text-accent'>
      <g fill='none' stroke='currentColor' strokeWidth='1.5' vectorEffect='non-scaling-stroke' strokeLinecap='round'>
        <path d='M1 500V200C1 95 120 30 200 3C280 30 399 95 399 200V500' vectorEffect='non-scaling-stroke' />
        <path d='M7 500V203C7 101 123 37 200 10C277 37 393 101 393 203V500' stroke='var(--color-bone)' strokeOpacity='0.18' strokeWidth='0.8' vectorEffect='non-scaling-stroke' />
        <path d={CROCKETS} strokeWidth='1.2' vectorEffect='non-scaling-stroke' />
        <Pinnacle x={1} />
        <Pinnacle x={399} />
        <path d='M200 3V-9' vectorEffect='non-scaling-stroke' />
      </g>
      <g fill='currentColor'>
        {KNOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={1.6} />
        ))}
        {/* Finial: a small trefoil at the peak. */}
        <circle cx={200} cy={-13} r={3.2} />
        <circle cx={195.5} cy={-8.5} r={2.4} />
        <circle cx={204.5} cy={-8.5} r={2.4} />
      </g>
    </svg>
  );
}

// The portrait fills the arched window; the ornament stays on the outline.
function Masquerade({ c }: { c: Character }) {
  const Wordmark = c.clan ? CLANS[c.clan].Wordmark : undefined;
  return (
    <div className='vtm-masq flex h-full flex-col drop-shadow-[0_1.5rem_2rem_rgb(0_0_0/0.6)]'>
      <div className='relative aspect-[4/5]'>
        <div aria-hidden className='gothic-arch-outer absolute inset-0 bg-ink/80 backdrop-blur-xl' />
        <div className='gothic-arch absolute inset-x-[9px] top-[12px] bottom-0 overflow-hidden bg-ink'>
          <Portrait c={c} />
          <div aria-hidden className='absolute inset-0 bg-linear-to-t from-ink via-ink/10 to-transparent' />
          <FactionMark
            character={c}
            className='absolute right-3 bottom-3 h-8 max-w-10 text-bone/75 drop-shadow-[0_0_0.75rem_rgb(0_0_0/0.9)] transition-[color,scale] duration-500 ease-(--ease-spring) [--knockout:transparent] group-hover:scale-110 group-hover:text-bone'
          />
        </div>
        <GothicFrame />
      </div>

      {/* Below the arch the outline runs straight down and closes. */}
      <div className='relative flex grow flex-col rounded-b-xl border-x-[1.5px] border-b-[1.5px] border-accent bg-ink/80 px-5 pt-3 pb-4 backdrop-blur-xl'>
        <span aria-hidden className='pointer-events-none absolute inset-x-[5px] top-0 bottom-[5px] rounded-b-lg border-x border-b border-bone/15' />
        {Wordmark ? (
          <Wordmark aria-label={factionName(c)} role='img' className='h-5 w-auto max-w-full self-start text-accent' />
        ) : (
          <p className='text-xs tracking-[0.25em] text-accent uppercase'>{factionName(c)}</p>
        )}
        <h2 className='mt-2 font-display text-3xl leading-tight'>{c.name}</h2>
        <p className='mt-2 text-sm leading-relaxed text-pretty text-bone/65'>{c.description}</p>
        <Footer c={c} />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ Neon Nights

// The metal clips that hold a neon tube to the wall.
function Clip({ className }: { className: string }) {
  return <span aria-hidden className={`absolute z-10 h-[7px] w-4 rounded-[2px] border border-black/60 bg-linear-to-b from-zinc-300 to-zinc-500 shadow-[0_2px_3px_rgb(0_0_0/0.7)] ${className}`} />;
}

function NeonNights({ c }: { c: Character }) {
  const rose = { '--tube': '#ff2e88' } as CSSProperties;
  const violet = { '--tube': '#8b5cf6' } as CSSProperties;
  const cyan = { '--tube': '#22d3ee' } as CSSProperties;
  return (
    <div className='vtm-neon neon-bricks relative flex h-full flex-col overflow-hidden rounded-2xl border border-bone/10 p-5 shadow-[0_1.5rem_3rem_-1.5rem_rgb(0_0_0/0.8)]'>
      {/* Rain on the glass and a wash of street light. */}
      <div aria-hidden className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgb(255_46_136/0.18),transparent_60%),radial-gradient(ellipse_at_10%_100%,rgb(34_211_238/0.12),transparent_55%)]' />
      <div aria-hidden className='pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(100deg,transparent_0_22px,rgb(255_255_255/0.035)_22px_23px)]' />

      <div className='relative m-2 aspect-[3/4]'>
        {/* Outer tube (rose) and inner tube (violet), clipped to the wall. */}
        <div aria-hidden style={rose} className='neon-tube neon-flicker-slow absolute -inset-[10px] rounded-[22px]' />
        <div aria-hidden style={violet} className='neon-tube absolute -inset-[3px] rounded-[16px] opacity-90' />
        <Clip className='-top-[13px] left-[22%]' />
        <Clip className='-top-[13px] right-[22%]' />
        <Clip className='-bottom-[13px] left-[22%]' />
        <Clip className='-bottom-[13px] right-[22%]' />

        <div className='absolute inset-0 overflow-hidden rounded-[14px] bg-black'>
          <Portrait c={c} className='contrast-125 grayscale-[0.4] group-hover:grayscale-0' />
          {/* Duotone wash, scanlines, and a hot edge of light. */}
          <div aria-hidden className='absolute inset-0 bg-linear-to-br from-[#ff2e88]/45 via-transparent to-[#22d3ee]/35 mix-blend-color' />
          <div aria-hidden className='absolute inset-0 bg-[repeating-linear-gradient(0deg,rgb(0_0_0/0.22)_0_1px,transparent_1px_3px)]' />
          <div aria-hidden className='absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent' />
          <FactionMark
            character={c}
            className='absolute top-3 right-3 h-8 max-w-10 text-[#ff8dc0] drop-shadow-[0_0_8px_#ff2e88] [--knockout:transparent]'
          />
        </div>
      </div>

      {/* The name as a neon sign, with its reflection on the wet ground. */}
      <div className='relative mt-8 text-center'>
        <p style={cyan} className='neon-text neon-flicker-late text-[0.7rem] tracking-[0.4em] uppercase'>
          {factionName(c) || 'Kindred'}
        </p>
        <h2 style={rose} className='neon-text mt-1 font-display text-4xl leading-tight italic'>
          {c.name}
        </h2>
        <p aria-hidden style={rose} className='neon-text pointer-events-none -mt-2 h-6 scale-y-[-1] overflow-hidden font-display text-4xl leading-tight italic opacity-15 blur-[2px] [mask-image:linear-gradient(to_top,black,transparent)]'>
          {c.name}
        </p>
      </div>
      <div className='relative flex grow flex-col'>
        <p className='text-sm leading-relaxed text-pretty text-pink-100/70'>{c.description}</p>
        <Footer c={c} />
      </div>
    </div>
  );
}

export default function VampireCard({ character: c, style }: { character: Character; style?: CSSProperties }) {
  return (
    <article style={style} className='group relative h-full transition-[translate] duration-500 ease-(--ease-out-expo) hover:-translate-y-1'>
      <Masquerade c={c} />
      <NeonNights c={c} />
    </article>
  );
}
