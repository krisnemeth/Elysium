'use client';

import { useRef, type ReactNode } from 'react';
import { MdClose, MdOpenInFull } from 'react-icons/md';

// The full sheet in a dialog over a blurred page. Esc, the close button or a
// click outside closes it.
export default function SheetModal({ label, children }: { label: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type='button'
        onClick={() => dialog.current?.showModal()}
        className='inline-flex items-center gap-1.5 rounded-full border border-bone/20 px-4 py-1.5 text-xs text-bone/85 transition hover:border-bone/50 hover:text-bone'
      >
        <MdOpenInFull aria-hidden /> Full sheet
      </button>
      <dialog
        ref={dialog}
        aria-label={label}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
        className='m-auto max-h-[92svh] w-[min(72rem,94vw)] overflow-y-auto rounded-2xl border border-bone/15 bg-ink p-0 text-bone shadow-[0_2rem_6rem_rgb(0_0_0/0.8)] backdrop:bg-black/55 backdrop:backdrop-blur-md'
      >
        <div className='sticky top-0 z-10 flex justify-end bg-linear-to-b from-ink to-transparent p-3'>
          <button
            type='button'
            onClick={() => dialog.current?.close()}
            aria-label='Close the sheet'
            className='grid size-10 place-items-center rounded-full border border-bone/20 bg-ink/80 text-bone/80 backdrop-blur hover:text-bone'
          >
            <MdClose aria-hidden className='size-5' />
          </button>
        </div>
        <div className='px-4 pb-6 md:px-8'>{children}</div>
      </dialog>
    </>
  );
}
