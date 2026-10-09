'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { MdArrowBack, MdEdit } from 'react-icons/md';
import type { Game } from '@/app/lib/games';
import type { Damage, Sheet } from '@/app/lib/sheets/types';
import { NO_DAMAGE } from '@/app/lib/play/damage';
import { healthMax as healthOf, willpowerMax as willpowerOf } from '@/app/lib/sheets/derived';
import { panel } from '@/app/ui/kit/styles';
import SaveStatus from '@/app/ui/sheets/SaveStatus';
import { useCharacterSave } from '@/app/ui/sheets/useCharacterSave';
import { DamageTrack, HumanityTrack, PointTrack } from './tracks';
import PoolRoller, { IMPAIRED_PENALTY } from './PoolRoller';

export default function PlaySheet({
  game,
  id,
  name,
  initialSheet,
  chronicles = [],
}: {
  game: Game;
  id: string;
  name: string;
  initialSheet: Sheet;
  // Chronicles this character is in: rolls can be shared to one of them.
  chronicles?: { id: string; name: string }[];
}) {
  const { sheet, update, state, error, retry } = useCharacterSave(game, id, initialSheet);
  const t = sheet.trackers;
  // From the rules: Stamina + 3, and Composure + Resolve.
  const healthMax = healthOf(sheet);
  const willpowerMax = willpowerOf(sheet);
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

  const shareId = useId();
  const [shareTo, setShareTo] = useState(chronicles[0]?.id ?? '');

  return (
    <div className='flex flex-col gap-8'>
      <header className='flex flex-wrap items-center gap-3'>
        <Link href={`/vault/${game}/characters/${id}`} className='inline-flex items-center gap-1.5 text-sm text-bone/60 transition-colors hover:text-bone'>
          <MdArrowBack aria-hidden /> {name}
        </Link>
        <Link href={`/vault/${game}/characters/${id}/edit`} className='inline-flex items-center gap-1.5 text-sm text-bone/60 transition-colors hover:text-bone'>
          <MdEdit aria-hidden /> Full sheet
        </Link>
        <SaveStatus className='ml-auto' state={state} error={error} onRetry={() => void retry()} />
      </header>

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
        {chronicles.length > 0 && (
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
        <PoolRoller game={game} name={name} sheet={sheet} update={update} shareTo={shareTo} />
      </section>
    </div>
  );
}
