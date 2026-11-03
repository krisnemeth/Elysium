import type { Metadata } from 'next';
import { Cormorant_Garamond, Josefin_Sans } from 'next/font/google';
import ForceDark from '@/app/ui/ForceDark';
import './landing.css';

// Own font variables: /concept remaps --font-cormorant to its editorial serif.
const display = Cormorant_Garamond({ weight: ['400', '500', '600'], style: ['normal', 'italic'], subsets: ['latin'], display: 'swap', variable: '--lc-display' });
const sans = Josefin_Sans({ weight: ['300', '400', '600'], subsets: ['latin'], display: 'swap', variable: '--lc-sans' });

export const metadata: Metadata = {
  title: { absolute: 'Elysium landing concept' },
  robots: { index: false },
};

// The landing redesign (ticket #39), not yet live. Not linked from anywhere.
export default function LandingConceptLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-game='wod' className={`lc ${display.variable} ${sans.variable}`}>
      <ForceDark />
      {children}
    </div>
  );
}
