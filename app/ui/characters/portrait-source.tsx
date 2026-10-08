'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { GAMES, GAMES_ORDER, type Game } from '@/app/lib/games';
import { PORTRAIT_LIBRARY } from '@/app/lib/portrait-library';
import { PORTRAIT_MAX_BYTES, PORTRAIT_SIZE } from '@/app/lib/portraits';
import ImageCropper, { type CropRect } from './ImageCropper';

// Anything bigger is almost certainly not a photo we can decode comfortably.
const MAX_INPUT_BYTES = 30 * 1024 * 1024;

function encode(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

/*
  Draws the chosen part of the image, scaled down to PORTRAIT_SIZE, and
  re-encodes it. Re-encoding also drops EXIF data such as GPS location.
*/
async function prepare(bitmap: ImageBitmap, rect: CropRect): Promise<Blob> {
  const scale = Math.min(1, PORTRAIT_SIZE.width / rect.sw);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(rect.sw * scale));
  canvas.height = Math.max(1, Math.round(rect.sh * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no canvas');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, canvas.width, canvas.height);
  // WebP where the browser can encode it (Safari can't), JPEG otherwise.
  for (const quality of [0.86, 0.75, 0.6]) {
    let blob = await encode(canvas, 'image/webp', quality);
    if (blob?.type !== 'image/webp') blob = await encode(canvas, 'image/jpeg', quality);
    if (blob && blob.size <= PORTRAIT_MAX_BYTES) return blob;
  }
  throw new Error('too large');
}

// The built-in portraits, the current game's first.
function LibraryDialog({ game, onPick, onClose }: { game: Game; onPick: (src: string) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => dialog.current?.showModal(), []);
  const order = [game, ...GAMES_ORDER.filter((g) => g !== game)];
  return (
    <dialog
      ref={dialog}
      aria-label='Choose a portrait'
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
      className='m-auto max-h-[88svh] w-[min(46rem,94vw)] overflow-y-auto rounded-2xl border border-bone/15 bg-ink p-5 text-bone shadow-[0_2rem_6rem_rgb(0_0_0/0.8)] backdrop:bg-black/60 backdrop:backdrop-blur-md'
    >
      <div className='flex items-baseline justify-between gap-3'>
        <h2 className='font-display text-2xl'>Choose a portrait</h2>
        <button type='button' aria-label='Close' onClick={onClose} className='grid size-9 place-items-center rounded-full text-bone/70 hover:bg-bone/[0.06] hover:text-bone'>
          <MdClose aria-hidden className='size-5' />
        </button>
      </div>
      <p className='mt-1 text-sm text-bone/60'>Pick one, then frame it.</p>
      {order.map((g) => (
        <section key={g} aria-label={GAMES[g].name} className='mt-5'>
          <h3 className='text-[0.65rem] tracking-[0.25em] text-bone/50 uppercase'>{GAMES[g].name}</h3>
          <ul className='mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5'>
            {PORTRAIT_LIBRARY[g].map((p) => (
              <li key={p.src}>
                <button
                  type='button'
                  onClick={() => onPick(p.src)}
                  className='group relative block aspect-[3/4] w-full overflow-hidden rounded-xl bg-bone/5 ring-1 ring-bone/10 transition hover:ring-2 hover:ring-accent focus-visible:outline-2 focus-visible:outline-accent'
                >
                  <Image src={p.src} alt={p.label} fill sizes='9rem' className='object-cover object-top transition-transform duration-500 group-hover:scale-105' />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </dialog>
  );
}

/*
  Where a portrait comes from: an upload or the built-in library, framed in
  the cropper, then handed back ready to save (resized, EXIF stripped).
  Render `elements` once somewhere in the component.
*/
export function usePortraitSource({ game, onReady, onError }: { game: Game; onReady: (blob: Blob) => void; onError: (message: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [library, setLibrary] = useState(false);
  const [cropping, setCropping] = useState<{ bitmap: ImageBitmap; url: string; revoke: boolean } | null>(null);

  const chooseFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return onError('That file isn’t an image.');
    if (file.size > MAX_INPUT_BYTES) return onError('That image is too large to use (30 MB at most).');
    try {
      const bitmap = await createImageBitmap(file);
      setCropping({ bitmap, url: URL.createObjectURL(file), revoke: true });
    } catch {
      onError('Couldn’t read that image. Try a JPEG or PNG.');
    }
  };

  const chooseLibrary = async (src: string) => {
    setLibrary(false);
    try {
      const blob = await (await fetch(src)).blob();
      setCropping({ bitmap: await createImageBitmap(blob), url: src, revoke: false });
    } catch {
      onError('Couldn’t load that portrait. Try another.');
    }
  };

  const close = () => {
    if (cropping) {
      if (cropping.revoke) URL.revokeObjectURL(cropping.url);
      cropping.bitmap.close();
    }
    setCropping(null);
  };

  const confirm = async (rect: CropRect) => {
    if (!cropping) return;
    try {
      const blob = await prepare(cropping.bitmap, rect);
      close();
      onReady(blob);
    } catch {
      close();
      onError('Couldn’t prepare that image. Try another one.');
    }
  };

  const elements = (
    <>
      <input
        ref={input}
        type='file'
        accept='image/*'
        className='sr-only'
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          void chooseFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {library && <LibraryDialog game={game} onPick={(src) => void chooseLibrary(src)} onClose={() => setLibrary(false)} />}
      {cropping && <ImageCropper url={cropping.url} width={cropping.bitmap.width} height={cropping.bitmap.height} onCancel={close} onConfirm={(r) => void confirm(r)} />}
    </>
  );

  return { openFile: () => input.current?.click(), openLibrary: () => setLibrary(true), chooseFile, elements };
}
