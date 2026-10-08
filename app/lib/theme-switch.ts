import { flushSync } from 'react-dom';
import { THEME_STORAGE_KEY, type Theme } from './theme';

/*
  Switches <html data-theme> through a View Transition, so the whole page
  (scenes, frames, colours) crossfades and softens instead of snapping. See
  the ::view-transition rules in globals.css. Falls back to an instant switch
  without browser support or with reduced motion.
*/
export function switchTheme(next: Theme) {
  const root = document.documentElement;
  if (root.dataset.theme === next) return;
  const apply = () => {
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduced) return apply();
  document.startViewTransition(() => flushSync(apply));
}

// The current theme, for useSyncExternalStore.
export function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}
export const readTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
export const serverTheme = (): Theme => 'dark';
