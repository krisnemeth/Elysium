'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useId, useRef, useState, useTransition, type DragEvent } from 'react';
import { MdAddPhotoAlternate, MdDeleteOutline } from 'react-icons/md';
import clsx from 'clsx';
import type { Game } from '@/app/lib/games';
import { removePortrait, setPortrait } from '@/app/lib/actions/characters';
import { PORTRAIT_MAX_BYTES, PORTRAIT_SIZE, isUploadedPortrait } from '@/app/lib/portraits';
import { buttonGhost } from '@/app/ui/kit/styles';

// Anything bigger is almost certainly not a photo we can decode comfortably.
const MAX_INPUT_BYTES = 30 * 1024 * 1024;

function encode(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

/*
  Crops to 3:4 (keeping the upper part of tall photos, where faces usually
  are), scales down to PORTRAIT_SIZE and re-encodes. Re-encoding also drops
  EXIF data such as GPS location.
*/
async function prepare(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const ratio = PORTRAIT_SIZE.width / PORTRAIT_SIZE.height;
  let sw = bitmap.width;
  let sh = bitmap.height;
  let sx = 0;
  let sy = 0;
  if (sw / sh > ratio) {
    sw = Math.round(sh * ratio);
    sx = Math.round((bitmap.width - sw) / 2);
  } else {
    sh = Math.round(sw / ratio);
    sy = Math.round((bitmap.height - sh) * 0.2);
  }
  const scale = Math.min(1, PORTRAIT_SIZE.width / sw);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(sw * scale);
  canvas.height = Math.round(sh * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no canvas');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  // WebP where the browser can encode it (Safari can't), JPEG otherwise.
  for (const quality of [0.86, 0.75, 0.6]) {
    let blob = await encode(canvas, 'image/webp', quality);
    if (blob?.type !== 'image/webp') blob = await encode(canvas, 'image/jpeg', quality);
    if (blob && blob.size <= PORTRAIT_MAX_BYTES) return blob;
  }
  throw new Error('too large');
}

export default function PortraitPicker({
  id,
  game,
  name,
  src: initialSrc,
  variant = 'panel',
}: {
  id: string;
  game: Game;
  name: string;
  src: string;
  // `panel` shows its own thumbnail; `overlay` sits on a portrait the page already shows.
  variant?: 'panel' | 'overlay';
}) {
  const router = useRouter();
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState(initialSrc);
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(false);
  const [pending, startTransition] = useTransition();
  const custom = isUploadedPortrait(src);

  const upload = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return setMessage('That file isn’t an image.');
    if (file.size > MAX_INPUT_BYTES) return setMessage('That image is too large to use (30 MB at most).');
    setMessage('Uploading…');
    startTransition(async () => {
      let blob: Blob;
      try {
        blob = await prepare(file);
      } catch {
        setMessage('Couldn’t read that image. Try a JPEG or PNG.');
        return;
      }
      const form = new FormData();
      form.append('portrait', blob, 'portrait');
      const result = await setPortrait(id, game, form);
      if (!result.ok) return setMessage(result.error);
      setSrc(result.src);
      setMessage('Portrait updated.');
      router.refresh();
    });
  };

  const remove = () =>
    startTransition(async () => {
      setMessage('Removing…');
      const result = await removePortrait(id, game);
      if (!result.ok) return setMessage(result.error);
      setSrc(result.src);
      setMessage('Portrait removed.');
      router.refresh();
    });

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    upload(e.dataTransfer.files[0]);
  };

  const fileInput = (
    <input
      ref={input}
      id={inputId}
      type='file'
      accept='image/*'
      className='sr-only'
      tabIndex={-1}
      onChange={(e) => {
        upload(e.target.files?.[0]);
        e.target.value = '';
      }}
    />
  );

  const buttons = (
    <div className='flex flex-wrap items-center gap-2'>
      <button type='button' onClick={() => input.current?.click()} disabled={pending} className={`${buttonGhost} bg-ink/70 px-4 py-1.5 text-xs backdrop-blur-md`}>
        <MdAddPhotoAlternate aria-hidden className='size-4' />
        {custom ? 'Change portrait' : 'Upload portrait'}
      </button>
      {custom && (
        <button type='button' onClick={remove} disabled={pending} className={`${buttonGhost} bg-ink/70 px-4 py-1.5 text-xs backdrop-blur-md`}>
          <MdDeleteOutline aria-hidden className='size-4' /> Remove
        </button>
      )}
    </div>
  );

  const status = (
    <p role='status' className='min-h-4 text-xs text-bone/60'>
      {message}
    </p>
  );

  if (variant === 'overlay') {
    return (
      <div
        className={clsx('group absolute inset-0 flex flex-col justify-end gap-2 p-4 transition-colors', dragging && 'bg-accent/20 ring-2 ring-accent ring-inset')}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {fileInput}
        {/* On devices with a mouse, the controls appear on hover or keyboard focus. */}
        <div className={clsx('transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100', !message && !dragging && 'pointer-fine:opacity-0')}>
          {buttons}
        </div>
        {message && status}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex items-center gap-5 rounded-2xl border border-dashed p-4 transition-colors',
        dragging ? 'border-accent bg-accent/10' : 'border-bone/15',
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <div className={clsx('relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-xl bg-bone/5', pending && 'animate-pulse')}>
        <Image src={src} alt={`Portrait of ${name || 'this character'}.`} fill sizes='5rem' unoptimized={isUploadedPortrait(src)} className='object-cover' />
      </div>
      <div className='flex min-w-0 flex-col gap-2'>
        <label htmlFor={inputId} className='font-display text-lg leading-tight'>
          Portrait
        </label>
        <p className='text-xs leading-relaxed text-bone/50'>JPEG, PNG or WebP. Drop an image here or upload one; it’s cropped to 3:4.</p>
        {fileInput}
        {buttons}
        {status}
      </div>
    </div>
  );
}
