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
    image: { src: '/Female1.jpg', width: 700, height: 920 },
    description:
      "Anarch enforcer and true believer of The Cause. Right hand to the Anarch leader. If you don't want trouble, stay out of her way.",
  },
  {
    slug: 'agatha-ramalho',
    name: 'Agatha Ramalho',
    game: 'vampire',
    faction: 'tremere',
    clan: 'tremere',
    status: 'finished',
    image: { src: '/Tremere.jpg', width: 735, height: 950 },
    description:
      'Prefers their books to people. A Tremere scholar, they are the keeper of the Chantry library and the local expert on all things occult.',
  },
  {
    slug: 'ailah-al-malik',
    name: 'Ailah Al-Malik',
    game: 'vampire',
    faction: 'ventrue',
    clan: 'ventrue',
    status: 'finished',
    image: { src: '/Ventrue.jpg', width: 375, height: 487 },
    description:
      'Merciless leader of the Glasgow Camarilla. She is a Ventrue through and through, and she will do anything to keep her power.',
  },
  {
    slug: 'vic-vargas',
    name: 'Vic Vargas',
    game: 'vampire',
    faction: 'banu-haqim',
    clan: 'banu-haqim',
    status: 'draft',
    image: { src: '/Male1.jpg', width: 719, height: 918 },
    description:
      'Judge, jury, and executioner. Local Sheriff, the assassins of the Camarilla, and they are feared by all.',
  },
  {
    slug: 'ada-oconnor',
    name: "Ada O'Connor",
    game: 'vampire',
    faction: 'lasombra',
    clan: 'lasombra',
    status: 'draft',
    image: { src: '/Female3.jpg', width: 671, height: 950 },
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
    image: { src: '/Malkavian.jpg', width: 735, height: 1034 },
    description:
      'Bearer of headaches, a Malkavian seer, she is the local oracle. She is cryptic, but her predictions are always accurate.',
  },
  {
    slug: 'chelsea-grimm',
    name: 'Chelsea Grimm',
    game: 'vampire',
    faction: 'gangrel',
    clan: 'gangrel',
    status: 'finished',
    image: { src: '/Gangrel.jpg', width: 673, height: 950 },
    description:
      "A Gangrel loner, she is a fierce protector of the city's parks. She is a wild card, but she is loyal to her friends. Loves spiders.",
  },
  {
    slug: 'blake-janssen',
    name: 'Blake Janssen',
    game: 'vampire',
    faction: 'nosferatu',
    clan: 'nosferatu',
    status: 'finished',
    image: { src: '/Nosferatu.jpeg', width: 736, height: 883 },
    description:
      'Nosferatu spymaster, he knows everything about everyone. He is the keeper of secrets and the master of the shadows.',
  },
  {
    slug: 'grey-fang',
    name: 'Grey-Fang',
    game: 'werewolf',
    faction: 'Red Talons',
    status: 'finished',
    image: { src: '/portraits/garou-crinos.webp', width: 600, height: 800 },
    description: 'An Ahroun who stopped counting the hunters he has buried. Speaks rarely, and only to the pack.',
  },
  {
    slug: 'rosa-vex',
    name: 'Rosa "Static" Vex',
    game: 'werewolf',
    faction: 'Glass Walkers',
    status: 'finished',
    image: { src: '/portraits/garou-punk.webp', width: 600, height: 800 },
    description: 'A Ragabash who hacks Pentex payrolls for fun and spirit-talks the city grid for the pack.',
  },
  {
    slug: 'old-tom',
    name: 'Old Tom Marrow',
    game: 'werewolf',
    faction: 'Bone Gnawers',
    status: 'draft',
    image: { src: '/portraits/garou-drifter.webp', width: 600, height: 800 },
    description: 'A Galliard who sings the forgotten caerns of the rail yards. Knows every stray by name.',
  },
  {
    slug: 'dez-mcallister',
    name: 'Dez McAllister',
    game: 'hunter',
    faction: 'Inquisitive',
    status: 'finished',
    image: { src: '/portraits/hunter-flannel.webp', width: 600, height: 800 },
    description: 'Ex-crime-scene photographer. Keeps the cell’s evidence board and refuses to stop asking questions.',
  },
  {
    slug: 'father-ruiz',
    name: 'Father Ruiz',
    game: 'hunter',
    faction: 'Faithful',
    status: 'finished',
    image: { src: '/portraits/hunter-priest.webp', width: 600, height: 800 },
    description: 'A parish priest who saw what lived in the bell tower. His Drive is Atonement, and he has a lot to atone for.',
  },
  {
    slug: 'kenji-park',
    name: 'Kenji Park',
    game: 'hunter',
    faction: 'Underground',
    status: 'draft',
    image: { src: '/portraits/hunter-tech.webp', width: 600, height: 800 },
    description: 'Runs the cell’s burner phones and safehouses. Has never once used his real name online.',
  },
  {
    slug: 'the-reverend',
    name: '“The Reverend”',
    game: 'hunter',
    faction: 'Martial',
    status: 'finished',
    image: { src: '/portraits/hunter-trench.webp', width: 600, height: 800 },
    description: 'Nobody knows his name. He arrives before the fire and leaves after it. The cell does not ask.',
  },
];
