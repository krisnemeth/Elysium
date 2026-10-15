'use client';

import Image from 'next/image';
import { useState, useTransition, type DragEvent } from 'react';
import { MdAddPhotoAlternate, MdDeleteOutline, MdPhotoLibrary } from 'react-icons/md';
import clsx from 'clsx';
import type { Game } from '@/app/lib/games';
import { LORE_TARGETS } from '@/app/lib/image-library';
import { LORE_KINDS, type LoreKind } from '@/app/lib/loresheets';
import { removeLoresheetImage, setLoresheetImage } from '@/app/lib/actions/lore-images';
import { buttonGhost } from '@/app/ui/kit/styles';
import { usePortraitSource } from '@/app/ui/characters/portrait-source';
import { LORE_ICONS } from './icons';

// The loresheet's picture, shown the way the list shows it: wide for places,
// tall for people. Empty, it's the kind's icon on a plain tile.
export function LoreImage({ src, kind, alt, sizes, className }: { src: string | null; kind: LoreKind; alt: string; sizes: string; className?: string }) {
  const Icon = LORE_ICONS[kind];
  return (
    <div className={clsx('relative overflow-hidden bg-bone/5', className)} style={{ aspectRatio: LORE_TARGETS[kind].aspect }}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} unoptimized={src.startsWith('/media/')} className='object-cover' />
      ) : (
        <Icon aria-hidden className='absolute inset-0 m-auto size-1/4 min-w-5 text-bone/20' />
      )}
    </div>
  );
}

// Upload or choose from the image library, frame it, save it. Same cropper as portraits.
export default function LoreImagePicker({ id, game, kind, title, src: initialSrc }: { id: string; game: Game; kind: LoreKind; title: string; src: string | null }) {
  const [src, setSrc] = useState(initialSrc);
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(false);
  const [pending, startTransition] = useTransition();
  const target = LORE_TARGETS[kind];
  const wide = target.aspect > 1;

  const save = (blob: Blob) => {
    setMessage('Uploading…');
    startTransition(async () => {
      const form = new FormData();
      form.append('image', blob, 'image');
      const result = await setLoresheetImage(id, game, form);
      if (!result.ok) return setMessage(result.error);
      setSrc(result.src);
      setMessage('Picture updated.');
    });
  };
  const source = usePortraitSource({ game, target, onReady: save, onError: setMessage });

  const remove = () =>
    startTransition(async () => {
      setMessage('Removing…');
      const result = await removeLoresheetImage(id, game);
      if (!result.ok) return setMessage(result.error);
      setSrc(null);
      setMessage('Picture removed.');
    });

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void source.chooseFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className={clsx(
        'flex flex-col gap-4 rounded-2xl border border-dashed p-4 transition-colors sm:flex-row sm:items-center sm:gap-5',
        dragging ? 'border-accent bg-accent/10' : 'border-bone/15',
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <LoreImage
        src={src}
        kind={kind}
        alt={src ? `Picture for ${title || `this ${LORE_KINDS[kind].noun}`}.` : ''}
        sizes={wide ? '16rem' : '7rem'}
        className={clsx('shrink-0 rounded-xl', wide ? 'w-full sm:w-64' : 'w-28', pending && 'animate-pulse')}
      />
      <div className='flex min-w-0 flex-col gap-2'>
        <h3 className='font-display text-lg leading-tight'>Picture</h3>
        <p className='text-xs leading-relaxed text-bone/50'>
          Upload an image (or drop one here) or choose one from the library, then frame it. {wide ? 'Places are shown wide.' : 'People are shown tall, like a portrait.'}
        </p>
        {source.elements}
        <div className='flex flex-wrap items-center gap-2'>
          <button type='button' onClick={source.openFile} disabled={pending} className={`${buttonGhost} px-4 py-1.5 text-xs`}>
            <MdAddPhotoAlternate aria-hidden className='size-4' />
            {src ? 'Upload another' : 'Upload'}
          </button>
          <button type='button' onClick={source.openLibrary} disabled={pending} className={`${buttonGhost} px-4 py-1.5 text-xs`}>
            <MdPhotoLibrary aria-hidden className='size-4' /> Choose from library
          </button>
          {src && (
            <button type='button' onClick={remove} disabled={pending} className={`${buttonGhost} px-4 py-1.5 text-xs`}>
              <MdDeleteOutline aria-hidden className='size-4' /> Remove
            </button>
          )}
        </div>
        <p role='status' className='min-h-4 text-xs text-bone/60'>
          {message}
        </p>
      </div>
    </div>
  );
}
