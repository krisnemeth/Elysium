'use client';

import clsx from 'clsx';
import { useId, useState } from 'react';
import type { Game } from '@/app/lib/games';
import { ATTRIBUTES, SKILLS, type Attribute, type Sheet, type Skill } from '@/app/lib/sheets/types';
import { NO_DAMAGE, takeDamage, trackState } from '@/app/lib/play/damage';
import { shareRoll } from '@/app/lib/actions/social';
import { fieldInput, fieldLabel, panel } from '@/app/ui/kit/styles';
import DiceRoller from '@/app/ui/dice/DiceRoller';

const PHYSICAL: readonly string[] = ATTRIBUTES.Physical;
export const IMPAIRED_PENALTY = 2;

type Second = { key: string; label: string; dots: number; specialty?: string };

// What can be added to an Attribute: Skills, plus Disciplines or Renown, or a second Attribute.
function seconds(game: Game, sheet: Sheet): { group: string; options: Second[] }[] {
  const groups: { group: string; options: Second[] }[] = Object.entries(SKILLS).map(([group, list]) => ({
    group: `${group} skills`,
    options: list.map((sk: Skill) => ({ key: `skill:${sk}`, label: sk, dots: sheet.skills[sk]?.dots ?? 0, specialty: sheet.skills[sk]?.specialty })),
  }));
  if (game === 'vampire' && sheet.disciplines?.length)
    groups.push({ group: 'Disciplines', options: sheet.disciplines.filter((d) => d.name).map((d) => ({ key: `discipline:${d.name}`, label: d.name, dots: d.dots })) });
  if (game === 'werewolf' && sheet.renown)
    groups.push({
      group: 'Renown',
      options: (['glory', 'honor', 'wisdom'] as const).map((r) => ({ key: `renown:${r}`, label: r[0].toUpperCase() + r.slice(1), dots: sheet.renown![r] })),
    });
  groups.push({
    group: 'Attributes',
    options: Object.values(ATTRIBUTES).flat().map((a) => ({ key: `attribute:${a}`, label: a, dots: sheet.attributes[a] })),
  });
  return groups;
}

/*
  The pool builder (e.g. Strength + Brawl) and the dice, bound to the sheet:
  special dice come from Hunger/Rage/Desperation, Willpower rerolls mark
  damage, and every roll can be shared to a chronicle (`shareTo`).
  `compact` is the chronicle table's dice column.
*/
export default function PoolRoller({
  game,
  name,
  sheet,
  update,
  shareTo,
  compact = false,
  locked,
}: {
  game: Game;
  name: string;
  sheet: Sheet;
  update: (fn: (s: Sheet) => void) => void;
  shareTo?: string;
  compact?: boolean;
  // Why rolling isn't possible right now (e.g. it's someone else's turn).
  locked?: string;
}) {
  const t = sheet.trackers;
  const health = sheet.damage?.health ?? NO_DAMAGE;
  const willpower = sheet.damage?.willpower ?? NO_DAMAGE;
  const setTracker = (key: string) => (v: number) =>
    update((s) => {
      s.trackers[key] = v;
    });

  const firstId = useId();
  const secondId = useId();
  const [first, setFirst] = useState<Attribute>('Strength');
  const [secondKey, setSecondKey] = useState('skill:Brawl');
  const [useSpecialty, setUseSpecialty] = useState(false);
  const [modifier, setModifier] = useState(0);
  const groups = seconds(game, sheet);
  const second = groups.flatMap((g) => g.options).find((o) => o.key === secondKey);
  const firstDots = sheet.attributes[first] ?? 0;
  const specialty = useSpecialty && second?.specialty ? 1 : 0;
  const physical = PHYSICAL.includes(first);
  const penalty =
    (physical && trackState(health, t.health ?? 0) !== 'fine') || (!physical && trackState(willpower, t.willpower ?? 0) !== 'fine') ? IMPAIRED_PENALTY : 0;
  const base = Math.max(1, firstDots + (second?.dots ?? 0) + specialty - penalty);
  const pool = Math.max(1, base + modifier);
  const poolNote = [
    `${first} ${firstDots}`,
    second && `${second.label} ${second.dots}`,
    specialty && `specialty +1`,
    penalty && `${physical ? 'Health' : 'Willpower'} impaired −${penalty}`,
    modifier && `${modifier > 0 ? '+' : '−'}${Math.abs(modifier)} other`,
  ]
    .filter(Boolean)
    .join(' · ');

  const specialKey = game === 'vampire' ? 'hunger' : game === 'werewolf' ? 'rage' : 'desperation';
  const rollLabel = [first, second?.label].filter(Boolean).join(' + ');
  const select = `${fieldInput} cursor-pointer [&_option]:bg-ink ${compact ? 'py-2 text-sm' : ''}`;

  return (
    <div className={clsx('flex flex-col', compact ? 'h-full min-h-0 gap-3' : 'gap-4')}>
      <div className={clsx('grid', compact ? 'grid-cols-2 gap-3' : `gap-4 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end ${panel}`)}>
        <div className='flex min-w-0 flex-col gap-1'>
          <label htmlFor={firstId} className={fieldLabel}>Attribute</label>
          <select id={firstId} value={first} onChange={(e) => { setFirst(e.target.value as Attribute); setModifier(0); }} className={select}>
            {Object.entries(ATTRIBUTES).map(([group, list]) => (
              <optgroup key={group} label={group}>
                {list.map((a) => (
                  <option key={a} value={a}>{a} ({sheet.attributes[a]})</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className='flex min-w-0 flex-col gap-1'>
          <label htmlFor={secondId} className={fieldLabel}>Plus</label>
          <select id={secondId} value={secondKey} onChange={(e) => { setSecondKey(e.target.value); setUseSpecialty(false); setModifier(0); }} className={select}>
            <option value=''>Nothing</option>
            {groups.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.options.map((o) => (
                  <option key={o.key} value={o.key}>{o.label} ({o.dots})</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        {second?.specialty ? (
          <label className={clsx('flex cursor-pointer items-center gap-2 text-sm text-bone/75', compact ? 'col-span-2' : 'min-h-11')}>
            <input type='checkbox' checked={useSpecialty} onChange={(e) => setUseSpecialty(e.target.checked)} className='size-5 accent-[var(--accent)]' />
            {second.specialty} (+1)
          </label>
        ) : (
          !compact && <span className='hidden sm:block' />
        )}
      </div>
      <DiceRoller
        game={game}
        compact={compact}
        locked={locked}
        onResult={(r, info) => {
          if (shareTo) void shareRoll(shareTo, game, sheet.profile.name || name, info.reroll ? `${rollLabel} (Willpower reroll)` : rollLabel, r, info.difficulty);
        }}
        pool={pool}
        onPoolChange={(v) => setModifier(v - base)}
        poolNote={poolNote}
        special={t[specialKey] ?? 0}
        onSpecialChange={setTracker(specialKey)}
        danger={t.danger ?? 0}
        onDangerChange={setTracker('danger')}
        despair={sheet.despair ?? false}
        onDespairChange={(v) =>
          update((s) => {
            s.despair = v;
          })
        }
        onWillpowerReroll={() =>
          update((s) => {
            s.damage = { ...s.damage, willpower: takeDamage(willpower, t.willpower ?? 0, 'superficial') };
          })
        }
      />
    </div>
  );
}
