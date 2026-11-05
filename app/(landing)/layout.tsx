import { Cormorant_Garamond, Josefin_Sans } from 'next/font/google';
import ForceDark from '@/app/ui/ForceDark';
import '@/app/ui/landing/buttons.css';
import '@/app/ui/landing/landing.css';

// Own font variables: /concept remaps --font-cormorant to its editorial serif.
const display = Cormorant_Garamond({ weight: ['400', '500', '600'], style: ['normal', 'italic'], subsets: ['latin'], display: 'swap', variable: '--lc-display' });
const sans = Josefin_Sans({ weight: ['300', '400', '600'], subsets: ['latin'], display: 'swap', variable: '--lc-sans' });

// The landing at / (ticket #39): its own fonts, styles (app/ui/landing/landing.css) and dark-only look.
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-game='wod' className={`lc ${display.variable} ${sans.variable}`}>
      <ForceDark />
      {children}
    </div>
  );
}
