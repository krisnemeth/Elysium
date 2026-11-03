'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import type { ArtBox } from './Atmosphere';
import { getScene, subscribeScene } from './scene';

const Atmosphere = dynamic(() => import('./Atmosphere'), { ssr: false });

/*
  The chosen cover's weather, carried down the page behind the sections'
  text: the same smoke, fog, leaves or steam as the cover's back layer,
  fixed to the screen and fainter. Drawn only while the sections are on
  screen (the cover draws its own above them), and not at all under reduced
  motion. Its parent sets where it sits (Screens.tsx).
*/
export default function SceneWeather({ initial }: { initial: number }) {
  const scene = useSyncExternalStore(subscribeScene, getScene, () => initial);
  const current = scene < 0 ? initial : scene;
  const host = useRef<HTMLDivElement>(null);
  const box = useRef<ArtBox | null>(null);
  const [allowed, setAllowed] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setAllowed(!mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Watch the sections (the host's parent), not the fixed layer itself.
  useEffect(() => {
    const el = host.current?.parentElement;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setOnScreen(e.isIntersecting);
      if (e.isIntersecting) setMounted(true);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} aria-hidden data-on={onScreen || undefined} className='lc-bx-weather'>
      {allowed && mounted && <Atmosphere current={current} layer='back' running={onScreen} box={box} />}
    </div>
  );
}
