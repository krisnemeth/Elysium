import type { ClanKey } from './clans';

// Placeholder data until characters are stored in a database.
export type Character = {
  slug: string;
  name: string;
  clan: ClanKey;
  status: 'finished' | 'draft';
  image: { src: string; width: number; height: number };
  description: string;
};

export const CHARACTERS: Character[] = [
  {
    slug: 'trixx-laveau',
    name: 'Trixx Laveau',
    clan: 'brujah',
    status: 'finished',
    image: { src: '/Female1.jpg', width: 700, height: 920 },
    description:
      "Anarch enforcer and true believer of The Cause. Right hand to the Anarch leader. If you don't want trouble, stay out of her way.",
  },
  {
    slug: 'agatha-ramalho',
    name: 'Agatha Ramalho',
    clan: 'tremere',
    status: 'finished',
    image: { src: '/Tremere.jpg', width: 735, height: 950 },
    description:
      'Prefers their books to people. A Tremere scholar, they are the keeper of the Chantry library and the local expert on all things occult.',
  },
  {
    slug: 'ailah-al-malik',
    name: 'Ailah Al-Malik',
    clan: 'ventrue',
    status: 'finished',
    image: { src: '/Ventrue.jpg', width: 375, height: 487 },
    description:
      'Merciless leader of the Glasgow Camarilla. She is a Ventrue through and through, and she will do anything to keep her power.',
  },
  {
    slug: 'vic-vargas',
    name: 'Vic Vargas',
    clan: 'banu-haqim',
    status: 'draft',
    image: { src: '/Male1.jpg', width: 719, height: 918 },
    description:
      'Judge, jury, and executioner. Local Sheriff, the assassins of the Camarilla, and they are feared by all.',
  },
  {
    slug: 'ada-oconnor',
    name: "Ada O'Connor",
    clan: 'lasombra',
    status: 'draft',
    image: { src: '/Female3.jpg', width: 671, height: 950 },
    description:
      'Recently arrived in the city, she is a Lasombra Ancilla with a mysterious past. She is a skilled manipulator and a master of shadows.',
  },
  {
    slug: 'claire-voyant',
    name: 'Claire Voyant',
    clan: 'malkavian',
    status: 'finished',
    image: { src: '/Malkavian.jpg', width: 735, height: 1034 },
    description:
      'Bearer of headaches, a Malkavian seer, she is the local oracle. She is cryptic, but her predictions are always accurate.',
  },
  {
    slug: 'chelsea-grimm',
    name: 'Chelsea Grimm',
    clan: 'gangrel',
    status: 'finished',
    image: { src: '/Gangrel.jpg', width: 673, height: 950 },
    description:
      "A Gangrel loner, she is a fierce protector of the city's parks. She is a wild card, but she is loyal to her friends. Loves spiders.",
  },
  {
    slug: 'blake-janssen',
    name: 'Blake Janssen',
    clan: 'nosferatu',
    status: 'finished',
    image: { src: '/Nosferatu.jpeg', width: 736, height: 883 },
    description:
      'Nosferatu spymaster, he knows everything about everyone. He is the keeper of secrets and the master of the shadows.',
  },
];
