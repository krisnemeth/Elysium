import { Instrument_Serif, Archivo, JetBrains_Mono } from 'next/font/google';

export const serif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--nf-instrument',
});

// Variable width axis, used extra-condensed for headlines.
export const grotesk = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--nf-archivo',
});

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--nf-jetbrains',
});
