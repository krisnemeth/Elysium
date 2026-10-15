import type { Game } from './games';
import PACK from './image-library-pack.json';

/*
  The image library: art hosted with the site that players can pick for a
  character portrait or a loresheet, tagged by game and kind. To add more,
  see scripts/add-library-images.mts (it converts chosen files from the
  official asset pack to WebP and appends them to image-library-pack.json).

  Terms: `source` records where each image comes from. 'dark-pack' images are
  from the official asset pack that the Dark Pack Agreement offers for free
  community use (keep the Dark Pack notices on the site and never put access
  to them behind a payment). 'site' images shipped with the app before the
  library existed and their provenance isn't recorded: check them against the
  pack, or replace them, before relying on them.
*/

export type ImageKind = 'character' | 'antagonist' | 'location' | 'scene';
export type ImageSource = 'dark-pack' | 'site';

export type LibraryImage = {
  // Stable id: the file's path without its extension.
  id: string;
  src: string;
  label: string;
  // The game it suits, or 'any' for art that works in every game.
  game: Game | 'any';
  kind: ImageKind;
  source: ImageSource;
  // Free-form words for later search (mood, setting, clan…).
  tags?: string[];
  width: number;
  height: number;
};

export const IMAGE_KINDS: Record<ImageKind, { label: string; plural: string }> = {
  character: { label: 'Character', plural: 'Characters' },
  antagonist: { label: 'Antagonist', plural: 'Antagonists' },
  location: { label: 'Location', plural: 'Locations' },
  scene: { label: 'Scene', plural: 'Scenes' },
};
export const IMAGE_KINDS_ORDER: ImageKind[] = ['character', 'antagonist', 'location', 'scene'];

type Entry = [src: string, label: string, game: LibraryImage['game'], kind: ImageKind, size: [number, number], source?: ImageSource, tags?: string[]];

