import type { Metadata } from 'next';
import Link from 'next/link';
import AuthShell from '@/app/ui/auth/AuthShell';

export const metadata: Metadata = { title: 'Sign-in problem' };

export default async function AuthError({ searchParams }: PageProps<'/auth/error'>) {
  const { error } = await searchParams;
  return (
    <AuthShell title='That didn’t work.' lead={typeof error === 'string' ? error : 'Something went wrong while signing you in.'}>
      <Link href='/login' className='inline-flex rounded-full bg-bone px-6 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5'>
        Back to log in
      </Link>
    </AuthShell>
  );
}
