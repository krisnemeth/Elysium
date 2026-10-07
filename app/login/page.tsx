import type { Metadata } from 'next';
import AuthShell from '@/app/ui/auth/AuthShell';
import ProviderButtons from '@/app/ui/auth/ProviderButtons';
import EmailForm from '@/app/ui/auth/EmailForm';

export const metadata: Metadata = { title: 'Log in' };

export default async function Login({ searchParams }: PageProps<'/login'>) {
  const { next } = await searchParams;
  const target = typeof next === 'string' ? next : undefined;
  return (
    <AuthShell title='Welcome back.' lead='Your coterie, pack and cell are where you left them.'>
      <ProviderButtons next={target} />
      <EmailForm mode='login' next={target} />
    </AuthShell>
  );
}
