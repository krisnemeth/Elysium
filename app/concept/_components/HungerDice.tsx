'use client';

import { useState } from 'react';
import type React from 'react';
import type { ComponentType, SVGProps } from 'react';
import { rollPool, type Die, type Outcome, type RollResult } from '@/app/lib/hunger-dice';
import {
  DiceBestialFailure,
  DiceCritical,
  DiceMessyCritical,
  DiceSuccess,
} from '@/app/ui/svgs/official';
import D10 from '@/app/ui/dice/D10';

type Symbol = ComponentType<SVGProps<SVGSVGElement>>;

// Faces of physical V5 dice: blanks on 1–5 (except a Hunger 1), an ankh on 6–9.
function faceSymbol({ value, hunger }: Die): Symbol | null {
  if (value === 10) return hunger ? DiceMessyCritical : DiceCritical;
  if (value >= 6) return DiceSuccess;
  if (hunger && value === 1) return DiceBestialFailure;
  return null;
}

const OUTCOME_SYMBOL: Partial<Record<Outcome, Symbol>> = {
  critical: DiceCritical,
  'messy-critical': DiceMessyCritical,
  win: DiceSuccess,
  'bestial-failure': DiceBestialFailure,
};

const OUTCOMES: Record<Outcome, { title: string; note: string }> = {
  critical: { title: 'Critical win', note: 'A pair of tens. Something remarkable happens.' },
  'messy-critical': { title: 'Messy critical', note: 'You win, but the Beast decides how.' },
  win: { title: 'Win', note: 'Enough successes to beat the difficulty.' },
  failure: { title: 'Failure', note: 'Not enough. You may still succeed at a cost.' },
  'total-failure': { title: 'Total failure', note: 'Not a single success. The night turns against you.' },
  'bestial-failure': { title: 'Bestial failure', note: 'You fail, and a Hunger die bares its teeth.' },
};

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const btn =
    'grid size-10 place-items-center border border-paper/25 text-lg transition-colors hover:border-paper hover:bg-paper hover:text-night focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blood disabled:pointer-events-none disabled:opacity-30';
  return (
    <div className='flex flex-col gap-2'>
      <span className='font-c-mono text-[0.65rem] tracking-[0.2em] text-paper/50 uppercase'>
        {label}
      </span>
      <div className='flex items-center'>
        <button
          type='button'
          aria-label={`Decrease ${label}`}
          className={btn}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          &minus;
        </button>
        <output
          aria-label={label}
          className='w-12 text-center font-c-serif text-3xl tabular-nums'
        >
          {value}
        </output>
        <button
          type='button'
          aria-label={`Increase ${label}`}
          className={btn}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function HungerDice() {
  const [pool, setPool] = useState(6);
  const [hunger, setHunger] = useState(2);
  const [difficulty, setDifficulty] = useState(3);
  const [result, setResult] = useState<RollResult | null>(null);
  const [rollId, setRollId] = useState(0);

  const effectiveHunger = Math.min(hunger, pool);
  const outcome = result ? OUTCOMES[result.outcome] : null;
  const bad =
    result?.outcome === 'bestial-failure' ||
    result?.outcome === 'messy-critical';

  return (
    <section
      aria-labelledby='dice-title'
      className='border-t border-paper/15 px-5 py-24 md:px-10 md:py-32'
    >
      <div className='grid gap-16 md:grid-cols-12'>
        <div className='md:col-span-4'>
          <p className='font-c-mono text-xs tracking-[0.25em] text-blood uppercase'>
            Exhibit B &mdash; the dice
          </p>
          <h2
            id='dice-title'
            className='mt-6 font-c-serif text-6xl leading-[0.95] text-balance md:text-7xl'
          >
            Roll with your <em className='text-blood'>Hunger</em>.
          </h2>
          <p className='mt-8 max-w-[40ch] leading-relaxed text-pretty text-paper/70'>
            The V5 rules, built in. Red dice are Hunger dice: a ten on one can
            turn a critical messy, and a one can make a failure bestial. Try a
            roll.
          </p>
        </div>

        <div className='md:col-span-7 md:col-start-6'>
          <div className='flex flex-wrap items-end gap-x-10 gap-y-6'>
            <Stepper label='Dice pool' value={pool} min={1} max={15} onChange={(v) => { setPool(v); setResult(null); }} />
            <Stepper label='Hunger' value={hunger} min={0} max={5} onChange={(v) => { setHunger(v); setResult(null); }} />
            <Stepper label='Difficulty' value={difficulty} min={1} max={9} onChange={(v) => { setDifficulty(v); setResult(null); }} />
            <button
              type='button'
              onClick={() => {
                setResult(rollPool(pool, hunger, difficulty));
                setRollId((n) => n + 1);
              }}
              className='ml-auto bg-blood px-8 py-3 font-c-sans text-sm font-bold tracking-[0.2em] text-chalk uppercase transition duration-300 [font-variation-settings:"wdth"_85] hover:bg-paper hover:text-night focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper active:scale-[0.97]'
            >
              Roll
            </button>
          </div>

          <ul
            aria-label='Dice'
            className='mt-10 flex min-h-36 flex-wrap content-start gap-x-3 gap-y-4'
          >
            {Array.from({ length: pool }, (_, i) => {
              const die = result?.dice[i];
              const isHunger = die ? die.hunger : i >= pool - effectiveHunger;
              const success = die && die.value >= 6;
              const Face = die ? faceSymbol(die) : null;
              const skull = die?.hunger && die.value === 1;
              return (
                <li
                  key={`${rollId}-${i}`}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={[
                    'relative w-14 md:w-16',
                    die ? 'tumble' : 'opacity-30',
                    die && !success && !skull ? 'opacity-40 saturate-50' : '',
                  ].join(' ')}
                >
                  <span className='sr-only'>
                    {isHunger ? 'Hunger die: ' : 'Die: '}
                    {die?.value ?? 'not rolled'}
                  </span>
                  <D10
                    hunger={isHunger}
                    className='w-full'
                    style={{ '--die-hunger': 'var(--color-blood)', '--die-regular': '#2b2727' } as React.CSSProperties}
                  >
                    {Face && <Face aria-hidden className='h-6 w-auto md:h-7' />}
                  </D10>
                  {die && (
                    <span aria-hidden className='absolute inset-x-0 top-[58%] text-center font-c-mono text-[0.55rem] text-chalk/60'>
                      {die.value}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <div aria-live='polite' className='mt-10 min-h-28 border-t border-paper/15 pt-6'>
            {result && outcome ? (
              <div key={rollId} className='tumble flex flex-wrap items-center justify-between gap-4'>
                <div className='flex items-center gap-5'>
                  {(() => {
                    const Mark = OUTCOME_SYMBOL[result.outcome];
                    return Mark ? (
                      <Mark aria-hidden className={`h-14 w-auto shrink-0 ${bad ? 'text-blood' : 'text-paper'}`} />
                    ) : null;
                  })()}
                  <div>
                  <p className={`font-c-serif text-5xl italic md:text-6xl ${bad ? 'text-blood' : 'text-paper'}`}>
                    {outcome.title}
                  </p>
                  <p className='mt-2 text-paper/60'>{outcome.note}</p>
                  </div>
                </div>
                <p className='font-c-mono text-xs tracking-[0.2em] text-paper/60 uppercase'>
                  {result.successes} {result.successes === 1 ? 'success' : 'successes'} vs. difficulty {difficulty}
                </p>
              </div>
            ) : (
              <p className='font-c-mono text-xs tracking-[0.2em] text-paper/40 uppercase'>
                {pool} dice &middot; {effectiveHunger} hunger &middot; difficulty {difficulty}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
