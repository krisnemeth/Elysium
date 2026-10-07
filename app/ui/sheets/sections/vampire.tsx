'use client';

import type { ComponentType, SVGProps } from 'react';
import DotRating from '@/app/ui/kit/DotRating';
import { CLANS } from '@/app/lib/clans';
import {
  DisciplineAnimalism,
  DisciplineAuspex,
  DisciplineBloodSorcery,
  DisciplineCelerity,
  DisciplineDominate,
  DisciplineFortitude,
  DisciplineObfuscate,
  DisciplineOblivion,
  DisciplinePotence,
  DisciplinePresence,
  DisciplineProtean,
  DisciplineThinBloodAlchemy,
} from '@/app/ui/svgs/official';
import { SelectField, TextField } from '../fields';
import { useSheet, useSheetFields } from '../SheetContext';
import { Profile } from './common';

const PREDATOR_TYPES = ['Alleycat', 'Bagger', 'Blood Leech', 'Cleaver', 'Consensualist', 'Farmer', 'Osiris', 'Sandman', 'Scene Queen', 'Siren'];
const RESONANCES = ['Choleric', 'Melancholic', 'Phlegmatic', 'Sanguine', 'Animal', 'Empty'];

export function VampireProfile() {
  return (
    <Profile
      fields={[
        { key: 'name', label: 'Name' },
        { key: 'concept', label: 'Concept' },
        { key: 'sire', label: 'Sire' },
        { key: 'player', label: 'Player' },
        { key: 'ambition', label: 'Ambition' },
        { key: 'clan', label: 'Clan', options: Object.values(CLANS).map((c) => c.name) },
        { key: 'chronicle', label: 'Chronicle' },
        { key: 'desire', label: 'Desire' },
        { key: 'predator', label: 'Predator type', options: PREDATOR_TYPES },
        { key: 'generation', label: 'Generation' },
        { key: 'sect', label: 'Sect' },
      ]}
    />
  );
}

export function VampireTrackers() {
  const { tracker, setTracker } = useSheetFields();
  const tracks = [
    { key: 'health', label: 'Health', shape: 'box' as const },
    { key: 'willpower', label: 'Willpower', shape: 'box' as const },
    { key: 'humanity', label: 'Humanity', shape: 'dot' as const },
  ];
  return (
    <div className='grid gap-6 md:grid-cols-3'>
      {tracks.map((t) => (
        <div key={t.key} className='flex flex-col items-center gap-2 rounded-xl border border-bone/10 bg-bone/[0.02] p-4'>
          <span className='font-display text-2xl'>{t.label}</span>
          <DotRating label={t.label} value={tracker(t.key)} max={10} shape={t.shape} onChange={setTracker(t.key)} />
          <span className='text-xs text-bone/40 tabular-nums'>{tracker(t.key)} / 10</span>
        </div>
      ))}
    </div>
  );
}

const DISCIPLINES: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Animalism: DisciplineAnimalism,
  Auspex: DisciplineAuspex,
  'Blood Sorcery': DisciplineBloodSorcery,
  Celerity: DisciplineCelerity,
  Dominate: DisciplineDominate,
  Fortitude: DisciplineFortitude,
  Obfuscate: DisciplineObfuscate,
  Oblivion: DisciplineOblivion,
  Potence: DisciplinePotence,
  Presence: DisciplinePresence,
  Protean: DisciplineProtean,
  'Thin-blood Alchemy': DisciplineThinBloodAlchemy,
};

const SLOTS = 6;

