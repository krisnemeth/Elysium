export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'elysium-theme';

// Site pages (landing, vault, chronicles) are dark only; the saved theme
// applies to the game dashboards. Keep in step with app/ui/ForceDark.tsx.
export const DARK_ONLY_PATHS = '^/(vampire)?$|^/vault/?$|^/vault/new/?$|^/vault/chronicles(/|$)';

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
