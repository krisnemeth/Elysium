import type { ReactNode } from 'react';
import type { Skin } from '@/app/lib/table-skin';
import ForceDark from '@/app/ui/ForceDark';
import ActBackdrop from './ActBackdrop';
import { SkinnedTable } from './TableSkin';

// A chronicle's page: the act's location behind the table, which fills the screen from lg up.
export default function TableShell({ game, act, skin, children }: { game: string; act: number; skin: Skin; children: ReactNode }) {
  return (
    <div data-game={game} className='relative min-h-svh bg-ink text-bone'>
      <ForceDark />
      <ActBackdrop act={act} />
      <SkinnedTable initial={skin}>{children}</SkinnedTable>
    </div>
  );
}
