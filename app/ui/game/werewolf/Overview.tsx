import Link from 'next/link';
import type { CSSProperties } from 'react';
import { MdAdd } from 'react-icons/md';
import { GiWolfHowl } from 'react-icons/gi';
import PageHeader from '@/app/ui/kit/PageHeader';
import Stagger from '@/app/ui/kit/Stagger';
import { panel, buttonPrimary } from '@/app/ui/kit/styles';
import { AUSPICES, glyphUrl } from '@/app/lib/factions';

// Each auspice is born under a moon phase: new moon (Ragabash) to full (Ahroun).
const PHASE: Record<(typeof AUSPICES)[number], number> = { Ragabash: 0, Theurge: 0.25, Philodox: 0.5, Galliard: 0.75, Ahroun: 1 };

function Moon({ lit }: { lit: number }) {
  // A lit disc with a shadow disc slid across it.
  return (
    <span className='relative block size-10 overflow-hidden rounded-full bg-bone/90 shadow-[0_0_1.25rem_-0.25rem_var(--color-bone)]'>
      <span
        className='absolute inset-0 rounded-full bg-ink'
        style={{ translate: `${lit * 100}% 0`, opacity: lit === 1 ? 0 : 1 }}
      />
    </span>
  );
}

// The top of Werewolf's vault: the moons the auspices are born under.
export default function WerewolfOverview() {
  return (
    <div className='flex flex-col gap-10'>
      <PageHeader
        eyebrow='Your vault'
        title='The moon is up.'
        description='Your pack and your Rage, all in one place. Pick up a draft or roll before the hunt.'
        actions={
          <>
            <Link href='/vault/werewolf/new' className={buttonPrimary}>
              <MdAdd aria-hidden className='size-4 transition-transform duration-300 group-hover:rotate-90' />
              New Garou
            </Link>
          </>
        }
      />

      <section aria-label='Auspices' className={`p-5 ${panel}`}>
        <Stagger as='ul' className='grid grid-cols-5 gap-2'>
          {AUSPICES.map((a) => {
            const url = `url(${glyphUrl(a)})`;
            return (
              <li key={a} className='group flex flex-col items-center gap-3 rounded-xl py-3 text-center transition-colors duration-500 hover:bg-bone/[0.05]'>
                <Moon lit={PHASE[a]} />
                <span
                  aria-hidden
                  className='size-8 bg-bone/50 transition duration-500 ease-(--ease-spring) [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] group-hover:scale-110 group-hover:bg-accent'
                  style={{ maskImage: url, WebkitMaskImage: url } as CSSProperties}
                />
                <span className='font-display text-[0.55rem] text-bone/70 uppercase md:text-sm md:tracking-[0.15em]'>{a}</span>
              </li>
            );
          })}
        </Stagger>
      </section>

      <section className={`flex flex-col items-center gap-3 p-8 text-center ${panel}`}>
        <GiWolfHowl aria-hidden className='size-10 text-accent/80' />
        <h2 className='font-display text-2xl'>No caerns marked yet</h2>
        <p className='max-w-[44ch] text-sm leading-relaxed text-bone/60'>
          Caerns, patron spirits and the pack&apos;s chronicle will live here, next to every Garou&apos;s sheet.
        </p>
        <span className='mt-2 rounded-full border border-bone/15 px-3 py-1 text-[0.65rem] tracking-[0.2em] text-bone/45 uppercase'>Coming soon</span>
      </section>
    </div>
  );
}
