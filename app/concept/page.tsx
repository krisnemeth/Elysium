import type { Metadata } from 'next';
import { serif, grotesk, mono } from './fonts';
import Hero from './_components/Hero';
import Marquee from './_components/Marquee';
import Dossier from './_components/Dossier';
import HungerDice from './_components/HungerDice';
import VaultIndex from './_components/VaultIndex';
import Coterie from './_components/Coterie';
import Closing from './_components/Closing';

export const metadata: Metadata = {
  title: 'Nightly Edition',
  description:
    'A concept landing page for Elysium, the character vault for Vampire: The Masquerade.',
};

// Concept landing page: an editorial take on the V5 art direction.
export default function ConceptPage() {
  return (
    <div
      className={`concept ${serif.variable} ${grotesk.variable} ${mono.variable} min-h-svh bg-night transition-colors duration-500 font-c-sans text-paper antialiased selection:bg-blood selection:text-paper`}
    >
      <Hero />
      <main>
        <Marquee />
        <Dossier />
        <HungerDice />
        <VaultIndex />
        <Coterie />
        <Closing />
      </main>
    </div>
  );
}
