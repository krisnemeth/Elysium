'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { MdGridView, MdViewList } from 'react-icons/md';
import { rememberVaultView, type VaultView } from '@/app/lib/vault-view';

const OPTIONS = [
  { value: 'grid', label: 'Grid', Icon: MdGridView },
  { value: 'list', label: 'List', Icon: MdViewList },
] as const;

/*
  Shows one of two views already rendered on the server, and remembers the
  choice in a cookie so the next visit starts on it. Before any choice
  ('auto'), phones get List and larger screens Grid: the server renders both
  and CSS picks, so nothing jumps on load; the switch then follows the screen.
*/
export default function ViewSwitch({ initial, grid, list }: { initial: VaultView | 'auto'; grid: ReactNode; list: ReactNode }) {
  const [view, setView] = useState(initial);
  useEffect(() => {
    if (initial !== 'auto') return;
    const fit = () => setView(matchMedia('(max-width: 47.99rem)').matches ? 'list' : 'grid');
    fit();
  }, [initial]);
  const choose = (next: VaultView) => {
    setView(next);
    rememberVaultView(next);
  };
  return (
    <div className='flex flex-col gap-5'>
      <div role='group' aria-label='View' className='flex gap-1 self-end rounded-xl bg-bone/[0.06] p-1'>
        {OPTIONS.map(({ value, label, Icon }) => (
          <button
            key={value}
            type='button'
            aria-pressed={view === value}
            onClick={() => choose(value)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-accent ${
              view === value ? 'bg-accent text-on-accent shadow-[0_0_1rem_-0.4rem_var(--accent)]' : 'text-bone/60 hover:bg-bone/[0.05] hover:text-bone'
            }`}
          >
            <Icon aria-hidden className='size-4' />
            {label}
          </button>
        ))}
      </div>
      {view === 'auto' ? (
        <>
          <div className='max-md:hidden'>{grid}</div>
          <div className='md:hidden'>{list}</div>
        </>
      ) : view === 'grid' ? (
        grid
      ) : (
        list
      )}
    </div>
  );
}
