'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { GiD10 } from 'react-icons/gi';
import { MdAdd, MdRemove, MdRefresh, MdRestartAlt } from 'react-icons/md';
import clsx from 'clsx';
import {
  canReroll,
  DICE_SET,
  rerollDice,
  rollPool,
  SPECIAL_DIE_NAME,
  type Die,
  type Game,
  type Outcome,
  type RollResult,
} from '@/app/lib/dice/rules';
import { buttonGhost, buttonPrimary, panel } from '@/app/ui/kit/styles';
import Glyph from './Glyph';
import { settleMs } from '@/app/ui/dice3d/timing';
import Paper from '@/app/ui/game/Paper';

// The 3D tray only runs in the browser.
const DiceScene = dynamic(() => import('@/app/ui/dice3d/DiceScene'), {
  ssr: false,
  loading: () => <div className='grid h-full place-items-center text-sm text-bone/40'>Setting the table…</div>,
});

const MAX_REROLL = 3;

type OutcomeText = { title: string; note: string; glyph?: string; grim?: boolean };

const BASE: Record<'critical' | 'win' | 'failure' | 'total-failure', OutcomeText> = {
  critical: { title: 'Critical win', note: 'A pair of tens. Something remarkable happens.' },
  win: { title: 'Win', note: 'Enough successes to beat the difficulty.' },
  failure: { title: 'Failure', note: 'Not enough. You may still succeed at a cost.' },
  'total-failure': { title: 'Total failure', note: 'Not a single success. The night turns against you.' },
};

const GAMES: Record<
  Game,
  {
    success: string;
    critical: string;
    outcomes: Partial<Record<Outcome, OutcomeText>>;
    check?: { title: string; body: string; button: string; calm: string; bad: string; uses: string; first: string };
  }
> = {
  vampire: {
    success: 'vtm-ankh.svg',
    critical: 'vtm-ankh-crit.svg',
    outcomes: {
      'messy-critical': { title: 'Messy critical', note: 'You win, but the Beast decides how.', glyph: 'vtm-messy.svg', grim: true },
      'bestial-failure': { title: 'Bestial failure', note: 'You fail, and the Beast takes the wheel.', glyph: 'vtm-skull.svg', grim: true },
    },
    check: {
      title: 'Rouse check',
      body: 'Wake the blood for a discipline or Blood Surge. On a 1–5, your Hunger rises.',
      button: 'Rouse the blood',
      calm: 'Rouse check: calm',
      bad: 'Rouse check: Hunger rises',
      uses: 'This roll uses the blood (a Discipline or Blood Surge)',
      first: 'Rouse the blood first: this roll draws on it.',
    },
  },
  werewolf: {
    success: 'wta-claw.svg',
    critical: 'wta-claw-crit.svg',
    outcomes: {
      brutal: {
        title: 'Brutal outcome',
        note: 'Two or more Rage dice show 1 or 2. The test fails, unless the goal was to cause harm.',
        glyph: 'wta-fangs.svg',
        grim: true,
      },
    },
    check: {
      title: 'Rage check',
      body: 'Call on a Gift or shift your form. On a 1–5, you lose a point of Rage.',
      button: 'Make a Rage check',
      calm: 'Rage check: Rage holds',
      bad: 'Rage check: Rage spent',
      uses: 'This roll calls on a Gift or a change of form',
      first: 'Make a Rage check first: this roll calls on your Rage.',
    },
  },
  hunter: {
    success: 'htr-flame.svg',
    critical: 'htr-flame-crit.svg',
    outcomes: {
      overreach: {
        title: 'Overreach or Despair',
        note: 'You succeed, but a Desperation die shows a 1. Choose your price.',
        glyph: 'htr-overreach.svg',
        grim: true,
      },
      despair: {
        title: 'Despair',
        note: 'You fail with a Desperation 1. Your Drive is lost until the cell fulfils it.',
        glyph: 'htr-overreach.svg',
        grim: true,
      },
    },
  },
};

function outcomeText(game: Game, outcome: Outcome): OutcomeText {
  const g = GAMES[game];
  return (
    g.outcomes[outcome] ?? {
      ...BASE[outcome as keyof typeof BASE],
      glyph: outcome === 'critical' ? g.critical : outcome === 'win' ? g.success : undefined,
    }
  );
}

