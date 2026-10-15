import Image from 'next/image';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';
import type { Character } from '@/app/lib/sample-characters';

/*
  Hunter's character cards. Both scenes are rendered and the theme shows one
  (.htr-cabin / .htr-city in app/games.css): an evidence bag in the cabin, an
  instant photo with a strip of tape in the city.
*/

// A stable evidence number from the slug, so a file keeps its number.
function evidenceNumber(slug: string) {
  let n = 0;
  for (const ch of slug) n = (n * 31 + ch.charCodeAt(0)) % 9000;
  return `EV-${String(1000 + n)}`;
}

function Portrait({ c, className = '' }: { c: Character; className?: string }) {
  return (
    <Image
      src={c.image.src}
      unoptimized={c.image.unoptimized}
      width={c.image.width}
      height={c.image.height}
      alt={`Portrait of ${c.name}.`}
      sizes='(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 22rem'
      className={`size-full object-cover object-top ${className}`}
    />
  );
}

const openLink =
  'group/link inline-flex items-center gap-1.5 text-sm text-bone/85 transition-colors after:absolute after:inset-0 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent';

// ------------------------------------------------------------------- The cabin

function EvidenceBag({ c }: { c: Character }) {
  const number = evidenceNumber(c.slug);
  return (
    <article className='group relative flex flex-col transition-[translate] duration-500 ease-(--ease-out-expo) hover:-translate-y-1'>
      {/* The bag: clear plastic, a ribbed heat seal along the top with a hanging hole. */}
      <div className='relative overflow-hidden rounded-[0.3rem] border border-white/20 bg-[linear-gradient(160deg,rgb(255_255_255/0.1),rgb(255_255_255/0.025)_45%,rgb(255_255_255/0.07))] shadow-[0_1.5rem_2.5rem_-1rem_rgb(0_0_0/0.9),inset_0_0_1.5rem_rgb(255_255_255/0.05)]'>
        <div aria-hidden className='frame-ornament relative h-9 border-b border-white/15 bg-[repeating-linear-gradient(90deg,rgb(255_255_255/0.13)_0_2px,transparent_2px_5px)]'>
          <span className='absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0c0805] shadow-[inset_0_1px_3px_rgb(0_0_0/0.9),0_0_0_1.5px_rgb(255_255_255/0.22)]' />
        </div>

        {/* The portrait, behind the plastic. The sheen only grazes its edges and one soft diagonal. */}
        <div className='relative mx-3 mt-3 aspect-[4/5] overflow-hidden bg-black'>
          <Portrait c={c} className='sepia-[0.15] transition-[scale] duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-105' />
          <div aria-hidden className='frame-ornament pointer-events-none absolute inset-0 bg-[linear-gradient(112deg,transparent_28%,rgb(255_255_255/0.11)_36%,rgb(255_255_255/0.02)_44%,transparent_58%)]' />
          <div aria-hidden className='frame-ornament pointer-events-none absolute inset-y-0 left-0 w-2.5 bg-linear-to-r from-white/20 to-transparent' />
          <div aria-hidden className='frame-ornament pointer-events-none absolute inset-y-0 right-0 w-2 bg-linear-to-l from-white/10 to-transparent' />
          {c.status === 'draft' && <span className='absolute top-2 left-2 bg-black/70 px-2 py-0.5 text-[0.65rem] tracking-[0.2em] text-bone/85 uppercase'>Draft</span>}
        </div>

        {/* The label strip: red stripes along its edges, then name, creed and evidence number. */}
        <div className='relative mt-3 bg-[#eee6d3] text-[#241a12] shadow-[0_-0.25rem_0.75rem_rgb(0_0_0/0.35)]'>
          <div aria-hidden className='h-2 bg-[repeating-linear-gradient(135deg,#b3151b_0_7px,#eee6d3_7px_12px)]' />
          <div className='flex items-end justify-between gap-3 px-3 py-2'>
            <div className='min-w-0'>
              <h2 className='truncate font-display text-xl leading-tight'>{c.name}</h2>
              <p className='truncate text-[0.7rem] tracking-[0.18em] uppercase opacity-70'>{c.faction}</p>
            </div>
            <div className='shrink-0 text-right'>
              <div aria-hidden className='ml-auto h-3 w-14 bg-[repeating-linear-gradient(90deg,#241a12_0_1px,transparent_1px_3px,#241a12_3px_5px,transparent_5px_6px)] opacity-70' />
              <p className='mt-0.5 font-mono text-[0.7rem] tracking-wider'>{number}</p>
            </div>
          </div>
          <div aria-hidden className='h-1.5 bg-[#b3151b]' />
        </div>
        <div className='h-3' />
      </div>

      <div className='flex items-center justify-between gap-3 px-1 pt-3'>
        <Link href={`/vault/hunter/characters/${c.slug}`} className={openLink}>
          Open file
          <MdArrowOutward aria-hidden className='transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5' />
        </Link>
        <span className='text-[0.65rem] tracking-[0.2em] text-bone/40 uppercase'>{c.status === 'draft' ? 'Open' : 'Verified'}</span>
      </div>
    </article>
  );
}

