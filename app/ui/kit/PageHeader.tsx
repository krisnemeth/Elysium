import type { ReactNode } from 'react';

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
      <div className='max-w-2xl'>
        <p className='text-xs tracking-[0.3em] text-accent uppercase'>{eyebrow}</p>
        <h1 className='mt-3 font-display text-5xl leading-[0.95] font-medium tracking-tight text-balance md:text-6xl'>
          {title}
        </h1>
        {description && (
          <p className='mt-4 max-w-[56ch] leading-relaxed text-pretty text-bone/65'>
            {description}
          </p>
        )}
      </div>
      {actions && <div className='flex shrink-0 flex-wrap gap-3'>{actions}</div>}
    </header>
  );
}