function Stepper({ label, value, min, max, onChange, small = false }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; small?: boolean }) {
  const btn =
    `grid ${small ? 'size-6' : 'size-9'} place-items-center rounded-full border border-bone/15 text-bone/80 transition duration-300 ease-(--ease-spring) hover:scale-110 hover:border-bone/40 hover:text-bone active:scale-95 focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-30`;
  // Small steppers sit three to a row in a narrow column.
  return (
    <div className={small ? 'flex min-w-0 flex-col items-center gap-0.5' : 'flex flex-col items-center gap-2'}>
      <span className={`${small ? 'max-w-full truncate text-[0.6rem] tracking-[0.12em]' : 'text-[0.7rem] tracking-[0.2em]'} text-bone/55 uppercase`}>{label}</span>
      <div className={`flex items-center ${small ? 'gap-0.5' : 'gap-2'}`}>
        <button type='button' aria-label={`Decrease ${label}`} className={btn} disabled={value <= min} onClick={() => onChange(value - 1)}>
          <MdRemove aria-hidden />
        </button>
        <output aria-label={label} key={value} className={`result-in text-center font-display tabular-nums ${small ? 'w-7 text-2xl' : 'w-10 text-4xl'}`}>
          {value}
        </output>
        <button type='button' aria-label={`Increase ${label}`} className={btn} disabled={value >= max} onClick={() => onChange(value + 1)}>
          <MdAdd aria-hidden />
        </button>
      </div>
    </div>
  );
}

type HistoryEntry = { id: number; label: string; detail: string; grim?: boolean };

const idleDice = (game: Game, pool: number, special: number): Die[] => {
  const specials = game === 'hunter' ? special : Math.min(special, pool);
  const regulars = game === 'hunter' ? pool : pool - specials;
  // 3 is a blank face on every V5-family die.
  return [
    ...Array.from({ length: regulars }, () => ({ value: 3, kind: 'regular' as const })),
    ...Array.from({ length: specials }, () => ({ value: 3, kind: 'special' as const })),
  ];
};

// Every value can be controlled (play mode binds them to the sheet); left
// uncontrolled, the roller keeps its own state as on the dice page.
type Controlled<T> = { value?: T; onChange?: (value: T) => void };

function useMaybeControlled<T>(initial: T, { value, onChange }: Controlled<T>) {
  const [own, setOwn] = useState(initial);
  return [value ?? own, (v: T) => (onChange ? onChange(v) : setOwn(v))] as const;
}