export function Disciplines() {
  const { sheet, update } = useSheet();
  const list = sheet.disciplines ?? [];
  const slots = Array.from({ length: Math.max(SLOTS, list.length) }, (_, i) => list[i] ?? { name: '', dots: 0, powers: [] });

  // Write back only slots that hold something.
  const save = (i: number, patch: Partial<(typeof slots)[number]>) =>
    update((d) => {
      const next = slots.map((s, j) => (j === i ? { ...s, ...patch } : s));
      d.disciplines = next.filter((s) => s.name || s.dots || s.powers.some(Boolean));
    });

  return (
    <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
      {slots.map((slot, i) => {
        const Badge = DISCIPLINES[slot.name];
        const powers = Array.from({ length: 5 }, (_, p) => slot.powers[p] ?? '');
        return (
          <div key={i} className='rounded-xl border border-bone/10 bg-bone/[0.02] p-4 transition-[border-color,background-color] duration-500 focus-within:border-bone/25 focus-within:bg-bone/[0.04]'>
            <div className='flex items-end gap-3'>
              <div className='grid size-11 shrink-0 place-items-center'>
                {Badge ? (
                  <Badge key={slot.name} aria-hidden className='dot-pop size-11 text-accent [--knockout:var(--color-bone)]' />
                ) : (
                  <span className='size-7 rotate-45 rounded-sm border border-dashed border-bone/25' />
                )}
              </div>
              <div className='grow'>
                <SelectField label={`Discipline ${i + 1}`} hideLabel name={`discipline-${i}`} value={slot.name} options={Object.keys(DISCIPLINES)} onChange={(name) => save(i, { name })} />
              </div>
            </div>
            <div className='mt-3 flex justify-end'>
              <DotRating label={`${slot.name || `Discipline ${i + 1}`} level`} value={slot.dots} onChange={(dots) => save(i, { dots })} size='sm' />
            </div>
            <ol className='mt-2'>
              {powers.map((power, p) => (
                <li key={p} className='flex items-center gap-3 border-b border-bone/[0.07] py-1'>
                  <span className={`w-3 text-xs tabular-nums ${p < slot.dots ? 'text-accent' : 'text-bone/30'}`}>{p + 1}</span>
                  <input
                    aria-label={`${slot.name || `Discipline ${i + 1}`} power ${p + 1}`}
                    value={power}
                    onChange={(e) => {
                      const next = powers.map((v, k) => (k === p ? e.target.value : v));
                      while (next.length && !next[next.length - 1]) next.pop();
                      save(i, { powers: next });
                    }}
                    className='w-full bg-transparent py-1 text-sm text-bone/85 focus:outline-none'
                  />
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

const BLOOD_STATS = [
  ['bloodSurge', 'Blood Surge'],
  ['mendAmount', 'Mend amount'],
  ['powerBonus', 'Power bonus'],
  ['rouseReroll', 'Rouse re-roll'],
  ['baneSeverity', 'Bane severity'],
  ['feedingPenalty', 'Feeding penalty'],
] as const;

export function Blood() {
  const { sheet, update, profile, setProfile, tracker, setTracker } = useSheetFields();
  return (
    <div className='flex flex-col gap-8'>
      <div className='grid items-end gap-8 md:grid-cols-2'>
        <SelectField label='Resonance' name='resonance' value={profile('resonance')} options={RESONANCES} onChange={setProfile('resonance')} />
        <div className='flex items-center justify-between gap-4 rounded-xl border border-bone/10 bg-bone/[0.02] px-4 py-3'>
          <span className='font-display text-2xl'>Hunger</span>
          <DotRating label='Hunger' value={tracker('hunger')} onChange={setTracker('hunger')} shape='box' />
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-bone/10 bg-bone/[0.02] px-4 py-3'>
        <span className='font-display text-2xl'>Blood Potency</span>
        <DotRating
          label='Blood Potency'
          value={sheet.bloodPotency ?? 0}
          max={10}
          onChange={(v) =>
            update((d) => {
              d.bloodPotency = v;
            })
          }
        />
      </div>
      <div className='grid gap-x-8 gap-y-6 sm:grid-cols-2'>
        {BLOOD_STATS.map(([key, label]) => (
          <TextField key={key} label={label} name={key} value={profile(key)} onChange={setProfile(key)} />
        ))}
      </div>
    </div>
  );
}
