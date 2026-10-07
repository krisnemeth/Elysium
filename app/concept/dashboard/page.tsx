import type { Metadata } from 'next';
import Link from 'next/link';
import Stagger from '@/app/ui/kit/Stagger';
import MaskedPortrait from '../_components/MaskedPortrait';
import Headline from '../_app/Headline';
import { cButton, cLink, fileNo } from '../_app/styles';
import { CHARACTERS as ALL } from '@/app/lib/sample-characters';

const CHARACTERS = ALL.filter((c) => c.game === 'vampire');
import { CLANS } from '@/app/lib/clans';

export const metadata: Metadata = { title: 'Case board' };

export default function Board() {
  const closed = CHARACTERS.filter((c) => c.status === 'finished');
  const open = CHARACTERS.filter((c) => c.status === 'draft');

  return (
    <div className='flex flex-col gap-16'>
      <Headline
        kicker='Case board &mdash; tonight'
        title={<>Your coterie, <span className='font-c-serif font-normal text-blood normal-case italic [font-variation-settings:normal]'>on file.</span></>}
        lead='Eight Kindred, two files still open. Finish a draft, open a new file or roll before the session.'
        aside={
          <div className='flex flex-wrap items-center gap-5'>
            <Link href='/concept/dashboard/sheets/create' className={cButton}>
              Open a new file <span className='transition-transform group-hover:translate-x-1'>&rarr;</span>
            </Link>
            <Link href='/concept/dashboard/dice' className={cLink}>Roll the bones</Link>
          </div>
        }
      />

      <Stagger as='section' className='grid grid-cols-3 border-y border-paper/15'>
        {[
          [closed.length, 'Closed files'],
          [open.length, 'Open files'],
          [0, 'Loresheets'],
        ].map(([value, label]) => (
          <div key={label} className='flex flex-col gap-1 border-r border-paper/15 px-4 py-6 last:border-r-0 md:flex-row md:items-baseline md:gap-4 md:px-8'>
            <span className='font-c-serif text-5xl md:text-7xl'>{value}</span>
            <span className='font-c-mono text-[0.6rem] tracking-[0.2em] text-paper/50 uppercase md:text-xs'>{label}</span>
          </div>
        ))}
      </Stagger>

      <div className='grid gap-12 lg:grid-cols-12'>
        <section aria-labelledby='closed-title' className='lg:col-span-7'>
          <h2 id='closed-title' className='font-c-mono text-xs tracking-[0.25em] text-blood uppercase'>Closed files</h2>
          <Stagger as='ol' className='mt-4 border-t border-paper/15'>
            {closed.map((c) => {
              const { Symbol, name: clan } = CLANS[c.clan!];
              return (
                <li key={c.slug} className='group relative overflow-hidden border-b border-paper/15 transition-colors duration-500 hover:text-chalk'>
                  <div className='absolute inset-0 origin-left scale-x-0 bg-blood transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-x-100' />
                  <Link href='/concept/dashboard/characters' className='relative grid grid-cols-[5.5rem_1fr_auto] items-center gap-4 py-4 focus-visible:outline-2 focus-visible:outline-blood'>
                    <span className='font-c-mono text-[0.65rem] text-paper/40 transition-colors group-hover:text-chalk/70'>{fileNo(CHARACTERS.indexOf(c))}</span>
                    <span>
                      <span className='block font-c-serif text-3xl leading-none transition-transform duration-500 group-hover:translate-x-2'>{c.name}</span>
                      <span className='mt-1 block font-c-mono text-[0.65rem] tracking-[0.2em] text-paper/50 uppercase transition-colors group-hover:text-chalk/70'>{clan}</span>
                    </span>
                    <Symbol aria-hidden className='h-8 w-auto max-w-10 text-paper/40 [--knockout:transparent] transition-colors group-hover:text-chalk' />
                  </Link>
                </li>
              );
            })}
          </Stagger>
        </section>

        <div className='flex flex-col gap-12 lg:col-span-5'>
          <section aria-labelledby='open-title'>
            <h2 id='open-title' className='font-c-mono text-xs tracking-[0.25em] text-blood uppercase'>Open files</h2>
            <Stagger className='mt-4 grid grid-cols-2 gap-4'>
              {open.map((c) => (
                <Link key={c.slug} href='/concept/dashboard/sheets/create' className='group relative block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blood'>
                  <MaskedPortrait src={c.image.src} width={c.image.width} height={c.image.height} alt={`Portrait of ${c.name}.`} sizes='14rem' className='aspect-[3/4]' />
                  <span aria-hidden className='pointer-events-none absolute top-3 -right-2 rotate-6 border-2 border-blood bg-night/70 px-2 py-0.5 font-c-sans text-sm font-black tracking-[0.1em] text-blood uppercase [font-variation-settings:"wdth"_62]'>
                    Draft
                  </span>
                  <span className='mt-2 block font-c-serif text-2xl leading-tight'>{c.name}</span>
                  <span className='font-c-mono text-[0.6rem] tracking-[0.2em] text-paper/50 uppercase'>Continue &rarr;</span>
                </Link>
              ))}
            </Stagger>
          </section>

          <section aria-labelledby='lore-title' className='border border-paper/20 p-6'>
            <h2 id='lore-title' className='font-c-mono text-xs tracking-[0.25em] text-blood uppercase'>Loresheets</h2>
            <p className='mt-4 font-c-serif text-3xl leading-tight'>Sealed until further notice.</p>
            <p className='mt-3 space-y-2 text-sm text-paper/60'>
              <span className='block'>Histories, lovers and grudges will be filed here.</span>
              <span aria-hidden className='block h-3 w-4/5 bg-paper' />
              <span aria-hidden className='block h-3 w-2/3 bg-paper' />
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
