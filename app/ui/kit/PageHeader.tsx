import type { ReactNode } from 'react';

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  compact = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  // Smaller, for pages sized to the window (the dice); the description is left out on phones.
  compact?: boolean;
}) {
  return (
    <header className='flex shrink-0 flex-col gap-6 md:flex-row md:items-end md:justify-between'>
      <div className='max-w-2xl'>
        <p className='text-xs tracking-[0.3em] text-accent uppercase'>{eyebrow}</p>
        <h1 className={`font-display leading-[0.95] font-medium tracking-tight text-balance ${compact ? 'mt-2 text-[2rem] md:text-5xl' : 'mt-3 text-4xl md:text-6xl'}`}>
          {title}
        </h1>
        {description && (
          <p className={`max-w-[56ch] leading-relaxed text-pretty text-bone/65 ${compact ? 'mt-3 max-md:hidden short:hidden' : 'mt-4'}`}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className='flex shrink-0 flex-wrap gap-3'>{actions}</div>}
    </header>
  );
}
