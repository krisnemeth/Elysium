import type { Game } from './games';

// Portraits hosted with the site that players can pick (and then crop).
export type LibraryPortrait = { src: string; label: string };

// Elysium's own look: the full-figure cut-outs the starters and the landing use, grouped by game.
export const PORTRAIT_LIBRARY: Record<Game, LibraryPortrait[]> = {
  vampire: [
    { src: '/art/vault/punk-vampire.webp', label: 'Punk in red and black' },
    { src: '/art/vault/toreador.webp', label: 'Woman in a red gown' },
    { src: '/art/cover-ventrue.webp', label: 'Shaven head, black coat' },
    { src: '/art/cover-neon.webp', label: 'Violet hair, long coat' },
    { src: '/art/vault/storyteller.webp', label: 'Bearded man in a waistcoat' },
  ],
  werewolf: [
    { src: '/art/cover-garou.webp', label: 'Tattooed man in leather' },
    { src: '/art/cover-garou-2.webp', label: 'Woman in a hood' },
    { src: '/art/vault/garou-biker.webp', label: 'Grinning biker' },
    { src: '/art/vault/garou-brawler.webp', label: 'Brawler with wrapped fists' },
  ],
  hunter: [
    { src: '/art/cover-hunter.webp', label: 'Woman lighting a match' },
    { src: '/art/cover-hunter-2.webp', label: 'Man in tactical gear' },
    { src: '/art/vault/hunter-tablet.webp', label: 'Man with a tablet' },
  ],
};

const darkPack = (n: number, label: string): LibraryPortrait => ({ src: `/portraits/dark-pack/characters-${n}.webp`, label });

/*
  Official World of Darkness art, for players who want the authentic look.
  Each number is the source file, Illustrations/Characters/Characters<n>.jpg in
  the Dark Pack asset pack (brand-assets/), resized; its use is governed by the
  Dark Pack Agreement. Labels describe the picture only: no canon names.
*/
export const DARK_PACK_PORTRAITS: LibraryPortrait[] = [
  darkPack(64, 'Woman with long earrings'),
  darkPack(46, 'Glowing eyes'),
  darkPack(30, 'Woman in a scarf'),
  darkPack(31, 'Scarred man in a scarf'),
  darkPack(38, 'Dark hair, sunken face'),
  darkPack(41, 'Green-skinned, long hair'),
  darkPack(36, 'Pale, sharp teeth'),
  darkPack(37, 'Pale man with sharp teeth'),
  darkPack(40, 'Wet hair, bared teeth'),
  darkPack(70, 'Bald, pointed ears'),
  darkPack(49, 'War form'),
  darkPack(63, 'Gaunt drifter'),
  darkPack(18, 'Tattooed blonde'),
  darkPack(7, 'Priest in a brown coat'),
  darkPack(10, 'Cap and glasses'),
  darkPack(9, 'Checked coat'),
  darkPack(59, 'Long dark coat'),
  darkPack(32, 'Robed figure in gold'),
  darkPack(16, 'Hooded, in rags'),
  darkPack(71, 'Scarred, bare-chested'),
  darkPack(50, 'Skull face, bullet belt'),
  darkPack(72, 'Striped jumper'),
  darkPack(73, 'Woman in a pink gown'),
  darkPack(75, 'Woman in a green dress'),
  darkPack(14, 'Black gown and purple skirt'),
  darkPack(12, 'Corset and patterned tights'),
  darkPack(52, 'Pale, purple skirt'),
  darkPack(22, 'Thigh boots and a whip'),
  darkPack(24, 'Cropped jacket'),
  darkPack(21, 'Patterned top, bandana'),
  darkPack(19, 'Striped top, rolled jeans'),
  darkPack(54, 'Dreadlocks, ragged coat'),
  darkPack(11, 'Dungarees'),
  darkPack(8, 'Silver hair, dark jacket'),
  darkPack(5, 'Hat and suit'),
  darkPack(6, 'Mohawk and studded collar'),
];
