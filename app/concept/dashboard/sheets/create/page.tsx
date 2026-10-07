import type { Metadata } from 'next';
import Headline from '../../../_app/Headline';
import SheetNav from '@/app/ui/sheets/SheetNav';
import { SHEET_SECTIONS } from '@/app/ui/sheets/sections';
import { LogoVampire } from '@/app/ui/svgs/official';

export const metadata: Metadata = { title: 'New file' };

export default function NewFile() {
  return (
    <div className='flex flex-col gap-10'>
      <Headline
        kicker='File &mdash; new Kindred'
        title='Character sheet.'
        lead='Fill it in as you would the printed sheet. Click a diamond to set a rating, or use the arrow keys.'
        aside={<LogoVampire aria-label='Vampire: The Masquerade' role='img' className='h-auto w-56 text-paper/80' />}
      />
      <SheetNav sections={SHEET_SECTIONS.map(({ id, label }) => ({ id, label }))} />
      <form className='flex flex-col'>
        {SHEET_SECTIONS.map(({ id, label, body }, i) => (
          <section key={id} id={id} aria-labelledby={`${id}-title`} className='reveal scroll-mt-48 border-t border-paper/20 py-12 md:grid md:grid-cols-12 md:gap-10'>
            <header className='mb-8 md:col-span-3 md:mb-0'>
              <p className='font-c-mono text-xs tracking-[0.25em] text-blood uppercase'>&sect; {String(i + 1).padStart(2, '0')}</p>
              <h2 id={`${id}-title`} className='mt-2 font-c-serif text-4xl leading-none'>{label}</h2>
            </header>
            <div className='md:col-span-9'>{body}</div>
          </section>
        ))}
      </form>
    </div>
  );
}
