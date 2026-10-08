-- The connected-profiles policy compared friendships.id instead of profiles.id
-- (an unqualified `id` inside the subquery resolves to the inner table).
drop policy "Connected profiles are readable" on public.profiles;

create policy "Connected profiles are readable"
  on public.profiles for select to authenticated
  using (
    exists (
      select 1 from public.friendships f
      where (f.requester = (select auth.uid()) and f.addressee = profiles.id)
         or (f.addressee = (select auth.uid()) and f.requester = profiles.id)
    )
    or exists (
      select 1 from public.chronicle_members theirs
      where theirs.user_id = profiles.id and public.chronicle_role(theirs.chronicle_id) is not null
    )
  );
