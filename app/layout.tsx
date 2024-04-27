import type { Metadata } from 'next';
import './globals.css';
import { Jsans } from './fonts';

export const metadata: Metadata = {
  title: {
    template: '%s | Elysium',
    default: 'Elysium',
  },
  description:
    'A place to store your characters, and character sheets for the World of Darkness. Developed by Krisztian Nemeth web developer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={Jsans.className}>{children}</body>
    </html>
  );
}
