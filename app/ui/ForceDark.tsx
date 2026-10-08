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
export default function ForceDark() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.forceDark = '1';
    root.dataset.theme = 'dark';
    return () => {
      delete root.dataset.forceDark;
      window.__elysiumTheme?.();
    };
  }, []);
  return null;
}
