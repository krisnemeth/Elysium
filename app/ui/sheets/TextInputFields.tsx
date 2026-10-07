'use client';
import { useState } from 'react';
import { SelectField, TextField } from './fields';
import { CLANS } from '@/app/lib/clans';

const PREDATOR_TYPES = [
  'Alleycat',
  'Bagger',
  'Blood Leech',
  'Cleaver',
  'Consensualist',
  'Farmer',
  'Osiris',
  'Sandman',
  'Scene Queen',
  'Siren',
];

const CLAN_NAMES = Object.values(CLANS).map((c) => c.name);

const FIELDS = [
  ['name', 'Name'],
  ['concept', 'Concept'],
  ['sire', 'Sire'],
  ['player', 'Player'],
  ['ambition', 'Ambition'],
  ['clan', 'Clan'],
  ['chronicle', 'Chronicle'],
  ['predator', 'Predator'],
  ['generation', 'Generation'],
] as const;

type Key = (typeof FIELDS)[number][0];

export default function TextInputFields() {
  const [values, setValues] = useState<Record<Key, string>>(
    Object.fromEntries(FIELDS.map(([key]) => [key, ''])) as Record<Key, string>,
  );
  const set = (key: Key) => (value: string) => setValues((v) => ({ ...v, [key]: value }));

  return (
    <div className='grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3'>
      {FIELDS.map(([key, label]) =>
        key === 'predator' || key === 'clan' ? (
          <SelectField
            key={key}
            label={label}
            name={key}
            value={values[key]}
            options={key === 'clan' ? CLAN_NAMES : PREDATOR_TYPES}
            onChange={set(key)}
          />
        ) : (
          <TextField key={key} label={label} name={key} value={values[key]} onChange={set(key)} />
        ),
      )}
    </div>
  );
}
