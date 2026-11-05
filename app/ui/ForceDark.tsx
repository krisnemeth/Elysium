'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    __elysiumTheme?: () => void;
  }
}

/*
  Keeps a page dark while it's shown, without touching the player's saved
  theme. First loads are handled by the theme script (DARK_ONLY_PATHS); this
  covers in-app navigation to and from these pages.
*/
export default function ForceDark({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.forceTheme = theme;
    root.dataset.theme = theme;
    return () => {
      delete root.dataset.forceTheme;
      window.__elysiumTheme?.();
    };
  }, [theme]);
  return null;
}
