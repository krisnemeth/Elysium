'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/server';
import { CLANS } from '@/app/lib/clans';
import { GAMES, isGame, type Game } from '@/app/lib/games';
import type { Sheet } from '@/app/lib/sheets/types';
import { HUNTERS } from '@/app/lib/starters/hunter';
import { VAMPIRES } from '@/app/lib/starters/vampire';
import { WEREWOLVES } from '@/app/lib/starters/werewolf';
import {
  PORTRAIT_BUCKET,
  PORTRAIT_MAX_BYTES,
  PORTRAIT_ROUTE,
  PORTRAIT_TYPES,
  isUploadedPortrait,
  portraitPath,
} from '@/app/lib/portraits';

export type SaveResult = { ok: true; id: string; savedAt: string } | { ok: false; error: string };

const MAX_SHEET_BYTES = 200_000;

// The list columns come from the sheet, so they never drift apart.
function columnsFrom(game: Game, sheet: Sheet) {
  const p = sheet.profile;
  const clanKey = Object.entries(CLANS).find(([, c]) => c.name === p.clan)?.[0];
  const faction = game === 'vampire' ? (clanKey ?? null) : game === 'werewolf' ? p.tribe || null : p.creed || null;
  return { name: (p.name ?? '').trim(), faction };
}

function validate(game: string, sheet: unknown): string | null {
  if (!isGame(game)) return 'Unknown game.';
  if (!sheet || typeof sheet !== 'object' || !('profile' in sheet) || !('attributes' in sheet)) return 'That isn’t a character sheet.';
  if (JSON.stringify(sheet).length > MAX_SHEET_BYTES) return 'This sheet is too large to save.';
  return null;
}

function refresh(game: Game) {
  revalidatePath('/vault');
  revalidatePath(`/vault/${game}`, 'layout');
}

export async function createCharacter(game: Game, sheet: Sheet): Promise<SaveResult> {
  const invalid = validate(game, sheet);
  if (invalid) return { ok: false, error: invalid };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return { ok: false, error: 'You’re signed out. Log in again to save.' };

  const { data, error } = await supabase
    .from('characters')
    .insert({ game, sheet, status: 'draft', summary: sheet.profile.concept || null, ...columnsFrom(game, sheet) })
    .select('id, updated_at')
    .single();
  if (error) return { ok: false, error: 'Couldn’t save. Check your connection and try again.' };
  refresh(game);
  return { ok: true, id: data.id, savedAt: data.updated_at };
}

export async function updateCharacter(id: string, game: Game, sheet: Sheet): Promise<SaveResult> {
  const invalid = validate(game, sheet);
  if (invalid) return { ok: false, error: invalid };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('characters')
    .update({ sheet, ...columnsFrom(game, sheet) })
    .eq('id', id)
    .select('id, updated_at, starter_key, summary')
    .maybeSingle();
  if (error) return { ok: false, error: 'Couldn’t save. Check your connection and try again.' };
  if (!data) return { ok: false, error: 'This character no longer exists, or isn’t yours.' };

  // Your own characters' summary follows their concept; starters keep theirs.
  if (!data.starter_key && sheet.profile.concept !== undefined && data.summary !== sheet.profile.concept) {
    await supabase.from('characters').update({ summary: sheet.profile.concept || null }).eq('id', id);
  }
  refresh(game);
  return { ok: true, id: data.id, savedAt: data.updated_at };
}

export async function setCharacterStatus(id: string, game: Game, status: 'draft' | 'finished') {
  const supabase = await createClient();
  const { error } = await supabase.from('characters').update({ status }).eq('id', id);
  if (error) return { ok: false as const, error: 'Couldn’t update the status.' };
  refresh(game);
  return { ok: true as const };
}

export async function deleteCharacter(id: string, game: Game) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  await supabase.from('characters').delete().eq('id', id);
  if (claims?.claims) await removeFolder(supabase, `${claims.claims.sub}/${id}`);
  refresh(game);
  redirect(`/vault/${game}/characters`);
}

type Supabase = Awaited<ReturnType<typeof createClient>>;

async function removeFolder(supabase: Supabase, folder: string) {
  const { data } = await supabase.storage.from(PORTRAIT_BUCKET).list(folder);
  if (data?.length) await supabase.storage.from(PORTRAIT_BUCKET).remove(data.map((f) => `${folder}/${f.name}`));
}

export type PortraitResult = { ok: true; src: string } | { ok: false; error: string };

const STARTER_PORTRAITS = new Map([...VAMPIRES, ...WEREWOLVES, ...HUNTERS].map((s) => [s.key, s.portrait]));

const EXTENSIONS: Record<string, string> = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' };

// The browser crops and shrinks the image first (PortraitPicker); this only checks it.
export async function setPortrait(id: string, game: Game, formData: FormData): Promise<PortraitResult> {
  const file = formData.get('portrait');
  if (!(file instanceof File) || !PORTRAIT_TYPES.includes(file.type)) return { ok: false, error: 'That isn’t a JPEG, PNG or WebP image.' };
  if (file.size > PORTRAIT_MAX_BYTES) return { ok: false, error: 'That image is too large (2 MB at most).' };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return { ok: false, error: 'You’re signed out. Log in again to upload.' };

  const { data: character } = await supabase.from('characters').select('id, portrait').eq('id', id).eq('user_id', claims.claims.sub).maybeSingle();
  if (!character) return { ok: false, error: 'This character no longer exists, or isn’t yours.' };

  const path = `${claims.claims.sub}/${id}/${crypto.randomUUID()}.${EXTENSIONS[file.type]}`;
  const { error: uploadError } = await supabase.storage.from(PORTRAIT_BUCKET).upload(path, file, { contentType: file.type });
  if (uploadError) return { ok: false, error: 'Couldn’t upload the image. Try again.' };

  const src = `${PORTRAIT_ROUTE}${path}`;
  const { error } = await supabase.from('characters').update({ portrait: src }).eq('id', id);
  if (error) {
    await supabase.storage.from(PORTRAIT_BUCKET).remove([path]);
    return { ok: false, error: 'Couldn’t save the portrait. Try again.' };
  }
  if (isUploadedPortrait(character.portrait)) await supabase.storage.from(PORTRAIT_BUCKET).remove([portraitPath(character.portrait)]);
  refresh(game);
  return { ok: true, src };
}

// Back to the starter's original art, or the game's default figure.
export async function removePortrait(id: string, game: Game): Promise<PortraitResult> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return { ok: false, error: 'You’re signed out.' };
  const { data: character } = await supabase
    .from('characters')
    .select('id, portrait, starter_key')
    .eq('id', id)
    .eq('user_id', claims.claims.sub)
    .maybeSingle();
  if (!character) return { ok: false, error: 'This character no longer exists, or isn’t yours.' };

  const fallback = (character.starter_key && STARTER_PORTRAITS.get(character.starter_key)) || null;
  const { error } = await supabase.from('characters').update({ portrait: fallback }).eq('id', id);
  if (error) return { ok: false, error: 'Couldn’t remove the portrait. Try again.' };
  if (isUploadedPortrait(character.portrait)) await supabase.storage.from(PORTRAIT_BUCKET).remove([portraitPath(character.portrait)]);
  refresh(game);
  return { ok: true, src: fallback ?? GAMES[game].figure.src };
}
