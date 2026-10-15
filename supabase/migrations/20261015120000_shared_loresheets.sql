-- Share loresheets with a chronicle. Members read them (read-only); only the
-- owner shares or unshares. The sheet itself stays in public.loresheets.

create table public.chronicle_loresheets (
  chronicle_id  uuid not null references public.chronicles (id) on delete cascade,
  loresheet_id  uuid not null references public.loresheets (id) on delete cascade,
  shared_by     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (chronicle_id, loresheet_id)
);
create index chronicle_loresheets_by_sheet on public.chronicle_loresheets (loresheet_id);

alter table public.chronicle_loresheets enable row level security;

-- Does this user own the loresheet, and is it from the chronicle's game?
-- (Security definer so the insert policy can look at both tables.)
create or replace function public.can_share_loresheet(cid uuid, lid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.loresheets l
    join public.chronicles c on c.id = cid and c.game = l.game
    where l.id = lid and l.user_id = auth.uid()
  ) and public.is_chronicle_member(cid);
$$;

-- A share is visible to joined members, while the member who shared it is still
-- in the chronicle: if they leave, their shares stop showing (and come back if
-- they are re-invited).
create or replace function public.chronicle_share_visible(cid uuid, sharer uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_chronicle_member(cid) and exists (
    select 1 from public.chronicle_members m
    where m.chronicle_id = cid and m.user_id = sharer and m.status = 'joined'
  );
$$;

-- May the current user read this loresheet because it was shared into one of
-- their chronicles?
create or replace function public.shared_loresheet_readable(lid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.chronicle_loresheets s
    where s.loresheet_id = lid and public.chronicle_share_visible(s.chronicle_id, s.shared_by)
  );
$$;

create policy "Members read what the chronicle shares"
  on public.chronicle_loresheets for select to authenticated
  using (shared_by = (select auth.uid()) or public.chronicle_share_visible(chronicle_id, shared_by));

create policy "Owners share their loresheets with their chronicles"
  on public.chronicle_loresheets for insert to authenticated
  with check (shared_by = (select auth.uid()) and public.can_share_loresheet(chronicle_id, loresheet_id));

create policy "Owners unshare"
  on public.chronicle_loresheets for delete to authenticated
  using (shared_by = (select auth.uid()));

-- Loresheets: also readable when shared into a chronicle you are in.
-- Writes stay owner-only (the existing policies).
create policy "Shared loresheets are readable by chronicle members"
  on public.loresheets for select to authenticated
  using (public.shared_loresheet_readable(id));

revoke execute on function public.can_share_loresheet(uuid, uuid) from public, anon;
revoke execute on function public.chronicle_share_visible(uuid, uuid) from public, anon;
revoke execute on function public.shared_loresheet_readable(uuid) from public, anon;
grant execute on function public.can_share_loresheet(uuid, uuid) to authenticated;
grant execute on function public.chronicle_share_visible(uuid, uuid) to authenticated;
grant execute on function public.shared_loresheet_readable(uuid) to authenticated;
