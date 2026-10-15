-- Integration of loresheet sharing and loresheet images.

-- 1. Members read the pictures of loresheets shared into their chronicles.
-- Images live in the private `portraits` bucket at <owner id>/<loresheet id>/<file>.
-- The path segments are compared as text (no uuid casts that could fail on odd
-- names), and the first segment must be the loresheet's owner, so the policy
-- opens nothing but the shared sheet's own folder. Character-portrait paths
-- (<user>/<character>/...) never match a loresheet id and keep their own policies.
create or replace function public.shared_lore_image_readable(owner_folder text, lore_folder text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.loresheets l
    join public.chronicle_loresheets s on s.loresheet_id = l.id
    where l.id::text = lore_folder
      and l.user_id::text = owner_folder
      and public.chronicle_share_visible(s.chronicle_id, s.shared_by)
  );
$$;

revoke execute on function public.shared_lore_image_readable(text, text) from public, anon;
grant execute on function public.shared_lore_image_readable(text, text) to authenticated;

create policy "Read images of loresheets shared with your chronicles"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'portraits'
    and public.shared_lore_image_readable((storage.foldername(name))[1], (storage.foldername(name))[2])
  );

-- 2. Live Lore tab: new shares reach open chronicle pages.
alter publication supabase_realtime add table public.chronicle_loresheets;

-- 3. A loresheet's image must be a file in its own folder (the upload action
-- always writes it that way); without this, a sheet could point at another
-- user's file path.
alter table public.loresheets drop constraint loresheets_image_check;
alter table public.loresheets
  add constraint loresheets_image_check
  check (image is null or (image like '/media/portraits/' || user_id::text || '/' || id::text || '/%' and char_length(image) <= 300));
