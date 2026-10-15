'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/app/lib/supabase/server';
import type { Game } from '@/app/lib/games';
import { PORTRAIT_BUCKET, PORTRAIT_MAX_BYTES, PORTRAIT_ROUTE, PORTRAIT_TYPES, isUploadedPortrait, portraitPath } from '@/app/lib/portraits';

/*
  A loresheet's picture, stored like a character portrait (same private
  bucket, <user>/<loresheet>/<file>, served by app/media/portraits). The
  browser crops and shrinks it first (LoreImagePicker); this only checks it.
*/
export type LoreImageResult = { ok: true; src: string | null } | { ok: false; error: string };

const EXTENSIONS: Record<string, string> = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' };

export async function setLoresheetImage(id: string, game: Game, formData: FormData): Promise<LoreImageResult> {
  const file = formData.get('image');
  if (!(file instanceof File) || !PORTRAIT_TYPES.includes(file.type)) return { ok: false, error: 'That isn’t a JPEG, PNG or WebP image.' };
  if (file.size > PORTRAIT_MAX_BYTES) return { ok: false, error: 'That image is too large (2 MB at most).' };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return { ok: false, error: 'You’re signed out. Log in again to upload.' };

  const { data: sheet } = await supabase.from('loresheets').select('id, image').eq('id', id).eq('user_id', claims.claims.sub).maybeSingle();
  if (!sheet) return { ok: false, error: 'This loresheet no longer exists, or isn’t yours.' };

  const path = `${claims.claims.sub}/${id}/${crypto.randomUUID()}.${EXTENSIONS[file.type]}`;
  const { error: uploadError } = await supabase.storage.from(PORTRAIT_BUCKET).upload(path, file, { contentType: file.type });
  if (uploadError) return { ok: false, error: 'Couldn’t upload the image. Try again.' };

  const src = `${PORTRAIT_ROUTE}${path}`;
  const { error } = await supabase.from('loresheets').update({ image: src }).eq('id', id);
  if (error) {
    await supabase.storage.from(PORTRAIT_BUCKET).remove([path]);
    return { ok: false, error: 'Couldn’t save the image. Try again.' };
  }
  if (isUploadedPortrait(sheet.image)) await supabase.storage.from(PORTRAIT_BUCKET).remove([portraitPath(sheet.image)]);
  revalidatePath(`/vault/${game}/loresheets`);
  return { ok: true, src };
}

export async function removeLoresheetImage(id: string, game: Game): Promise<LoreImageResult> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return { ok: false, error: 'You’re signed out.' };
  const { data: sheet } = await supabase.from('loresheets').select('id, image').eq('id', id).eq('user_id', claims.claims.sub).maybeSingle();
  if (!sheet) return { ok: false, error: 'This loresheet no longer exists, or isn’t yours.' };

  const { error } = await supabase.from('loresheets').update({ image: null }).eq('id', id);
  if (error) return { ok: false, error: 'Couldn’t remove the image. Try again.' };
  if (isUploadedPortrait(sheet.image)) await supabase.storage.from(PORTRAIT_BUCKET).remove([portraitPath(sheet.image)]);
  revalidatePath(`/vault/${game}/loresheets`);
  return { ok: true, src: null };
}

// Called when a loresheet is deleted: its pictures go with it.
export async function removeLoresheetImages(id: string) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return;
  const folder = `${claims.claims.sub}/${id}`;
  const { data } = await supabase.storage.from(PORTRAIT_BUCKET).list(folder);
  if (data?.length) await supabase.storage.from(PORTRAIT_BUCKET).remove(data.map((f) => `${folder}/${f.name}`));
}
