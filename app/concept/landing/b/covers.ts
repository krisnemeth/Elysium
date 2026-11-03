import type { Game } from '@/app/lib/games';

/*
  The cover characters, one per theme (two per game), and the mark behind each
  one's head. Plain data (no 'use client') so the server page can read it too.
*/

export type Cover = {
  // The theme it stands for (?cover=<id>).
  id: string;
  game: Game;
  src: string;
  width: number;
  height: number;
  alt: string;
  mark: MarkKey;
  // The backdrop's colour round the art (the theme's tokens in app/games.css
  // and globals.css), and the light of its scene: the glow on the call to
  // action and on the next section's rim (the forest's moonlight, the cave's
  // fire, the hideout's lamp).
  tint: string;
  glow: string;
  // The centre of the character's head, as fractions of --cover: below the
  // art's top, and off the art's centre line (negative is left). The mark's
  // loop (or disc) is centred on it.
  head: number;
  headX: number;
  // The theme's scene behind the character (the art the app's themes use),
  // and where to centre it.
  scene: { src: string; position?: string; flip?: boolean };
  // Its weather (Atmosphere.tsx).
  fx: Fx;
};

/*
  The weather round a character, drawn in WebGL in two layers, one behind
  the character and one in front. smoke: Vampire's black smoke rolling up
  from the floor. wind: Werewolf's leaves and debris blown across; fog: low banks drifting. steam:
  Hunter's steam rising from below; wisp: a thin curl of smoke from a point
  on the art (fractions of its width and height), the match or cigarette.
*/
export type Fx = {
  smoke?: { color: string; rim: string; opacity: number };
  wind?: { leaves: string[]; debris: string };
  fog?: { color: string; opacity: number };
  steam?: { opacity: number };
  wisp?: { x: number; y: number };
};

// The tallest art's height over its width (941 x 1672): every character fits
// between the game logos (--art-top) and the bottom of the screen.
export const ART_RATIO = 1.78;

/*
  A ring, in picker order: each game's dark theme, then each game's second
  scene, so the three logos on show are always three different games. All are
  cut-outs (transparent backgrounds), so the mark shows round each head.
  Hunter's second scene keeps the hideout's amber until its city theme lands.
*/
export const COVERS: Cover[] = [
  {
    id: 'masquerade',
    game: 'vampire',
    src: '/art/cover-ventrue.webp',
    width: 948,
    height: 1659,
    alt: 'A bald vampire in a black suit and open white shirt, hands folded, a spiked jewel at her throat.',
    mark: 'ventrue',
    tint: '#991b1b',
    glow: '#c81e2b',
    head: 0.22,
    headX: 0,
    scene: { src: '/art/city-night.webp', position: 'center 70%' },
    fx: { smoke: { color: '#040203', rim: '#4a0c10', opacity: 0.72 } },
  },
  {
    id: 'forest',
    game: 'werewolf',
    src: '/art/cover-garou-2.webp',
    width: 941,
    height: 1672,
    alt: 'A red-haired Garou in a knitted hood and a worn denim jacket, hands in her pockets.',
    mark: 'glassWalkers',
    tint: '#2c5a3f',
    glow: '#7fb894',
    head: 0.26,
    // Centred on her body rather than her head, so the glyph's rungs show both sides.
    headX: 0.05,
    scene: { src: '/art/ww-forest.webp' },
    fx: { fog: { color: '#a8bdb0', opacity: 0.26 }, wind: { leaves: ['#3d5a2a', '#5f7a2e', '#8a8a2a', '#c49a2c', '#c06a24', '#9a3a1e', '#6e2a1c', '#4a6a3a', '#a87c34'], debris: '#1c1a14' } },
  },
  {
    id: 'hideout',
    game: 'hunter',
    src: '/art/cover-hunter.webp',
    width: 941,
    height: 1672,
    alt: 'A grinning hunter with cropped blond hair and a bandolier, holding up a lit match.',
    mark: 'flame',
    tint: '#9a4a12',
    glow: '#f08a24',
    head: 0.19,
    headX: 0.1,
    scene: { src: '/art/htr-den.webp', position: 'center 30%', flip: true },
    fx: { steam: { opacity: 0.12 }, wisp: { x: 0.3, y: 0.105 } },
  },
  {
    id: 'neon',
    game: 'vampire',
    // Cropped mid-thigh up from cover-neon.webp, to stand as close as the others.
    src: '/art/cover-neon-close.webp',
    width: 646,
    height: 1150,
    alt: 'A violet-haired vampire in a long black coat and thigh boots, fingertips pressed to her temples.',
    mark: 'malkavian',
    tint: '#4c1d95',
    glow: '#9b6cf0',
    head: 0.285,
    headX: 0,
    scene: { src: '/locations/location-1.webp', position: 'center 38%' },
    fx: { smoke: { color: '#07040d', rim: '#3a1c66', opacity: 0.72 } },
  },
  {
    id: 'cave',
    game: 'werewolf',
    src: '/art/cover-garou.webp',
    width: 941,
    height: 1672,
    alt: 'A bearded Garou in a worn leather jacket and harness, hands in his pockets.',
    mark: 'claw',
    tint: '#7a4a22',
    glow: '#ef8a3c',
    head: 0.26,
    headX: -0.05,
    scene: { src: '/art/ww-cave.webp', position: 'center 40%' },
    fx: { fog: { color: '#b8946a', opacity: 0.12 } },
  },
  {
    id: 'hunter-2',
    game: 'hunter',
    src: '/art/cover-hunter-2.webp',
    width: 1003,
    height: 1568,
    alt: 'A scarred hunter with a shaved head and a black scarf, arms folded over a tactical vest.',
    mark: 'flame',
    tint: '#9a4a12',
    glow: '#f08a24',
    head: 0.3,
    headX: 0,
    scene: { src: '/locations/location-3.webp', position: 'center 55%' },
    fx: { steam: { opacity: 0.26 } },
  },
];

