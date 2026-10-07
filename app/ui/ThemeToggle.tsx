'use client';

import { THEME_STORAGE_KEY, type Theme } from '@/app/lib/theme';

type Props = {
  labels: Record<Theme, string>;
  className?: string;
  // e.g. 'max-sm:sr-only' to show only the switch on small screens.
  labelClassName?: string;
};

/*
  Switches <html data-theme>. The label is driven by CSS (`dark:` variant), so
  the server-rendered markup is the same for both themes.
*/
export default function ThemeToggle({
  labels,
  className = '',
  labelClassName = '',
}: Props) {
  const toggle = () => {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  };

  return (
    <button
      type='button'
      onClick={toggle}
      className={`group inline-flex items-center gap-2 ${className}`}
    >
      <span
        aria-hidden
        className='relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-current/25 p-0.5 transition-colors'
      >
        <span className='size-4 rounded-full bg-current transition-transform duration-300 ease-out dark:translate-x-4' />
      </span>
      <span className={`dark:hidden ${labelClassName}`}>
        <span className='sr-only'>Theme: </span>
        {labels.light}
        <span className='sr-only'>. Switch to {labels.dark}.</span>
      </span>
      <span className={`hidden dark:inline ${labelClassName}`}>
        <span className='sr-only'>Theme: </span>
        {labels.dark}
        <span className='sr-only'>. Switch to {labels.light}.</span>
      </span>
    </button>
  );
}
