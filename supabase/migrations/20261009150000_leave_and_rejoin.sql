-- Leaving a chronicle keeps your place on file: the row stays with status
-- 'left' (and the character you brought), out of sight of the chronicle.
-- When a party member invites you again, accepting puts you back at the
-- table with the same character. A chronicle's creator who leaves hands it
-- to the next player who joined.

alter table public.chronicle_members drop constraint chronicle_members_status_check;
alter table public.chronicle_members add constraint chronicle_members_status_check check (status in ('invited', 'joined', 'left'));

-- People who left see nothing of the chronicle.
create or replace function public.chronicle_role(cid uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case m.status when 'joined' then m.role when 'invited' then 'invited' end
  from public.chronicle_members m
  where m.chronicle_id = cid and m.user_id = auth.uid();
$$;

create or replace function public.chronicle_party(cid uuid)
returns table (
  user_id uuid,
  display_name text,
  role text,
  status text,
  character_id uuid,
  character_name text,
  game public.game,
  faction text,
  portrait text
)
language sql
stable
security definer
set search_path = ''
as $$
  select m.user_id, p.display_name, m.role, m.status, c.id, c.name, c.game, c.faction, c.portrait
  from public.chronicle_members m
  join public.profiles p on p.id = m.user_id
  left join public.characters c on c.id = m.character_id and c.user_id = m.user_id
  where m.chronicle_id = cid and m.status <> 'left' and public.chronicle_role(cid) is not null
  order by m.role = 'storyteller' desc, m.created_at;
$$;

-- Only an invitation brings someone back: they can't rejoin by themselves.
create or replace function public.guard_rejoin()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status = 'left' and new.status <> 'left' and coalesce(current_setting('elysium.reinvite', true), '') <> 'on' then
    raise exception 'Only a party member can invite you back.';
  end if;
  return new;
end;
$$;
create trigger chronicle_members_guard_rejoin before update of status on public.chronicle_members
  for each row execute function public.guard_rejoin();

-- Inviting someone who left re-invites them, keeping their character.
create or replace function public.invite_to_chronicle(cid uuid, friend uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
begin
  if not public.is_chronicle_member(cid) then return 'not-member'; end if;
  if not public.are_friends(me, friend) then return 'not-friends'; end if;
  perform set_config('elysium.reinvite', 'on', true);
  insert into public.chronicle_members (chronicle_id, user_id, invited_by)
  values (cid, friend, me)
  on conflict (chronicle_id, user_id) do update set status = 'invited', invited_by = me
    where public.chronicle_members.status = 'left';
  perform set_config('elysium.reinvite', 'off', true);
  return 'invited';
end;
$$;

-- Leave the table. The creator hands the chronicle to the next member.
create or replace function public.leave_chronicle(cid uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
  heir uuid;
begin
  if not public.is_chronicle_member(cid) then return false; end if;
  if exists (select 1 from public.chronicles where id = cid and owner_id = me) then
    select m.user_id into heir from public.chronicle_members m
    where m.chronicle_id = cid and m.status = 'joined' and m.user_id <> me
    order by m.created_at limit 1;
    if heir is null then return false; end if;
    update public.chronicles set owner_id = heir where id = cid;
  end if;
  update public.chronicle_members set status = 'left' where chronicle_id = cid and user_id = me;
  -- If it was their turn, nobody holds it until the next pass.
  return true;
end;
$$;

revoke execute on function public.leave_chronicle(uuid) from public, anon;
grant execute on function public.leave_chronicle(uuid) to authenticated;

-- A turn only times out when someone else is waiting for it: playing alone,
-- the game just waits for you.
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
    or (led_by = 'bot' and now() >= t.started_at + make_interval(secs => t.seconds)
        and (select count(*) from public.turn_order(cid)) > 1)
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

-- Seats change live when someone joins, picks a character or leaves.
alter publication supabase_realtime add table public.chronicle_members;
