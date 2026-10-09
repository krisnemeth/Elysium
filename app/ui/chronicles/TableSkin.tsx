'use client';

import { createContext, use, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { SKIN_COOKIE, type Skin } from '@/app/lib/table-skin';

const SkinContext = createContext<{ skin: Skin; setSkin: (s: Skin) => void } | null>(null);
export const useTableSkin = () => use(SkinContext);

// The table, wearing its skin. Switching crossfades (View Transitions) and is remembered in a cookie.
export function SkinnedTable({ initial, children }: { initial: Skin; children: ReactNode }) {
  const [skin, set] = useState(initial);
  const setSkin = (next: Skin) => {
    document.cookie = `${SKIN_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    const apply = () => set(next);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduced) return apply();
    document.startViewTransition(() => flushSync(apply));
  };
  return (
    <SkinContext value={{ skin, setSkin }}>
      {/* .chronicle-table and the skins live in app/games.css. */}
      <main id='main' data-skin={skin} className='chronicle-table page-in relative flex flex-col gap-2 p-2 text-bone lg:h-svh'>
        {children}
      </main>
    </SkinContext>
  );
}
