'use client';
import { useState } from 'react';
import { RatingRow } from './fields';

const GROUPS = [
  { name: 'Physical', attributes: ['Strength', 'Dexterity', 'Stamina'] },
  { name: 'Social', attributes: ['Charisma', 'Manipulation', 'Composure'] },
  { name: 'Mental', attributes: ['Intelligence', 'Wits', 'Resolve'] },
];

export default function Attributes() {
  // Every attribute starts at one dot in V5.
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(GROUPS.flatMap((g) => g.attributes).map((a) => [a, 1])),
  );

  return (
    <div className='grid gap-8 md:grid-cols-3'>
      {GROUPS.map((group) => (
        <div key={group.name}>
          <h3 className='mb-2 text-xs tracking-[0.25em] text-accent uppercase'>{group.name}</h3>
          {group.attributes.map((attr) => (
            <RatingRow
              key={attr}
              label={attr}
              value={values[attr]}
              onChange={(v) => setValues((s) => ({ ...s, [attr]: v }))}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
