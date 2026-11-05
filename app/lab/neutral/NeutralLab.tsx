'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { buttonGhostSmall } from '@/app/ui/kit/styles';

const BACKDROPS = [
  { label: 'None', value: 'none' },
  { label: 'City at night', value: 'url(/art/city-night.webp)' },
  { label: 'Overgrown graves', value: 'url(/art/lore-dark.webp)' },
  { label: 'Old study', value: 'url(/art/sheet-study.webp)' },
  { label: 'Location: hook', value: 'url(/acts/hook.webp)' },
  { label: 'Location: dig', value: 'url(/acts/dig.webp)' },
  { label: 'Location: twist', value: 'url(/acts/twist.webp)' },
  { label: 'Location: clash', value: 'url(/acts/clash.webp)' },
  { label: 'Location: after', value: 'url(/acts/after.webp)' },
];
const INKS = [
  { label: 'Ash', value: '#0b0b0c' },
  { label: 'Warm', value: '#0f0c0a' },
  { label: 'Cold', value: '#090c10' },
];
const FRAMES = ['none', 'hairline', 'corners'] as const;

type Look = {
  image: string;
  ink: string;
  frame: (typeof FRAMES)[number];
  bright: number;
  blur: number;
  dim: number;
  vignette: number;
  grain: number;
  panel: number;
  border: number;
  gray: number;
  rest: number;
  rowGray: number;
  glow: number;
};

const CITY: Look = { image: BACKDROPS[1].value, ink: '#0b0b0c', frame: 'hairline', bright: 0.8, blur: 0, dim: 0.75, vignette: 0.5, grain: 0.6, panel: 0.72, border: 0.1, gray: 1, rest: 0.7, rowGray: 0.5, glow: 1 };
const PRESETS: Record<string, Look> = {
  City: CITY,
  Ash: { ...CITY, image: 'none', grain: 0.25, vignette: 0.3, panel: 0.6 },
  Graves: { ...CITY, image: BACKDROPS[2].value, bright: 1, dim: 0.6 },
};

const SLIDERS: { key: keyof Look; label: string; min: number; max: number; step: number; css: string; unit?: string }[] = [
  { key: 'bright', label: 'Backdrop brightness', min: 0.2, max: 1.6, step: 0.05, css: '--n-bright' },
  { key: 'blur', label: 'Backdrop blur', min: 0, max: 16, step: 1, css: '--n-blur', unit: 'px' },
  { key: 'dim', label: 'Darkening', min: 0, max: 1, step: 0.05, css: '--n-dim' },
  { key: 'vignette', label: 'Vignette', min: 0, max: 1, step: 0.05, css: '--n-vignette' },
  { key: 'grain', label: 'Film grain', min: 0, max: 0.6, step: 0.01, css: '--n-grain' },
  { key: 'panel', label: 'Panel darkness', min: 0, max: 1, step: 0.02, css: '--n-panel' },
  { key: 'border', label: 'Panel border', min: 0, max: 0.4, step: 0.01, css: '--n-border' },
  { key: 'gray', label: 'Game art: grey at rest', min: 0, max: 1, step: 0.05, css: '--n-gray' },
  { key: 'rest', label: 'Game art: strength at rest', min: 0.2, max: 1, step: 0.05, css: '--n-rest' },
  { key: 'rowGray', label: 'Portraits in lists: grey at rest', min: 0, max: 1, step: 0.05, css: '--n-row-gray' },
  { key: 'glow', label: 'Game colour glow', min: 0, max: 2, step: 0.05, css: '--n-glow' },
];

const VIEWS = [
  { id: 'overview', label: 'Overview' },
  { id: 'new', label: 'New character' },
  { id: 'loresheets', label: 'Loresheets' },
  { id: 'settings', label: 'Settings' },
  { id: 'login', label: 'Log in' },
];

const KEY = 'elysium-neutral-lab';

