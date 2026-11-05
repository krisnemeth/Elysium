import type { Game } from '@/app/lib/games';

// The cover last chosen on the landing: the overview wears its theme (app/lib/entry-cover.ts).
export const COVER_COOKIE = 'elysium-cover';

// In the browser only.
export function rememberCover(id: string) {
  document.cookie = `${COVER_COOKIE}=${id}; path=/; max-age=31536000; samesite=lax`;
}

/*
  The cover characters, one per theme (two per game), and the mark behind each
  one's head. Plain data (no 'use client') so the server page can read it too.
*/

export type Cover = {
  // The theme it stands for (?cover=<id>), and its name in the app.
  id: string;
  name: string;
  game: Game;
  mode: 'dark' | 'light';
  src: string;
  width: number;
  height: number;
  alt: string;
  mark: MarkKey;
  // The backdrop's colour round the art (the theme's tokens in app/games.css
  // and globals.css), and the light of its scene: the glow on the call to
  // action and on the next section's rim (Neon Nights' rose neon, the
  // forest's and the cave's moonlit green, the hideout's lamp).
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
  rain: the city's rain, slanting with the wind (slant: sideways per unit fallen), with splashes.
*/
export type Fx = {
  smoke?: { color: string; rim: string; opacity: number };
  wind?: { leaves: string[]; debris: string };
  fog?: { color: string; opacity: number };
  steam?: { opacity: number };
  wisp?: { x: number; y: number };
  rain?: { opacity: number; slant: number };
};

// The tallest art's height over its width (941 x 1672): every character fits
// between the game logos (--art-top) and the bottom of the screen.
export const ART_RATIO = 1.78;

/*
  A ring, in picker order: each game's dark theme, then each game's second
  scene, so the three logos on show are always three different games. All are
  cut-outs (transparent backgrounds), so the mark shows round each head.
*/
export const COVERS: Cover[] = [
  {
    id: 'masquerade',
    name: 'Masquerade',
    game: 'vampire',
    mode: 'dark',
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
    name: 'Moonlit forest',
    game: 'werewolf',
    mode: 'dark',
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
    name: 'The hideout',
    game: 'hunter',
    mode: 'dark',
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
    name: 'Neon Nights',
    game: 'vampire',
    mode: 'light',
    // Cropped mid-thigh up from cover-neon.webp, to stand as close as the others.
    src: '/art/cover-neon-mid.webp',
    width: 702,
    height: 1250,
    alt: 'A violet-haired vampire in a long black coat and thigh boots, fingertips pressed to her temples.',
    mark: 'malkavian',
    tint: '#4c1d95',
    // The rose of the theme's flickering neon (--accent, globals.css).
    glow: '#e11d48',
    head: 0.262,
    headX: 0,
    scene: { src: '/locations/location-1.webp', position: 'center 38%' },
    fx: { smoke: { color: '#07040d', rim: '#3a1c66', opacity: 0.72 } },
  },
  {
    id: 'cave',
    name: 'The cave',
    game: 'werewolf',
    mode: 'light',
    src: '/art/cover-garou.webp',
    width: 941,
    height: 1672,
    alt: 'A bearded Garou in a worn leather jacket and harness, hands in his pockets.',
    mark: 'claw',
    tint: '#2c5a3f',
    glow: '#7fb894',
    head: 0.26,
    headX: -0.05,
    scene: { src: '/art/ww-cave.webp', position: 'center 40%' },
    fx: { fog: { color: '#a8bdb0', opacity: 0.12 } },
  },
  {
    id: 'hunter-2',
    name: 'The city',
    game: 'hunter',
    mode: 'light',
    src: '/art/cover-hunter-2.webp',
    width: 1003,
    height: 1568,
    alt: 'A scarred hunter with a shaved head and a black scarf, arms folded over a tactical vest.',
    mark: 'flame',
    tint: '#1d2b3c',
    // The city's sodium streetlamps (--accent, app/games.css).
    glow: '#f2b23a',
    head: 0.3,
    headX: 0,
    scene: { src: '/locations/location-3.webp', position: 'center 55%' },
    // Steam a little thinner than the hideout's, to leave room for the rain.
    fx: { steam: { opacity: 0.2 }, rain: { opacity: 1, slant: 0.14 } },
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
  ventrue: { width: 0.76, focus: 0.4 },
  malkavian: { width: 0.59, focus: 0.34 },
  glassWalkers: { width: 0.72, focus: 0.42, src: '/werewolf/glass-walkers-mark.png', ratio: '447/800' },
  claw: { width: 0.5, focus: 0.33, src: '/dice/glyphs/wta-claw.svg', ratio: '496/524' },
  flame: { width: 0.45, focus: 0.34, src: '/dice/glyphs/htr-flame.svg', ratio: '404/528' },
} satisfies Record<string, { width: number; focus: number; src?: string; ratio?: string }>;

export type MarkKey = keyof typeof MARKS;

// The ring position to open on: a theme id, or a game (its first theme).
export function coverIndex(wanted: string | undefined) {
  const i = COVERS.findIndex((c) => c.id === wanted || c.game === wanted);
  return i < 0 ? 0 : i;
}

// The scene's tint sunk into the night (a fifth of it over near-black), the colour round the cover's edges.
export function pageColor(tint: string) {
  const n = parseInt(tint.slice(1), 16);
  const mix = (c: number) => Math.round(10 + (c - 10) * 0.2).toString(16).padStart(2, '0');
  return `#${mix(n >> 16)}${mix((n >> 8) & 255)}${mix(n & 255)}`;
}
