'use client';

import { useEffect, useRef, useState, type ComponentType, type SVGProps } from 'react';
import { GiD10 } from 'react-icons/gi';
import { MdAdd, MdRemove, MdRefresh } from 'react-icons/md';
import { resolveRoll, rollPool, type Die, type Outcome, type RollResult } from '@/app/lib/hunger-dice';
import {
  DiceBestialFailure,
  DiceCritical,
  DiceMessyCritical,
  DiceSuccess,
} from '@/app/ui/svgs/official';
import { buttonGhost, buttonPrimary, panel } from '@/app/ui/kit/styles';

type Svg = ComponentType<SVGProps<SVGSVGElement>>;

const ROLL_MS = 750;
const MAX_REROLL = 3;

const OUTCOMES: Record<Outcome, { title: string; note: string; Symbol?: Svg; grim?: boolean }> = {
  critical: { title: 'Critical win', note: 'A pair of tens. Something remarkable happens.', Symbol: DiceCritical },
  'messy-critical': { title: 'Messy critical', note: 'You win, but the Beast decides how.', Symbol: DiceMessyCritical, grim: true },
  win: { title: 'Win', note: 'Enough successes to beat the difficulty.', Symbol: DiceSuccess },
  failure: { title: 'Failure', note: 'Not enough. You may still succeed at a cost.' },
  'total-failure': { title: 'Total failure', note: 'Not a single success. The night turns against you.' },
  'bestial-failure': { title: 'Bestial failure', note: 'You fail, and the Beast takes the wheel.', Symbol: DiceBestialFailure, grim: true },
};

// The symbol printed on a physical V5 die for this value.
function FaceIcon({ die: { value, hunger }, className }: { die: Die; className: string }) {
  if (value === 10) return hunger ? <DiceMessyCritical aria-hidden className={className} /> : <DiceCritical aria-hidden className={className} />;
  if (value >= 6) return <DiceSuccess aria-hidden className={className} />;
  if (hunger && value === 1) return <DiceBestialFailure aria-hidden className={className} />;
  return null;
}

const randomDie = (hunger: boolean): Die => ({ value: Math.floor(Math.random() * 10) + 1, hunger });

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

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
    'grid size-9 place-items-center rounded-full border border-bone/15 text-bone/80 transition duration-300 ease-(--ease-spring) hover:scale-110 hover:border-bone/40 hover:text-bone active:scale-95 focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-30';
  return (
    <div className='flex flex-col items-center gap-2'>
      <span className='text-[0.7rem] tracking-[0.2em] text-bone/55 uppercase'>{label}</span>
      <div className='flex items-center gap-2'>
        <button type='button' aria-label={`Decrease ${label}`} className={btn} disabled={value <= min} onClick={() => onChange(value - 1)}>
          <MdRemove aria-hidden />
        </button>
        <output aria-label={label} key={value} className='result-in w-10 text-center font-display text-4xl tabular-nums'>
          {value}
        </output>
        <button type='button' aria-label={`Increase ${label}`} className={btn} disabled={value >= max} onClick={() => onChange(value + 1)}>
          <MdAdd aria-hidden />
        </button>
      </div>
    </div>
  );
}

function DieFace({
  die,
  rolling,
  index,
  selected,
  selectable,
  onSelect,
}: {
  die: Die;
  rolling: boolean;
  index: number;
  selected: boolean;
  selectable: boolean;
  onSelect: () => void;
}) {
  const success = die.value >= 6;
  const label = `${die.hunger ? 'Hunger die' : 'Die'} showing ${die.value}${selected ? ', selected for reroll' : ''}`;
  return (
    <li>
      <button
        type='button'
        aria-label={label}
        aria-pressed={selectable ? selected : undefined}
        disabled={!selectable}
        onClick={onSelect}
        style={{ animationDelay: rolling ? `${index * -60}ms` : `${index * 55}ms` }}
        className={[
          'relative grid size-16 place-items-center rounded-2xl transition-[opacity,box-shadow,translate] duration-300 md:size-20',
          rolling ? 'die-spin' : 'die-land',
          die.hunger
            ? 'bg-accent text-white shadow-[0_0.75rem_1.5rem_-0.75rem_var(--accent)]'
            : 'border border-bone/25 bg-bone/[0.05] text-bone',
          !rolling && !success && !(die.hunger && die.value === 1) ? 'opacity-40' : '',
          selected ? '-translate-y-2 ring-2 ring-bone ring-offset-2 ring-offset-ink' : '',
          selectable ? 'cursor-pointer hover:-translate-y-1' : 'cursor-default',
        ].join(' ')}
      >
        <FaceIcon die={die} className='h-10 w-auto md:h-12' />
        <span aria-hidden className='absolute right-2 bottom-1 text-[0.6rem] tabular-nums opacity-60'>
          {die.value}
        </span>
      </button>
    </li>
  );
}

