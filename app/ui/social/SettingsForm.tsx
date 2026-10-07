'use client';

import { useActionState } from 'react';
import { savePreferences } from '@/app/lib/actions/social';
import type { Preferences } from '@/app/lib/preferences';
import { buttonPrimary } from '@/app/ui/kit/styles';

const OPTIONS: { key: keyof Preferences; title: string; body: string }[] = [
  { key: 'tooltips', title: 'Explain traits on the sheet', body: 'Hover over (or tab to) a trait’s name to see what it means.' },
  { key: 'guidance', title: 'Tips in guided creation', body: 'Short tutorials and hints on each step of the guided character builder.' },
];

export default function SettingsForm({ preferences }: { preferences: Preferences }) {
  const [state, action, pending] = useActionState(savePreferences, {});
  return (
    <form action={action} className='flex flex-col gap-5'>
      {OPTIONS.map((o) => (
        <label key={o.key} className='flex cursor-pointer items-start justify-between gap-6 border-b border-bone/[0.07] pb-5'>
          <span>
            <span className='block font-display text-xl'>{o.title}</span>
            <span className='mt-1 block text-sm text-bone/60'>{o.body}</span>
          </span>
          <input type='checkbox' name={o.key} defaultChecked={preferences[o.key]} className='mt-1 size-5 shrink-0 accent-[var(--accent)]' />
        </label>
      ))}
      {(state.error || state.message) && (
        <p role='status' className={`text-sm ${state.error ? 'text-accent' : 'text-bone/70'}`}>{state.error ?? state.message}</p>
      )}
      <button disabled={pending} className={`${buttonPrimary} self-start`}>Save settings</button>
    </form>
  );
}
