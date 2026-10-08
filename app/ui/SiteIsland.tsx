'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from 'react';
import { MdArrowOutward, MdCheck, MdClose, MdDarkMode, MdLightMode, MdMenu } from 'react-icons/md';
import clsx from 'clsx';
import { signOut } from '@/app/lib/actions/auth';
import type { Theme } from '@/app/lib/theme';
import { readTheme, serverTheme, subscribeTheme, switchTheme } from '@/app/lib/theme-switch';
import { Elysium1 } from '@/app/ui/svgs';
import { IslandBackdrop, IslandSection, useIsland } from '@/app/ui/kit/Island';

type Section = { href: string; label: string };

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone';
const quiet = `rounded-xl px-3 py-2 text-sm text-bone/80 transition-colors duration-200 hover:text-bone ${focus}`;
const FADE = 400; // px before a section where its dot starts fading in

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

// Smooth-scrolls to an in-page section (instantly with reduced motion).
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

/*
  The site navbar as a "dynamic island": the theme button and (on phones) the
  menu button grow the pill itself to show their panel, with the page blurred
  behind. In-page section links scroll smoothly, and a dot by each link
  crossfades to show which section you're in.
*/
export default function SiteIsland({
  sections,
  themeLabels,
  signedIn,
}: {
  sections: Section[];
  themeLabels: Record<Theme, string>;
  signedIn: boolean;
}) {
  const [menu, setMenu] = useState(false);
  const [themes, setThemes] = useState(false);
  const theme = useSyncExternalStore(subscribeTheme, readTheme, serverTheme);
  const menuButton = useRef<HTMLButtonElement>(null);
  const themeTrigger = useRef<HTMLButtonElement | null>(null);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const expanded = menu || themes;

  const closeAll = useCallback(() => {
    setMenu(false);
    setThemes(false);
  }, []);
  const onEscape = useCallback(() => {
    if (themes) setThemes(false);
    else setMenu(false);
  }, [themes]);
  useIsland({ open: expanded, onEscape, onBreakpoint: closeAll, trigger: themes ? themeTrigger : menuButton });

  // Section dots: each in-page link's dot fades in as its section arrives.
  const hashIds = sections.filter((s) => s.href.startsWith('#')).map((s) => s.href.slice(1));
  const idsKey = hashIds.join(',');
  useEffect(() => {
    const ids = idsKey ? idsKey.split(',') : [];
    if (!ids.length) return;
    let raf = 0;
    const activation = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return Infinity;
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      return el.getBoundingClientRect().top + window.scrollY - margin - 1;
    };
    const update = () => {
      raf = 0;
      const points = ids.map(activation);
      const y = window.scrollY;
      let current = -1;
      points.forEach((p, i) => {
        if (y >= p) current = i;
      });
      let fractional = current;
      if (current < points.length - 1) {
        const distance = points[current + 1] - y;
        if (distance < FADE) fractional = current + clamp(1 - distance / FADE, 0, 1);
      }
      dots.current.forEach((dot, i) => {
        if (dot) dot.style.opacity = String(clamp(1 - Math.abs(fractional - i), 0, 1));
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [idsKey]);

  const onSectionClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#') || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    closeAll();
    window.history.pushState(null, '', href);
    scrollToSection(href.slice(1));
  };

  const toggleThemes = (e: MouseEvent<HTMLButtonElement>) => {
    themeTrigger.current = e.currentTarget;
    setThemes((t) => !t);
  };

  const ThemeIcon = theme === 'light' ? MdLightMode : MdDarkMode;
  const themeButton = (className = '') => (
    <button type='button' aria-label='Theme' aria-expanded={themes} aria-controls='site-themes' onClick={toggleThemes} className={clsx('grid size-9 place-items-center rounded-xl text-bone/75 transition-colors hover:bg-bone/[0.06] hover:text-bone', themes && 'bg-bone/[0.08]', focus, className)}>
      <ThemeIcon aria-hidden className='size-5' />
    </button>
  );
  let hashIndex = -1;

  return (
    <header className='fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3'>
      <IslandBackdrop open={expanded} onClose={closeAll} />
      <div className='frame relative mx-auto flex max-w-6xl flex-col rounded-2xl border border-bone/15 bg-ink/70 px-2 shadow-[0_8px_32px_-8px_rgb(0_0_0/0.6),inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl'>
        <nav aria-label='Main' className='flex h-14 items-center justify-between pl-2'>
          <Link href='/' aria-label='Elysium home' onClick={closeAll} className={`rounded-md ${focus}`}>
            <Elysium1 aria-hidden className='mt-1 h-auto w-20 text-bone/90' />
          </Link>

          <ul className='hidden items-center gap-6 text-sm text-bone/70 md:flex'>
            {sections.map(({ href, label }) => {
              const isHash = href.startsWith('#');
              if (isHash) hashIndex++;
              const i = hashIndex;
              return (
                <li key={href}>
                  <a href={href} onClick={(e) => onSectionClick(e, href)} className={`relative block rounded-sm py-1 pl-3 transition-colors duration-200 hover:text-bone ${focus}`}>
                    {isHash && (
                      <span
                        ref={(el) => {
                          dots.current[i] = el;
                        }}
                        aria-hidden
                        style={{ opacity: 0 }}
                        className='absolute top-1/2 left-0 size-1.5 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0.5rem_var(--accent)]'
                      />
                    )}
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className='flex items-center gap-1'>
            {themeButton('hidden md:grid')}
            <div className='hidden items-center md:flex'>
              {signedIn ? (
                <form action={signOut}>
                  <button className={quiet}>Log out</button>
                </form>
              ) : (
                <Link href='/login' className={quiet}>
                  Log in
                </Link>
              )}
            </div>
            <Link
              href={signedIn ? '/vault' : '/signup'}
              onClick={closeAll}
              className={`group inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_0_1.5rem_-0.5rem_var(--accent)] transition duration-300 hover:brightness-110 active:scale-[0.98] ${focus}`}
            >
              {signedIn ? 'Your vault' : 'Sign up'}
              <MdArrowOutward aria-hidden className='transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
            </Link>
            <button
              ref={menuButton}
              type='button'
              aria-label={menu ? 'Close menu' : 'Menu'}
              aria-expanded={menu}
              aria-controls='site-menu'
              onClick={() => {
                setMenu((m) => !m);
                setThemes(false);
              }}
              className={`ml-1 grid size-9 place-items-center rounded-xl text-bone/80 transition-colors hover:bg-bone/[0.06] md:hidden ${focus}`}
            >
              {menu ? <MdClose aria-hidden className='size-6' /> : <MdMenu aria-hidden className='size-6' />}
            </button>
          </div>
        </nav>

        {/* Phone menu: grows the pill itself. */}
        <IslandSection open={menu} id='site-menu' className='md:hidden'>
          <div className='flex flex-col gap-1 border-t border-bone/10 px-1 pt-2 pb-3'>
            {sections.map(({ href, label }) => (
              <a key={href} href={href} onClick={(e) => (href.startsWith('#') ? onSectionClick(e, href) : closeAll())} className='rounded-xl px-3 py-3.5 text-base text-bone/85 hover:bg-bone/[0.06]'>
                {label}
              </a>
            ))}
            <div className='mt-1 flex items-center justify-between gap-2 border-t border-bone/10 px-1 pt-3'>
              {signedIn ? (
                <form action={signOut}>
                  <button className={quiet}>Log out</button>
                </form>
              ) : (
                <Link href='/login' onClick={closeAll} className={quiet}>
                  Log in
                </Link>
              )}
              {themeButton()}
            </div>
          </div>
        </IslandSection>

        {/* Theme options: grows the pill below whatever is showing. */}
        <IslandSection open={themes} id='site-themes'>
          <div role='group' aria-label='Theme' className='flex flex-col gap-1 border-t border-bone/10 px-1 pt-2 pb-3 md:flex-row md:justify-end md:border-0 md:pt-0'>
            {(['dark', 'light'] as const).map((t) => {
              const Icon = t === 'light' ? MdLightMode : MdDarkMode;
              const active = theme === t;
              return (
                <button
                  key={t}
                  type='button'
                  aria-pressed={active}
                  onClick={() => {
                    switchTheme(t);
                    setThemes(false);
                  }}
                  className={clsx(
                    'flex items-center gap-2 rounded-xl px-3 py-3.5 text-left text-base text-bone/85 transition-colors hover:bg-bone/[0.06] md:px-4 md:py-2 md:text-sm',
                    active && 'bg-bone/[0.08] text-bone',
                  )}
                >
                  <Icon aria-hidden className='size-4' />
                  {themeLabels[t]}
                  {active && <MdCheck aria-hidden className='size-4 text-accent' />}
                </button>
              );
            })}
          </div>
        </IslandSection>
      </div>
    </header>
  );
}
