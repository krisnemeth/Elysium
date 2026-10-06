import type { Metadata } from 'next';
import Link from 'next/link';
import Stagger from '@/app/ui/kit/Stagger';
import MaskedPortrait from '../../_components/MaskedPortrait';
import Headline from '../../_app/Headline';
import { cButton, fileNo } from '../../_app/styles';
import { CHARACTERS } from '@/app/lib/sample-characters';
import { CLANS } from '@/app/lib/clans';

export const metadata: Metadata = { title: 'Dossiers' };

export default function Dossiers() {
  return (
    <div className='flex flex-col gap-14'>
      <Headline
        kicker='Dossiers'
        title='Every Kindred, on record.'
        lead='Hover a portrait to drop the Masquerade. Open a file to update the sheet between sessions.'
        aside={
          <Link href='/concept/dashboard/sheets/create' className={`${cButton} self-start`}>
            Open a new file <span className='transition-transform group-hover:translate-x-1'>&rarr;</span>
          </Link>
        }
      />
      <Stagger className='grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-4'>
        {CHARACTERS.map((c, i) => {
          const { Wordmark, Symbol, name: clan } = CLANS[c.clan];
          return (
            <article key={c.slug} className='group flex flex-col'>
              <div className='relative'>
                <MaskedPortrait src={c.image.src} width={c.image.width} height={c.image.height} alt={`Portrait of ${c.name}.`} sizes='(max-width: 640px) 100vw, 20rem' className='aspect-[3/4]' />
                {c.status === 'draft' && (
                  <span aria-hidden className='pointer-events-none absolute top-4 -right-2 rotate-6 border-2 border-blood bg-night/70 px-2 py-0.5 font-c-sans text-base font-black tracking-[0.1em] text-blood uppercase [font-variation-settings:"wdth"_62]'>
                    Draft
                  </span>
                )}
              </div>
              <div className='mt-3 flex items-center justify-between font-c-mono text-[0.6rem] tracking-[0.2em] text-paper/45 uppercase'>
                <span>{fileNo(i)}</span>
                <Symbol aria-hidden className='h-5 w-auto max-w-6 text-paper/45 [--knockout:transparent]' />
              </div>
              <h2 className='mt-2 font-c-serif text-4xl leading-none'>{c.name}</h2>
              {Wordmark ? (
                <Wordmark aria-label={clan} role='img' className='mt-3 h-4 w-auto max-w-full self-start text-blood' />
              ) : (
                <p className='mt-3 font-c-mono text-xs tracking-[0.2em] text-blood uppercase'>{clan}</p>
              )}
              <p className='mt-4 text-sm leading-relaxed text-pretty text-paper/65'>{c.description}</p>
              <Link
                href='/concept/dashboard/sheets/create'
                className='mt-5 self-start border-b border-paper/40 pb-1 font-c-mono text-xs tracking-[0.2em] text-paper/80 uppercase transition-colors hover:border-blood hover:text-paper'
              >
                Open file &rarr;
              </Link>
            </article>
          );
        })}
      </Stagger>
    </div>
  );
}
