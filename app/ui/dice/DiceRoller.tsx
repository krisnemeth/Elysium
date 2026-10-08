'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { GiD10 } from 'react-icons/gi';
import { MdAdd, MdRemove, MdRefresh } from 'react-icons/md';
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
    check?: { title: string; body: string; button: string; calm: string; bad: string };
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

function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
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

  const text = result ? outcomeText(game, result.outcome) : null;

  return (
    <div className='grid gap-5 xl:grid-cols-3'>
      <Paper index={1} className='xl:col-span-2'>
        {(torn) => (
      <div className={`flex h-full flex-col gap-6 p-6 md:p-8 ${torn} ${panel}`}>
        <div className='flex flex-wrap items-end justify-center gap-x-10 gap-y-6 md:justify-between'>
          <div className='flex flex-col items-center gap-1'>
            <Stepper label='Dice pool' value={usablePool} min={1} max={set.pool} onChange={(v) => { setPool(v); resetRoll(); }} />
            {poolNote && <span className='max-w-48 text-center text-xs text-bone/45'>{poolNote}</span>}
          </div>
          <Stepper label={specialName} value={special} min={0} max={set.special} onChange={(v) => { setSpecial(v); resetRoll(); }} />
          <Stepper label='Difficulty' value={difficulty} min={1} max={10} onChange={setDifficulty} />
        </div>

        <div className='relative -mx-2 h-72 md:h-96'>
          <DiceScene
            game={game}
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

        <div aria-live='polite' className='min-h-24 border-t border-bone/10 pt-6 text-center'>
          {text && result && settled ? (
            <div key={rollKey} className='result-in flex flex-col items-center gap-2'>
              <div className='flex items-center gap-3'>
                {text.glyph && <Glyph name={text.glyph} className={`inline-block size-12 ${text.grim ? 'text-accent' : 'text-bone'}`} />}
                <p className={`font-display text-5xl italic ${text.grim ? 'text-accent' : ''}`}>{text.title}</p>
              </div>
              <p className='max-w-md text-bone/60'>{text.note}</p>
              <p className='text-xs tracking-[0.2em] text-bone/45 uppercase'>
                {result.successes} {result.successes === 1 ? 'success' : 'successes'} vs difficulty {difficulty}
              </p>
              {game === 'hunter' && result.outcome === 'overreach' && !choiceMade && (
                <div className='mt-3 flex flex-wrap justify-center gap-3'>
                  <button type='button' onClick={() => choose('overreach')} className={buttonPrimary}>Overreach (Danger +1)</button>
                  <button type='button' onClick={() => choose('despair')} className={buttonGhost}>Accept Despair</button>
                </div>
              )}
            </div>
          ) : (
            <p className='text-sm text-bone/45'>
              {result ? 'Rolling…' : `Set your pool and roll. ${specialName} dice are the coloured ones.`}
            </p>
          )}
        </div>

        <div className='flex flex-wrap items-center justify-center gap-3'>
          <button type='button' onClick={roll} disabled={!settled} className={`${buttonPrimary} px-8 py-3 text-base`}>
            <GiD10 aria-hidden className='size-5 transition-transform duration-500 ease-(--ease-spring) group-hover:rotate-180' />
            Roll {usablePool + (game === 'hunter' ? usableSpecial : 0)} dice
          </button>
          {canRerollNow && (
            <button type='button' onClick={reroll} disabled={!selected.length} className={buttonGhost}>
              <MdRefresh aria-hidden className='size-4 transition-transform duration-500 group-hover:-rotate-180' />
              {selected.length ? `Reroll ${selected.length} with Willpower` : `Tap up to ${MAX_REROLL} dice to reroll`}
            </button>
          )}
        </div>
      </div>
        )}
      </Paper>

      <div className='flex flex-col gap-5'>
        {config.check && (
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
