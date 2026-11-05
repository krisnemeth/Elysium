import type { ClanKey } from './clans';
import type { Game } from './games';

// Placeholder data until characters are stored in a database.
export type Character = {
  slug: string;
  name: string;
  game: Game;
  // Vampire clan, Werewolf tribe or Hunter creed.
  faction: string;
  clan?: ClanKey;
  status: 'finished' | 'draft';
  // Uploaded portraits are already sized in the browser, so they skip next/image optimisation.
  image: { src: string; width: number; height: number; unoptimized?: boolean };
  description: string;
};

export const CHARACTERS: Character[] = [
  {
    slug: 'trixx-laveau',
    name: 'Trixx Laveau',
    game: 'vampire',
    faction: 'brujah',
    clan: 'brujah',
    status: 'finished',
    image: { src: '/art/vault/punk-vampire.webp', width: 933, height: 1400 },
    description:
      "Anarch enforcer and true believer of The Cause. Right hand to the Anarch leader. If you don't want trouble, stay out of her way.",
  },
  {
    slug: 'ailah-al-malik',
    name: 'Ailah Al-Malik',
    game: 'vampire',
    faction: 'ventrue',
    clan: 'ventrue',
    status: 'finished',
    image: { src: '/art/cover-ventrue.webp', width: 948, height: 1659 },
    description:
      'Merciless leader of the Glasgow Camarilla. She is a Ventrue through and through, and she will do anything to keep her power.',
  },
  {
    slug: 'ada-oconnor',
    name: "Ada O'Connor",
    game: 'vampire',
    faction: 'lasombra',
    clan: 'lasombra',
    status: 'draft',
    image: { src: '/art/vault/toreador.webp', width: 800, height: 1400 },
    description:
      'Recently arrived in the city, she is a Lasombra Ancilla with a mysterious past. She is a skilled manipulator and a master of shadows.',
  },
  {
    slug: 'claire-voyant',
    name: 'Claire Voyant',
    game: 'vampire',
    faction: 'malkavian',
    clan: 'malkavian',
    status: 'finished',
    image: { src: '/art/cover-neon.webp', width: 1024, height: 1536 },
    description:
      'Bearer of headaches, a Malkavian seer, she is the local oracle. She is cryptic, but her predictions are always accurate.',
  },
  {
    slug: 'blake-janssen',
    name: 'Blake Janssen',
    game: 'vampire',
    faction: 'nosferatu',
    clan: 'nosferatu',
    status: 'finished',
    image: { src: '/art/vault/storyteller.webp', width: 896, height: 1400 },
    description:
      'Nosferatu spymaster, he knows everything about everyone. He is the keeper of secrets and the master of the shadows.',
  },
  {
    slug: 'grey-fang',
    name: 'Grey-Fang',
    game: 'werewolf',
    faction: 'Red Talons',
    status: 'finished',
    image: { src: '/art/cover-garou.webp', width: 941, height: 1672 },
    description: 'An Ahroun who stopped counting the hunters he has buried. Speaks rarely, and only to the pack.',
  },
  {
    slug: 'rosa-vex',
    name: 'Rosa "Static" Vex',
    game: 'werewolf',
    faction: 'Glass Walkers',
    status: 'finished',
    image: { src: '/art/cover-garou-2.webp', width: 941, height: 1672 },
    description: 'A Ragabash who hacks Pentex payrolls for fun and spirit-talks the city grid for the pack.',
  },
  {
    slug: 'old-tom',
    name: 'Old Tom Marrow',
    game: 'werewolf',
    faction: 'Bone Gnawers',
    status: 'draft',
    image: { src: '/art/vault/garou-biker.webp', width: 788, height: 1400 },
    description: 'A Galliard who sings the forgotten caerns of the rail yards. Knows every stray by name.',
  },
  {
    slug: 'dez-mcallister',
    name: 'Dez McAllister',
    game: 'hunter',
    faction: 'Inquisitive',
    status: 'finished',
    image: { src: '/art/vault/hunter-tablet.webp', width: 791, height: 1400 },
    description: 'Ex-crime-scene photographer. Keeps the cell’s evidence board and refuses to stop asking questions.',
  },
  {
    slug: 'father-ruiz',
    name: 'Father Ruiz',
    game: 'hunter',
    faction: 'Faithful',
    status: 'finished',
    image: { src: '/art/cover-hunter-2.webp', width: 1003, height: 1568 },
    description: 'A parish priest who saw what lived in the bell tower. His Drive is Atonement, and he has a lot to atone for.',
  },
  {
    slug: 'vesna-kovac',
    name: 'Vesna Kovač',
    game: 'hunter',
    faction: 'Underground',
    status: 'draft',
    image: { src: '/art/cover-hunter.webp', width: 941, height: 1672 },
    description: 'Runs the cell’s burner phones, safehouses and forged papers. Hunts the thing that took her brother.',
  },
];
