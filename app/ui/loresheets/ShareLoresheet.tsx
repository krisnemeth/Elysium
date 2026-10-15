'use client';

import { useState, useTransition } from 'react';
import { MdOutlineGroups } from 'react-icons/md';
import { setLoresheetShared } from '@/app/lib/actions/loresheets';
import { fieldLabel, panel } from '@/app/ui/kit/styles';

// Which of your chronicles can read this loresheet (read-only for them).
export default function ShareLoresheet({
  loresheetId,
  chronicles,
  sharedWith,
}: {
  loresheetId: string;
  chronicles: { id: string; name: string }[];
  sharedWith: string[];
}) {
  const [shared, setShared] = useState(() => new Set(sharedWith));
  const [error, setError] = useState('');
  const [pending, start] = useTransition();

  const toggle = (id: string, on: boolean) =>
    start(async () => {
      const r = await setLoresheetShared(loresheetId, id, on);
      if (!r.ok) return setError(r.error);
      setError('');
      setShared((prev) => {
        const next = new Set(prev);
        if (on) next.add(id);
        else next.delete(id);
        return next;
      });
    });

  return (
    <section aria-labelledby='share-lore' className={`flex flex-col gap-4 p-6 md:p-8 ${panel}`}>
      <div>
        <h2 id='share-lore' className='flex items-center gap-2 font-display text-2xl'>
          <MdOutlineGroups aria-hidden className='size-6 text-accent' /> Share with a chronicle
        </h2>
        <p className='mt-1 text-sm text-bone/60'>
          Everyone in the chronicle can read it, Storyteller included, but only you can change it. That includes the Secrets, so leave out anything that is for you alone.
        </p>
      </div>
      {chronicles.length === 0 ? (
        <p className='text-sm text-bone/50'>You haven’t joined a chronicle of this game yet.</p>
      ) : (
        <fieldset disabled={pending} className='flex flex-col gap-2'>
          <legend className={`${fieldLabel} mb-1`}>Your chronicles</legend>
          {chronicles.map((c) => (
            <label key={c.id} className='flex cursor-pointer items-center gap-3 text-bone/85'>
              <input type='checkbox' checked={shared.has(c.id)} onChange={(e) => toggle(c.id, e.target.checked)} className='size-4 accent-accent' />
              {c.name}
            </label>
          ))}
        </fieldset>
      )}
      {error && <p role='status' className='text-sm text-accent'>{error}</p>}
    </section>
  );
}
