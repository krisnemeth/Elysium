'use client';

import clsx from 'clsx';
import { MdAdd, MdRemove } from 'react-icons/md';
import { boxes, heal, takeDamage, trackState, NO_DAMAGE, type DamageKind } from '@/app/lib/play/damage';
import type { Damage } from '@/app/lib/sheets/types';
import { panel } from '@/app/ui/kit/styles';

const tap =
  'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-bone/15 px-3 text-sm text-bone/85 transition active:scale-95 hover:border-bone/40 hover:text-bone disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-accent';

// A Health or Willpower track: Superficial (/) and Aggravated (X) boxes.
export function DamageTrack({
  label,
  max,
  damage = NO_DAMAGE,
  onChange,
  downLabel,
  impairedNote,
}: {
  label: string;
  max: number;
  damage?: Damage;
  onChange: (d: Damage) => void;
  downLabel: string;
  impairedNote: string;
}) {
  const state = trackState(damage, max);
  const marks = boxes(damage, max);
  const change = (kind: DamageKind, dir: 1 | -1) => onChange(dir > 0 ? takeDamage(damage, max, kind) : heal(damage, max, kind));
  const sup = Math.min(damage.superficial, max);
  const agg = Math.min(damage.aggravated, max);

  return (
    <section aria-label={label} className={`flex flex-col gap-4 p-5 ${panel}`}>
      <div className='flex items-baseline justify-between gap-3'>
        <h2 className='font-display text-2xl'>{label}</h2>
        <p role='status' className={clsx('text-xs tracking-[0.15em] uppercase', state === 'fine' ? 'text-bone/45' : 'text-accent')}>
          {state === 'down' ? downLabel : state === 'impaired' ? 'Impaired' : `${max - sup - agg} of ${max} left`}
        </p>
      </div>
      <ol className='flex flex-wrap gap-1.5' aria-label={`${label}: ${sup} superficial, ${agg} aggravated, ${max} boxes`}>
        {marks.map((m, i) => (
          <li
            key={i}
            className={clsx(
              'relative grid size-8 place-items-center rounded-md border transition-colors duration-300',
              m === 'empty' ? 'border-bone/25' : 'border-accent bg-accent/15',
            )}
          >
            {m !== 'empty' && (
              <svg viewBox='0 0 20 20' aria-hidden className='size-5 text-accent'>
                <path d='M4 16 16 4' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
                {m === 'aggravated' && <path d='M4 4 16 16' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />}
              </svg>
            )}
          </li>
        ))}
      </ol>
      {state !== 'fine' && <p className='text-xs leading-relaxed text-bone/55'>{state === 'impaired' ? impairedNote : ''}</p>}
      <div className='grid grid-cols-2 gap-2'>
        <button type='button' className={tap} onClick={() => change('superficial', 1)} disabled={max === 0 || agg >= max}>
          <MdAdd aria-hidden /> Superficial
        </button>
        <button type='button' className={tap} onClick={() => change('aggravated', 1)} disabled={max === 0 || agg >= max}>
          <MdAdd aria-hidden /> Aggravated
        </button>
        <button type='button' className={tap} onClick={() => change('superficial', -1)} disabled={sup === 0}>
          <MdRemove aria-hidden /> Heal superficial
        </button>
        <button type='button' className={tap} onClick={() => change('aggravated', -1)} disabled={agg === 0}>
          <MdRemove aria-hidden /> Heal aggravated
        </button>
      </div>
    </section>
  );
}

// A small 0–max track (Hunger, Rage, Desperation, Danger…) with big +/− buttons.
export function PointTrack({
  label,
  value,
  max = 5,
  onChange,
  note,
  shape = 'dot',
}: {
  label: string;
  value: number;
  max?: number;
  onChange: (v: number) => void;
  note?: string;
  shape?: 'dot' | 'box';
}) {
  return (
    <section aria-label={label} className={`flex flex-col gap-3 p-5 ${panel}`}>
      <div className='flex items-baseline justify-between gap-3'>
        <h2 className='font-display text-2xl'>{label}</h2>
        <span className='font-display text-3xl tabular-nums'>{value}</span>
      </div>
      <div className='flex items-center gap-3'>
        <button type='button' aria-label={`Lower ${label}`} className={`${tap} size-11 px-0`} onClick={() => onChange(Math.max(0, value - 1))} disabled={value <= 0}>
          <MdRemove aria-hidden className='size-5' />
        </button>
        <ol className='flex grow flex-wrap justify-center gap-2' aria-hidden>
          {Array.from({ length: max }, (_, i) => (
            <li
              key={i}
              className={clsx(
                'size-5 border transition-colors duration-300',
                shape === 'dot' ? 'rounded-full' : 'rotate-45 rounded-[3px]',
                i < value ? 'border-accent bg-accent' : 'border-bone/30',
              )}
            />
          ))}
        </ol>
        <button type='button' aria-label={`Raise ${label}`} className={`${tap} size-11 px-0`} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>
          <MdAdd aria-hidden className='size-5' />
        </button>
      </div>
      {note && <p className='text-xs leading-relaxed text-bone/55'>{note}</p>}
    </section>
  );
}

