'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/*
  Keeps <meta name="theme-color"> on the page's own colour (--page-bg,
  globals.css), for the browsers that colour their bars from it (Chrome on
  Android, Safari before iOS 26). It follows the theme, the game and, on the
  landing, the chosen cover: whatever changes the html element's attributes.
*/
export default function ThemeColor() {
  const path = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.append(meta);
    }
    const sync = () => {
      const color = getComputedStyle(root).getPropertyValue('--page-bg').trim() || getComputedStyle(root).getPropertyValue('--ink').trim();
      if (color && meta.content !== color) meta.content = color;
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ['style', 'data-theme', 'data-lc-scene'] });
    // The game's wrapper (and with it :has([data-game])) mounts with the page.
    const t = setTimeout(sync, 50);
    return () => {
      mo.disconnect();
      clearTimeout(t);
    };
  }, [path]);
  return null;
}
