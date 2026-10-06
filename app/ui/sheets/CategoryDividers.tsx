import { LogoAnkh } from '@/app/ui/svgs/official';

// Section heading for the character sheet, flanked by ankhs.
export default function CategoryDividers({ title, id }: { title: string; id?: string }) {
  return (
    <div className='flex items-center gap-4'>
      <span className='h-px grow bg-linear-to-r from-transparent to-bone/20' />
      <LogoAnkh aria-hidden className='h-4 w-auto rotate-90 text-accent' />
      <h2 id={id} className='font-display text-3xl'>
        {title}
      </h2>
      <LogoAnkh aria-hidden className='h-4 w-auto -rotate-90 text-accent' />
      <span className='h-px grow bg-linear-to-l from-transparent to-bone/20' />
    </div>
  );
}
