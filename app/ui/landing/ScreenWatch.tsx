'use client';

import { useEffect } from 'react';

/*
  Marks each screen of the sections (.lc-screen) with data-in the first time
  a good part of it is on screen, so its entrance plays once, in time rather
  than scrubbed to the scroll (landing.css). Until this runs (no JS) nothing
  is hidden: data-lc-armed on <html> turns the hidden start states on.
*/
export default function ScreenWatch() {
  useEffect(() => {
    const root = document.documentElement;
    const screens = [...document.querySelectorAll<HTMLElement>('.lc-screen')];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.in = '';
          io.unobserve(e.target);
        }
      },
      { threshold: 0.3 },
    );
    screens.forEach((s) => io.observe(s));
    root.dataset.lcArmed = '';
    return () => {
      io.disconnect();
      delete root.dataset.lcArmed;
    };
  }, []);
  return null;
}
