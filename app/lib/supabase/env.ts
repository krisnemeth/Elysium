// Supabase is only used on the server, so the plain names are preferred.
// The NEXT_PUBLIC_ names still work (e.g. an older .env.local).
export const SUPABASE_URL = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)!;
export const SUPABASE_KEY = (process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!;

// False until .env.local (and Vercel) have the Supabase project settings.
export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);
