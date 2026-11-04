export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'elysium-theme';

// The public pages (landing, accounts) and the chronicle table are dark only (the
// table has its own skins); the saved theme applies everywhere else inside the
// app. Keep in step with app/ui/ForceDark.tsx.
export const DARK_ONLY_PATHS = '^/$|^/vault/chronicles/[^/]+/?$|^/(login|signup|auth)(/|$)';

/*
  Runs inline in <head> before first paint: applies the saved theme, or the
  system preference if none is saved (and keeps following the system until
  the user picks one). Dark-only pages get dark, without changing the saved
  choice. `window.__elysiumTheme()` re-applies it (used by ForceDark).
*/
export const themeScript = `(() => {
  const key = '${THEME_STORAGE_KEY}';
  const darkOnly = new RegExp('${DARK_ONLY_PATHS}');
  const media = matchMedia('(prefers-color-scheme: dark)');
  const apply = () => {
    const root = document.documentElement;
    if (root.dataset.forceDark || darkOnly.test(location.pathname)) {
      root.dataset.theme = 'dark';
      return;
    }
    let saved = null;
    try { saved = localStorage.getItem(key); } catch {}
    root.dataset.theme = saved === 'light' || saved === 'dark' ? saved : media.matches ? 'dark' : 'light';
  };
  window.__elysiumTheme = apply;
  apply();
  media.addEventListener('change', apply);
})();`;

/*
  A refresh of the landing starts on the cover. Left alone, the browser restores
  the scroll while only the cover has loaded, so it clamps to the page's height
  then, one screen down: the Games section. Browsers decide to restore as the
  refresh begins, so scrollRestoration only stops the later ones: the restore
  itself is undone from its scroll event, which runs before that frame paints.
  Listening ends with the load or the first touch, so it can't fight the reader.
  A link to a section and the back button are untouched.
*/
export const startOnCoverScript = `if (location.pathname === '/' && performance.getEntriesByType('navigation')[0]?.type === 'reload') {
  history.scrollRestoration = 'manual';
  if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
  const top = () => scrollTo({ top: 0, behavior: 'instant' });
  const stop = () => {
    removeEventListener('scroll', top);
    removeEventListener('touchstart', stop);
    removeEventListener('wheel', stop);
  };
  addEventListener('scroll', top, { passive: true });
  addEventListener('touchstart', stop, { passive: true });
  addEventListener('wheel', stop, { passive: true });
  addEventListener('load', () => { top(); stop(); });
}`;
