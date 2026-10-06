import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Jsans, Cormorant } from './fonts';
import { themeScript } from './lib/theme';

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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1a0b2e' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0a0b' },
  ],
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
      className={Cormorant.variable}
      // data-theme is set by themeScript before hydration.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={Jsans.className}>{children}</body>
    </html>
  );
}
