import Image from 'next/image';
import Link from 'next/link';
import Stagger from '@/app/ui/kit/Stagger';
import { panel } from '@/app/ui/kit/styles';
import type { Character } from '@/app/lib/sample-characters';
import { FactionMark } from '@/app/ui/game/FactionMark';

// A sprig of leaves on the arch's shoulder (moonlit forest only).
function Sprig({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox='0 0 60 40' aria-hidden className={`wta-leaves absolute top-[24%] z-10 w-20 text-[#7fa86c] drop-shadow-[0_2px_3px_rgb(0_0_0/0.8)] ${flip ? '-right-8 -scale-x-100' : '-left-8'}`}>
      <path d='M4 34C18 28 30 20 44 6' fill='none' stroke='currentColor' strokeWidth='1.8' />
      <g fill='#5f8f52'>
        <ellipse cx='16' cy='26' rx='7' ry='2.8' transform='rotate(-55 16 26)' />
        <ellipse cx='22' cy='29' rx='7' ry='2.8' transform='rotate(15 22 29)' />
        <ellipse cx='28' cy='17' rx='7' ry='2.8' transform='rotate(-60 28 17)' />
        <ellipse cx='35' cy='20' rx='7' ry='2.8' transform='rotate(10 35 20)' />
        <ellipse cx='42' cy='8' rx='6' ry='2.4' transform='rotate(-40 42 8)' />
      </g>
    </svg>
  );
}

// Three claw marks raked across the corner on hover.
function Claws() {
  return (
    <span aria-hidden className='pointer-events-none absolute top-3 right-4 z-10 flex rotate-[24deg] gap-2'>
      {[0, 1, 2].map((i) => (
        <span key={i} className='claw-mark block h-16 w-[3px] rounded-full bg-linear-to-b from-transparent via-accent to-transparent shadow-[0_0_8px_var(--accent)]' style={{ marginTop: `${i * 6}px` }} />
      ))}
    </span>
  );
}

// A ring of short marks around the tribe glyph.
function GlyphRing() {
  return (
    <svg viewBox='0 0 100 100' aria-hidden className='absolute inset-0 size-full text-bone/50 transition-transform duration-[1.5s] ease-(--ease-out-expo) group-hover:rotate-45'>
      <circle cx='50' cy='50' r='46' fill='none' stroke='currentColor' strokeWidth='1.5' />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1='50' y1='2' x2='50' y2={i % 3 === 0 ? 12 : 8} stroke='currentColor' strokeWidth={i % 3 === 0 ? 2.5 : 1.5} transform={`rotate(${i * 30} 50 50)`} />
      ))}
    </svg>
  );
}

// A small fang-and-line divider under the name.
function Divider() {
  return (
    <span aria-hidden className='mx-auto mt-3 flex w-40 items-center gap-2 text-accent'>
      <span className='h-px grow bg-linear-to-r from-transparent to-accent/60' />
      <svg viewBox='0 0 24 12' className='h-3 w-6'>
        <path d='M2 1L7 11L12 3L17 11L22 1' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinejoin='round' />
      </svg>
      <span className='h-px grow bg-linear-to-l from-transparent to-accent/60' />
    </span>
  );
}

// The pack: tall portraits in arched, cave-mouth frames.
export default function Pack({ members }: { members: Character[] }) {
  return (
    <Stagger className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
      {members.map((c) => (
        <article key={c.slug} className={`group relative flex flex-col overflow-hidden p-5 transition-[translate,box-shadow] duration-700 ease-(--ease-out-expo) hover:-translate-y-1.5 hover:shadow-[0_2rem_4rem_-1.5rem_var(--accent)] ${panel}`}>
          <Claws />
          <div className='relative mx-3 mt-3'>
            {/* Moon rising behind the arch. */}
            <span aria-hidden className='absolute -top-6 left-1/2 size-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(236_232_225/0.35),transparent_68%)] transition-opacity duration-700 group-hover:opacity-100 opacity-60' />
            {/* Carved double arch. */}
            <span aria-hidden className='absolute -inset-[9px] rounded-t-[999px] rounded-b-[22px] border border-bone/25' />
            <span aria-hidden className='absolute -inset-[4px] rounded-t-[999px] rounded-b-[19px] border-2 border-accent/45 shadow-[0_0_1.25rem_-0.25rem_var(--accent)]' />
            <Sprig />
            <Sprig flip />
            <div className='relative overflow-hidden rounded-t-[999px] rounded-b-2xl'>
              <Image src={c.image.src} unoptimized={c.image.unoptimized} width={c.image.width} height={c.image.height} alt={`Portrait of ${c.name}.`} sizes='(max-width: 640px) 100vw, 22rem' className='aspect-[3/4] w-full object-cover transition duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-105' />
              <div className='absolute inset-0 bg-linear-to-t from-ink via-transparent to-transparent' />
              {c.status === 'draft' && (
                <span className='absolute top-1/4 left-4 rounded-full border border-bone/20 bg-ink/60 px-3 py-1 text-[0.65rem] tracking-[0.2em] uppercase backdrop-blur-md'>Draft</span>
              )}
              <span className='absolute bottom-3 left-1/2 grid size-[4.5rem] -translate-x-1/2 place-items-center'>
                <GlyphRing />
                <FactionMark character={c} className='relative size-11 text-bone/85 drop-shadow-[0_0_0.75rem_rgb(0_0_0/0.9)] transition duration-500 ease-(--ease-spring) group-hover:scale-110 group-hover:text-accent' />
              </span>
            </div>
          </div>
          <div className='mt-5 text-center'>
            <h2 className='font-display text-2xl'>{c.name}</h2>
            <p className='mt-1 text-[0.65rem] tracking-[0.25em] text-accent uppercase'>{c.faction}</p>
            <Divider />
            <p className='mt-3 text-sm leading-relaxed text-pretty text-bone/65'>{c.description}</p>
            <Link href={`/vault/werewolf/characters/${c.slug}`} className='mt-4 inline-block text-sm text-bone transition-colors after:absolute after:inset-0 hover:text-accent'>
              Open sheet &rarr;
            </Link>
          </div>
        </article>
      ))}
    </Stagger>
  );
}
