// Werewolf tribes and auspices (with their official glyphs in /public/werewolf)
// and Hunter creeds and drives, as used by the 5th edition games.

export const TRIBES = [
  'Black Furies',
  'Bone Gnawers',
  'Children of Gaia',
  'Galestalkers',
  'Ghost Council',
  'Glass Walkers',
  'Hart Wardens',
  'Red Talons',
  'Shadow Lords',
  'Silent Striders',
  'Silver Fangs',
] as const;

export const AUSPICES = ['Ragabash', 'Theurge', 'Philodox', 'Galliard', 'Ahroun'] as const;

export const glyphUrl = (name: string) => `/werewolf/${name.toLowerCase().replace(/\s+/g, '-')}.png`;

export const CREEDS = ['Entrepreneurial', 'Faithful', 'Inquisitive', 'Martial', 'Underground'] as const;

export const DRIVES = ['Curiosity', 'Vengeance', 'Oath', 'Greed', 'Pride', 'Envy', 'Atonement'] as const;