type HistoryEntry = { id: number; label: string; detail: string; grim?: boolean };

export default function DiceRoller() {
  const [pool, setPool] = useState(5);
  const [hunger, setHunger] = useState(1);
  const [difficulty, setDifficulty] = useState(3);
  const [result, setResult] = useState<RollResult | null>(null);
  const [display, setDisplay] = useState<Die[]>([]);
  const [rolling, setRolling] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [rerolled, setRerolled] = useState(false);
  const [rouse, setRouse] = useState<{ id: number; value: number } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const timers = useRef<number[]>([]);
  const nextId = useRef(1);

  useEffect(() => {
    const pending = timers.current;
    return () =>
      pending.forEach((t) => {
        clearTimeout(t);
        clearInterval(t);
      });
  }, []);

  const log = (entry: Omit<HistoryEntry, 'id'>) =>
    setHistory((h) => [{ ...entry, id: nextId.current++ }, ...h].slice(0, 8));

  // Flicker random faces while the dice tumble, then settle on the result.
  const animateTo = (final: RollResult, onDone: (r: RollResult) => void) => {
    if (prefersReducedMotion()) {
      setDisplay(final.dice);
      setResult(final);
      onDone(final);
      return;
    }
    setRolling(true);
    setResult(null);
    const flicker = window.setInterval(
      () => setDisplay(final.dice.map((d) => randomDie(d.hunger))),
      80,
    );
    const settle = window.setTimeout(() => {
      clearInterval(flicker);
      setDisplay(final.dice);
      setRolling(false);
      setResult(final);
      onDone(final);
    }, ROLL_MS);
    timers.current.push(flicker, settle);
  };

  const roll = () => {
    setSelected([]);
    setRerolled(false);
    setRouse(null);
    animateTo(rollPool(pool, hunger, difficulty), (r) =>
      log({
        label: OUTCOMES[r.outcome].title,
        detail: `${pool} dice · ${Math.min(hunger, pool)} hunger · ${r.successes} vs ${difficulty}`,
        grim: OUTCOMES[r.outcome].grim,
      }),
    );
  };

  // Willpower: reroll up to three regular dice.
  const reroll = () => {
    if (!result) return;
    const dice = result.dice.map((d, i) => (selected.includes(i) ? randomDie(false) : d));
    setSelected([]);
    setRerolled(true);
    animateTo(resolveRoll(dice, difficulty), (r) =>
      log({ label: `Willpower reroll: ${OUTCOMES[r.outcome].title}`, detail: `${r.successes} vs ${difficulty}`, grim: OUTCOMES[r.outcome].grim }),
    );
  };

  const rouseCheck = () => {
    const value = Math.floor(Math.random() * 10) + 1;
    setRouse({ id: Date.now(), value });
    if (value < 6) setHunger((h) => Math.min(5, h + 1));
    log({
      label: value >= 6 ? 'Rouse check: calm' : 'Rouse check: Hunger rises',
      detail: `Rolled ${value}`,
      grim: value < 6,
    });
  };

  const toggleSelect = (i: number) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : s.length < MAX_REROLL ? [...s, i] : s));

  const dice = display.length ? display : Array.from({ length: pool }, (_, i) => ({ value: 0, hunger: i >= pool - Math.min(hunger, pool) }));
  const outcome = result ? OUTCOMES[result.outcome] : null;
  const canReroll = !!result && !rolling && !rerolled;

  return (
    <div className='grid gap-5 xl:grid-cols-3'>
      <div className={`flex flex-col gap-8 p-6 md:p-8 xl:col-span-2 ${panel}`}>
        <div className='flex flex-wrap items-end justify-center gap-x-10 gap-y-6 md:justify-between'>
          <Stepper label='Dice pool' value={pool} min={1} max={20} onChange={(v) => { setPool(v); setDisplay([]); setResult(null); }} />
          <Stepper label='Hunger' value={hunger} min={0} max={5} onChange={(v) => { setHunger(v); setDisplay([]); setResult(null); }} />
          <Stepper label='Difficulty' value={difficulty} min={1} max={10} onChange={(v) => { setDifficulty(v); setResult(null); }} />
        </div>

        <ul aria-label='Dice' aria-busy={rolling} className='flex min-h-44 flex-wrap content-center justify-center gap-3'>
          {dice.map((die, i) =>
            die.value === 0 ? (
              <li
                key={`idle-${i}`}
                className={`size-16 rounded-2xl md:size-20 ${die.hunger ? 'bg-accent/25' : 'border border-dashed border-bone/20'}`}
              />
            ) : (
              <DieFace
                key={`${i}-${rolling ? 'r' : 's'}`}
                die={die}
                index={i}
                rolling={rolling}
                selected={selected.includes(i)}
                selectable={canReroll && !die.hunger}
                onSelect={() => toggleSelect(i)}
              />
            ),
          )}
        </ul>

        <div aria-live='polite' className='min-h-24 border-t border-bone/10 pt-6 text-center'>
          {outcome && result ? (
            <div key={`${result.successes}-${result.outcome}-${history[0]?.id}`} className='result-in flex flex-col items-center gap-2'>
              <div className='flex items-center gap-3'>
                {outcome.Symbol && <outcome.Symbol aria-hidden className={`h-12 w-auto ${outcome.grim ? 'text-accent' : 'text-bone'}`} />}
                <p className={`font-display text-5xl italic ${outcome.grim ? 'text-accent' : ''}`}>{outcome.title}</p>
              </div>
              <p className='text-bone/60'>{outcome.note}</p>
              <p className='text-xs tracking-[0.2em] text-bone/45 uppercase'>
                {result.successes} {result.successes === 1 ? 'success' : 'successes'} vs difficulty {difficulty}
              </p>
            </div>
          ) : (
            <p className='text-sm text-bone/45'>
              {rolling ? 'Rolling…' : 'Set your pool and roll. Red dice are Hunger dice.'}
            </p>
          )}
        </div>

        <div className='flex flex-wrap items-center justify-center gap-3'>
          <button type='button' onClick={roll} disabled={rolling} className={`${buttonPrimary} px-8 py-3 text-base`}>
            <GiD10 aria-hidden className='size-5 transition-transform duration-500 ease-(--ease-spring) group-hover:rotate-180' />
            Roll {pool} {pool === 1 ? 'die' : 'dice'}
          </button>
          {canReroll && (
            <button type='button' onClick={reroll} disabled={!selected.length} className={buttonGhost}>
              <MdRefresh aria-hidden className='size-4 transition-transform duration-500 group-hover:-rotate-180' />
              {selected.length ? `Reroll ${selected.length} with Willpower` : `Select up to ${MAX_REROLL} dice to reroll`}
            </button>
          )}
        </div>
      </div>

      <div className='flex flex-col gap-5'>
        <section aria-labelledby='rouse-title' className={`p-6 ${panel}`}>
          <h2 id='rouse-title' className='font-display text-2xl'>Rouse check</h2>
          <p className='mt-2 text-sm leading-relaxed text-bone/60'>
            Wake the blood for a discipline or Blood Surge. On a 1–5, your Hunger rises.
          </p>
          <div className='mt-5 flex items-center gap-4'>
            <button type='button' onClick={rouseCheck} disabled={rolling} className={buttonGhost}>
              Rouse the blood
            </button>
            {rouse && (
              <span
                key={rouse.id}
                className={`die-land grid size-12 place-items-center rounded-xl text-white ${rouse.value >= 6 ? 'border border-bone/25 bg-bone/[0.05] text-bone' : 'bg-accent'}`}
              >
                {rouse.value >= 6 ? <DiceSuccess aria-hidden className='h-7 w-auto' /> : <span className='font-display text-2xl'>{rouse.value}</span>}
              </span>
            )}
          </div>
        </section>

        <section aria-labelledby='history-title' className={`grow p-6 ${panel}`}>
          <h2 id='history-title' className='font-display text-2xl'>Recent rolls</h2>
          {history.length ? (
            <ol className='mt-4 flex flex-col gap-2'>
              {history.map((h) => (
                <li key={h.id} className='result-in flex items-baseline justify-between gap-3 border-b border-bone/[0.07] pb-2'>
                  <span className={`text-sm ${h.grim ? 'text-accent' : 'text-bone'}`}>{h.label}</span>
                  <span className='shrink-0 text-xs text-bone/45 tabular-nums'>{h.detail}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className='mt-3 text-sm text-bone/45'>Nothing rolled yet tonight.</p>
          )}
        </section>
      </div>
    </div>
  );
}
