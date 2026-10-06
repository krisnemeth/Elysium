'use client';
import { useState } from 'react';
import DotRating from '@/app/ui/kit/DotRating';

const TRACKS = [
  { key: 'health', label: 'Health', shape: 'box', initial: 0 },
  { key: 'willpower', label: 'Willpower', shape: 'box', initial: 0 },
  { key: 'humanity', label: 'Humanity', shape: 'dot', initial: 7 },
] as const;

export default function LifeStats() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(TRACKS.map((t) => [t.key, t.initial])),
  );

  return (
    <div className='grid gap-6 md:grid-cols-3'>
      {TRACKS.map((track) => (
        <div key={track.key} className='flex flex-col items-center gap-2 rounded-xl border border-bone/10 bg-bone/[0.02] p-4'>
          <span className='font-display text-2xl'>{track.label}</span>
          <DotRating
            label={track.label}
            value={values[track.key]}
            max={10}
            shape={track.shape}
            onChange={(v) => setValues((s) => ({ ...s, [track.key]: v }))}
          />
          <span className='text-xs text-bone/40 tabular-nums'>{values[track.key]} / 10</span>
        </div>
      ))}
    </div>
  );
}
