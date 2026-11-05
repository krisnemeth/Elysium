'use client';

import { useEffect } from 'react';
import { haptic, type Haptic } from '@/app/lib/haptics';

const CONTROLS = "button, a[href], summary, select, input[type='checkbox'], input[type='radio'], input[type='range'], [role='button'], [role='tab'], [role='switch'], [role='radio'], [role='slider']";
const TOGGLES = "input, select, [role='tab'], [role='switch'], [role='radio'], [role='slider'], [aria-pressed], [aria-checked], [aria-selected]";

/*
  One listener for the whole app, so every control answers the same way: a toggle
  gives a light tick, a button or a card a tap. Links inside running text stay quiet,
  and typing has none. An element can name its own with data-haptic (app/lib/haptics.ts),
  or data-haptic='off'. Moments with no tap (a result, an error) call haptic() themselves.
*/
export default function Haptics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const el = e.target.closest(CONTROLS);
      if (!el || el.matches("[aria-disabled='true']") || el.closest('p')) return;
      const named = el.closest('[data-haptic]')?.getAttribute('data-haptic');
      if (named === 'off') return;
      haptic((named as Haptic | null | undefined) ?? (el.matches(TOGGLES) ? 'select' : 'tap'));
    };
    // iOS Safari only applies :active (the pressed colours) once the page listens for touches.
    const noop = () => {};
    document.addEventListener('click', onClick, true);
    document.addEventListener('touchstart', noop, { passive: true });
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('touchstart', noop);
    };
  }, []);
  return null;
}
