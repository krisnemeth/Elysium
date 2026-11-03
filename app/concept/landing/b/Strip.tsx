'use client';

import { useEffect, useRef, useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

/*
  The vault's row of characters, kept inside the content column: it scrolls
  sideways (snapping card by card; a trackpad, a swipe or shift + wheel), and
  the arrows under it turn a screenful at a time. Its edges fade only on the
  side that has more to show (data-more, landing.css).
*/
export default function Strip({ label, children }: { label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const [more, setMore] = useState({ back: false, on: true });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      // The cards are as tall as the row (a percentage height doesn't resolve in this flexed row).
      el.style.setProperty('--face-h', `${el.clientHeight}px`);
      setMore({ back: el.scrollLeft > 4, on: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
    };
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      ro.disconnect();
    };
  }, []);

  const turn = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' });
  };

  const arrow = 'grid size-11 place-items-center rounded-full border border-bone/20 bg-[#0a0809]/60 text-bone/85 backdrop-blur-sm transition duration-300 hover:border-(--lc-glow)/70 hover:text-(--lc-glow-text) disabled:pointer-events-none disabled:opacity-30';

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <ul
        ref={ref}
        aria-label={label}
        data-more={[more.back && 'back', more.on && 'on'].filter(Boolean).join(' ') || undefined}
        className='lc-bx-strip flex min-h-60 max-h-160 flex-1 snap-x snap-mandatory gap-[clamp(0.75rem,1.5vw,1.25rem)] overflow-x-auto overscroll-x-contain [scrollbar-width:none]'
      >
        {children}
      </ul>
      <div className='mt-[clamp(0.75rem,2svh,1.25rem)] flex items-center justify-end gap-2'>
        <button type='button' onClick={() => turn(-1)} disabled={!more.back} aria-label='Earlier characters' className={arrow}>
          <MdChevronLeft aria-hidden className='size-6' />
        </button>
        <button type='button' onClick={() => turn(1)} disabled={!more.on} aria-label='More characters' className={arrow}>
          <MdChevronRight aria-hidden className='size-6' />
        </button>
      </div>
    </div>
  );
}
