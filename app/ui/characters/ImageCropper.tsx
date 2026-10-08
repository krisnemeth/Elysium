'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type WheelEvent } from 'react';
import { MdZoomIn, MdZoomOut } from 'react-icons/md';
import { buttonGhost, buttonPrimary } from '@/app/ui/kit/styles';

export type CropRect = { sx: number; sy: number; sw: number; sh: number };

const MAX_ZOOM = 4;
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/*
  Choose which part of an image becomes the portrait: drag to move it, zoom
  with the slider, the wheel, a pinch or +/−; arrow keys move it too. The
  frame has the portrait's 3:4 shape. Opens on the automatic crop (centred,
  faces near the top), so confirming straight away matches the old result.
*/
export default function ImageCropper({
  url,
  width: iw,
  height: ih,
  aspect = 3 / 4,
  onCancel,
  onConfirm,
}: {
  url: string;
  width: number;
  height: number;
  aspect?: number;
  onCancel: () => void;
  onConfirm: (rect: CropRect) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(300);
  const H = W / aspect;
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; zoom: number } | null>(null);

  const base = Math.max(W / iw, H / ih);
  const dw = iw * base * zoom;
  const dh = ih * base * zoom;
  const fit = useCallback((x: number, y: number, w: number, h: number) => ({ x: clamp(x, W - w, 0), y: clamp(y, H - h, 0) }), [W, H]);
  // Until moved, sit on the automatic crop.
  const at = pos ?? { x: (W - dw) / 2, y: (H - dh) * 0.2 };

  useEffect(() => {
    dialog.current?.showModal();
    const measure = () => frame.current && setW(frame.current.clientWidth);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Zoom around the frame's centre, keeping that point of the image in place.
  const zoomTo = (next: number) => {
    const z = clamp(next, 1, MAX_ZOOM);
    const k = z / zoom;
    const cx = W / 2;
    const cy = H / 2;
    setZoom(z);
    setPos(fit(cx - (cx - at.x) * k, cy - (cy - at.y) * k, iw * base * z, ih * base * z));
  };
  const moveBy = (dx: number, dy: number) => setPos(fit(at.x + dx, at.y + dy, dw, dh));

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom };
    }
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const last = pointers.current.get(e.pointerId);
    if (!last) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      zoomTo((pinch.current.zoom * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.current.dist);
    } else if (pointers.current.size === 1) {
      moveBy(e.clientX - last.x, e.clientY - last.y);
    }
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };
  const onWheel = (e: WheelEvent<HTMLDivElement>) => zoomTo(zoom * (e.deltaY < 0 ? 1.08 : 1 / 1.08));
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 40 : 10;
    const moves: Record<string, [number, number]> = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    if (moves[e.key]) {
      e.preventDefault();
      moveBy(...moves[e.key]);
    } else if (e.key === '+' || e.key === '=') zoomTo(zoom * 1.1);
    else if (e.key === '-') zoomTo(zoom / 1.1);
  };

  const confirm = () => {
    const s = base * zoom;
    onConfirm({ sx: -at.x / s, sy: -at.y / s, sw: W / s, sh: H / s });
  };

  return (
    <dialog
      ref={dialog}
      aria-label='Crop the portrait'
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      className='m-auto w-[min(26rem,92vw)] rounded-2xl border border-bone/15 bg-ink p-5 text-bone shadow-[0_2rem_6rem_rgb(0_0_0/0.8)] backdrop:bg-black/60 backdrop:backdrop-blur-md'
    >
      <h2 className='font-display text-2xl'>Frame the portrait</h2>
      <p className='mt-1 text-sm text-bone/60'>Drag to move, zoom to fit. Arrow keys and + / − work too.</p>

      <div
        ref={frame}
        tabIndex={0}
        role='img'
        aria-label='Portrait crop area'
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        className='relative mt-4 w-full cursor-grab touch-none overflow-hidden rounded-xl bg-black outline-none select-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-accent'
        style={{ height: H }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- a local object URL, moved and scaled by hand */}
        <img src={url} alt='' draggable={false} className='pointer-events-none absolute max-w-none' style={{ left: at.x, top: at.y, width: dw, height: dh }} />
        {/* Rule-of-thirds guides */}
        <div aria-hidden className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_33.2%,rgb(255_255_255/0.18)_33.3%,transparent_33.5%,transparent_66.5%,rgb(255_255_255/0.18)_66.6%,transparent_66.8%),linear-gradient(to_bottom,transparent_33.2%,rgb(255_255_255/0.18)_33.3%,transparent_33.5%,transparent_66.5%,rgb(255_255_255/0.18)_66.6%,transparent_66.8%)]' />
      </div>

      <div className='mt-4 flex items-center gap-3'>
        <button type='button' aria-label='Zoom out' onClick={() => zoomTo(zoom / 1.2)} className='text-bone/70 hover:text-bone'>
          <MdZoomOut aria-hidden className='size-5' />
        </button>
        <input
          type='range'
          min={1}
          max={MAX_ZOOM}
          step={0.01}
          value={zoom}
          aria-label='Zoom'
          onChange={(e) => zoomTo(Number(e.target.value))}
          className='grow accent-[var(--accent)]'
        />
        <button type='button' aria-label='Zoom in' onClick={() => zoomTo(zoom * 1.2)} className='text-bone/70 hover:text-bone'>
          <MdZoomIn aria-hidden className='size-5' />
        </button>
      </div>

      <div className='mt-5 flex justify-end gap-3'>
        <button type='button' onClick={onCancel} className={buttonGhost}>
          Cancel
        </button>
        <button type='button' onClick={confirm} className={buttonPrimary}>
          Use this crop
        </button>
      </div>
    </dialog>
  );
}
