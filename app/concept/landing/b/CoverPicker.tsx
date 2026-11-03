'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { MdArrowDownward, MdArrowOutward, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import {
  ClanBanuHaqim,
  ClanBrujah,
  ClanCaitiff,
  ClanGangrel,
  ClanHecata,
  ClanLasombra,
  ClanMalkavian,
  ClanMinistry,
  ClanNosferatu,
  ClanRavnos,
  ClanSalubri,
  ClanThinBlood,
  ClanToreador,
  ClanTremere,
  ClanTzimisce,
  ClanVentrue,
} from '@/app/ui/svgs/official';
import { GAMES, GAMES_ORDER, type Game } from '@/app/lib/games';
import { TRIBES, glyphUrl } from '@/app/lib/factions';
import { ART_RATIO, COVERS, MARKS, type MarkKey, type PeekStyle, type PickerPlace, type TaglinePlace } from './covers';
import type { ArtBox } from './Atmosphere';
import { setScene } from './scene';

// WebGL weather, in the browser only (Atmosphere.tsx).
const Atmosphere = dynamic(() => import('./Atmosphere'), { ssr: false });

/*
  The cover as a character picker. Six characters, one per theme, stand in a
  ring (covers.ts); the game logos under the navbar show the chosen one in the
  middle, larger and at full opacity, and its neighbours either side. Choosing
  a side logo turns the ring one step: every logo slides one place towards the
  middle's other side (the chosen one into the middle, a new one in at the far
  edge, the last one out), and the character goes the same way, sliding off
  and fading while the next one slides in from the chosen side with its
  theme's colours, mark and spines. Everything runs on one clock, in depth:
  the logos travel furthest, the marks a little less, the characters least,
  sinking back and blurring as they leave (landing.css).

  Every layer stays mounted (so its art is loaded before it's needed); the
  classes below decide which one shows and which way it moves. Under reduced
  motion the swap is instant.
*/

type Dir = 1 | -1;
const N = COVERS.length;

// A ring position's slot relative to the chosen one: -1 left, 0 middle,
// 1 right; further out (2, 3, -2) is off the row, hidden.
function slotOf(i: number, current: number) {
  const d = (i - current + N) % N;
  return d > N / 2 ? d - N : d;
}

const MARK_CLASS = 'block h-auto w-[calc(var(--cover)*var(--mark-w))] text-black';

function Mark({ mark }: { mark: MarkKey }) {
  const m = MARKS[mark];
  // Clan symbols: inline, with their white inner details cut out.
  if (!('src' in m)) {
    const Clan = mark === 'malkavian' ? ClanMalkavian : ClanVentrue;
    return <Clan aria-hidden className={`${MARK_CLASS} [--knockout:transparent]`} />;
  }
  return <span aria-hidden className={`${MARK_CLASS} bg-current`} style={{ aspectRatio: m.ratio, mask: `url(${m.src}) center / contain no-repeat` }} />;
}

// The spines, the same for every character: Vampire's clan symbols down the
// left, Werewolf's tribe glyphs down the right (official art; Hunter's
// creeds have no marks). The columns are as long as their lists.
const CLANS = [
  ClanBrujah,
  ClanGangrel,
  ClanMalkavian,
  ClanNosferatu,
  ClanToreador,
  ClanTremere,
  ClanVentrue,
  ClanBanuHaqim,
  ClanHecata,
  ClanLasombra,
  ClanMinistry,
  ClanRavnos,
  ClanSalubri,
  ClanTzimisce,
  ClanCaitiff,
  ClanThinBlood,
];
const SPINE = 'absolute top-1/2 flex -translate-y-1/2 flex-col items-center gap-[1.4svh]';
const SPINE_ICON = 'size-[min(1.75rem,3.6svh)] drop-shadow-[0_0_0.6rem_#000]';

function Spines() {
  return (
    <>
      <ul className={`${SPINE} left-[1.4rem]`}>
        {CLANS.map((Clan, i) => (
          <li key={i}>
            <Clan className={`${SPINE_ICON} block [--knockout:transparent]`} />
          </li>
        ))}
      </ul>
      <ul className={`${SPINE} right-[1.4rem]`}>
        {TRIBES.map((t) => (
          <li key={t} className={`${SPINE_ICON} bg-current`} style={{ mask: `url(${glyphUrl(t)}) center / contain no-repeat` }} />
        ))}
      </ul>
    </>
  );
}

// Weather only in the browser, only with motion allowed, and only drawn
// while the cover is on screen.
function useWeather(section: React.RefObject<HTMLElement | null>) {
  const [allowed, setAllowed] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setAllowed(!mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [section]);
  return { allowed, running: onScreen };
}

