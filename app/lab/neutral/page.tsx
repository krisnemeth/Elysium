import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AuthShell from '@/app/ui/auth/AuthShell';
import EmailForm from '@/app/ui/auth/EmailForm';
import ProviderButtons from '@/app/ui/auth/ProviderButtons';
import ForceDark from '@/app/ui/ForceDark';
import PageHeader from '@/app/ui/kit/PageHeader';
import { panel } from '@/app/ui/kit/styles';
import LoresheetsPage from '@/app/ui/loresheets/LoresheetsPage';
import NeutralShell from '@/app/ui/neutral/NeutralShell';
import OverviewPage from '@/app/ui/overview/OverviewPage';
import SettingsForm from '@/app/ui/social/SettingsForm';
import ChooseGame from '@/app/vault/(overview)/new/page';
import { DEFAULT_PREFERENCES } from '@/app/lib/preferences';
import { CHARACTERS } from '@/app/lib/sample-characters';
import NeutralLab from './NeutralLab';

export const metadata: Metadata = { title: 'Neutral theme lab', robots: { index: false } };

const LORE = [
  { id: 'a', game: 'vampire' as const, kind: 'location' as const, title: 'The Rack', content: { about: 'The club every Kindred in the city pretends not to visit.' } },
  { id: 'b', game: 'werewolf' as const, kind: 'npc' as const, title: 'Old Marrow’s sister', content: { about: 'Keeps the rail yards quiet, and knows why they need to be.' } },
  { id: 'c', game: 'hunter' as const, kind: 'location' as const, title: 'Harbour Street', content: { about: 'Three of the cell’s cases end at the same lock-up.' } },
];

/*
  Development only: the real neutral pages with sample data and no account, and
  a panel that changes the look live. Links and forms are off, and hovering or pressing
  is the real thing. The settings stay in this browser; copy them to keep them.
*/
export default async function Lab({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound();
  const { view = 'overview' } = await searchParams;
  const characters = CHARACTERS.map((c, i) => (i % 4 === 0 ? { ...c, status: 'draft' as const } : c));

  if (view === 'login') {
    return (
      <>
        <ForceDark />
        <AuthShell title='Welcome back.' lead='Your coterie, pack and cell are where you left them.'>
          <ProviderButtons />
          <EmailForm mode='login' />
        </AuthShell>
        <NeutralLab view={view} />
      </>
    );
  }

  return (
    <>
      <NeutralShell friendRequests={2}>
        {view === 'new' && <ChooseGame />}
        {view === 'loresheets' && <LoresheetsPage list={LORE} />}
        {view === 'settings' && (
          <div className='flex flex-col gap-10'>
            <PageHeader eyebrow='Settings' title='Your profile.' description='How you appear to friends, and how much help and decoration the app shows.' />
            <section aria-label='Preferences' className={`p-6 ${panel}`}>
              <SettingsForm preferences={DEFAULT_PREFERENCES} />
            </section>
          </div>
        )}
        {view === 'overview' && <OverviewPage name='Kris' characters={characters} loresheets={LORE} />}
      </NeutralShell>
      <NeutralLab view={view} />
    </>
  );
}
