import type { Metadata } from 'next';
import { getMe } from '@/app/lib/data/social';
import { DEFAULT_PREFERENCES } from '@/app/lib/preferences';
import { panel } from '@/app/ui/kit/styles';
import SocialShell from '@/app/ui/social/SocialShell';
import SettingsForm from '@/app/ui/social/SettingsForm';
import { DisplayNameForm } from '@/app/ui/social/forms';

export const metadata: Metadata = { title: 'Settings' };

export default async function Settings() {
  const me = await getMe();
  return (
    <SocialShell eyebrow='Settings' title='Your profile.' description='How you appear to friends, and how much help the app gives you.'>
      <div className='grid gap-5 lg:grid-cols-[1fr_2fr]'>
        <section aria-label='Profile' className={`p-6 ${panel}`}>
          {me && <DisplayNameForm name={me.display_name} />}
        </section>
        <section aria-label='Help' className={`p-6 ${panel}`}>
          <h2 className='mb-5 font-display text-2xl'>Help while you play</h2>
          <SettingsForm preferences={me?.preferences ?? DEFAULT_PREFERENCES} />
        </section>
      </div>
    </SocialShell>
  );
}
