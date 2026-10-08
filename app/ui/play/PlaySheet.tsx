'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { MdArrowBack, MdEdit } from 'react-icons/md';
import type { Game } from '@/app/lib/games';
import { ATTRIBUTES, SKILLS, type Attribute, type Damage, type Sheet, type Skill } from '@/app/lib/sheets/types';
import { NO_DAMAGE, takeDamage, trackState } from '@/app/lib/play/damage';
import { fieldInput, fieldLabel, panel } from '@/app/ui/kit/styles';
import DiceRoller from '@/app/ui/dice/DiceRoller';
import { shareRoll } from '@/app/lib/actions/social';
import SaveStatus from '@/app/ui/sheets/SaveStatus';
import { useCharacterSave } from '@/app/ui/sheets/useCharacterSave';
import { DamageTrack, HumanityTrack, PointTrack } from './tracks';

const PHYSICAL: readonly string[] = ATTRIBUTES.Physical;
const IMPAIRED_PENALTY = 2;

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

export default function PlaySheet({
  game,
  id,
  name,
  initialSheet,
  chronicles = [],
  embeddedIn,
}: {
  game: Game;
  id: string;
  name: string;
  initialSheet: Sheet;
  // Chronicles this character is in: rolls can be shared to one of them.
  chronicles?: { id: string; name: string }[];
  // Shown on a chronicle's page: no header, and every roll goes to that chronicle.
  embeddedIn?: string;
}) {
  const { sheet, update, state, error, retry } = useCharacterSave(game, id, initialSheet);
  const t = sheet.trackers;
  const healthMax = t.health ?? 0;
  const willpowerMax = t.willpower ?? 0;
  const health = sheet.damage?.health ?? NO_DAMAGE;
  const willpower = sheet.damage?.willpower ?? NO_DAMAGE;

  const setDamage = (track: 'health' | 'willpower') => (d: Damage) =>
    update((s) => {
      s.damage = { ...s.damage, [track]: d };
    });
  const setTracker = (key: string) => (v: number) =>
    update((s) => {
      s.trackers[key] = v;
    });

  // Pool builder
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
    (physical && trackState(health, healthMax) !== 'fine') || (!physical && trackState(willpower, willpowerMax) !== 'fine') ? IMPAIRED_PENALTY : 0;
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
  const shareId = useId();
  const [chosenShare, setShareTo] = useState(chronicles[0]?.id ?? '');
  const shareTo = embeddedIn ?? chosenShare;
  const rollLabel = [first, second?.label].filter(Boolean).join(' + ');

  return (
    <div className='flex flex-col gap-8'>
      {embeddedIn ? (
        <SaveStatus className='self-start' state={state} error={error} onRetry={() => void retry()} />
      ) : (
      <header className='flex flex-wrap items-center gap-3'>
        <Link href={`/vault/${game}/characters/${id}`} className='inline-flex items-center gap-1.5 text-sm text-bone/60 transition-colors hover:text-bone'>
          <MdArrowBack aria-hidden /> {name}
        </Link>
        <Link href={`/vault/${game}/characters/${id}/edit`} className='inline-flex items-center gap-1.5 text-sm text-bone/60 transition-colors hover:text-bone'>
          <MdEdit aria-hidden /> Full sheet
        </Link>
        <SaveStatus className='ml-auto' state={state} error={error} onRetry={() => void retry()} />
      </header>
      )}

      <section aria-labelledby='condition-title' className='flex flex-col gap-4'>
        <h2 id='condition-title' className='font-display text-3xl'>Condition</h2>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          <DamageTrack
            label='Health'
            max={healthMax}
            damage={health}
            onChange={setDamage('health')}
            downLabel={game === 'vampire' ? 'Torpor' : 'Incapacitated'}
            impairedNote={`−${IMPAIRED_PENALTY} dice to Physical tests. The pool below takes it into account.`}
          />
          <DamageTrack
            label='Willpower'
            max={willpowerMax}
            damage={willpower}
            onChange={setDamage('willpower')}
            downLabel='Impaired'
            impairedNote={`−${IMPAIRED_PENALTY} dice to Social and Mental tests. The pool below takes it into account.`}
          />
          {game === 'vampire' && (
            <>
              <PointTrack label='Hunger' value={t.hunger ?? 0} onChange={setTracker('hunger')} shape='box' note='Rouse checks below raise it on a 1–5.' />
              <HumanityTrack
                humanity={t.humanity ?? 7}
                stains={sheet.stains ?? 0}
                onHumanity={setTracker('humanity')}
                onStains={(v) =>
                  update((s) => {
                    s.stains = v;
                  })
                }
              />
            </>
          )}
          {game === 'werewolf' && (
            <>
              <PointTrack label='Rage' value={t.rage ?? 0} onChange={setTracker('rage')} shape='box' note='With no Rage left, you lose the wolf and can’t change form.' />
              <PointTrack label='Harano' value={t.harano ?? 0} onChange={setTracker('harano')} note='Despair at the dying world.' />
              <PointTrack label='Hauglosk' value={t.hauglosk ?? 0} onChange={setTracker('hauglosk')} note='Fanatic, unbending fury.' />
            </>
          )}
          {game === 'hunter' && (
            <>
              <PointTrack label='Desperation' value={t.desperation ?? 0} onChange={setTracker('desperation')} note='Shared by the cell. Add these dice to a roll that serves your Drive.' />
              <PointTrack label='Danger' value={t.danger ?? 0} onChange={setTracker('danger')} shape='box' note='How close the quarry is to striking back.' />
              <section aria-label='Despair' className={`flex flex-col gap-3 p-5 ${panel}`}>
                <h2 className='font-display text-2xl'>Despair</h2>
                <label className='flex min-h-11 cursor-pointer items-center justify-between gap-4 text-sm text-bone/75'>
                  In Despair: no Desperation dice until your Drive is fulfilled
                  <input
                    type='checkbox'
                    checked={sheet.despair ?? false}
                    onChange={(e) =>
                      update((s) => {
                        s.despair = e.target.checked;
                      })
                    }
                    className='size-5 shrink-0 accent-[var(--accent)]'
                  />
                </label>
              </section>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby='roll-title' className='flex flex-col gap-4'>
        <h2 id='roll-title' className='font-display text-3xl'>Roll</h2>
        <div className={`grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end ${panel}`}>
          <div className='flex flex-col gap-1'>
            <label htmlFor={firstId} className={fieldLabel}>Attribute</label>
            <select id={firstId} value={first} onChange={(e) => { setFirst(e.target.value as Attribute); setModifier(0); }} className={`${fieldInput} cursor-pointer [&_option]:bg-ink`}>
              {Object.entries(ATTRIBUTES).map(([group, list]) => (
                <optgroup key={group} label={group}>
                  {list.map((a) => (
                    <option key={a} value={a}>{a} ({sheet.attributes[a]})</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor={secondId} className={fieldLabel}>Plus</label>
            <select id={secondId} value={secondKey} onChange={(e) => { setSecondKey(e.target.value); setUseSpecialty(false); setModifier(0); }} className={`${fieldInput} cursor-pointer [&_option]:bg-ink`}>
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
            <label className='flex min-h-11 cursor-pointer items-center gap-2 text-sm text-bone/75'>
              <input type='checkbox' checked={useSpecialty} onChange={(e) => setUseSpecialty(e.target.checked)} className='size-5 accent-[var(--accent)]' />
              {second.specialty} (+1)
            </label>
          ) : (
            <span className='hidden sm:block' />
          )}
        </div>
        {embeddedIn ? (
          <p className='text-sm text-bone/55'>Rolls here appear in the chronicle’s dice log for everyone.</p>
        ) : chronicles.length > 0 && (
          <div className='flex flex-wrap items-center gap-3 text-sm text-bone/70'>
            <label htmlFor={shareId}>Share rolls with</label>
            <select id={shareId} value={shareTo} onChange={(e) => setShareTo(e.target.value)} className='cursor-pointer rounded-lg border border-bone/15 bg-transparent px-3 py-1.5 [&_option]:bg-ink'>
              <option value=''>Nobody (private)</option>
              {chronicles.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
        <DiceRoller
          game={game}
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
          onWillpowerReroll={() => setDamage('willpower')(takeDamage(willpower, willpowerMax, 'superficial'))}
        />
      </section>
    </div>
  );
}
