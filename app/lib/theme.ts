export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'elysium-theme';

/*
  Runs inline in <head> before first paint: applies the saved theme, or the
  system preference if none is saved (and keeps following the system until
  the user picks one).
*/
export const themeScript = `(() => {
  const key = '${THEME_STORAGE_KEY}';
  const media = matchMedia('(prefers-color-scheme: dark)');
  const apply = () => {
    let saved = null;
    try { saved = localStorage.getItem(key); } catch {}
    document.documentElement.dataset.theme =
      saved === 'light' || saved === 'dark' ? saved : media.matches ? 'dark' : 'light';
  };
  apply();
  media.addEventListener('change', apply);
})();`;