export default function DiceRoller({
  game = 'vampire',
  pool: poolProp,
  onPoolChange,
  special: specialProp,
  onSpecialChange,
  danger: dangerProp,
  onDangerChange,
  despair: despairProp,
  onDespairChange,
  onWillpowerReroll,
  poolNote,
  onResult,
  compact = false,
  locked,
  onReset,
}: {
  game?: Game;
  pool?: number;
  onPoolChange?: (v: number) => void;
  special?: number;
  onSpecialChange?: (v: number) => void;
  danger?: number;
  onDangerChange?: (v: number) => void;
  despair?: boolean;
  onDespairChange?: (v: boolean) => void;
  // Called when Willpower is spent on a reroll (play mode marks the damage).
  onWillpowerReroll?: () => void;
  // Explains where the pool came from, e.g. "Strength 3 + Brawl 2".
  poolNote?: string;
  // Every roll and reroll, e.g. to share it with a chronicle.
  onResult?: (result: RollResult, info: { reroll: boolean; difficulty: number }) => void;
  // A smaller roller for the chronicle page: one column, a portrait tray, no
  // history (the chronicle keeps its own roll log).
  compact?: boolean;
  // Why rolling isn't possible right now (e.g. it's someone else's turn).
  locked?: string;
  // Reset also sets the pool back up (e.g. a sheet-built pool's modifier).
  onReset?: () => void;
}) {
  const config = GAMES[game];
  const specialName = SPECIAL_DIE_NAME[game];
  const [pool, setPool] = useMaybeControlled(5, { value: poolProp, onChange: onPoolChange });
  const [special, setSpecial] = useMaybeControlled(game === 'hunter' ? 0 : 1, { value: specialProp, onChange: onSpecialChange });
  const [difficulty, setDifficulty] = useState(3);
  const [danger, setDanger] = useMaybeControlled(0, { value: dangerProp, onChange: onDangerChange });
  const [despair, setDespair] = useMaybeControlled(false, { value: despairProp, onChange: onDespairChange });
  const [result, setResult] = useState<RollResult | null>(null);
  const [rollKey, setRollKey] = useState(0);
  const [rolled, setRolled] = useState<number[]>([]);
  const [settled, setSettled] = useState(true);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [selected, setSelected] = useState<number[]>([]);
  const [rerolled, setRerolled] = useState(false);
  const [choiceMade, setChoiceMade] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  // A roll that uses the blood or a Gift needs its rouse/Rage check first.
  const [usesPower, setUsesPower] = useState(false);
  const [checked, setChecked] = useState(false);
  const needsCheck = !!config.check && usesPower && !checked;

  // Pools built from a sheet can exceed the dice set; roll what the set holds.
  const set = DICE_SET[game];
  const usablePool = Math.min(pool, set.pool);
  const usableSpecial = Math.min(game === 'hunter' && despair ? 0 : special, set.special);

  const log = (entry: Omit<HistoryEntry, 'id'>) =>
    setHistory((h) => [{ ...entry, id: (h[0]?.id ?? 0) + 1 }, ...h].slice(0, 8));

  // The outcome is revealed once the dice have landed.
  const throwDice = (indexes: number[]) => {
    setRolled(indexes);
    setRollKey((k) => k + 1);
    setSettled(false);
    // The scene says when the last die stops (onSettled); this is the backstop.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => setSettled(true), reduced ? 0 : settleMs(indexes.length));
  };

  const finish = (r: RollResult, label?: string) => {
    setResult(r);
    onResult?.(r, { reroll: Boolean(label), difficulty });
    const text = outcomeText(game, r.outcome);
    log({
      label: label ? `${label}: ${text.title}` : text.title,
      detail: `${r.dice.length} dice · ${r.dice.filter((d) => d.kind === 'special').length} ${specialName.toLowerCase()} · ${r.successes} vs ${difficulty}`,
      grim: text.grim,
    });
    if (game === 'hunter' && r.outcome === 'despair') setDespair(true);
  };

  const roll = () => {
    if (needsCheck || locked) return;
    setChecked(false);
    const r = rollPool(game, usablePool, usableSpecial, difficulty);
    setSelected([]);
    setRerolled(false);
    setChoiceMade(false);
    throwDice(r.dice.map((_, i) => i));
    finish(r);
  };

  const reroll = () => {
    if (!result) return;
    const r = rerollDice(game, result, selected, difficulty);
    throwDice(selected);
    setSelected([]);
    setRerolled(true);
    onWillpowerReroll?.();
    finish(r, 'Willpower reroll');
  };

  const check = () => {
    const value = Math.floor(Math.random() * 10) + 1;
    const ok = value >= 6;
    if (!ok) setSpecial(game === 'vampire' ? Math.min(5, special + 1) : Math.max(0, special - 1));
    setChecked(true);
    log({ label: ok ? config.check!.calm : config.check!.bad, detail: `Rolled ${value}`, grim: !ok });
  };

  const choose = (choice: 'overreach' | 'despair') => {
    setChoiceMade(true);
    if (choice === 'overreach') setDanger(Math.min(5, danger + 1));
    else setDespair(true);
    log({ label: choice === 'overreach' ? 'Overreach: Danger +1' : 'Chose Despair', detail: '', grim: true });
  };

  const dice: Die[] = result ? result.dice : idleDice(game, usablePool, usableSpecial);
  const canRerollNow = !!result && settled && !rerolled;
  const sceneDice = dice.map((d, i) => ({
    ...d,
    dimmed: !!result && d.value < 6 && !(d.kind === 'special' && ((game === 'werewolf' && d.value <= 2) || d.value === 1)),
    selected: selected.includes(i),
    selectable: canRerollNow && canReroll(game, d),
  }));
  const toggle = (i: number) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : s.length < MAX_REROLL ? [...s, i] : s));

  const resetRoll = () => {
    setResult(null);
    setRolled([]);
    setSelected([]);
  };

  // Start over: no roll, no check, the default difficulty, the pool as built.
  const resetAll = () => {
    clearTimeout(settleTimer.current);
    resetRoll();
    setSettled(true);
    setRerolled(false);
    setChoiceMade(false);
    setUsesPower(false);
    setChecked(false);
    setDifficulty(3);
    if (onReset) onReset();
    else if (poolProp === undefined) setPool(5);
  };

  const text = result ? outcomeText(game, result.outcome) : null;

  return (
    <div className={compact ? 'flex h-full min-h-0 flex-col gap-5' : 'grid gap-5 xl:grid-cols-3'}>
      <Paper index={1} className={compact ? 'min-h-0 grow' : 'xl:col-span-2'}>
        {/* Compact rollers sit inside the table's own panel. */}
        {(torn) => (
      <div className={`flex h-full flex-col ${compact ? 'gap-3' : `gap-6 p-6 md:p-8 ${torn} ${panel}`}`}>
        <div className={compact ? 'grid grid-cols-3 gap-1' : 'flex flex-wrap items-end justify-center gap-x-10 gap-y-6 md:justify-between'}>
          <div className={compact ? 'contents' : 'flex flex-col items-center gap-1'}>
            <Stepper small={compact} label={compact ? 'Pool' : 'Dice pool'} value={usablePool} min={1} max={set.pool} onChange={(v) => { setPool(v); resetRoll(); }} />
            {poolNote && !compact && <span className='max-w-48 text-center text-xs text-bone/45'>{poolNote}</span>}
          </div>
          <Stepper small={compact} label={specialName} value={special} min={0} max={set.special} onChange={(v) => { setSpecial(v); resetRoll(); }} />
          <Stepper small={compact} label={compact ? 'Diff.' : 'Difficulty'} value={difficulty} min={1} max={10} onChange={setDifficulty} />
        </div>
        {poolNote && compact && <p title={poolNote} className='-mt-1 truncate text-xs text-bone/45'>{poolNote}</p>}

        <div className={compact ? 'relative min-h-72 w-full grow lg:min-h-40' : 'relative -mx-2 h-108 md:h-144'}>
          <DiceScene
            game={game}
            portrait={compact}
            dice={sceneDice}
            rollKey={rollKey}
            rolled={rolled}
            onSelect={toggle}
            onSettled={(key) => {
              if (key !== rollKey) return;
              clearTimeout(settleTimer.current);
              setSettled(true);
            }}
          />
        </div>

        {/* Screen reader and keyboard access to the dice */}
        <ul aria-label='Dice' className='sr-only'>
          {sceneDice.map((d, i) => (
            <li key={i}>
              <button type='button' disabled={!d.selectable} aria-pressed={d.selectable ? d.selected : undefined} onClick={() => toggle(i)}>
                {d.kind === 'special' ? `${specialName} die` : 'Die'} {result ? `showing ${d.value}` : 'not rolled'}
              </button>
            </li>
          ))}
        </ul>

        {/* What the roll says, in a slot of fixed height, so nothing below or
            around the tray moves as messages come and go. */}
        <div aria-live='polite' className={clsx('flex shrink-0 flex-col items-center justify-center overflow-hidden border-t border-bone/10 text-center', compact ? 'h-21 pt-2' : 'h-36 pt-4')}>
          {text && result && settled ? (
            <div key={rollKey} className={clsx('result-in flex flex-col items-center', compact ? 'gap-0.5' : 'gap-1.5')}>
              <div className='flex items-center gap-2.5'>
                {text.glyph && <Glyph name={text.glyph} className={clsx('inline-block', compact ? 'size-7' : 'size-11', text.grim ? 'text-accent' : 'text-bone')} />}
                <p className={clsx('font-display leading-none italic', compact ? 'text-[1.75rem]' : 'text-5xl', text.grim && 'text-accent')}>{text.title}</p>
              </div>
              {game === 'hunter' && result.outcome === 'overreach' && !choiceMade ? (
                <div className='mt-1 flex gap-2'>
                  <button type='button' onClick={() => choose('overreach')} title='Overreach: succeed, and Danger rises by 1' className={`${buttonPrimary} px-3 py-1.5 text-xs`}>{compact ? 'Overreach' : 'Overreach (Danger +1)'}</button>
                  <button type='button' onClick={() => choose('despair')} title='Accept Despair: no Desperation dice until your Drive is fulfilled' className={`${buttonGhost} px-3 py-1.5 text-xs`}>{compact ? 'Despair' : 'Accept Despair'}</button>
                </div>
              ) : (
                <>
                  <p title={text.note} className={clsx('max-w-md text-bone/60', compact ? 'line-clamp-1 text-xs' : 'line-clamp-2')}>{text.note}</p>
                  <p className='text-[0.65rem] tracking-[0.2em] text-bone/45 uppercase'>
                    {result.successes} {result.successes === 1 ? 'success' : 'successes'} vs difficulty {difficulty}
                  </p>
                </>
              )}
            </div>
          ) : (
            <p
              id={locked ? 'roll-locked' : needsCheck ? 'check-first' : undefined}
              className={clsx(compact ? 'text-xs' : 'text-sm', !result && needsCheck && !locked ? 'text-accent' : 'text-bone/50')}
            >
              {result
                ? 'Rolling…'
                : locked
                  ? locked
                  : needsCheck
                    ? config.check!.first
                    : `Ready: ${usablePool + (game === 'hunter' ? usableSpecial : 0)} dice${game === 'hunter' ? '' : `, ${Math.min(usableSpecial, usablePool)} ${specialName}`} against difficulty ${difficulty}.`}
            </p>
          )}
        </div>

        {config.check && (
          <label className={clsx('flex shrink-0 cursor-pointer items-center justify-center gap-3 text-bone/75', compact ? 'text-xs' : 'text-sm')}>
            <input type='checkbox' checked={usesPower} onChange={(e) => setUsesPower(e.target.checked)} className='size-4 shrink-0 accent-[var(--accent)]' />
            {config.check.uses}
          </label>
        )}

        {/* Every action keeps its place: buttons are enabled or disabled, never added or removed. */}
        <div className={clsx('flex shrink-0 flex-col gap-2', !compact && 'mx-auto w-full max-w-xl')}>
          <div className={clsx('grid gap-2', config.check && 'grid-cols-2')}>
            {config.check && (
              // Lit up while the next roll is waiting for it.
              <button type='button' onClick={check} disabled={!!locked} className={clsx(buttonGhost, 'min-w-0 px-3', needsCheck && 'border-accent text-bone shadow-[0_0_1.25rem_-0.25rem_var(--accent)]')}>
                <span className='truncate'>{config.check.button}</span>
              </button>
            )}
            <button
              type='button'
              onClick={reroll}
              disabled={!canRerollNow || !selected.length || !!locked}
              title={`Spend Willpower to reroll up to ${MAX_REROLL} dice: tap them in the tray first.`}
              className={`${buttonGhost} min-w-0 px-3`}
            >
              <MdRefresh aria-hidden className='size-4 shrink-0 transition-transform duration-500 group-hover:-rotate-180' />
              <span className='truncate'>
                {compact
                  ? selected.length && canRerollNow ? `Reroll ${selected.length}` : 'Reroll'
                  : canRerollNow && selected.length ? `Reroll ${selected.length} with Willpower` : canRerollNow ? `Tap up to ${MAX_REROLL} dice to reroll` : 'Willpower reroll'}
              </span>
            </button>
          </div>
          <div className='grid grid-cols-[auto_1fr] gap-2'>
            <button type='button' onClick={resetAll} aria-label='Reset the roll' title='Reset: clear the roll and set up the dice again' className={`${buttonGhost} aspect-square px-0`}>
              <MdRestartAlt aria-hidden className='size-5' />
            </button>
            <button
              type='button'
              onClick={roll}
              disabled={!settled || needsCheck || !!locked}
              aria-describedby={locked ? 'roll-locked' : needsCheck ? 'check-first' : undefined}
              className={`${buttonPrimary} ${compact ? 'py-2.5' : 'py-3'} text-base`}
            >
              <GiD10 aria-hidden className='size-5 transition-transform duration-500 ease-(--ease-spring) group-hover:rotate-180' />
              Roll {usablePool + (game === 'hunter' ? usableSpecial : 0)} dice
            </button>
          </div>
        </div>
      </div>
        )}
      </Paper>

      <div className={compact ? 'grid gap-5 empty:hidden' : 'flex flex-col gap-5'}>
        {/* Compact rollers keep the check button next to Roll instead. */}
        {config.check && !compact && (
          <section aria-labelledby='check-title' className={`p-6 ${panel}`}>
            <h2 id='check-title' className='font-display text-2xl'>{config.check.title}</h2>
            <p className='mt-2 text-sm leading-relaxed text-bone/60'>{config.check.body}</p>
            <button type='button' onClick={check} className={`${buttonGhost} mt-5`}>{config.check.button}</button>
          </section>
        )}

        {/* Play mode shows Danger and Despair with the character's condition instead. */}
        {game === 'hunter' && dangerProp === undefined && (
          <section aria-labelledby='cell-title' className={`p-6 ${panel}`}>
            <h2 id='cell-title' className='font-display text-2xl'>The cell</h2>
            <div className='mt-4 flex items-center justify-between'>
              <span className='text-sm text-bone/70'>Danger</span>
              <span className='flex gap-1.5' aria-label={`Danger ${danger} of 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`size-3 rotate-45 border transition-colors duration-500 ${i < danger ? 'border-accent bg-accent' : 'border-bone/30'}`} />
                ))}
              </span>
            </div>
            <label className='mt-4 flex cursor-pointer items-center justify-between gap-4 text-sm text-bone/70'>
              In Despair (no Desperation dice)
              <input type='checkbox' checked={despair} onChange={(e) => setDespair(e.target.checked)} className='size-4 accent-[var(--accent)]' />
            </label>
          </section>
        )}

        {!compact && (
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
        )}
      </div>
    </div>
  );
}
