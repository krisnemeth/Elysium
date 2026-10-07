'use client';
import { useState } from 'react';
import { RatingRow, TextAreaField } from './fields';

type Merit = { name: string; level: number };

export default function MixedSection() {
  const [merits, setMerits] = useState<Merit[]>(() =>
    Array.from({ length: 10 }, () => ({ name: '', level: 0 })),
  );
  const [notes, setNotes] = useState('');
  const update = (i: number, patch: Partial<Merit>) =>
    setMerits((m) => m.map((row, j) => (j === i ? { ...row, ...patch } : row)));

  return (
    <div className='grid gap-8 lg:grid-cols-2'>
      <div>
        <h3 className='mb-2 text-xs tracking-[0.25em] text-accent uppercase'>
          Backgrounds, merits & flaws
        </h3>
        {merits.map((merit, i) => (
          <RatingRow
            key={i}
            label={`#${i + 1}`}
            value={merit.level}
            onChange={(level) => update(i, { level })}
          >
            <input
              aria-label={`Background, merit or flaw ${i + 1}`}
              placeholder='Name'
              value={merit.name}
              onChange={(e) => update(i, { name: e.target.value })}
              className='w-full bg-transparent text-sm text-bone placeholder:text-bone/20 focus:outline-none'
            />
          </RatingRow>
        ))}
      </div>
      <TextAreaField label='Notes' name='notes' rows={14} value={notes} onChange={setNotes} />
    </div>
  );
}
