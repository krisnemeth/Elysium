'use client';
import { useState } from 'react';
import DotRating from '@/app/ui/kit/DotRating';
import { TextField } from './fields';

const STATS = [
  ['bloodSurge', 'Blood Surge'],
  ['mendAmount', 'Mend Amount'],
  ['powerBonus', 'Power Bonus'],
  ['rouseReRoll', 'Rouse Re-Roll'],
  ['feedingPenalty', 'Feeding Penalty'],
  ['baneSeverity', 'Bane Severity'],
] as const;

export default function BloodPotency() {
  const [potency, setPotency] = useState(1);
  const [stats, setStats] = useState<Record<string, string>>({});
  const [xp, setXp] = useState({ total: '', spent: '' });

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-bone/10 bg-bone/[0.02] px-4 py-3'>
        <span className='font-display text-2xl'>Blood Potency</span>
        <DotRating label='Blood Potency' value={potency} onChange={setPotency} max={10} />
      </div>
      <div className='grid gap-x-8 gap-y-6 sm:grid-cols-2'>
        {STATS.map(([key, label]) => (
          <TextField
            key={key}
            label={label}
            name={key}
            value={stats[key] ?? ''}
            onChange={(v) => setStats((s) => ({ ...s, [key]: v }))}
          />
        ))}
      </div>
      <div className='grid gap-x-8 gap-y-6 sm:grid-cols-2'>
        <TextField label='Total experience' name='xpTotal' type='number' value={xp.total} onChange={(total) => setXp((x) => ({ ...x, total }))} />
        <TextField label='Spent experience' name='xpSpent' type='number' value={xp.spent} onChange={(spent) => setXp((x) => ({ ...x, spent }))} />
      </div>
    </div>
  );
}
