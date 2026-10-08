'use client';

import { useEffect, type ReactNode, type RefObject } from 'react';
import clsx from 'clsx';

/*
  "Dynamic island" building blocks: a pill that grows to show sections inside
  itself, rather than a separate dropdown.

  - IslandSection animates its height with grid rows (0fr → 1fr) — no
    measuring — while its content fades and slides in. Closed sections are
    `inert`, so they're out of the tab order and the accessibility tree.
    Give each panel its own section so switching panels eases the height.
  - IslandBackdrop blurs and dims the page while the island is open; a tap
    closes it.
  - useIsland locks page scroll while open, closes on Escape (returning focus
    to the trigger) and when crossing the md breakpoint.
*/

export function IslandSection({ open, id, children, className = '' }: { open: boolean; id?: string; children: ReactNode; className?: string }) {
  return (
    <div
      id={id}
      inert={!open}
      className={clsx(
        'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        className,
      )}
    >
      <div className='min-h-0 overflow-hidden'>
        <div className={clsx('transition duration-300 ease-out motion-reduce:transition-none', open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0')}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function IslandBackdrop({ open, onClose, className = '' }: { open: boolean; onClose: () => void; className?: string }) {
  return (
    <div
      aria-hidden
      onClick={onClose}
      className={clsx(
        'fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300 ease-out motion-reduce:transition-none',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
        className,
      )}
    />
  );
}

export function useIsland({
  open,
  onEscape,
  onBreakpoint,
  trigger,
  lockScroll = true,
}: {
  open: boolean;
  // Close the innermost thing; return focus to its trigger.
  onEscape: () => void;
  onBreakpoint?: () => void;
  trigger?: RefObject<HTMLElement | null>;
  lockScroll?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    if (lockScroll) root.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      onEscape();
      trigger?.current?.focus();
    };
    const desktop = window.matchMedia('(min-width: 48rem)');
    const onChange = () => onBreakpoint?.();
    document.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onChange);
    return () => {
      root.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onChange);
    };
  }, [open, onEscape, onBreakpoint, trigger, lockScroll]);
}
