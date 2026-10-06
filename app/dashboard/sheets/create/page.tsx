import type { Metadata } from 'next';
import PageHeader from '@/app/ui/kit/PageHeader';
import { panel } from '@/app/ui/kit/styles';
import { LogoVampire } from '@/app/ui/svgs/official';
import CategoryDividers from '@/app/ui/sheets/CategoryDividers';
import SheetNav from '@/app/ui/sheets/SheetNav';
import { SHEET_SECTIONS } from '@/app/ui/sheets/sections';

export const metadata: Metadata = {
  title: 'New character sheet',
};

export default function CreateSheet() {
  return (
    <div className='flex flex-col gap-8'>
      <PageHeader
        eyebrow='New character'
        title='Character sheet'
        description='Fill it in as you would the printed sheet. Click a dot to set a rating; use the arrow keys on a focused rating.'
      />
      <SheetNav sections={SHEET_SECTIONS.map(({ id, label }) => ({ id, label }))} />
      <form className='flex flex-col gap-6'>
        <div className='flex justify-center py-4'>
          <LogoVampire aria-label='Vampire: The Masquerade' role='img' className='h-auto w-64 text-bone/80 md:w-80' />
        </div>
        {SHEET_SECTIONS.map(({ id, label, body }) => (
          <section
            key={id}
            id={id}
            aria-labelledby={`${id}-title`}
            className={`reveal scroll-mt-36 p-5 md:scroll-mt-24 md:p-8 ${panel}`}
          >
            <CategoryDividers id={`${id}-title`} title={label} />
            <div className='mt-8'>{body}</div>
          </section>
        ))}
      </form>
    </div>
  );
}
