'use client';

import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import clsx from 'clsx';
import { MdClose, MdMenu } from 'react-icons/md';
import { IslandBackdrop, useIsland } from '@/app/ui/kit/Island';

// Keep in step with the desk variants (app/globals.css).
const DESK_QUERY = '(min-width: 64rem) and (hover: hover)';

type DrawerState = { open: boolean; setOpen: (open: boolean) => void; button: React.RefObject<HTMLButtonElement | null> };
const DrawerContext = createContext<DrawerState | null>(null);

function useDrawer() {
  const state = use(DrawerContext);
  if (!state) throw new Error('Drawer parts need a DrawerProvider.');
  return state;
}

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const value = useMemo(() => ({ open, setOpen, button }), [open]);
  return <DrawerContext value={value}>{children}</DrawerContext>;
}

// The hamburger, wherever the top bar keeps it; on desktop the sidebar is always there, so it's hidden.
export function DrawerButton() {
  const { open, setOpen, button } = useDrawer();
  return (
    <button
      ref={button}
      type='button'
      aria-label='Menu'
      aria-expanded={open}
      aria-controls='side-drawer'
      onClick={() => setOpen(true)}
      className='grid size-10 place-items-center rounded-xl text-bone/80 transition-colors hover:bg-bone/[0.06] hover:text-bone focus-visible:outline-2 focus-visible:outline-accent desk:hidden'
    >
      <MdMenu aria-hidden className='size-6' />
    </button>
  );
}

/*
  One sidebar for every screen. With a mouse and room it stays fixed where
  `className` puts it (desk: classes). On phones it slides in from the right
  over everything, the hamburger's side; on tablets, either way up, at its usual
  width; with the page blurred behind by the same backdrop and timing as the
  navbar's menu (Island.tsx). Closed it's `invisible`: out of the tab order, and
  out of Safari's check for edge bars (app/globals.css).
*/
export function Drawer({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  const { open, setOpen, button } = useDrawer();
  const closeButton = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), [setOpen]);
  useIsland({ open, onEscape: close, onBreakpoint: close, trigger: button, breakpoint: DESK_QUERY });

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const main = document.getElementById('main');
    main?.setAttribute('inert', '');
    return () => main?.removeAttribute('inert');
  }, [open]);

  // Following a link leaves the drawer behind.
  const onClick = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as Element).closest('a')) close();
  };

  return (
    <>
      <IslandBackdrop open={open} onClose={close} className='z-[55] desk:hidden' />
      <aside
        id='side-drawer'
        aria-label={label}
        onClick={onClick}
        className={clsx(
          'fixed z-[60] flex flex-col transition-[translate,visibility] duration-300 ease-out motion-reduce:transition-none desk:visible desk:z-40 desk:translate-x-0',
          'undesk:inset-x-2 undesk:top-[max(0.5rem,env(safe-area-inset-top))] undesk:bottom-[max(0.5rem,env(safe-area-inset-bottom))] sm:undesk:top-[max(1rem,env(safe-area-inset-top))] sm:undesk:right-4 sm:undesk:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:undesk:left-auto sm:undesk:w-60',
          open ? 'visible translate-x-0' : 'invisible translate-x-[calc(100%+1.5rem)]',
          className,
        )}
      >
        <button
          ref={closeButton}
          type='button'
          aria-label='Close menu'
          onClick={close}
          className='absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-xl text-bone/80 transition-colors hover:bg-bone/[0.06] hover:text-bone focus-visible:outline-2 focus-visible:outline-accent desk:hidden'
        >
          <MdClose aria-hidden className='size-6' />
        </button>
        {children}
      </aside>
    </>
  );
}
