'use client';
import { useState } from 'react';
import DotRating from '@/app/ui/kit/DotRating';
import { SelectField } from './fields';

const RESONANCES = ['Choleric', 'Melancholic', 'Phlegmatic', 'Sanguine', 'Animal', 'Empty'];

export default function ResonanceHunger() {
  const [resonance, setResonance] = useState('');
  const [hunger, setHunger] = useState(1);

  return (
    <div className='grid items-end gap-8 md:grid-cols-2'>
      <SelectField label='Resonance' name='resonance' value={resonance} options={RESONANCES} onChange={setResonance} />
      <div className='flex items-center justify-between gap-4 rounded-xl border border-bone/10 bg-bone/[0.02] px-4 py-3'>
        <span className='font-display text-2xl'>Hunger</span>
        <DotRating label='Hunger' value={hunger} onChange={setHunger} shape='box' />
      </div>
    </div>
  );
}
