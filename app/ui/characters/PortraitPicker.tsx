'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition, type DragEvent } from 'react';
import { MdAddPhotoAlternate, MdDeleteOutline, MdPhotoLibrary } from 'react-icons/md';
import clsx from 'clsx';
import type { Game } from '@/app/lib/games';
import { removePortrait, setPortrait } from '@/app/lib/actions/characters';
import { isUploadedPortrait } from '@/app/lib/portraits';
import { buttonGhost } from '@/app/ui/kit/styles';
import { usePortraitSource } from './portrait-source';

export default function PortraitPicker({
  id,
  ensureId,
  game,
  name,
  src: initialSrc,
  variant = 'panel',
}: {
  // Null for a character that hasn't been saved yet: `ensureId` saves it first.
  id: string | null;
  ensureId?: () => Promise<string | null>;
  game: Game;
  name: string;
  src: string;
  // `panel` shows its own thumbnail; `overlay` sits on a portrait the page already shows.
  variant?: 'panel' | 'overlay';
}) {
  const router = useRouter();
  const [src, setSrc] = useState(initialSrc);
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(false);
  const [pending, startTransition] = useTransition();
  const custom = isUploadedPortrait(src);

  const save = (blob: Blob) => {
    setMessage('Uploading…');
    startTransition(async () => {
      const target = id ?? (await ensureId?.()) ?? null;
      if (!target) return setMessage('Couldn’t save the character yet. Try again in a moment.');
      const form = new FormData();
      form.append('portrait', blob, 'portrait');
      const result = await setPortrait(target, game, form);
      if (!result.ok) return setMessage(result.error);
      setSrc(result.src);
      setMessage('Portrait updated.');
      router.refresh();
    });
  };
  const source = usePortraitSource({ game, onReady: save, onError: setMessage });

  const remove = () =>
    startTransition(async () => {
      setMessage('Removing…');
      if (!id) return;
      const result = await removePortrait(id, game);
      if (!result.ok) return setMessage(result.error);
      setSrc(result.src);
      setMessage('Portrait removed.');
      router.refresh();
    });

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void source.chooseFile(e.dataTransfer.files[0]);
  };

  const fileInput = source.elements;

  const buttons = (
    <div className='flex flex-wrap items-center gap-2'>
      <button type='button' onClick={source.openFile} disabled={pending} className={`${buttonGhost} bg-ink/70 px-4 py-1.5 text-xs backdrop-blur-md`}>
        <MdAddPhotoAlternate aria-hidden className='size-4' />
        {custom ? 'Upload another' : 'Upload'}
      </button>
      <button type='button' onClick={source.openLibrary} disabled={pending} className={`${buttonGhost} bg-ink/70 px-4 py-1.5 text-xs backdrop-blur-md`}>
        <MdPhotoLibrary aria-hidden className='size-4' /> Choose from library
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
        <h3 className='font-display text-lg leading-tight'>Portrait</h3>
        <p className='text-xs leading-relaxed text-bone/50'>Upload an image (or drop one here) or choose one from the library, then frame it.</p>
        {fileInput}
        {buttons}
        {status}
      </div>
    </div>
  );
}
