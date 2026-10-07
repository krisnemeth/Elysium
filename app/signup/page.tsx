import type { Metadata } from 'next';
import AuthShell from '@/app/ui/auth/AuthShell';
import ProviderButtons from '@/app/ui/auth/ProviderButtons';
import EmailForm from '@/app/ui/auth/EmailForm';

export const metadata: Metadata = { title: 'Create an account' };

export default async function SignUp({ searchParams }: PageProps<'/signup'>) {
  const { next } = await searchParams;
  return (
    <AuthShell
      title='Join the night.'
      lead='Free, always. Your vault comes with nine ready-to-play characters: three Kindred, three Garou and three hunters.'
    >
      <ProviderButtons next={typeof next === 'string' ? next : undefined} />
      <EmailForm mode='signup' />
    </AuthShell>
  );
}
