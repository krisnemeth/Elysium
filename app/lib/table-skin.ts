import { GAMES_ORDER, type Game } from '@/app/lib/games';
import type { Theme } from '@/app/lib/theme';

/*
  The chronicle table's skin: any of the six scenes (game × mode), chosen in
  the game bar. It only recolours the table and frames its sidebars (see
  "table skins" in app/games.css). Kept in a cookie so the server renders it.
*/
export type Skin = `${Game}-${Theme}`;

export const SKIN_COOKIE = 'elysium-table-skin';

export const SKINS: { skin: Skin; game: Game; mode: Theme }[] = GAMES_ORDER.flatMap((game) =>
  (['dark', 'light'] as const).map((mode) => ({ skin: `${game}-${mode}` as Skin, game, mode })),
);

export function readSkin(value: string | undefined, fallback: Skin): Skin {
  return SKINS.some((s) => s.skin === value) ? (value as Skin) : fallback;
}
