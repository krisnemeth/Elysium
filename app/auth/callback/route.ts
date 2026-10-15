import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

// Where Google, Discord and email confirmation links land: exchange the code
// for a session, then continue to `next`.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next') ?? '/vault';
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/vault';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent('That link didn’t work. It may have expired. Log in or sign up again.')}`);
  }

  const description = 'That link is missing or has expired. Log in or sign up again.';
  return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(description)}`);
}
