'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

/*
  Browser client, used only for live updates (Realtime). The URL and the
  publishable key are passed down from the server; both are safe to expose,
  and RLS still decides what each user receives.
*/
let client: SupabaseClient | undefined;

export function browserClient(url: string, key: string): SupabaseClient {
  client ??= createBrowserClient(url, key);
  return client;
}

/*
  Subscribes to inserts/updates on a table for one chronicle. Realtime applies
  RLS with the user's token, so the session is loaded and handed to the
  socket first; subscribing before that would join as an anonymous user and
  silently receive nothing.
*/
export function subscribe(
  url: string,
  key: string,
  name: string,
  table: string,
  filter: string,
  onChange: (payload: { new: Record<string, unknown>; eventType: string }) => void,
  onStatus?: (status: string) => void,
) {
  const supabase = browserClient(url, key);
  let channel: ReturnType<typeof supabase.channel> | undefined;
  let cancelled = false;
  void supabase.auth.getSession().then(async ({ data }) => {
    if (cancelled) return;
    if (data.session) await supabase.realtime.setAuth(data.session.access_token);
    channel = supabase
      .channel(name)
      .on('postgres_changes', { event: '*', schema: 'public', table, filter }, (payload) =>
        onChange({ new: payload.new as Record<string, unknown>, eventType: payload.eventType }),
      )
      .subscribe((status: string) => onStatus?.(status));
  });
  return () => {
    cancelled = true;
    if (channel) void supabase.removeChannel(channel);
  };
}
