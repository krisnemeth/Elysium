import type { IconType } from 'react-icons';
import { GiCharacter, GiHoodedFigure, GiTreasureMap } from 'react-icons/gi';
import type { LoreKind } from '@/app/lib/loresheets';

// One icon per kind of loresheet.
export const LORE_ICONS: Record<LoreKind, IconType> = {
  location: GiTreasureMap,
  pc: GiCharacter,
  npc: GiHoodedFigure,
};
