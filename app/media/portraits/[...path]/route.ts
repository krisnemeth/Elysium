import type { NextRequest } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import { PORTRAIT_BUCKET } from '@/app/lib/portraits';

/*
  Serves an uploaded portrait to its owner. Storage policies only let users
  read their own folder, so anyone else gets a 404. File names are unique per
  upload, so the browser may keep them for good.
*/
export async function GET(_req: NextRequest, ctx: RouteContext<'/media/portraits/[...path]'>) {
  const { path } = await ctx.params;
  if (path.length !== 3 || path.some((p) => !/^[\w.-]+$/.test(p))) return new Response('Not found', { status: 404 });

  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(PORTRAIT_BUCKET).download(path.join('/'));
  if (error || !data) return new Response('Not found', { status: 404 });

  return new Response(data, {
    headers: {
      'Content-Type': data.type || 'image/webp',
      'Cache-Control': 'private, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
