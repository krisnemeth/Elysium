'use client';
import { useState, type ComponentType, type SVGProps } from 'react';
import DotRating from '@/app/ui/kit/DotRating';
import { SelectField } from './fields';
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

type Slot = { name: string; level: number; powers: string[] };

const empty = (): Slot => ({ name: '', level: 0, powers: Array(5).fill('') });

export default function Disciplines() {
  const [slots, setSlots] = useState<Slot[]>(() => Array.from({ length: 6 }, empty));
  const update = (i: number, patch: Partial<Slot>) =>
    setSlots((s) => s.map((slot, j) => (j === i ? { ...slot, ...patch } : slot)));

  return (
    <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
      {slots.map((slot, i) => {
        const Badge = DISCIPLINES[slot.name];
        return (
          <div
            key={i}
            className='rounded-xl border border-bone/10 bg-bone/[0.02] p-4 transition-[border-color,background-color] duration-500 focus-within:border-bone/25 focus-within:bg-bone/[0.04]'
          >
            <div className='flex items-end gap-3'>
              <div className='grid size-11 shrink-0 place-items-center'>
                {Badge ? (
                  <Badge
                    key={slot.name}
                    aria-hidden
                    className='dot-pop size-11 text-accent [--knockout:var(--color-bone)]'
                  />
                ) : (
                  <span className='size-7 rotate-45 rounded-sm border border-dashed border-bone/25' />
                )}
              </div>
              <div className='grow'>
                <SelectField
                  label={`Discipline ${i + 1}`}
                  hideLabel
                  name={`discipline-${i}`}
                  value={slot.name}
                  options={Object.keys(DISCIPLINES)}
                  onChange={(name) => update(i, { name })}
                />
              </div>
            </div>
            <div className='mt-3 flex justify-end'>
              <DotRating
                label={`${slot.name || `Discipline ${i + 1}`} level`}
                value={slot.level}
                onChange={(level) => update(i, { level })}
                size='sm'
              />
            </div>
            <ol className='mt-2'>
              {slot.powers.map((power, p) => (
                <li key={p} className='flex items-center gap-3 border-b border-bone/[0.07] py-1'>
                  <span className={`w-3 text-xs tabular-nums ${p < slot.level ? 'text-accent' : 'text-bone/30'}`}>{p + 1}</span>
                  <input
                    aria-label={`${slot.name || `Discipline ${i + 1}`} power ${p + 1}`}
                    value={power}
                    onChange={(e) =>
                      update(i, { powers: slot.powers.map((v, k) => (k === p ? e.target.value : v)) })
                    }
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
