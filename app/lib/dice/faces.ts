import type { DieKind, Game } from './rules';

/*
  How each die looks: its colours and which official symbol each face shows.
  Shared by the 3D dice (app/ui/dice3d/d10.ts) and flat dice (the chronicle's
  roll log); kept free of three.js so pages without the 3D tray stay light.
*/

export type DieStyle = { face: string; glyph: string };

// Colours sampled from the front faces of the official dice art; the black
// dice are a shade deeper, so they read black rather than grey on screen.
export const DICE_STYLES: Record<Game, Record<DieKind, DieStyle>> = {
  vampire: {
    regular: { face: '#1c1c1d', glyph: '#e8e8e8' },
    special: { face: '#ff0021', glyph: '#151515' },
  },
  werewolf: {
    regular: { face: '#b2b02c', glyph: '#171214' },
    special: { face: '#ff4437', glyph: '#0e0e0e' },
  },
  hunter: {
    regular: { face: '#ff7800', glyph: '#060600' },
    special: { face: '#141414', glyph: '#f5821f' },
  },
};

// Which official symbol a face shows.
export function glyphFor(game: Game, kind: DieKind, value: number): string | null {
  const special = kind === 'special';
  switch (game) {
    case 'vampire':
      if (value === 10) return special ? 'vtm-messy.svg' : 'vtm-ankh-crit.svg';
      if (value >= 6) return 'vtm-ankh.svg';
      return special && value === 1 ? 'vtm-skull.svg' : null;
    case 'werewolf':
      if (value === 10) return 'wta-claw-crit.svg';
      if (value >= 6) return 'wta-claw.svg';
      return special && value <= 2 ? 'wta-fangs.svg' : null;
    case 'hunter':
      if (value === 10) return 'htr-flame-crit.svg';
      if (value >= 6) return 'htr-flame.svg';
      return special && value === 1 ? 'htr-overreach.svg' : null;
  }
}

