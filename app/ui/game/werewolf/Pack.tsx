import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import Stagger from '@/app/ui/kit/Stagger';
import { panel } from '@/app/ui/kit/styles';
import type { Character } from '@/app/lib/sample-characters';
import { glyphUrl } from '@/app/lib/factions';
import { FactionMark } from '@/app/ui/game/FactionMark';

/*
  The pack. Each theme gives the card its own silhouette (app/games.css, "Werewolf cards"):
  in the moonlit forest a tall oval, a gap in the canopy, ringed by the auspice's moon phase;
  in the cave a standing stone with the tribe's glyph carved at its head.
*/

// How much of the moon is lit for each auspice (the share of the ring), and its name.
const MOON: Record<string, { lit: number; phase: string }> = {
  Ragabash: { lit: 0, phase: 'new moon' },
  Theurge: { lit: 25, phase: 'crescent moon' },
  Philodox: { lit: 50, phase: 'half moon' },
  Galliard: { lit: 75, phase: 'gibbous moon' },
  Ahroun: { lit: 100, phase: 'full moon' },
};

// A thin ring around the oval; the lit part runs up the right-hand side, as a waxing moon does.
function MoonRing({ auspice }: { auspice?: string }) {
  const moon = auspice ? MOON[auspice] : undefined;
  const label = moon ? `${auspice}: ${moon.phase}` : undefined;
  // Start at the bottom and run anticlockwise through the right-hand side to the top and round.
  const d = 'M50 133A49 66 0 1 0 50 1A49 66 0 1 0 50 133';
  return (
    <svg
      viewBox='0 0 100 134'
      preserveAspectRatio='none'
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className='ww-ring pointer-events-none absolute inset-0 size-full overflow-visible'
    >
      <path d={d} pathLength={100} className='ww-ring-track' />
      {moon && moon.lit > 0 && <path d={d} pathLength={100} className='ww-ring-lit' strokeDasharray={`${moon.lit} ${100 - moon.lit}`} />}
    </svg>
  );
}

export default function Pack({ members }: { members: Character[] }) {
  return (
    <Stagger className='grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3'>
      {members.map((c) => {
        const url = `url(${glyphUrl(c.faction)})`;
        return (
          <article key={c.slug} className={`ww-card group relative flex flex-col transition-[translate,filter] duration-700 ease-(--ease-out-expo) hover:-translate-y-1.5 ${panel}`}>
            <div className='ww-stone flex grow flex-col p-4'>
              {/* The cave: the tribe's glyph, carved at the stone's head. */}
              <div aria-hidden className='ww-petroglyph'>
                <span className='ww-petroglyph-mark' style={{ maskImage: url, WebkitMaskImage: url } as CSSProperties} />
              </div>
              <div className='ww-figure relative'>
                <MoonRing auspice={c.auspice} />
                <div className='ww-photo relative overflow-hidden rounded-2xl'>
                  <Image src={c.image.src} unoptimized={c.image.unoptimized} width={c.image.width} height={c.image.height} alt={`Portrait of ${c.name}.`} sizes='(max-width: 640px) 100vw, 22rem' className='aspect-[3/4] w-full object-cover transition duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-105' />
                  <div className='absolute inset-0 bg-linear-to-t from-ink via-transparent to-transparent' />
                  {c.status === 'draft' && (
                    <span className='ww-draft absolute top-1/4 left-4 rounded-full border border-bone/20 bg-ink/60 px-3 py-1 text-[0.65rem] tracking-[0.2em] uppercase backdrop-blur-md'>Draft</span>
                  )}
                  <FactionMark character={c} className='ww-mark absolute bottom-4 left-1/2 size-14 -translate-x-1/2 text-bone/85 drop-shadow-[0_0_0.75rem_rgb(0_0_0/0.9)] transition duration-500 ease-(--ease-spring) group-hover:scale-110 group-hover:text-accent' />
                </div>
              </div>
              <div className='mt-4 text-center'>
                <h2 className='font-display text-2xl'>{c.name}</h2>
                <p className='mt-1 text-[0.65rem] tracking-[0.25em] text-accent uppercase'>
                  {c.faction}
                  {c.auspice && ` · ${c.auspice}`}
                </p>
                <p className='mt-3 text-sm leading-relaxed text-pretty text-bone/65'>{c.description}</p>
                <Link href={`/vault/werewolf/characters/${c.slug}`} className='mt-4 inline-block text-sm text-bone transition-colors hover:text-accent'>
                  Open sheet &rarr;
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </Stagger>
  );
}