const toImage = ([src, label, game, kind, [width, height], source = 'dark-pack', tags]: Entry): LibraryImage => ({
  id: src.replace(/^\//, '').replace(/\.\w+$/, ''),
  src,
  label,
  game,
  kind,
  source,
  tags,
  width,
  height,
});

// Art already in /public: the portraits the picker offered before, the
// locations and the story acts' backdrops.
const BUILT_IN: LibraryImage[] = (
  [
    // Vampire characters
    ['/Female1.jpg', 'Punk with crosses', 'vampire', 'character', [700, 920], 'site'],
    ['/Female2.jpg', 'Woman in shadow', 'vampire', 'character', [671, 849], 'site'],
    ['/Female3.jpg', 'Woman in red', 'vampire', 'character', [671, 950], 'site'],
    ['/Female4.jpeg', 'Woman, full figure', 'vampire', 'character', [736, 1308], 'site'],
    ['/Male1.jpg', 'Man in a suit', 'vampire', 'character', [719, 918], 'site'],
    ['/Male2.jpg', 'Man in a coat', 'vampire', 'character', [650, 941], 'site'],
    ['/Brujah.jpg', 'Street fighter', 'vampire', 'character', [650, 700], 'site', ['brujah']],
    ['/Gangrel.jpg', 'Wild one', 'vampire', 'character', [673, 950], 'site', ['gangrel']],
    ['/Malkavian.jpg', 'Seer', 'vampire', 'character', [735, 1034], 'site', ['malkavian']],
    ['/Nosferatu.jpeg', 'Scarred face', 'vampire', 'character', [736, 883], 'site', ['nosferatu']],
    ['/Tremere.jpg', 'Scholar', 'vampire', 'character', [735, 950], 'site', ['tremere']],
    ['/Ventrue.jpg', 'Aristocrat', 'vampire', 'character', [375, 487], 'site', ['ventrue']],
    ['/art/pale-vampire.webp', 'Pale vampire', 'vampire', 'character', [1200, 1600]],
    ['/art/pale-vampire-2.webp', 'Pale vampire, eyes open', 'vampire', 'character', [1200, 1600]],
    // Werewolf characters
    ['/portraits/garou-crinos.webp', 'War form', 'werewolf', 'character', [600, 800], 'dark-pack', ['crinos']],
    ['/portraits/garou-punk.webp', 'Punk', 'werewolf', 'character', [600, 800]],
    ['/portraits/garou-drifter.webp', 'Drifter', 'werewolf', 'character', [600, 800]],
    ['/art/werewolf.webp', 'Werewolf', 'werewolf', 'character', [1100, 1512]],
    // Hunter characters
    ['/portraits/hunter-flannel.webp', 'Flannel', 'hunter', 'character', [600, 800]],
    ['/portraits/hunter-priest.webp', 'Priest', 'hunter', 'character', [600, 800]],
    ['/portraits/hunter-tech.webp', 'Tech', 'hunter', 'character', [600, 800]],
    ['/portraits/hunter-trench.webp', 'Trench coat', 'hunter', 'character', [600, 800]],
    ['/portraits/hunter-vesna.webp', 'Vesna', 'hunter', 'character', [600, 800]],
    ['/art/hunter.webp', 'Hunter', 'hunter', 'character', [900, 1886]],
    // Locations
    ['/art/city-night.webp', 'City at night', 'vampire', 'location', [2000, 1174], 'dark-pack', ['city', 'skyline']],
    ['/art/sheet-study.webp', 'Grand lobby', 'vampire', 'location', [1296, 875], 'dark-pack', ['haven', 'hotel']],
    ['/locations/location-30.webp', 'Teal city street', 'vampire', 'location', [2400, 1704], 'dark-pack', ['city', 'street']],
    ['/locations/location-53.webp', 'Cathedral and towers', 'vampire', 'location', [2400, 1700], 'dark-pack', ['city', 'church']],
    ['/locations/location-3.webp', 'Harbour in the fog', 'any', 'location', [2400, 1433], 'dark-pack', ['harbour', 'fog']],
    ['/art/ww-cave.webp', 'Cave and waterfall', 'werewolf', 'location', [1566, 1134], 'dark-pack', ['caern', 'cave']],
    ['/art/ww-forest.webp', 'Misty park', 'werewolf', 'location', [1200, 720], 'dark-pack', ['forest', 'fog']],
    ['/art/htr-cabin.webp', 'Mine tunnel', 'hunter', 'location', [1440, 1080], 'dark-pack', ['mine', 'tunnel']],
    ['/art/lore-dark.webp', 'Abandoned playground', 'hunter', 'location', [1306, 712], 'dark-pack', ['playground']],
    ['/acts/clash.webp', 'Manor at night', 'any', 'location', [2400, 1594], 'dark-pack', ['manor', 'estate']],
    ['/acts/hook.webp', 'Old town street', 'any', 'location', [2400, 1439], 'dark-pack', ['street', 'city']],
    // Scenes
    ['/acts/after.webp', 'Bridge in the mist', 'any', 'scene', [2400, 1330], 'dark-pack', ['bridge', 'mist']],
    ['/acts/dig.webp', 'The amphitheatre', 'any', 'scene', [1854, 960], 'dark-pack', ['hall']],
    ['/acts/twist.webp', 'Ruined underpass', 'any', 'scene', [2400, 1441], 'dark-pack', ['ruins']],
  ] satisfies Entry[]
).map(toImage);

// Entries added by scripts/add-library-images.mts.
export const IMAGE_LIBRARY: LibraryImage[] = [...BUILT_IN, ...(PACK as LibraryImage[])];

// Images that suit a game (art tagged 'any' included), optionally of some kinds.
export function libraryImages({ game, kinds }: { game?: Game; kinds?: ImageKind[] } = {}) {
  return IMAGE_LIBRARY.filter((i) => (!game || i.game === game || i.game === 'any') && (!kinds || kinds.includes(i.kind)));
}

/*
  What an image is for: its shape and output size (the browser crops and
  scales to this before uploading), the kinds of art the library suggests,
  and how the card will frame it.
*/
export type ImageTarget = {
  noun: string;
  aspect: number;
  // Output width in pixels; the height follows from the aspect.
  width: number;
  kinds: ImageKind[];
  // Portraits are framed by the character card; loresheet images are plain.
  frame: 'card' | 'plain';
};

export const PORTRAIT_TARGET: ImageTarget = { noun: 'portrait', aspect: 3 / 4, width: 900, kinds: ['character'], frame: 'card' };

// Places are wide; people are tall like a portrait.
export const LORE_TARGETS = {
  location: { noun: 'picture', aspect: 16 / 10, width: 1600, kinds: ['location', 'scene'], frame: 'plain' },
  pc: { noun: 'picture', aspect: 3 / 4, width: 900, kinds: ['character'], frame: 'plain' },
  npc: { noun: 'picture', aspect: 3 / 4, width: 900, kinds: ['character', 'antagonist'], frame: 'plain' },
} satisfies Record<'location' | 'pc' | 'npc', ImageTarget>;