// The tagline in each game's own face, crossfading with the picker.
const TAGLINE = 'A character vault for the World of Darkness';
const TAG_FONT: Record<Game, string> = {
  vampire: 'font-[family-name:var(--lc-display)]',
  werewolf: 'font-[family-name:var(--font-cinzel)] text-[0.8em] tracking-wide',
  hunter: 'font-[family-name:var(--font-special-elite)] text-[0.82em]',
};

function Tagline({ game, className }: { game: Game; className: string }) {
  return (
    // One cell for the three faces, on a shared baseline (their sizes differ).
    <p className={clsx('grid items-baseline text-bone drop-shadow-[0_1px_8px_#000]', className)}>
      {GAMES_ORDER.map((g) => (
        <span
          key={g}
          aria-hidden={g === game ? undefined : true}
          className={clsx('transition-opacity [grid-area:1/1] [transition-duration:var(--pick-dur)]', TAG_FONT[g], g === game ? 'opacity-100' : 'opacity-0')}
        >
          {TAGLINE}
        </span>
      ))}
    </p>
  );
}

export default function CoverPicker({
  initial,
  picker = 'foot-arrows',
  tagline = 'foot',
  peekStyle = 'strong',
}: {
  initial: number;
  picker?: PickerPlace;
  tagline?: TaglinePlace;
  peekStyle?: PeekStyle;
}) {
  const pickerTop = picker.startsWith('top');
  const arrows = picker.endsWith('arrows');
  const [current, setCurrent] = useState(initial);
  // The cover sliding out, which way everything moves (1 is rightwards), and
  // whether anything has been picked yet (the first character doesn't slide in).
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<Dir>(1);
  const [moved, setMoved] = useState(false);
  const cover = COVERS[current];
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const box = useRef<ArtBox | null>(null);
  const weather = useWeather(section);

  // The chosen scene's light, for the whole page: the calls to action here
  // and in the navbar (data-lc-cover, landing.css) and the next section's
  // glow and rim (GamesSection).
  // The sections below follow it too: their colours, type and weather
  // (Screens.tsx, SceneWeather.tsx).
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--lc-scene-glow', cover.glow);
    root.style.setProperty('--lc-scene-tint', cover.tint);
    root.dataset.lcCover = '';
    root.dataset.lcScene = cover.id;
    root.dataset.lcGame = cover.game;
    setScene(current);
  }, [cover, current]);
  useEffect(
    () => () => {
      const root = document.documentElement;
      root.style.removeProperty('--lc-scene-glow');
      root.style.removeProperty('--lc-scene-tint');
      delete root.dataset.lcCover;
      delete root.dataset.lcScene;
      delete root.dataset.lcGame;
      setScene(-1);
    },
    [],
  );

  // "Learn more" glides down to the next section (an ordinary jump without JS
  // or with reduced motion).
  function learnMore(e: React.MouseEvent<HTMLAnchorElement>) {
    const next = document.getElementById('games');
    if (!next) return;
    e.preventDefault();
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    next.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    history.replaceState(null, '', '#games');
  }

  // Where the character stands in the stage, for weather pinned to the art.
  useEffect(() => {
    const s = stage.current;
    const a = art.current;
    if (!s || !a) return;
    const measure = () => {
      const sr = s.getBoundingClientRect();
      const ar = a.getBoundingClientRect();
      box.current = { left: ar.left - sr.left, top: ar.top - sr.top, w: ar.width };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(s);
    return () => ro.disconnect();
  }, []);

  // Touch: a sideways swipe across the stage turns the ring, as choosing
  // the logo on that side would (swiping left brings in the one on the
  // right). Vertical moves are left to the page (touch-action: pan-y).
  const swipe = useRef<{ x: number; y: number } | null>(null);
  function swipeStart(e: React.PointerEvent) {
    swipe.current = e.pointerType === 'mouse' ? null : { x: e.clientX, y: e.clientY };
  }
  function swipeEnd(e: React.PointerEvent) {
    const from = swipe.current;
    swipe.current = null;
    if (!from) return;
    const dx = e.clientX - from.x;
    const dy = e.clientY - from.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    pick((current + (dx < 0 ? 1 : -1) + N) % N);
  }

  function pick(next: number) {
    const slot = slotOf(next, current);
    if (slot === 0) return;
    setPrev(current);
    // The chosen logo moves towards the middle, so the row (and the
    // character with it) moves away from the side that was clicked.
    setDir(slot > 0 ? -1 : 1);
    setCurrent(next);
    setMoved(true);
  }

  const step = (by: 1 | -1) => pick((current + by + N) % N);

  // Trackpads: a sideways two-finger swipe over the stage turns the ring
  // too, once per gesture (the gesture ends when the wheel events stop).
  // Sideways wheel events are kept from the page, and landing.css turns off
  // the browser's swipe-to-go-back here (overscroll-behavior-x).
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  });
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let sum = 0;
    let fired = false;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      clearTimeout(idle);
      idle = setTimeout(() => {
        sum = 0;
        fired = false;
      }, 220);
      if (fired) return;
      sum += e.deltaX;
      if (Math.abs(sum) < 60) return;
      fired = true;
      stepRef.current(sum > 0 ? 1 : -1);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      clearTimeout(idle);
    };
  }, []);

  // The peek: once, if nobody has turned the ring four seconds in (and the
  // page is still at the top), the cover leans towards the next character
  // and back while its logo brightens, to show it turns (landing.css; not
  // under reduced motion). 'strong': the lean comes twice, and a light runs
  // along the rail from this character's tick to the next one and back.
  const [peek, setPeek] = useState(false);
  const peeked = useRef(false);
  useEffect(() => {
    if (moved || peeked.current) return;
    const t = setTimeout(() => {
      if (window.scrollY > 40 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      peeked.current = true;
      setPeek(true);
    }, 4000);
    return () => clearTimeout(t);
  }, [moved]);

  // The picker: the logo row (the chosen game in the middle), and under it a
  // rail of six ticks, one per character, the current one lit in its
  // scene's colour; with arrows, thin chevrons at the rail's ends.
  const pickerUi = (
    <div className={clsx('lc-picker pointer-events-auto flex w-full flex-col items-center', peek && 'lc-peeking', peekStyle === 'strong' && 'lc-peek-strong')}>
      <div role='group' aria-label='Choose a game' className='relative h-(--logos-h) w-full max-w-3xl [--logo-gap:clamp(7.5rem,24vw,13rem)]'>
        {COVERS.map((c, i) => {
          const { Logo, title } = GAMES[c.game];
          const slot = slotOf(i, current);
          const shown = Math.abs(slot) <= 1;
          return (
            <button
              key={c.id}
              type='button'
              data-slot={slot}
              onClick={() => pick(i)}
              tabIndex={shown ? undefined : -1}
              aria-hidden={shown ? undefined : true}
              aria-pressed={slot === 0}
              aria-label={slot === 0 ? title : `Show ${title}`}
              style={{ translate: `calc(-50% + ${slot} * var(--logo-gap)) -50%`, scale: slot === 0 ? 1 : 0.62 }}
              className={clsx(
                'lc-pick-logo absolute top-1/2 left-1/2 rounded-md p-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone',
                slot === 0 ? 'cursor-default opacity-100' : shown ? 'opacity-45 hover:opacity-80' : 'pointer-events-none opacity-0',
              )}
            >
              <Logo aria-hidden className='h-11 w-auto max-w-40 text-bone drop-shadow-[0_0_0.8rem_#000] md:h-14 md:max-w-52' />
            </button>
          );
        })}
      </div>
      <div className='relative mt-1 flex items-center gap-2'>
        <span aria-hidden className='absolute top-1/2 left-1/2 h-px w-[min(20rem,70vw)] -translate-x-1/2 bg-linear-to-r from-transparent via-bone/30 to-transparent' />
        {arrows && (
          <button type='button' aria-label='Previous character' onClick={() => step(-1)} className='relative grid size-7 place-items-center rounded-md text-bone/55 transition-colors hover:text-bone focus-visible:outline-2 focus-visible:outline-bone'>
            <MdChevronLeft aria-hidden className='size-5' />
          </button>
        )}
        <div role='group' aria-label='Characters' className='relative flex items-center'>
          {peekStyle === 'strong' && <span aria-hidden className='lc-peek-rail' style={{ left: `calc(${current} * 1rem + 0.5rem)` }} />}
          {COVERS.map((c, i) => (
            <button
              key={c.id}
              type='button'
              onClick={() => pick(i)}
              aria-label={`${c.name}, ${GAMES[c.game].name}`}
              aria-current={i === current ? 'true' : undefined}
              className='group grid h-6 w-4 place-items-center rounded-xs focus-visible:outline-2 focus-visible:outline-bone'
            >
              <span
                aria-hidden
                className={clsx(
                  'block rounded-full transition-all duration-500',
                  i === current ? 'h-4 w-0.5 bg-(--lc-scene-glow) shadow-[0_0_0.5rem_var(--lc-scene-glow)]' : 'h-2 w-px bg-bone/45 group-hover:h-3 group-hover:bg-bone/80',
                )}
              />
            </button>
          ))}
        </div>
        {arrows && (
          <button type='button' aria-label='Next character' onClick={() => step(1)} className='relative grid size-7 place-items-center rounded-md text-bone/55 transition-colors hover:text-bone focus-visible:outline-2 focus-visible:outline-bone'>
            <MdChevronRight aria-hidden className='size-5' />
          </button>
        )}
      </div>
    </div>
  );

  // Which way a cover's layers move right now.
  const layer = (i: number) => (i === current ? (moved ? 'lc-pick-in' : undefined) : i === prev ? 'lc-pick-out' : 'lc-pick-off');

  return (
    <section
      ref={section}
      aria-labelledby='lc-title'
      style={{ '--art-ratio': ART_RATIO, '--accent': cover.glow, '--pick-dir': dir } as React.CSSProperties}
      className={clsx(
        'lc-snap relative isolate h-[200svh] overflow-x-clip',
        // The character starts 18px under the navbar, or under the logos when they're at the top.
        pickerTop ? '[--art-top:calc(5.5rem+var(--logos-h))]' : '[--art-top:5.5rem]',
        '[--cover:min(100vw,calc((100svh-var(--art-top))/var(--art-ratio)),48rem)] [--logos-h:3.75rem] md:[--logos-h:4.5rem]',
      )}
    >
      {/* The stage: every layer held for the first screen of scrolling while
          the next section (GamesSection) takes over; each layer's part in
          the hand-over is its lc-ho-* class (landing.css). */}
      <div
        ref={stage}
        onPointerDown={swipeStart}
        onPointerUp={swipeEnd}
        onPointerCancel={() => (swipe.current = null)}
        className='lc-cover-stage sticky top-0 grid h-svh touch-pan-y overflow-hidden'
      >
        {/* Backdrops: each theme's scene, sliding with the picker a little
            (oversized so its edges never show), washed in the theme's colour */}
        <div className='lc-ho-back -z-10 grid [grid-area:1/1]'>
          {COVERS.map((c, i) => (
            <div key={c.id} className='lc-pick-scene relative overflow-hidden [grid-area:1/1]'>
              <div className={clsx('absolute -inset-[6%]', layer(i))}>
                <Image
                  src={c.scene.src}
                  alt=''
                  fill
                  sizes='112vw'
                  loading='eager'
                  style={{ objectPosition: c.scene.position }}
                  className={clsx('object-cover brightness-[.55] saturate-[.75]', c.scene.flip && '-scale-x-100')}
                />
              </div>
              <div
                style={{ '--tint': c.tint } as React.CSSProperties}
                className={clsx(
                  'lc-grain absolute inset-0 transition-opacity [transition-duration:var(--pick-dur)]',
                  'bg-[radial-gradient(ellipse_at_50%_40%,color-mix(in_oklab,var(--tint)_40%,transparent),color-mix(in_oklab,var(--tint)_22%,rgb(10_8_9/.55))_45%,var(--lc-ink)_92%)]',
                  i === current ? 'opacity-100' : 'opacity-0',
                )}
              />
            </div>
          ))}
        </div>

        {/* Weather behind the character */}
        {weather.allowed && (
          <div aria-hidden className='lc-ho-fx pointer-events-none relative z-[5] [grid-area:1/1]'>
            <Atmosphere current={current} layer='back' running={weather.running} box={box} />
          </div>
        )}

        {/* Marks, behind the character */}
        <div className='lc-ho-mark pointer-events-none z-0 grid [grid-area:1/1]'>
          {COVERS.map((c, i) => {
            const mark = MARKS[c.mark];
            return (
              <div
                key={c.id}
                style={{ '--head-x': c.headX, '--mark-w': mark.width, '--mark-lift': c.head - mark.focus } as React.CSSProperties}
                onAnimationEnd={() => setPeek(false)}
                className={clsx(
                  'lc-pick-mark flex translate-x-[calc(var(--cover)*var(--head-x))] justify-center self-start pt-[calc(var(--art-top)+var(--cover)*var(--mark-lift))] [grid-area:1/1]',
                  peek && i === current && clsx('lc-peek lc-peek-mark', peekStyle === 'strong' && 'lc-peek-strong'),
                )}
              >
                <div className={layer(i)}>
                  <Mark mark={c.mark} />
                </div>
              </div>
            );
          })}
        </div>

        {/* The characters */}
        <div className={clsx('pointer-events-none z-10 flex justify-center [grid-area:1/1]', peek && 'lc-peek', peek && peekStyle === 'strong' && 'lc-peek-strong')}>
          {/* The bottom fade is on each image, not this box: a mask clips to its
              box, so a character sliding past the box's sides would be cut off
              in a hard vertical edge. */}
          <div ref={art} className='lc-ho-char relative mt-(--art-top) grid w-(--cover) self-start'>
            {COVERS.map((c, i) => (
              <div key={c.id} className={clsx('self-start [grid-area:1/1]', layer(i))}>
                <Image
                  src={c.src}
                  width={c.width}
                  height={c.height}
                  alt={i === current ? c.alt : ''}
                  preload={i === initial}
                  loading={i === initial ? undefined : 'eager'}
                  sizes='(max-width: 768px) 100vw, 48rem'
                  className='h-auto w-full [mask-image:linear-gradient(to_bottom,black_85%,transparent)]'
                />
              </div>
            ))}
          </div>
        </div>

        {/* Weather in front of the character */}
        {weather.allowed && (
          <div aria-hidden className='lc-ho-fx pointer-events-none relative z-[15] [grid-area:1/1]'>
            <Atmosphere current={current} layer='front' running={weather.running} box={box} />
          </div>
        )}

        {/* Spines */}
        <div aria-hidden className='lc-ho-spines pointer-events-none relative z-20 hidden text-bone/50 [grid-area:1/1] md:block'>
          <Spines />
          <span className='absolute bottom-0 left-[2.375rem] h-[12svh] w-px bg-current' />
          <span className='absolute right-[2.375rem] bottom-0 h-[12svh] w-px bg-current' />
        </div>

        {/* The sides of the stage turn the ring too, on devices that hover:
            the cursor and the logo on that side say which way. Hidden from
            assistive tech; the logos are the controls. */}
        <button type='button' aria-hidden tabIndex={-1} onClick={() => step(-1)} className='lc-half lc-half-prev absolute inset-y-0 left-0 z-[25] hidden w-[28%] cursor-w-resize [@media(hover:hover)]:block' />
        <button type='button' aria-hidden tabIndex={-1} onClick={() => step(1)} className='lc-half lc-half-next absolute inset-y-0 right-0 z-[25] hidden w-[28%] cursor-e-resize [@media(hover:hover)]:block' />

        {/* Cover text: the picker (at the top or the foot), the tagline and the buttons */}
        <div className='pointer-events-none relative z-30 flex flex-col items-center px-5 [grid-area:1/1]'>
          <div className='lc-ho-foot absolute inset-x-0 bottom-0 -z-10 h-[58svh] bg-linear-to-t from-[#0a0809] from-10% via-[#0a0809]/60 to-transparent' />
          {/* No visible title: the navbar carries the wordmark and the character gets the room. */}
          <h1 id='lc-title' className='sr-only'>
            Elysium, a character vault for the World of Darkness
          </h1>

          {pickerTop && <div className='lc-ho-logos mt-[5.5rem] w-full'>{pickerUi}</div>}
          {tagline === 'top' && <Tagline game={cover.game} className={clsx('lc-ho-logos justify-items-center text-center text-xl md:text-2xl', pickerTop ? 'mt-3' : 'mt-[6.5rem]')} />}
          <p aria-live='polite' className='sr-only'>
            {cover.name}, {GAMES[cover.game].title}
          </p>

          <div className='lc-ho-foot pointer-events-auto mt-auto mb-[4svh] flex w-full max-w-3xl flex-col items-center gap-4 text-center'>
            {!pickerTop && pickerUi}
            {(tagline === 'foot' || tagline === 'side') && (
              <Tagline game={cover.game} className={clsx('justify-items-center text-xl text-balance md:text-2xl', tagline === 'side' && 'md:hidden')} />
            )}
            <div className='flex flex-wrap items-center justify-center gap-3'>
              <Link href='/vault/new' className='lc-btn lc-btn-cover lc-btn-ghost lc-btn-glow'>
                Create a character
                <MdArrowOutward aria-hidden />
              </Link>
              <a href='#games' onClick={learnMore} className='lc-btn lc-btn-cover lc-btn-ghost'>
                Learn more
                <MdArrowDownward aria-hidden />
              </a>
            </div>
          </div>

          {/* The tagline set large at the side, beside the character (wide screens) */}
          {tagline === 'side' && (
            <Tagline
              game={cover.game}
              className='lc-ho-foot absolute bottom-[34svh] left-[max(5.5rem,7vw)] hidden max-w-[13ch] text-left text-4xl leading-[1.05] md:grid lg:text-5xl xl:max-w-[14ch]'
            />
          )}
        </div>
      </div>
    </section>
  );
}
