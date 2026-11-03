import type { Metadata } from 'next';
import Navbar from '@/app/ui/navbar';

import CoverPicker from '@/app/ui/landing/CoverPicker';
import GamesSection from '@/app/ui/landing/GamesSection';
import Screens, { SECTIONS } from '@/app/ui/landing/Screens';
import { COVERS, coverIndex } from '@/app/ui/landing/covers';

/*
  The landing (/), "the cover": after the original 2023 Elysium hero (the `legacy`
  branch: app/ui/home/HomePageArt.tsx and WelcomeText.tsx, as /vampire rebuilt
  it), turned into a character picker across the three games (app/ui/landing/CoverPicker.tsx):
  one cut-out character per theme (two per game), the game's mark behind their head (the
  clan symbol, the Glass Walkers glyph or claw marks, the flame), its spines down the sides and its theme's
  colours, chosen from the game logos under the navbar. The first section
  slides up over the character from the front; the sections
  (Screens.tsx) follow, one screen each, in the chosen cover's colours. `?cover=<theme id or game>` opens on that cover.
*/

export const metadata: Metadata = {
  title: { absolute: 'Elysium — a character vault for the World of Darkness' },
  description:
    'Build and keep characters for Vampire: The Masquerade, Werewolf: The Apocalypse and Hunter: The Reckoning, each with its own sheet, dice and atmosphere.',
};

export default async function Landing({ searchParams }: PageProps<'/'>) {
  const { cover: wanted } = await searchParams;
  const initial = coverIndex(typeof wanted === 'string' ? wanted : undefined);

  return (
    <>
      <Navbar sections={SECTIONS} />
      <main id='main'>
        <CoverPicker initial={initial} />

        <GamesSection glow={COVERS[initial].glow} />
        <Screens initial={initial} />
      </main>
    </>
  );
}
