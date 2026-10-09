'use client';

import clsx from 'clsx';

// One location per act (official Dark Pack illustrations, public/acts/).
const ACT_ART = ['hook', 'dig', 'twist', 'clash', 'after'] as const;

/*
  The chronicle's backdrop: the current act's location, full screen behind
  the table. All five are layered and crossfade as the story moves on (the
  page refreshes live when an act changes); reduced motion swaps instantly.
*/
export default function ActBackdrop({ act }: { act: number }) {
  return (
    <div aria-hidden className='pointer-events-none fixed inset-0 overflow-hidden'>
      {ACT_ART.map((key, i) => (
        <div
          key={key}
          className={clsx(
            'absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out motion-reduce:transition-none',
            i === act ? 'opacity-100' : 'opacity-0',
          )}
          style={{ backgroundImage: `url(/acts/${key}.webp)` }}
        />
      ))}
      {/* Dim and vignette it, so the panels stay easy to read. */}
      <div className='absolute inset-0 bg-ink/30' />
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-ink)_110%)] opacity-70' />
    </div>
  );
}
