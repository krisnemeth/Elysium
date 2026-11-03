import Navbar from '@/app/ui/navbar';

import CoverPicker from './CoverPicker';
import GamesSection from './GamesSection';
import Screens, { SECTIONS } from './Screens';
import { COVERS, coverIndex } from './covers';

/*
  The landing, "the cover": after the original 2023 Elysium hero (the `legacy`
  branch: app/ui/home/HomePageArt.tsx and WelcomeText.tsx, as /vampire rebuilt
  it), turned into a character picker across the three games (CoverPicker.tsx):
  one cut-out character per theme (two per game), the game's mark behind their head (the
  clan symbol, the Glass Walkers glyph or claw marks, the flame), its spines down the sides and its theme's
  colours, chosen from the game logos under the navbar. The first section
  slides up over the character from the front; the sections
  (Screens.tsx) follow, one screen each, in the chosen cover's colours. `?cover=<theme id or game>` opens on that cover.
*/

export default async function Landing({ searchParams }: PageProps<'/concept/landing'>) {
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
