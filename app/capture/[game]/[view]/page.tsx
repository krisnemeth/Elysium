import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SideNav from '@/app/ui/dashboard/sidenav';
import Ambience from '@/app/ui/game/Ambience';
import PageHeader from '@/app/ui/kit/PageHeader';
import DiceRoller from '@/app/ui/dice/DiceRoller';
import GuidedLoader from '@/app/ui/guided/GuidedLoader';
import CharacterEditor from '@/app/ui/sheets/CharacterEditor';
import SheetForm from '@/app/ui/sheets/SheetForm';
import VaultHome from '@/app/ui/dashboard/VaultHome';
import { PreferencesProvider } from '@/app/ui/PreferencesContext';
import { DEFAULT_PREFERENCES } from '@/app/lib/preferences';
import { emptySheet } from '@/app/lib/sheets/empty';
import { CHARACTERS } from '@/app/lib/sample-characters';
import { GAMES, isGame } from '@/app/lib/games';
import CaptureMode from './CaptureMode';

export const metadata: Metadata = { title: 'Capture', robots: { index: false } };

/*
  Development only: the dashboard's own pieces (overview, dice, guided and
  classic creation, the chronicle table's dice column, the scene alone) in the dashboard
  shell, with the sample characters and no account, for recording the
  landing page's clips (scripts in the session scratchpad; the clips live in
  public/landing/). ?mode=light shows a game's second scene. Saving is off:
  the editors' save status is hidden, as nothing here is signed in.
*/
const VIEWS = ['overview', 'dice', 'guided', 'classic', 'roller', 'scene'] as const;

export default async function Capture({ params, searchParams }: PageProps<'/capture/[game]/[view]'>) {
  if (process.env.NODE_ENV === 'production') notFound();
  const { game, view } = await params;
  const { mode, list } = await searchParams;
  if (!isGame(game) || !VIEWS.includes(view as (typeof VIEWS)[number])) notFound();

  if (view === 'scene') {
    // The scene alone, nothing in front of it, for the landing's themes.
    return (
      <div data-game={game} data-capture className='relative isolate min-h-svh bg-ink'>
        <CaptureMode mode={mode === 'light' ? 'light' : 'dark'} />
        <Ambience game={game} />
      </div>
    );
  }

  if (view === 'roller') {
    // The chronicle table's dice column, alone, for a portrait clip.
    return (
      <div data-game={game} data-capture className='relative isolate min-h-svh bg-ink p-4 text-bone'>
        <CaptureMode mode={mode === 'light' ? 'light' : 'dark'} />
        <Ambience game={game} />
        <div className='frame panel h-[calc(100svh-2rem)] p-4'>
          <DiceRoller game={game} compact />
        </div>
      </div>
    );
  }

  let body: React.ReactNode;
  if (view === 'overview') body = <VaultHome game={game} characters={CHARACTERS} loresheets={[]} view={list === '1' ? 'list' : 'grid'} />;
  else if (view === 'dice')
    body = (
      <div className='flex flex-col gap-10'>
        <PageHeader eyebrow={`${GAMES[game].name} · dice`} title='Roll the dice.' description='Criticals, messy criticals and rerolls, in the game’s own tray.' />
        <DiceRoller game={game} />
      </div>
    );
  else if (view === 'guided') body = <GuidedLoader game={game} />;
  else
    body = (
      <div className='flex flex-col gap-8'>
        <PageHeader eyebrow={`New ${GAMES[game].noun.one}`} title='Classic sheet' description='Fill it in as you would the printed sheet. Click a dot to set a rating, or use the arrow keys.' />
        <CharacterEditor game={game} id={null} initialSheet={emptySheet(game)}>
          <SheetForm game={game} />
        </CharacterEditor>
      </div>
    );

  return (
    <div data-game={game} data-capture className='relative isolate min-h-svh bg-ink text-bone'>
      <CaptureMode mode={mode === 'light' ? 'light' : 'dark'} />
      <Ambience game={game} />
      <SideNav game={game} />
      <main id='main' className='relative px-4 pt-32 pb-32 md:pt-10 md:pr-8 md:pb-16 md:pl-72'>
        <div className='mx-auto max-w-6xl'>
          <PreferencesProvider value={DEFAULT_PREFERENCES}>{body}</PreferencesProvider>
        </div>
      </main>
    </div>
  );
}
