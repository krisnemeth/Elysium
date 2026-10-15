import type { Game } from './games';

/*
  What the crop guide shows: the shape a card cuts the picture to, and which
  part of the stored image it shows. `top` and `height` are fractions of the
  image's height.
  - Masquerade (Vampire, dark): the card's window is a pointed arch, 4:5,
    with the picture pinned to its top (VampireCard).
  - Every other card (CharacterCard) shows the picture 4:5, centred.
  Portraits are stored 3:4, so a card trims a little off (the bottom, or the
  top and bottom); the guide dims that part so players know what's safe.
*/
export type CropGuide = { shape: 'rect' | 'arch'; top: number; height: number };

// A 4:5 window over a 3:4 image shows this share of its height.
const CARD_SHARE = 3 / 4 / (4 / 5);

export const FULL_GUIDE: CropGuide = { shape: 'rect', top: 0, height: 1 };

export function portraitGuide(game: Game, mode: 'dark' | 'light'): CropGuide {
  if (game === 'vampire' && mode === 'dark') return { shape: 'arch', top: 0, height: CARD_SHARE };
  return { shape: 'rect', top: (1 - CARD_SHARE) / 2, height: CARD_SHARE };
}

// The lancet arch of `.gothic-arch` (app/games.css) in a 100 × 100 box, placed in
// the guide's band. Shared with the cropper's overlay so the two can't drift.
export function guidePath({ shape, top, height }: CropGuide) {
  const y = (v: number) => +(top * 100 + v * height).toFixed(3);
  if (shape === 'rect') return `M0 ${y(0)}H100V${y(100)}H0Z`;
  return `M0 ${y(100)}V${y(36)}C0 ${y(16)} 26 ${y(5)} 50 ${y(0)}C74 ${y(5)} 100 ${y(16)} 100 ${y(36)}V${y(100)}Z`;
}
