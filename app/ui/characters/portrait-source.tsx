'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { MdClose } from 'react-icons/md';
import { GAMES, GAMES_ORDER, type Game } from '@/app/lib/games';
import { IMAGE_KINDS, IMAGE_KINDS_ORDER, PORTRAIT_TARGET, libraryImages, type ImageKind, type ImageTarget } from '@/app/lib/image-library';
import { FULL_GUIDE, portraitGuide } from '@/app/lib/image-frames';
import { PORTRAIT_MAX_BYTES } from '@/app/lib/portraits';
import ImageCropper, { type CropRect } from './ImageCropper';

// Anything bigger is almost certainly not a photo we can decode comfortably.
const MAX_INPUT_BYTES = 30 * 1024 * 1024;

function encode(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

/*
  Draws the chosen part of the image, scaled down to the target's width, and
  re-encodes it. Re-encoding also drops EXIF data such as GPS location.
*/
async function prepare(bitmap: ImageBitmap, rect: CropRect, width: number): Promise<Blob> {
  const scale = Math.min(1, width / rect.sw);
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

// The library's art, the current game's first. Opens on the kinds that suit
// the target (portraits: characters); the chips widen or narrow that.
function LibraryDialog({ game, target, onPick, onClose }: { game: Game; target: ImageTarget; onPick: (src: string) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => dialog.current?.showModal(), []);
  const [filter, setFilter] = useState<'suggested' | 'all' | ImageKind>('suggested');
  const all = libraryImages();
  const kindsWithArt = IMAGE_KINDS_ORDER.filter((k) => all.some((i) => i.kind === k));
  const kinds = filter === 'suggested' ? target.kinds : filter === 'all' ? undefined : [filter];
  const order: (Game | 'any')[] = [game, ...GAMES_ORDER.filter((g) => g !== game), 'any'];
  const sections = order
    .map((g) => ({ g, images: all.filter((i) => i.game === g && (!kinds || kinds.includes(i.kind))) }))
    .filter((s) => s.images.length > 0);
  const wide = target.aspect > 1;
  const chip = (value: typeof filter, label: string) => (
    <button
      key={value}
      type='button'
      aria-pressed={filter === value}
      onClick={() => setFilter(value)}
      className={clsx(
        'rounded-full border px-3 py-1 text-xs transition-colors',
        filter === value ? 'border-accent bg-accent/15 text-bone' : 'border-bone/20 text-bone/65 hover:border-bone/50 hover:text-bone',
      )}
    >
      {label}
    </button>
  );
  return (
    <dialog
      ref={dialog}
      aria-label={`Choose a ${target.noun}`}
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
        <h2 className='font-display text-2xl'>Choose a {target.noun}</h2>
        <button type='button' aria-label='Close' onClick={onClose} className='grid size-9 place-items-center rounded-full text-bone/70 hover:bg-bone/[0.06] hover:text-bone'>
          <MdClose aria-hidden className='size-5' />
        </button>
      </div>
      <p className='mt-1 text-sm text-bone/60'>Pick one, then frame it.</p>
      <div role='group' aria-label='Kind of art' className='mt-3 flex flex-wrap gap-2'>
        {chip('suggested', 'Suggested')}
        {kindsWithArt.length > 1 && chip('all', 'Everything')}
        {kindsWithArt.map((k) => chip(k, IMAGE_KINDS[k].plural))}
      </div>
      {sections.length === 0 && <p className='mt-6 text-sm text-bone/55'>Nothing of that kind yet.</p>}
      {sections.map(({ g, images }) => (
        <section key={g} aria-label={g === 'any' ? 'Any game' : GAMES[g].name} className='mt-5'>
          <h3 className='text-[0.65rem] tracking-[0.25em] text-bone/50 uppercase'>{g === 'any' ? 'Any game' : GAMES[g].name}</h3>
          <ul className={clsx('mt-2 grid gap-2', wide ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-3 sm:grid-cols-5')}>
            {images.map((p) => (
              <li key={p.src}>
                <button
                  type='button'
                  onClick={() => onPick(p.src)}
                  title={p.label}
                  style={{ aspectRatio: target.aspect }}
                  className='group relative block w-full overflow-hidden rounded-xl bg-bone/5 ring-1 ring-bone/10 transition hover:ring-2 hover:ring-accent focus-visible:outline-2 focus-visible:outline-accent'
                >
                  <Image src={p.src} alt={p.label} fill sizes={wide ? '15rem' : '9rem'} className='object-cover object-top transition-transform duration-500 group-hover:scale-105' />
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
  Where a picture comes from: an upload or the image library, framed in the
  cropper (guided by the card's own shape), then handed back ready to save
  (resized, EXIF stripped). Portraits by default; loresheets pass their own
  target. Render `elements` once somewhere in the component.
*/
export function usePortraitSource({
  game,
  target = PORTRAIT_TARGET,
  onReady,
  onError,
}: {
  game: Game;
  target?: ImageTarget;
  onReady: (blob: Blob) => void;
  onError: (message: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [library, setLibrary] = useState(false);
  const [cropping, setCropping] = useState<{ bitmap: ImageBitmap; url: string; revoke: boolean } | null>(null);

  // If the component goes away with the cropper open, free its image too.
  const open = useRef(cropping);
  useEffect(() => {
    open.current = cropping;
  }, [cropping]);
  useEffect(
    () => () => {
      const c = open.current;
      if (!c) return;
      if (c.revoke) URL.revokeObjectURL(c.url);
      c.bitmap.close();
    },
    [],
  );

  // A portrait is framed by the character card of the scene the player is in.
  const guide = () =>
    target.frame === 'card' ? portraitGuide(game, document.documentElement.dataset.theme === 'light' ? 'light' : 'dark') : FULL_GUIDE;
  const [shape, setShape] = useState(FULL_GUIDE);

  const chooseFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return onError('That file isn’t an image.');
    if (file.size > MAX_INPUT_BYTES) return onError('That image is too large to use (30 MB at most).');
    try {
      const bitmap = await createImageBitmap(file);
      setShape(guide());
      setCropping({ bitmap, url: URL.createObjectURL(file), revoke: true });
    } catch {
      onError('Couldn’t read that image. Try a JPEG or PNG.');
    }
  };

  const chooseLibrary = async (src: string) => {
    setLibrary(false);
    try {
      const blob = await (await fetch(src)).blob();
      const bitmap = await createImageBitmap(blob);
      setShape(guide());
      setCropping({ bitmap, url: src, revoke: false });
    } catch {
      onError(`Couldn’t load that ${target.noun}. Try another.`);
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
      const blob = await prepare(cropping.bitmap, rect, target.width);
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
      {library && <LibraryDialog game={game} target={target} onPick={(src) => void chooseLibrary(src)} onClose={() => setLibrary(false)} />}
      {cropping && <ImageCropper url={cropping.url} width={cropping.bitmap.width} height={cropping.bitmap.height} aspect={target.aspect} guide={shape} noun={target.noun} onCancel={close} onConfirm={(r) => void confirm(r)} />}
    </>
  );

  return { openFile: () => input.current?.click(), openLibrary: () => setLibrary(true), chooseFile, elements };
}
