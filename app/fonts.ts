import {
  Josefin_Slab,
  Josefin_Sans,
  Cormorant_Garamond,
  Cinzel,
  Special_Elite,
  Courier_Prime,
} from 'next/font/google';

export const Jslab = Josefin_Slab({
  weight: ['400', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});
export const Jsans = Josefin_Sans({
  weight: ['300', '400', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

// Display serif for landing page headings.
export const Cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
});

// Werewolf display face: carved, ancient.
export const CinzelFont = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cinzel',
});

// Hunter: typewritten case files.
export const SpecialElite = Special_Elite({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-special-elite',
});
export const CourierPrime = Courier_Prime({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-courier',
});
