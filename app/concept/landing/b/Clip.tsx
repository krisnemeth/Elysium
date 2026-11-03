'use client';

import { useEffect, useRef, useState } from 'react';
import { MdPause, MdPlayArrow } from 'react-icons/md';

/*
  A short silent clip recorded from inside the app (public/landing/). It
  starts as its poster, a still, and plays while the pointer is over its card
  (the nearest [data-clip-host], else its parent); the corner button, shown
  only on touch screens and to the keyboard, plays and pauses it. Only one clip plays at a
  time: starting one pauses the last. Under reduced motion hovering does
  nothing; the button still plays it by choice.
*/

let playing: HTMLVideoElement | null = null;

export default function Clip({ src, poster, label, className }: { src: string; poster: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    if (playing && playing !== v) playing.pause();
    playing = v;
    v.play().catch(() => {});
  };
  const pause = () => ref.current?.pause();

  useEffect(() => {
    const v = ref.current;
    const host = v?.closest<HTMLElement>('[data-clip-host]') ?? v?.parentElement;
    if (!v || !host) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const enter = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || reduced.matches) return;
      if (playing && playing !== v) playing.pause();
      playing = v;
      v.play().catch(() => {});
    };
    const leave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') v.pause();
    };
    const sync = () => setOn(!v.paused);
    host.addEventListener('pointerenter', enter);
    host.addEventListener('pointerleave', leave);
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    return () => {
      host.removeEventListener('pointerenter', enter);
      host.removeEventListener('pointerleave', leave);
      v.removeEventListener('play', sync);
      v.removeEventListener('pause', sync);
      if (playing === v) playing = null;
    };
  }, []);

  return (
    <>
      <video ref={ref} src={src} poster={poster} aria-label={label} muted loop playsInline preload='none' className={className} />
      <button
        type='button'
        onClick={() => (on ? pause() : play())}
        aria-label={on ? `Pause: ${label}` : `Play: ${label}`}
        // On touch it's the way to play; with a mouse hovering plays, so it only shows for the keyboard.
        className='absolute top-3 right-3 z-3 grid size-9 place-items-center rounded-full border border-bone/25 bg-[#0a0809]/70 text-bone/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 focus-visible:opacity-100 [@media(hover:none)]:opacity-100'
      >
        {on ? <MdPause aria-hidden className='size-5' /> : <MdPlayArrow aria-hidden className='size-5' />}
      </button>
    </>
  );
}
