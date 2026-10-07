import type { Metadata } from 'next';
import Link from 'next/link';
import AuthShell from '@/app/ui/auth/AuthShell';

export const metadata: Metadata = { title: 'Check your email' };

export default async function CheckEmail({ searchParams }: PageProps<'/auth/check-email'>) {
  const { email } = await searchParams;
  return (
    <AuthShell
      title='Check your inbox.'
      lead={
        <>
          We sent a confirmation link to {typeof email === 'string' ? <strong className='text-bone'>{email}</strong> : 'your email'}. Open it on this device to enter your vault.
        </>
      }
    >
      <p className='text-sm text-bone/55'>
        Nothing arrived after a few minutes? Check your spam folder, or{' '}
        <Link href='/signup' className='text-bone underline underline-offset-4 hover:text-accent'>try again</Link>.
      </p>
    </AuthShell>
  );
}