/*
  The marks, from the Dark Pack asset pack: for Vampire the character's clan
  symbol (the official SVGs, app/ui/svgs/official/clans: Ventrue's crossed
  sword and sceptre, crossing behind her neck; Malkavian's cracked mirror,
  its glass round her head); for Werewolf the Glass Walkers tribe glyph
  (public/werewolf/glass-walkers-mark.png, a large export of the pack's PNG)
  and the claw marks from its dice (public/dice/glyphs/wta-claw.svg); for
  Hunter the flame from its dice (public/dice/glyphs/htr-flame.svg). The
  clan symbols are inline SVGs; the rest are CSS masks over `src`, `ratio`
  their width/height. `width` is a
  fraction of --cover, `focus` the point centred on the head, below the mark's
  top (also of --cover).
*/
export const MARKS = {
  ventrue: { width: 0.95, focus: 0.4 },
  malkavian: { width: 0.7, focus: 0.34 },
  glassWalkers: { width: 0.9, focus: 0.42, src: '/werewolf/glass-walkers-mark.png', ratio: '447/800' },
  claw: { width: 0.62, focus: 0.33, src: '/dice/glyphs/wta-claw.svg', ratio: '496/524' },
  flame: { width: 0.56, focus: 0.34, src: '/dice/glyphs/htr-flame.svg', ratio: '404/528' },
} satisfies Record<string, { width: number; focus: number; src?: string; ratio?: string }>;

export type MarkKey = keyof typeof MARKS;

// The ring position to open on: a theme id, or a game (its first theme).
export function coverIndex(wanted: string | undefined) {
  const i = COVERS.findIndex((c) => c.id === wanted || c.game === wanted);
  return i < 0 ? 0 : i;
}

// How the next section takes over from the cover on scroll (landing.css),
// compared in /concept/landing/lab.
export const HANDOVERS = ['moonrise', 'iris', 'slash'] as const;
export type Handover = (typeof HANDOVERS)[number];
