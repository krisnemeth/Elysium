import type { Metadata } from 'next';
import Link from 'next/link';
import AuthShell from '@/app/ui/auth/AuthShell';
import { buttonPrimary } from '@/app/ui/kit/styles';

export const metadata: Metadata = { title: 'Sign-in problem' };

export default async function AuthError({ searchParams }: PageProps<'/auth/error'>) {
  const { error } = await searchParams;
  return (
    <AuthShell title='That didn’t work.' lead={typeof error === 'string' ? error : 'Something went wrong while signing you in.'}>
      <Link href='/login' className={buttonPrimary}>
        Back to log in
      </Link>
    </AuthShell>
  );
}
