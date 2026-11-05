import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Jsans, Cormorant, CinzelFont, SpecialElite, CourierPrime } from './fonts';
import { startOnCoverScript, themeScript } from './lib/theme';
import Haptics from './ui/Haptics';
import ThemeColor from './ui/ThemeColor';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000',
  ),
  title: {
    template: '%s | Elysium',
    default: 'Elysium',
  },
  description:
    'A place to store your characters, and character sheets for the World of Darkness. Developed by Krisztian Nemeth web developer.',
  openGraph: {
    title: 'Elysium',
    description:
      'Build, store and play your Vampire: The Masquerade characters from any device.',
    images: ['/iPadDark.png'],
    type: 'website',
  },
};

export const viewport: Viewport = {
  // ThemeColor keeps it in step with the page's colour (--page-bg).
  themeColor: '#0d0a0b',
  // Draw under the phone's status bar and toolbar; fixed bars keep clear with env(safe-area-inset-*).
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      data-scroll-behavior='smooth'
      className={`${Cormorant.variable} ${CinzelFont.variable} ${SpecialElite.variable} ${CourierPrime.variable}`}
      // data-theme is set by themeScript before hydration.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: startOnCoverScript }} />
      </head>
      <body className={Jsans.className}>
        {children}
        <ThemeColor />
        <Haptics />
      </body>
    </html>
  );
}
