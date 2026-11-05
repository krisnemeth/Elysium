'use client';

import { useSyncExternalStore } from 'react';
import { haptic, hapticsOn, setHapticsOn } from '@/app/lib/haptics';

const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

// Kept on this device, not the account: it saves straight away, apart from the form around it.
export default function HapticsToggle() {
  const on = useSyncExternalStore(subscribe, hapticsOn, () => true);
  return (
    <label className='flex cursor-pointer items-start justify-between gap-6 border-b border-bone/[0.07] pb-5'>
      <span>
        <span className='block font-display text-xl'>Haptic feedback</span>
        <span className='mt-1 block text-sm text-bone/60'>A small buzz on taps and dice results, on phones that support it. Saved on this device.</span>
      </span>
      <input
        type='checkbox'
        data-haptic='off'
        checked={on}
        onChange={(e) => {
          setHapticsOn(e.target.checked);
          listeners.forEach((fn) => fn());
          if (e.target.checked) haptic('select');
        }}
        className='mt-1 size-5 shrink-0 accent-[var(--accent)]'
      />
    </label>
  );
}
