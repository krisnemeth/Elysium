'use client';

import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { explain } from '@/app/lib/sheets/glossary';
import { usePreferences } from '@/app/ui/PreferencesContext';

const COARSE = '(pointer: coarse)';

/*
  A trait name with a plain-language explanation on hover or keyboard focus.
  Renders the bare label when tooltips are off (Settings) or there's nothing
  to explain. On touch screens a tap focuses the term and the explanation
  rises from the bottom of the screen, clear of the edges (rendered at the
  page's level: panels' backdrop blur would otherwise pin it to the panel);
  tapping anywhere else closes it.
*/
export default function Explain({ label, term = label, className = '' }: { label: string; term?: string; className?: string }) {
  const { tooltips } = usePreferences();
  const id = useId();
  const [touch, setTouch] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mq = matchMedia(COARSE);
    const on = () => setTouch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const text = tooltips ? explain(term) : undefined;
  if (!text) return <span className={className}>{label}</span>;

  const tip = 'rounded-xl border border-bone/15 bg-ink/95 text-left leading-relaxed font-normal tracking-normal text-bone/85 normal-case shadow-[0_1rem_2rem_-0.5rem_rgb(0_0_0/0.7)] backdrop-blur-md';

  return (
    <span className={`group/explain relative inline-block ${className}`}>
      <span
        tabIndex={0}
        aria-describedby={id}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className='cursor-help underline decoration-bone/25 decoration-dotted underline-offset-4 outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-accent/70'
      >
        {label}
      </span>
      {touch ? (
        <>
          <span id={id} hidden>
            {text}
          </span>
          {open &&
            createPortal(
              <div
                role='tooltip'
                className={`result-in fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[60] p-4 text-sm ${tip}`}
              >
                <p className='mb-1 font-display text-lg text-bone'>{label}</p>
                {text}
              </div>,
              document.body,
            )}
        </>
      ) : (
        <span
          id={id}
          role='tooltip'
          className={`pointer-events-none invisible absolute top-full left-0 z-50 mt-2 w-64 p-3 text-xs opacity-0 transition-opacity duration-200 group-hover/explain:visible group-hover/explain:opacity-100 group-focus-within/explain:visible group-focus-within/explain:opacity-100 ${tip}`}
        >
          {text}
        </span>
      )}
    </span>
  );
}
