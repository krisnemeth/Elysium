'use client';
import { useState } from 'react';
import { TextAreaField } from './fields';

const FIELDS = [
  ['tenets', 'Chronicle Tenets'],
  ['touchstones', 'Touchstones & Convictions'],
  ['bane', 'Clan Bane'],
] as const;

export default function TenetsTouchstonesBane() {
  const [values, setValues] = useState<Record<string, string>>({});
  return (
    <div className='grid gap-6 lg:grid-cols-3'>
      {FIELDS.map(([key, label]) => (
        <TextAreaField
          key={key}
          label={label}
          name={key}
          rows={7}
          value={values[key] ?? ''}
          onChange={(v) => setValues((s) => ({ ...s, [key]: v }))}
        />
      ))}
    </div>
  );
}