// -------------------------------------------------------------------- The city

// A little tilt per photo, so the stack never looks ruled.
const TILTS = [-2.2, 1.6, -0.9, 2.4, -1.7, 1.1];

function Snapshot({ c, index }: { c: Character; index: number }) {
  const tilt = TILTS[index % TILTS.length];
  const number = evidenceNumber(c.slug);
  return (
    <article
      className='group relative flex flex-col transition-[rotate,translate] duration-500 ease-(--ease-spring) hover:-translate-y-1.5 hover:rotate-0!'
      style={{ rotate: `${tilt}deg` }}
    >
      {/* A strip of tape holds it up. */}
      <span aria-hidden className='tape' style={{ top: -11, left: '50%', width: 84, rotate: `${-tilt * 2 - 2}deg`, translate: '-50% 0' }} />
      <div className='relative bg-[#f1ece0] px-3 pt-3 pb-4 text-[#1d1a16] shadow-[0_1.25rem_1.75rem_-0.75rem_rgb(0_0_0/0.85),0_0_0_1px_rgb(0_0_0/0.25)]'>
        <div className='relative aspect-[4/5] overflow-hidden bg-[#1a1612] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.25)]'>
          <Portrait c={c} className='saturate-[0.75] contrast-[1.05] transition-[scale] duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-105' />
          {c.status === 'draft' && <span className='absolute top-2 left-2 bg-black/70 px-2 py-0.5 text-[0.65rem] tracking-[0.2em] text-bone/85 uppercase'>Draft</span>}
        </div>
        {/* Handwritten caption under the picture. */}
        <p className='mt-3 truncate text-center font-hand text-3xl leading-none'>{c.name}</p>
        <p className='mt-1.5 flex items-center justify-between gap-2 text-[0.65rem] tracking-[0.18em] uppercase opacity-60'>
          <span className='truncate'>{c.faction}</span>
          <span className='shrink-0 font-mono tracking-wider'>{number}</span>
        </p>
      </div>
      <div className='flex items-center justify-between gap-3 px-1 pt-4'>
        <Link href={`/vault/hunter/characters/${c.slug}`} className={openLink}>
          Open file
          <MdArrowOutward aria-hidden className='transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5' />
        </Link>
        <span className='text-[0.65rem] tracking-[0.2em] text-bone/40 uppercase'>{c.status === 'draft' ? 'Open' : 'Verified'}</span>
      </div>
    </article>
  );
}

export default function HunterCards({ files }: { files: Character[] }) {
  const grid = 'grid gap-x-6 gap-y-9 sm:grid-cols-2 xl:grid-cols-3';
  return (
    <>
      <ul className={`htr-cabin ${grid}`}>
        {files.map((c) => (
          <li key={c.slug}>
            <EvidenceBag c={c} />
          </li>
        ))}
      </ul>
      <ul className={`htr-city ${grid}`}>
        {files.map((c, i) => (
          <li key={c.slug} className='pt-3'>
            <Snapshot c={c} index={i} />
          </li>
        ))}
      </ul>
    </>
  );
}
