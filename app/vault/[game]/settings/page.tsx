import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMe } from '@/app/lib/data/social';
import { isGame } from '@/app/lib/games';
import { DEFAULT_PREFERENCES } from '@/app/lib/preferences';
import PageHeader from '@/app/ui/kit/PageHeader';
import { panel } from '@/app/ui/kit/styles';
import SettingsForm from '@/app/ui/social/SettingsForm';
import { DisplayNameForm } from '@/app/ui/social/forms';

export const metadata: Metadata = { title: 'Settings' };

export default async function Settings({ params }: PageProps<'/vault/[game]/settings'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  const me = await getMe();
  return (
    <div className='flex flex-col gap-10'>
      <PageHeader eyebrow='Settings' title='Your profile.' description='How you appear to friends, and how much help and decoration the app shows.' />
      <div className='grid gap-5 lg:grid-cols-[1fr_2fr]'>
        <section aria-label='Profile' className={`p-6 ${panel}`}>
          {me && <DisplayNameForm name={me.display_name} />}
        </section>
        <section aria-label='Preferences' className={`p-6 ${panel}`}>
          <h2 className='mb-5 font-display text-2xl'>Preferences</h2>
          <SettingsForm preferences={me?.preferences ?? DEFAULT_PREFERENCES} />
        </section>
      </div>
    </div>
  );
}
