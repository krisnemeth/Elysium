import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { MdArrowOutward } from 'react-icons/md';
import { CLANS } from '@/app/lib/clans';
import type { Character } from '@/app/lib/sample-characters';
import { FactionMark, factionName } from '@/app/ui/game/FactionMark';
import CharacterCard from './CharacterCard';

/*
  Vampire character cards. Both looks are rendered; the theme shows one
  (app/games.css): Masquerade is an arch-shaped card, Neon Nights the
  original rectangular card.
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

/*
  The card's outline: straight sides that rise into a pointed arch, drawn as
  a fine double line with crockets and a finial at the peak. Drawn in a 400x500 box that matches the portrait's 4:5, so it
  scales without distorting.
*/
function GothicFrame() {
  return (
    <svg viewBox='0 0 400 500' preserveAspectRatio='none' aria-hidden className='pointer-events-none absolute inset-0 size-full overflow-visible text-accent'>
      <g fill='none' stroke='currentColor' strokeWidth='1.5' vectorEffect='non-scaling-stroke' strokeLinecap='round'>
        <path d='M1 500V200C1 95 120 30 200 3C280 30 399 95 399 200V500' vectorEffect='non-scaling-stroke' />
        <path d='M7 500V203C7 101 123 37 200 10C277 37 393 101 393 203V500' stroke='var(--color-bone)' strokeOpacity='0.18' strokeWidth='0.8' vectorEffect='non-scaling-stroke' />
        <path className='frame-ornament' d={CROCKETS} strokeWidth='1.2' vectorEffect='non-scaling-stroke' />
        <path className='frame-ornament' d='M200 3V-9' vectorEffect='non-scaling-stroke' />
      </g>
      <g fill='currentColor' className='frame-ornament'>
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

export default function VampireCard({ character: c, style }: { character: Character; style?: CSSProperties }) {
  return (
    <article style={style} className='group relative h-full transition-[translate] duration-500 ease-(--ease-out-expo) hover:-translate-y-1'>
      <Masquerade c={c} />
      {/* Neon Nights keeps the original card (the sidebar carries the neon). */}
      <div className='vtm-neon h-full'>
        <CharacterCard character={c} />
      </div>
    </article>
  );
}
