-- Character portraits uploaded by players.
-- Private bucket; files live at <user id>/<character id>/<file>, and each user
-- can only read and write inside their own folder. The app serves them through
-- /media/portraits/... with the user's session, so no public URLs exist.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portraits', 'portraits', false, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "Read own portraits"
  on storage.objects for select to authenticated
  using (bucket_id = 'portraits' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Upload own portraits"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portraits' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Update own portraits"
  on storage.objects for update to authenticated
  using (bucket_id = 'portraits' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'portraits' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Delete own portraits"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portraits' and (storage.foldername(name))[1] = (select auth.uid())::text);
