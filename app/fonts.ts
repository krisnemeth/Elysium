import {
  Josefin_Slab,
  Josefin_Sans,
  Cormorant_Garamond,
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
