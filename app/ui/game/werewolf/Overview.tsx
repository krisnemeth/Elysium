import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { MdAdd } from 'react-icons/md';
import { GiD10, GiPawPrint, GiWolfHowl } from 'react-icons/gi';
import PageHeader from '@/app/ui/kit/PageHeader';
import Stagger from '@/app/ui/kit/Stagger';
import EmptyState from '@/app/ui/kit/EmptyState';
import { panel, buttonPrimary, buttonGhost } from '@/app/ui/kit/styles';
import type { Character } from '@/app/lib/sample-characters';
import { AUSPICES, glyphUrl } from '@/app/lib/factions';
import { FactionMark } from '@/app/ui/game/FactionMark';

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

export default function WerewolfOverview({ characters: pack }: { characters: Character[] }) {
  const drafts = pack.filter((c) => c.status === 'draft').length;

  return (
    <div className='flex flex-col gap-10'>
      <PageHeader
        eyebrow='Werewolf · The pack'
        title='The moon is up.'
        description='Your pack, your caerns and your Rage, all in one place. Pick up a draft or roll before the hunt.'
        actions={
          <>
            <Link href='/vault/werewolf/new' className={buttonPrimary}>
              <MdAdd aria-hidden className='size-4 transition-transform duration-300 group-hover:rotate-90' />
              New Garou
            </Link>
            <Link href='/vault/werewolf/dice' className={buttonGhost}>
              <GiD10 aria-hidden className='size-4 transition-transform duration-500 ease-(--ease-spring) group-hover:rotate-180' />
              Roll with Rage
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

      <section aria-labelledby='pack-title'>
        <div className='flex items-baseline justify-between'>
          <h2 id='pack-title' className='font-display text-3xl'>The pack</h2>
          <Link href='/vault/werewolf/characters' className='text-xs tracking-[0.2em] text-bone/55 uppercase transition-colors hover:text-bone'>
            {pack.length} Garou · {drafts} draft{drafts === 1 ? '' : 's'}
          </Link>
        </div>
        {pack.length === 0 ? (
          <div className='mt-6'>
            <EmptyState icon={<GiPawPrint aria-hidden />} title='No Garou answer the howl.' action={{ href: '/vault/werewolf/new', label: 'Create your first Garou' }}>
              Your pack is empty. Bring the first wolf in; their sheet saves as you go.
            </EmptyState>
          </div>
        ) : (
          <Stagger as='ul' className='mt-6 flex flex-wrap justify-center gap-10 md:justify-start'>
            {pack.map((c) => (
              <li key={c.slug}>
                <Link href={`/vault/werewolf/characters/${c.slug}`} className='group flex w-40 flex-col items-center text-center focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent'>
                  <span className='relative block'>
                    <span className='block size-36 overflow-hidden rounded-full ring-2 ring-bone/15 transition duration-700 ease-(--ease-out-expo) group-hover:-translate-y-2 group-hover:shadow-[0_0_2.5rem_-0.25rem_var(--accent)] group-hover:ring-accent'>
                      <Image src={c.image.src} unoptimized={c.image.unoptimized} width={288} height={384} alt={`Portrait of ${c.name}.`} className='size-full object-cover transition-transform duration-1000 group-hover:scale-110' />
                    </span>
                    <span className='absolute -right-1 bottom-1 grid size-11 place-items-center rounded-full bg-ink ring-1 ring-bone/20'>
                      <FactionMark character={c} className='size-7 text-accent' />
                    </span>
                  </span>
                  <span className='mt-4 font-display text-lg leading-tight'>{c.name}</span>
                  <span className='text-[0.65rem] tracking-[0.2em] text-bone/50 uppercase'>
                    {c.faction}
                    {c.status === 'draft' && ' · draft'}
                  </span>
                </Link>
              </li>
            ))}
          </Stagger>
        )}
      </section>

      <section className={`flex flex-col items-center gap-3 p-8 text-center ${panel}`}>
        <GiWolfHowl aria-hidden className='size-10 text-accent/80' />
        <h2 className='font-display text-2xl'>No caerns marked yet</h2>
        <p className='max-w-[44ch] text-sm leading-relaxed text-bone/60'>
          Caerns, totems and the pack&apos;s chronicle will live here, next to every Garou&apos;s sheet.
        </p>
        <span className='mt-2 rounded-full border border-bone/15 px-3 py-1 text-[0.65rem] tracking-[0.2em] text-bone/45 uppercase'>Coming soon</span>
      </section>
    </div>
  );
}