/*
  Humanity: filled dots from the left, Stains marked from the right on the
  empty boxes. More Stains than empty boxes means degeneration.
*/
export function HumanityTrack({
  humanity,
  stains,
  onHumanity,
  onStains,
}: {
  humanity: number;
  stains: number;
  onHumanity: (v: number) => void;
  onStains: (v: number) => void;
}) {
  const empty = 10 - humanity;
  const overflow = stains > empty;
  return (
    <section aria-label='Humanity' className={`flex flex-col gap-4 p-5 ${panel}`}>
      <div className='flex items-baseline justify-between gap-3'>
        <h2 className='font-display text-2xl'>Humanity</h2>
        <p role='status' className={clsx('text-xs tracking-[0.15em] uppercase', overflow ? 'text-accent' : 'text-bone/45')}>
          {overflow ? 'Degeneration' : `${humanity} · ${stains} ${stains === 1 ? 'stain' : 'stains'}`}
        </p>
      </div>
      <ol className='flex flex-wrap gap-1.5' aria-hidden>
        {Array.from({ length: 10 }, (_, i) => {
          const filled = i < humanity;
          const stained = !filled && i >= 10 - Math.min(stains, empty);
          return (
            <li key={i} className={clsx('grid size-6 place-items-center rounded-full border', filled ? 'border-accent bg-accent' : 'border-bone/25')}>
              {stained && (
                <svg viewBox='0 0 20 20' className='size-4 text-accent'>
                  <path d='M4 16 16 4' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
      {overflow && (
        <p className='text-xs leading-relaxed text-bone/55'>
          More Stains than empty boxes: the Beast takes its toll. Degeneration follows; check the core rules with your Storyteller.
        </p>
      )}
      <div className='grid grid-cols-2 gap-2'>
        <button type='button' className={tap} onClick={() => onStains(Math.min(10, stains + 1))}>
          <MdAdd aria-hidden /> Stain
        </button>
        <button type='button' className={tap} onClick={() => onStains(Math.max(0, stains - 1))} disabled={stains === 0}>
          <MdRemove aria-hidden /> Clear stain
        </button>
        <button type='button' className={tap} onClick={() => onHumanity(Math.max(0, humanity - 1))} disabled={humanity === 0}>
          <MdRemove aria-hidden /> Lose Humanity
        </button>
        <button type='button' className={tap} onClick={() => onHumanity(Math.min(10, humanity + 1))} disabled={humanity === 10}>
          <MdAdd aria-hidden /> Gain Humanity
        </button>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------ compact (the chronicle table's sidebar)

const mini =
  'grid size-6 place-items-center rounded-md border border-bone/15 text-bone/75 transition active:scale-90 hover:border-bone/40 hover:text-bone disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-accent';

function MiniStep({ label, onDown, onUp, downDisabled, upDisabled }: { label: string; onDown: () => void; onUp: () => void; downDisabled?: boolean; upDisabled?: boolean }) {
  return (
    <span className='flex items-center gap-1'>
      <button type='button' aria-label={`Lower ${label}`} className={mini} onClick={onDown} disabled={downDisabled}>
        <MdRemove aria-hidden className='size-3.5' />
      </button>
      <button type='button' aria-label={`Raise ${label}`} className={mini} onClick={onUp} disabled={upDisabled}>
        <MdAdd aria-hidden className='size-3.5' />
      </button>
    </span>
  );
}

const slash = (aggravated: boolean) => (
  <svg viewBox='0 0 20 20' aria-hidden className='size-3 text-accent'>
    <path d='M4 16 16 4' stroke='currentColor' strokeWidth='3' strokeLinecap='round' />
    {aggravated && <path d='M4 4 16 16' stroke='currentColor' strokeWidth='3' strokeLinecap='round' />}
  </svg>
);

// Health or Willpower: the boxes, then Superficial and Aggravated steppers.
export function MiniDamageTrack({ label, max, damage = NO_DAMAGE, onChange, downLabel }: { label: string; max: number; damage?: Damage; onChange: (d: Damage) => void; downLabel: string }) {
  const state = trackState(damage, max);
  const marks = boxes(damage, max);
  const sup = Math.min(damage.superficial, max);
  const agg = Math.min(damage.aggravated, max);
  const change = (kind: DamageKind, dir: 1 | -1) => onChange(dir > 0 ? takeDamage(damage, max, kind) : heal(damage, max, kind));
  return (
    <section aria-label={label} className='flex flex-col gap-1.5'>
      <div className='flex items-baseline justify-between gap-2'>
        <h3 className='text-sm'>{label}</h3>
        <p role='status' className={clsx('text-[0.6rem] tracking-[0.15em] uppercase', state === 'fine' ? 'text-bone/45' : 'text-accent')}>
          {state === 'down' ? downLabel : state === 'impaired' ? 'Impaired' : `${max - sup - agg} of ${max}`}
        </p>
      </div>
      <ol className='flex flex-wrap gap-1' aria-label={`${label}: ${sup} superficial, ${agg} aggravated, ${max} boxes`}>
        {marks.map((m, i) => (
          <li key={i} className={clsx('grid size-4.5 place-items-center rounded-[4px] border', m === 'empty' ? 'border-bone/25' : 'border-accent bg-accent/15')}>
            {m !== 'empty' && slash(m === 'aggravated')}
          </li>
        ))}
      </ol>
      <div className='flex items-center justify-between gap-2 text-xs text-bone/55'>
        <span className='flex items-center gap-1' title='Superficial damage'>
          Sup.
          <MiniStep label={`${label} superficial damage`} onDown={() => change('superficial', -1)} onUp={() => change('superficial', 1)} downDisabled={sup === 0} upDisabled={max === 0 || agg >= max} />
        </span>
        <span className='flex items-center gap-1' title='Aggravated damage'>
          Agg.
          <MiniStep label={`${label} aggravated damage`} onDown={() => change('aggravated', -1)} onUp={() => change('aggravated', 1)} downDisabled={agg === 0} upDisabled={max === 0 || agg >= max} />
        </span>
      </div>
    </section>
  );
}

// Hunger, Rage, Desperation…: the name and steppers, the marks underneath.
export function MiniPointTrack({ label, value, max = 5, onChange, shape = 'dot' }: { label: string; value: number; max?: number; onChange: (v: number) => void; shape?: 'dot' | 'box' }) {
  return (
    <section aria-label={label} className='flex flex-col gap-1.5'>
      <div className='flex items-center justify-between gap-2'>
        <h3 className='text-sm'>{label}</h3>
        <MiniStep label={label} onDown={() => onChange(Math.max(0, value - 1))} onUp={() => onChange(Math.min(max, value + 1))} downDisabled={value <= 0} upDisabled={value >= max} />
      </div>
      <ol className='flex gap-2 pl-0.5' role='img' aria-label={`${label} ${value} of ${max}`}>
        {Array.from({ length: max }, (_, i) => (
          <li key={i} className={clsx('size-3 border', shape === 'dot' ? 'rounded-full' : 'rotate-45 rounded-[2px]', i < value ? 'border-accent bg-accent' : 'border-bone/30')} />
        ))}
      </ol>
    </section>
  );
}

// Humanity (steppers by the name) and Stains (steppers underneath).
export function MiniHumanityTrack({ humanity, stains, onHumanity, onStains }: { humanity: number; stains: number; onHumanity: (v: number) => void; onStains: (v: number) => void }) {
  const empty = 10 - humanity;
  const overflow = stains > empty;
  return (
    <section aria-label='Humanity' className='flex flex-col gap-1.5'>
      <div className='flex items-center justify-between gap-2'>
        <h3 className='text-sm'>
          Humanity <span className={clsx('text-xs', overflow ? 'text-accent' : 'text-bone/45')}>{overflow ? 'Degeneration' : humanity}</span>
        </h3>
        <MiniStep label='Humanity' onDown={() => onHumanity(Math.max(0, humanity - 1))} onUp={() => onHumanity(Math.min(10, humanity + 1))} downDisabled={humanity === 0} upDisabled={humanity === 10} />
      </div>
      <ol className='flex gap-[3px]' aria-hidden>
        {Array.from({ length: 10 }, (_, i) => {
          const filled = i < humanity;
          const stained = !filled && i >= 10 - Math.min(stains, empty);
          return (
            <li key={i} className={clsx('grid size-4 place-items-center rounded-full border', filled ? 'border-accent bg-accent' : 'border-bone/25')}>
              {stained && slash(false)}
            </li>
          );
        })}
      </ol>
      <div className='flex items-center justify-between gap-2 text-xs text-bone/55'>
        <span>
          {stains} {stains === 1 ? 'Stain' : 'Stains'}
        </span>
        <MiniStep label='Stains' onDown={() => onStains(Math.max(0, stains - 1))} onUp={() => onStains(Math.min(10, stains + 1))} downDisabled={stains === 0} />
      </div>
    </section>
  );
}
