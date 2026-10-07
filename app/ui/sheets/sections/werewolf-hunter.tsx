'use client';

import { MdAdd, MdClose } from 'react-icons/md';
import { RatingRow, SelectField } from '../fields';
import { useSheet } from '../SheetContext';
import { NameList } from './common';
import type { Sheet } from '@/app/lib/sheets/types';

const groupTitle = 'mb-2 text-xs tracking-[0.25em] text-accent uppercase';
const smallInput = 'w-full bg-transparent text-sm text-bone placeholder:text-bone/25 focus:outline-none';
const addButton =
  'mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-bone/25 px-3 py-1.5 text-xs text-bone/60 transition-colors hover:border-bone/50 hover:text-bone focus-visible:outline-2 focus-visible:outline-accent';
const removeButton =
  'grid size-7 shrink-0 place-items-center rounded-full text-bone/30 transition-colors hover:bg-bone/[0.06] hover:text-bone focus-visible:outline-2 focus-visible:outline-accent';

// ------------------------------------------------------------------ Werewolf

export function Renown() {
  const { sheet, update } = useSheet();
  const renown = sheet.renown ?? { glory: 0, honor: 0, wisdom: 0 };
  return (
    <div className='max-w-md'>
      {(['glory', 'honor', 'wisdom'] as const).map((key) => (
        <RatingRow
          key={key}
          label={key[0].toUpperCase() + key.slice(1)}
          value={renown[key]}
          onChange={(v) =>
            update((d) => {
              d.renown = { ...renown, [key]: v };
            })
          }
        />
      ))}
    </div>
  );
}

type Gift = NonNullable<Sheet['gifts']>[number];

export function GiftsAndRites() {
  const { sheet, update } = useSheet();
  const gifts = sheet.gifts ?? [];
  const set = (i: number, patch: Partial<Gift>) =>
    update((d) => {
      d.gifts = gifts.map((g, j) => (j === i ? { ...g, ...patch } : g));
    });
  return (
    <div className='grid gap-8 lg:grid-cols-2'>
      <div>
        <h3 className={groupTitle}>Gifts</h3>
        <ul>
          {gifts.map((g, i) => (
            <li key={i} className='flex items-center gap-3 border-b border-bone/[0.07] py-2'>
              <input aria-label={`Gift ${i + 1}`} placeholder='Gift' value={g.name} onChange={(e) => set(i, { name: e.target.value })} className={`${smallInput} grow`} />
              <div className='w-28 shrink-0'>
                <SelectField label={`Gift ${i + 1} source`} hideLabel name={`gift-${i}-source`} value={g.source} options={['Native', 'Auspice', 'Tribe']} onChange={(v) => set(i, { source: v as Gift['source'] })} />
              </div>
              <button type='button' aria-label={`Remove ${g.name || 'gift'}`} className={removeButton} onClick={() => update((d) => void (d.gifts = gifts.filter((_, j) => j !== i)))}>
                <MdClose aria-hidden />
              </button>
            </li>
          ))}
        </ul>
        <button type='button' className={addButton} onClick={() => update((d) => void (d.gifts = [...gifts, { name: '', source: 'Native', renown: '' }]))}>
          <MdAdd aria-hidden /> Add gift
        </button>
      </div>
      <NameList title='Rites' placeholder='Rite' items={sheet.rites ?? []} onChange={(rites) => update((d) => void (d.rites = rites))} />
    </div>
  );
}

// -------------------------------------------------------------------- Hunter

export function Edges() {
  const { sheet, update } = useSheet();
  const edges = sheet.edges ?? [];
  const setEdges = (next: typeof edges) => update((d) => void (d.edges = next));
  return (
    <div>
      <h3 className={groupTitle}>Edges and their perks</h3>
      <ul className='grid gap-4 lg:grid-cols-2'>
        {edges.map((e, i) => (
          <li key={i} className='rounded-xl border border-bone/10 bg-bone/[0.02] p-4'>
            <div className='flex items-center gap-3'>
              <input
                aria-label={`Edge ${i + 1}`}
                placeholder='Edge'
                value={e.name}
                onChange={(ev) => setEdges(edges.map((x, j) => (j === i ? { ...x, name: ev.target.value } : x)))}
                className={`${smallInput} font-display text-xl`}
              />
              <button type='button' aria-label={`Remove ${e.name || 'edge'}`} className={removeButton} onClick={() => setEdges(edges.filter((_, j) => j !== i))}>
                <MdClose aria-hidden />
              </button>
            </div>
            <div className='mt-3'>
              <NameList title='Perks' placeholder='Perk' items={e.perks} onChange={(perks) => setEdges(edges.map((x, j) => (j === i ? { ...x, perks } : x)))} />
            </div>
          </li>
        ))}
      </ul>
      <button type='button' className={addButton} onClick={() => setEdges([...edges, { name: '', perks: [] }])}>
        <MdAdd aria-hidden /> Add edge
      </button>
    </div>
  );
}
