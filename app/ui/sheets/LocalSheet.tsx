'use client';

import { useState, type ReactNode } from 'react';
import type { GameKey, Sheet } from '@/app/lib/sheets/types';
import { SheetProvider } from './SheetContext';
import { emptySheet } from '@/app/lib/sheets/empty';

// A sheet that lives only in the browser (prototype pages; nothing is saved).
export default function LocalSheet({ game, children }: { game: GameKey; children: ReactNode }) {
  const [sheet, setSheet] = useState<Sheet>(() => emptySheet(game));
  return (
    <SheetProvider
      value={{
        sheet,
        update: (mutate) =>
          setSheet((s) => {
            const next = structuredClone(s);
            mutate(next);
            return next;
          }),
      }}
    >
      {children}
    </SheetProvider>
  );
}
