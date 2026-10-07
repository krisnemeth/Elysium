'use client';

import { useId, useState, type FormEvent } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import type { Game } from '@/app/lib/games';
import { applyPurchase, purchases, xpTotals } from '@/app/lib/xp/costs';
import { buttonGhost, buttonPrimary, fieldInput, fieldLabel } from '@/app/ui/kit/styles';
import { useSheet } from '../SheetContext';

const today = () => new Date().toISOString().slice(0, 10);
const OTHER = 'other';

// The XP log: award experience, buy traits at the rules' cost, see the history.
export function Experience({ game }: { game: Game }) {
  const { sheet, update } = useSheet();
  const totals = xpTotals(sheet);
  const options = purchases(game, sheet);
  const groups = [...new Set(options.map((o) => o.group))];
  const log = [...(sheet.xp ?? [])].reverse();

  const ids = { award: useId(), awardNote: useId(), buy: useId(), otherName: useId(), otherCost: useId() };
  const [award, setAward] = useState('');
  const [awardNote, setAwardNote] = useState('');
  const [choice, setChoice] = useState('');
  const [otherName, setOtherName] = useState('');
  const [otherCost, setOtherCost] = useState('');

  const picked = options.find((o) => o.id === choice);
  const cost = choice === OTHER ? Number(otherCost) || 0 : (picked?.cost ?? 0);
  const short = cost - totals.available;
  const canBuy = (picked || (choice === OTHER && otherName.trim() && cost > 0)) && short <= 0;

  const addAward = (e: FormEvent) => {
    e.preventDefault();
    const amount = Math.round(Number(award));
    if (!amount || amount < 1) return;
    update((s) => {
      (s.xp ??= []).push({ id: crypto.randomUUID(), date: today(), kind: 'earned', amount, note: awardNote.trim() || 'Experience awarded' });
    });
    setAward('');
    setAwardNote('');
  };

  const buy = (e: FormEvent) => {
    e.preventDefault();
    if (!canBuy) return;
    update((s) => {
      if (picked) {
        applyPurchase(s, picked);
        (s.xp ??= []).push({
          id: crypto.randomUUID(),
          date: today(),
          kind: 'spent',
          amount: picked.cost,
          note: picked.id === 'specialty' ? 'New specialty' : `${picked.label} ${picked.from} → ${picked.to}`,
          trait: picked.id,
          from: picked.from,
          to: picked.to,
        });
      } else {
        (s.xp ??= []).push({ id: crypto.randomUUID(), date: today(), kind: 'spent', amount: cost, note: otherName.trim() });
      }
    });
    setChoice('');
    setOtherName('');
    setOtherCost('');
  };

  const remove = (id: string) =>
    update((s) => {
      s.xp = (s.xp ?? []).filter((e) => e.id !== id);
    });

  return (
    <div className='flex flex-col gap-8'>
      <dl className='grid grid-cols-3 gap-3 text-center'>
        {[
          ['Available', totals.available],
          ['Earned', totals.earned],
          ['Spent', totals.spent],
        ].map(([label, value]) => (
          <div key={label} className='rounded-xl border border-bone/10 bg-bone/[0.02] p-4'>
            <dd className='font-display text-4xl tabular-nums'>{value}</dd>
            <dt className='mt-1 text-[0.65rem] tracking-[0.2em] text-bone/50 uppercase'>{label}</dt>
          </div>
        ))}
      </dl>

      <div className='grid gap-8 lg:grid-cols-2'>
        <form onSubmit={addAward} className='flex flex-col gap-4'>
          <h3 className='font-display text-xl'>Award experience</h3>
          <div className='grid grid-cols-[6rem_1fr] gap-4'>
            <div className='flex flex-col gap-1'>
              <label htmlFor={ids.award} className={fieldLabel}>XP</label>
              <input id={ids.award} type='number' min={1} inputMode='numeric' value={award} onChange={(e) => setAward(e.target.value)} className={fieldInput} />
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor={ids.awardNote} className={fieldLabel}>For</label>
              <input id={ids.awardNote} value={awardNote} placeholder='Session 4' onChange={(e) => setAwardNote(e.target.value)} className={fieldInput} />
            </div>
          </div>
          <button type='submit' disabled={!(Number(award) >= 1)} className={`${buttonGhost} self-start`}>
            <MdAdd aria-hidden /> Add to the log
          </button>
        </form>

        <form onSubmit={buy} className='flex flex-col gap-4'>
          <h3 className='font-display text-xl'>Spend experience</h3>
          <div className='flex flex-col gap-1'>
            <label htmlFor={ids.buy} className={fieldLabel}>Buy</label>
            <select id={ids.buy} value={choice} onChange={(e) => setChoice(e.target.value)} className={`${fieldInput} cursor-pointer [&_option]:bg-ink`}>
              <option value=''>Choose a trait…</option>
              {groups.map((g) => (
                <optgroup key={g} label={g}>
                  {options
                    .filter((o) => o.group === g)
                    .map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id === 'specialty' ? o.label : `${o.label} ${o.from} → ${o.to}`} · {o.cost} XP{o.note && o.id !== 'specialty' ? ` (${o.note})` : ''}
                      </option>
                    ))}
                </optgroup>
              ))}
              <option value={OTHER}>Something else (enter the cost)…</option>
            </select>
          </div>
          {choice === OTHER && (
            <div className='grid grid-cols-[1fr_6rem] gap-4'>
              <div className='flex flex-col gap-1'>
                <label htmlFor={ids.otherName} className={fieldLabel}>What</label>
                <input id={ids.otherName} value={otherName} placeholder={game === 'werewolf' ? 'A new Gift or Rite' : game === 'hunter' ? 'A new Edge or Perk' : 'A ritual, formula…'} onChange={(e) => setOtherName(e.target.value)} className={fieldInput} />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor={ids.otherCost} className={fieldLabel}>XP</label>
                <input id={ids.otherCost} type='number' min={1} inputMode='numeric' value={otherCost} onChange={(e) => setOtherCost(e.target.value)} className={fieldInput} />
              </div>
            </div>
          )}
          {picked?.note && picked.id === 'specialty' && <p className='text-xs text-bone/50'>{picked.note}</p>}
          {choice === OTHER && <p className='text-xs text-bone/50'>Use the cost from your core rulebook. Add the trait to your sheet yourself.</p>}
          {cost > 0 && short > 0 && (
            <p role='status' className='text-sm text-accent'>
              Not enough experience: you need {short} more.
            </p>
          )}
          <button type='submit' disabled={!canBuy} className={`${buttonPrimary} self-start`}>
            {cost ? `Spend ${cost} XP` : 'Spend XP'}
          </button>
        </form>
      </div>

      <div className='flex flex-col gap-3'>
        <h3 className='font-display text-xl'>Log</h3>
        {totals.carriedEarned + totals.carriedSpent > 0 && (
          <p className='text-xs text-bone/50'>
            Carried over from the sheet’s earlier totals: {totals.carriedEarned} earned, {totals.carriedSpent} spent.
          </p>
        )}
        {log.length ? (
          <ol className='flex flex-col'>
            {log.map((e) => (
              <li key={e.id} className='flex items-center gap-3 border-b border-bone/[0.07] py-2.5'>
                <span className='w-24 shrink-0 text-xs text-bone/45 tabular-nums'>{e.date}</span>
                <span className='grow text-sm'>{e.note}</span>
                <span className={`shrink-0 font-display text-lg tabular-nums ${e.kind === 'spent' ? 'text-accent' : ''}`}>
                  {e.kind === 'spent' ? '−' : '+'}
                  {e.amount}
                </span>
                <button
                  type='button'
                  onClick={() => remove(e.id)}
                  aria-label={`Remove “${e.note}” from the log`}
                  title='Remove from the log (doesn’t change the sheet)'
                  className='grid size-8 shrink-0 place-items-center rounded-full text-bone/40 transition hover:bg-bone/10 hover:text-bone'
                >
                  <MdClose aria-hidden />
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p className='text-sm text-bone/45'>No experience logged yet. Award some after your next session.</p>
        )}
        {log.length > 0 && <p className='text-xs text-bone/40'>Removing an entry only changes the totals, not the traits on the sheet.</p>}
      </div>
    </div>
  );
}
