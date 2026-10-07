'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/server';
import { isGame, type Game } from '@/app/lib/games';
import { LORE_KINDS, isLoreKind, type LoreKind } from '@/app/lib/loresheets';

const path = (game: Game) => `/vault/${game}/loresheets`;

export async function createLoresheet(game: Game, kind: LoreKind) {
  if (!isGame(game) || !isLoreKind(kind)) return;
  const supabase = await createClient();
  const { data, error } = await supabase.from('loresheets').insert({ game, kind }).select('id').single();
  if (error || !data) throw new Error('Couldn’t create the loresheet.');
  revalidatePath(path(game));
  redirect(`${path(game)}/${data.id}`);
}

export async function saveLoresheet(
  id: string,
  game: Game,
  kind: LoreKind,
  patch: { title: string; character_id: string | null; content: Record<string, string> },
) {
  if (!isLoreKind(kind)) return { ok: false as const, error: 'Unknown loresheet.' };
  // Only the fields this kind of loresheet has, as text.
  const allowed = new Set(LORE_KINDS[kind].fields.map((f) => f.key));
  const content = Object.fromEntries(
    Object.entries(patch.content)
      .filter(([k, v]) => allowed.has(k) && typeof v === 'string')
      .map(([k, v]) => [k, v.slice(0, 20000)]),
  );
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('loresheets')
    .update({ title: patch.title.slice(0, 200), character_id: kind === 'pc' ? patch.character_id : null, content })
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error) return { ok: false as const, error: 'Couldn’t save. Check your connection and try again.' };
  if (!data) return { ok: false as const, error: 'This loresheet no longer exists.' };
  revalidatePath(path(game));
  return { ok: true as const };
}

export async function deleteLoresheet(id: string, game: Game) {
  const supabase = await createClient();
  await supabase.from('loresheets').delete().eq('id', id);
  revalidatePath(path(game));
  redirect(path(game));
}
