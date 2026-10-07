import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { hasSupabase, SUPABASE_KEY, SUPABASE_URL } from './env';

// Pages that need a signed-in user. Everything else (landing pages, the
// game choice, auth pages) stays public.
const PROTECTED = /^\/vault\/(vampire|werewolf|hunter)(\/|$)|^\/vault\/?$|^\/account/;

/*
  Refreshes the Supabase session cookie on every request and sends signed-out
  visitors on protected pages to the login page.
*/
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!hasSupabase) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Nothing may run between creating the client and getClaims(), or users can
  // be logged out at random.
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims && PROTECTED.test(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}`;
    const redirect = NextResponse.redirect(url);
    // Keep any refreshed cookies in sync.
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  return response;
}
