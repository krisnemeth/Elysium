'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/server';

export type AuthState = { error?: string; email?: string };

// Only allow redirects to paths on this site.
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === 'string' ? value : '';
  return next.startsWith('/') && !next.startsWith('//') ? next : '/vault';
}

async function origin() {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? (host?.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Enter your email and password.', email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      error:
        error.code === 'email_not_confirmed'
          ? 'Confirm your email first. Check your inbox for the link we sent.'
          : 'That email and password don’t match an account.',
      email,
    };
  }
  redirect(safeNext(formData.get('next')));
}

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const displayName = String(formData.get('display_name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Enter an email and a password.', email };
  if (password.length < 8) return { error: 'Use at least 8 characters for your password.', email };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: displayName ? { display_name: displayName } : undefined,
      emailRedirectTo: `${await origin()}/auth/callback?next=/vault`,
    },
  });
  if (error) {
    return {
      error: error.code === 'user_already_exists' ? 'There’s already an account with that email. Log in instead.' : error.message,
      email,
    };
  }
  // With email confirmation on, there's no session until the link is clicked.
  if (!data.session) redirect(`/auth/check-email?email=${encodeURIComponent(email)}`);
  redirect('/vault');
}

export async function signInWithProvider(provider: 'google' | 'discord', next: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${await origin()}/auth/callback?next=${encodeURIComponent(safeNext(next))}` },
  });
  if (error || !data.url) redirect(`/auth/error?error=${encodeURIComponent(error?.message ?? 'Sign-in failed')}`);
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
