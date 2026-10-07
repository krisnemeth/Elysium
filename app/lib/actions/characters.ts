'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/server';
import { CLANS } from '@/app/lib/clans';
import { isGame, type Game } from '@/app/lib/games';
import type { Sheet } from '@/app/lib/sheets/types';

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
  await supabase.from('characters').delete().eq('id', id);
  refresh(game);
  redirect(`/vault/${game}/characters`);
}