function load(): Look {
  try {
    return { ...CITY, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') };
  } catch {
    return CITY;
  }
}

// The lab's controls: they change the --n-* values on the page, and pages' links and forms are switched off.
export default function NeutralLab({ view }: { view: string }) {
  const [look, setLook] = useState<Look>(CITY);
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  // Read after mounting, as the server can't see localStorage.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLook(load());
  }, []);

  useEffect(() => {
    const ground = document.querySelector<HTMLElement>('[data-neutral]');
    if (!ground) return;
    ground.style.setProperty('--n-image', look.image);
    ground.style.setProperty('--n-ink', look.ink);
    ground.dataset.nFrame = look.frame;
    for (const s of SLIDERS) ground.style.setProperty(s.css, `${look[s.key]}${s.unit ?? ''}`);
    localStorage.setItem(KEY, JSON.stringify(look));
  }, [look, view]);

  useEffect(() => {
    const stop = (e: Event) => {
      if (e.type === 'submit' || (e.target instanceof Element && e.target.closest('a[href]'))) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const ground = document.querySelector('[data-neutral]');
    ground?.addEventListener('click', stop, true);
    ground?.addEventListener('submit', stop, true);
    return () => {
      ground?.removeEventListener('click', stop, true);
      ground?.removeEventListener('submit', stop, true);
    };
  }, [view]);

  const set = <K extends keyof Look>(key: K, value: Look[K]) => setLook((l) => ({ ...l, [key]: value }));
  const label = 'block text-[0.65rem] tracking-[0.15em] text-[#ece8e1]/55 uppercase';
  const chip = (on: boolean) => `rounded-md px-2 py-1 text-xs transition-colors ${on ? 'bg-[#ece8e1] text-black' : 'text-[#ece8e1]/70 hover:bg-white/10'}`;

  return (
    <aside aria-label='Neutral theme lab' className='fixed right-3 bottom-3 z-[100] flex max-h-[62svh] w-72 flex-col rounded-xl border border-white/20 bg-black/90 text-sm text-[#ece8e1] shadow-2xl backdrop-blur-md'>
      <button type='button' onClick={() => setOpen((o) => !o)} aria-expanded={open} className='flex items-center justify-between px-3 py-2.5 font-semibold'>
        Neutral theme lab
        {open ? <MdExpandMore aria-hidden className='size-5' /> : <MdExpandLess aria-hidden className='size-5' />}
      </button>
      {open && (
        <div className='flex min-h-0 flex-col gap-4 overflow-y-auto border-t border-white/10 p-3'>
          <div>
            <span className={label}>Page</span>
            <div className='mt-1 flex flex-wrap gap-1'>
              {VIEWS.map((v) => (
                <Link key={v.id} href={`/lab/neutral?view=${v.id}`} aria-current={v.id === view ? 'page' : undefined} className={chip(v.id === view)}>{v.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <span className={label}>Start from</span>
            <div className='mt-1 flex flex-wrap gap-1'>
              {Object.entries(PRESETS).map(([name, preset]) => (
                <button key={name} type='button' onClick={() => setLook(preset)} className={chip(false)}>{name}</button>
              ))}
            </div>
          </div>
          <label>
            <span className={label}>Backdrop</span>
            <select value={look.image} onChange={(e) => set('image', e.target.value)} className='mt-1 w-full rounded-md border border-white/20 bg-black px-2 py-1.5 text-xs'>
              {BACKDROPS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </label>
          <div>
            <span className={label}>Black</span>
            <div className='mt-1 flex gap-1'>
              {INKS.map((i) => <button key={i.value} type='button' aria-pressed={look.ink === i.value} onClick={() => set('ink', i.value)} className={chip(look.ink === i.value)}>{i.label}</button>)}
            </div>
          </div>
          <div>
            <span className={label}>Panel edges</span>
            <div className='mt-1 flex gap-1'>
              {FRAMES.map((f) => <button key={f} type='button' aria-pressed={look.frame === f} onClick={() => set('frame', f)} className={`capitalize ${chip(look.frame === f)}`}>{f}</button>)}
            </div>
          </div>
          {SLIDERS.map((s) => (
            <label key={s.key}>
              <span className={`${label} flex justify-between`}>
                {s.label}
                <span className='tabular-nums'>{look[s.key]}{s.unit}</span>
              </span>
              <input type='range' min={s.min} max={s.max} step={s.step} value={look[s.key] as number} onChange={(e) => set(s.key, Number(e.target.value) as never)} className='mt-1 w-full accent-[#ece8e1]' />
            </label>
          ))}
          <button
            type='button'
            className={buttonGhostSmall}
            onClick={async () => {
              await navigator.clipboard.writeText(JSON.stringify(look));
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? 'Copied' : 'Copy these settings'}
          </button>
        </div>
      )}
    </aside>
  );
}
