-- Turns at the table. Players with a character take turns in the order they
-- joined. A Storyteller (person) directs them: gives the turn to anyone or
-- passes it on. With the Storyteller bot, the turn holder passes it, and once
-- a turn has run longer than `seconds`, anyone may pass it on, so an idle
-- player can't stall the game. The server's clock decides, not the browser's.

create table public.chronicle_turns (
  chronicle_id  uuid primary key references public.chronicles (id) on delete cascade,
  user_id       uuid references auth.users (id) on delete set null,
  round         int not null default 1,
  seconds       int not null default 120 check (seconds between 30 and 3600),
  started_at    timestamptz not null default now()
);

alter table public.chronicle_turns enable row level security;

create policy "Members see whose turn it is"
  on public.chronicle_turns for select to authenticated
  using (public.is_chronicle_member(chronicle_id));

alter publication supabase_realtime add table public.chronicle_turns;

-- Who takes turns, in order.
create or replace function public.turn_order(cid uuid)
returns table (user_id uuid, created_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select m.user_id, m.created_at
  from public.chronicle_members m
  where m.chronicle_id = cid and m.status = 'joined' and m.role = 'player' and m.character_id is not null
  order by m.created_at, m.user_id;
$$;

-- Moves the turn on to the next player. `expected` is whose turn the caller
-- saw; if the turn has moved since, nothing changes. Returns whose turn it is.
create or replace function public.pass_turn(cid uuid, expected uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
  led_by text;
  t public.chronicle_turns;
  holder_in_order boolean;
  next_user uuid;
  wrapped boolean := false;
begin
  if not public.is_chronicle_member(cid) then return null; end if;
  select storyteller into led_by from public.chronicles where id = cid;

  insert into public.chronicle_turns (chronicle_id) values (cid) on conflict do nothing;
  select * into t from public.chronicle_turns where chronicle_id = cid for update;
  if t.user_id is distinct from expected then return t.user_id; end if;

  holder_in_order := exists (select 1 from public.turn_order(cid) o where o.user_id = t.user_id);
  if not (
    not holder_in_order
    or t.user_id = me
    or public.chronicle_role(cid) = 'storyteller'
    or (led_by = 'bot' and now() >= t.started_at + make_interval(secs => t.seconds))
  ) then
    return t.user_id;
  end if;

  if holder_in_order then
    select o.user_id into next_user from public.turn_order(cid) o
    where (o.created_at, o.user_id) > (select m.created_at, m.user_id from public.chronicle_members m where m.chronicle_id = cid and m.user_id = t.user_id)
    order by o.created_at, o.user_id
    limit 1;
  end if;
  if next_user is null then
    select o.user_id into next_user from public.turn_order(cid) o limit 1;
    wrapped := holder_in_order;
  end if;

  update public.chronicle_turns
     set user_id = next_user,
         started_at = now(),
         round = round + case when wrapped then 1 else 0 end
   where chronicle_id = cid;
  return next_user;
end;
$$;

-- A Storyteller (person) gives the turn to a player, or to nobody (null).
create or replace function public.give_turn(cid uuid, to_user uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.chronicle_role(cid) is distinct from 'storyteller' then return false; end if;
  if to_user is not null and not exists (select 1 from public.turn_order(cid) o where o.user_id = to_user) then return false; end if;
  insert into public.chronicle_turns (chronicle_id, user_id) values (cid, to_user)
  on conflict (chronicle_id) do update set user_id = excluded.user_id, started_at = now();
  return true;
end;
$$;

revoke execute on function public.turn_order(uuid) from public, anon, authenticated;
revoke execute on function public.pass_turn(uuid, uuid) from public, anon;
revoke execute on function public.give_turn(uuid, uuid) from public, anon;
grant execute on function public.pass_turn(uuid, uuid) to authenticated;
grant execute on function public.give_turn(uuid, uuid) to authenticated;
