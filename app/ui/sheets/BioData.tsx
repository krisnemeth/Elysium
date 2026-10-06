'use client';
import { useState } from 'react';
import { TextAreaField, TextField } from './fields';

function yearsBetween(from: string, to: Date) {
  const start = new Date(from);
  if (!from || Number.isNaN(start.getTime())) return null;
  let years = to.getFullYear() - start.getFullYear();
  const beforeBirthday =
    to.getMonth() < start.getMonth() ||
    (to.getMonth() === start.getMonth() && to.getDate() < start.getDate());
  if (beforeBirthday) years -= 1;
  return years;
}

export default function BioData() {
  const [birth, setBirth] = useState('');
  const [death, setDeath] = useState('');
  const [text, setText] = useState<Record<string, string>>({});

  // True age counts from birth to tonight; apparent age stops at the Embrace.
  const trueAge = yearsBetween(birth, new Date());
  const apparentAge = death ? yearsBetween(birth, new Date(death)) : null;

  return (
    <div className='flex flex-col gap-8'>
      <div className='grid gap-x-8 gap-y-6 sm:grid-cols-2'>
        <TextField label='Date of birth' name='birth' type='date' value={birth} onChange={setBirth} />
        <TextField label='Date of death' name='death' type='date' value={death} onChange={setDeath} />
        {[
          ['True age', trueAge],
          ['Apparent age', apparentAge],
        ].map(([label, age]) => (
          <div key={label as string} className='flex items-baseline justify-between border-b border-bone/[0.07] py-2'>
            <span className='text-[0.7rem] tracking-[0.2em] text-bone/55 uppercase'>{label}</span>
            <span className='font-display text-3xl tabular-nums'>{age ?? '—'}</span>
          </div>
        ))}
      </div>
      {[
        ['appearance', 'Appearance', 4],
        ['features', 'Distinguishing features', 4],
        ['history', 'History', 8],
      ].map(([key, label, rows]) => (
        <TextAreaField
          key={key as string}
          label={label as string}
          name={key as string}
          rows={rows as number}
          value={text[key as string] ?? ''}
          onChange={(v) => setText((s) => ({ ...s, [key as string]: v }))}
        />
      ))}
    </div>
  );
}
