'use client';

import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { haptic } from '@/app/lib/haptics';

type Props = {
  label: string;
  value: number;
  max?: number;
  onChange: (value: number) => void;
  // 'dot' for ratings (attributes, skills), 'box' for tracks (Health, Willpower).
  shape?: 'dot' | 'box';
  size?: 'sm' | 'md';
  className?: string;
};

/*
  A V5-style rating: clicking the third dot sets the value to 3, clicking the
  current value clears it back by one. Hovering previews the new value.
  Works as a slider for keyboard and screen reader users.

  On touch screens the dots keep their size: each one's hit area (the `tap`
  utility) splits the gaps with its neighbours and fills the row's height, and
  a sideways drag along the row sets the value under the finger, so precise
  taps matter less. Vertical drags still scroll the page.
*/
export default function DotRating({
  label,
  value,
  max = 5,
  onChange,
  shape = 'dot',
  size = 'md',
  className = '',
}: Props) {
  const [preview, setPreview] = useState<number | null>(null);
  // Dots filled by the latest change pop in, one after another.
  const [pop, setPop] = useState({ from: value, to: value, id: 0 });

  const set = (next: number) => {
    const clamped = Math.max(0, Math.min(max, next));
    setPop((p) => ({ from: value, to: clamped, id: p.id + 1 }));
    onChange(clamped);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: value + 1,
      ArrowUp: value + 1,
      ArrowLeft: value - 1,
      ArrowDown: value - 1,
      Home: 0,
      End: max,
    };
    if (e.key in keys) {
      e.preventDefault();
      set(keys[e.key]);
    }
  };

  // A sideways drag (touch or pen) sets the value under the finger; the click that follows it is ignored.
  const drag = useRef<{ x: number; moved: boolean; last: number } | null>(null);
  const skipClick = useRef(false);
  const dotAt = (row: HTMLElement, x: number) => {
    const dots = [...row.querySelectorAll('button')];
    const first = dots[0]?.getBoundingClientRect();
    if (!first || x < first.left - 4) return 0;
    let n = 0;
    dots.forEach((d, i) => {
      if (x >= d.getBoundingClientRect().left - 3) n = i + 1;
    });
    return n;
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    // With the pointer captured, the click after a drag may not reach a dot at all: start each touch clean.
    skipClick.current = false;
    if (e.pointerType === 'mouse') return;
    drag.current = { x: e.clientX, moved: false, last: value };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved) {
      if (Math.abs(e.clientX - d.x) < 6) return;
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const n = dotAt(e.currentTarget, e.clientX);
    if (n !== d.last) {
      d.last = n;
      set(n);
      haptic('select');
    }
  };
  const endDrag = () => {
    if (drag.current?.moved) skipClick.current = true;
    drag.current = null;
  };

  const shown = preview ?? value;
  const dim = size === 'sm' ? 'size-2.5' : 'size-3';

  return (
    <div
      role='slider'
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} of ${max}`}
      onKeyDown={onKeyDown}
      onMouseLeave={() => setPreview(null)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={() => (drag.current = null)}
      className={`group/dots inline-flex touch-pan-y items-center gap-1.5 rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-accent/70 ${className}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const filled = n <= shown;
        const previewing = preview !== null && filled !== n <= value;
        return (
          <button
            key={i}
            type='button'
            tabIndex={-1}
            aria-hidden
            onMouseEnter={() => setPreview(n === value ? n - 1 : n)}
            onClick={() => {
              if (skipClick.current) {
                skipClick.current = false;
                return;
              }
              set(n === value ? n - 1 : n);
            }}
            // 20px dots 6px apart: hit areas of 26px meet with no gap, 40px tall fills a sheet row (41px apart).
            className='tap relative grid size-5 place-items-center [--tap-h:40px] [--tap-w:26px]'
          >
            <span
              key={`${i}-${pop.id}`}
              style={{ animationDelay: `${Math.max(0, n - pop.from - 1) * 45}ms` }}
              className={[
                dim,
                'block border transition-[background-color,border-color,box-shadow,opacity,scale] duration-300 ease-(--ease-out-expo)',
                shape === 'dot' ? 'rotate-45 rounded-[2px]' : 'rounded-[3px]',
                filled
                  ? 'border-accent bg-accent shadow-[0_0_0.6rem_-0.1rem_var(--accent)]'
                  : 'border-bone/35 bg-transparent group-hover/dots:border-bone/55',
                previewing ? 'opacity-55' : '',
                n > pop.from && n <= pop.to ? 'dot-pop' : '',
              ].join(' ')}
            />
          </button>
        );
      })}
    </div>
  );
}
