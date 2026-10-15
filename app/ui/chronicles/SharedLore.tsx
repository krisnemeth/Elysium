'use client';

import { useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { LORE_KINDS, type LoreKind } from '@/app/lib/loresheets';
import { LORE_ICONS } from '@/app/ui/loresheets/icons';

export type LoreItem = {
  id: string;
  kind: LoreKind;
  title: string;
  content: Record<string, string>;
  by: string;
};

// The loresheets the chronicle's members have shared: a list, and each one
// opens read-only in a dialog (Esc, the close button or a click outside closes it).
export default function SharedLore({ items }: { items: LoreItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<LoreItem | null>(null);
  const spec = open && LORE_KINDS[open.kind];

  if (!items.length) {
    return <p className='text-sm text-bone/50'>Nothing shared yet. Players can share a loresheet from its page in their vault.</p>;
  }

  return (
    <>
      <ul className='flex flex-col'>
        {items.map((l) => {
          const Icon = LORE_ICONS[l.kind];
          return (
            <li key={l.id} className='border-t border-bone/[0.07] first:border-t-0'>
              <button
                type='button'
                onClick={() => {
                  setOpen(l);
                  dialog.current?.showModal();
                }}
                className='flex w-full items-center gap-3 py-3 text-left transition-colors hover:text-accent'
              >
                <Icon aria-hidden className='size-6 shrink-0 text-accent' />
                <span className='min-w-0 grow'>
                  <span className='block truncate font-display text-lg leading-tight'>{l.title || `Untitled ${LORE_KINDS[l.kind].noun}`}</span>
                  <span className='block truncate text-xs text-bone/50'>
                    {LORE_KINDS[l.kind].label} · shared by {l.by}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <dialog
        ref={dialog}
        aria-label={open?.title || 'Loresheet'}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
        onClose={() => setOpen(null)}
        className='m-auto max-h-[92svh] w-[min(44rem,94vw)] overflow-y-auto rounded-2xl border border-bone/15 bg-ink p-0 text-bone shadow-[0_2rem_6rem_rgb(0_0_0/0.8)] backdrop:bg-black/55 backdrop:backdrop-blur-md'
      >
        <div className='sticky top-0 z-10 flex justify-end bg-linear-to-b from-ink to-transparent p-3'>
          <button
            type='button'
            onClick={() => dialog.current?.close()}
            aria-label='Close the loresheet'
            className='grid size-10 place-items-center rounded-full border border-bone/20 bg-ink/80 text-bone/80 backdrop-blur hover:text-bone'
          >
            <MdClose aria-hidden className='size-5' />
          </button>
        </div>
        {open && spec && (
          <article className='flex flex-col gap-5 px-5 pb-8 md:px-8'>
            <header>
              <p className='text-[0.65rem] tracking-[0.2em] text-accent uppercase'>
                Loresheet · {spec.label} · shared by {open.by} · read-only
              </p>
              <h2 className='mt-1 font-display text-3xl leading-tight'>{open.title || `Untitled ${spec.noun}`}</h2>
            </header>
            {spec.fields
              .filter((f) => open.content[f.key]?.trim())
              .map((f) => (
                <section key={f.key}>
                  <h3 className='text-[0.65rem] tracking-[0.2em] text-bone/50 uppercase'>{f.label}</h3>
                  <p className='mt-1 leading-relaxed whitespace-pre-line text-bone/85'>{open.content[f.key]}</p>
                </section>
              ))}
            {!spec.fields.some((f) => open.content[f.key]?.trim()) && <p className='text-sm text-bone/50'>Nothing written yet.</p>}
          </article>
        )}
      </dialog>
    </>
  );
}
