import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Stagger from '@/app/ui/kit/Stagger';
import Headline from '../../_app/Headline';
import study from '@/public/art/sheet-study.webp';
import lore from '@/public/art/lore-dark.webp';

export const metadata: Metadata = { title: 'Paperwork' };

function Plate({ src, sealed = false }: { src: typeof study; sealed?: boolean }) {
  return (
    <div className='relative aspect-[16/10] overflow-hidden bg-night'>
      <Image src={src} alt='' placeholder='blur' sizes='(max-width: 1024px) 100vw, 40rem' className='size-full object-cover brightness-150 contrast-110 grayscale transition duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-105 group-hover:grayscale-0' />
      <div className={`absolute inset-0 bg-blood mix-blend-multiply transition-opacity duration-700 ${sealed ? 'opacity-50' : 'opacity-55 group-hover:opacity-0'}`} />
    </div>
  );
}

export default function Paperwork() {
  return (
    <div className='flex flex-col gap-14'>
      <Headline kicker='Paperwork' title='What are we filing tonight?' lead='Every Kindred has two records: the numbers on the sheet, and the story behind them.' />
      <Stagger className='grid gap-10 lg:grid-cols-2'>
        <Link href='/concept/dashboard/sheets/create' className='group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blood'>
          <Plate src={study} />
          <p className='mt-5 font-c-mono text-xs tracking-[0.25em] text-blood uppercase'>Exhibit A</p>
          <h2 className='mt-2 font-c-serif text-5xl leading-none'>Character sheet</h2>
          <p className='mt-4 max-w-[48ch] leading-relaxed text-paper/65'>Stats, skills, disciplines, merits, flaws and every tracker you mark during play.</p>
          <span className='mt-5 inline-block border-b border-paper/40 pb-1 font-c-mono text-xs tracking-[0.2em] text-paper/80 uppercase transition-colors group-hover:border-blood group-hover:text-paper'>
            Open a new file &rarr;
          </span>
        </Link>
        <div aria-disabled className='relative'>
          <Plate src={lore} sealed />
          <span aria-hidden className='pointer-events-none absolute top-8 right-6 rotate-[-8deg] border-4 border-blood px-4 py-1 font-c-sans text-4xl font-black tracking-[0.1em] text-blood uppercase [font-variation-settings:"wdth"_62]'>
            Sealed
          </span>
          <p className='mt-5 font-c-mono text-xs tracking-[0.25em] text-blood uppercase'>Exhibit B</p>
          <h2 className='mt-2 font-c-serif text-5xl leading-none'>Loresheet</h2>
          <p className='mt-4 space-y-2'>
            <span className='block max-w-[48ch] leading-relaxed text-paper/65'>Backstory, Embrace, lovers and ghouls.</span>
            <span aria-hidden className='block h-3.5 w-3/4 bg-paper' />
            <span aria-hidden className='block h-3.5 w-1/2 bg-paper' />
          </p>
          <span className='mt-5 inline-block font-c-mono text-xs tracking-[0.2em] text-paper/40 uppercase'>Coming soon</span>
        </div>
      </Stagger>
    </div>
  );
}
