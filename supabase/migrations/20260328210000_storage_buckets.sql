-- STEP-3: Supabase Storage buckets only (no app code changes).
-- Path conventions when uploading files (prefixes / object keys):
--
-- hero-media/
--   hero-video/   (object keys e.g. hero-video/<file>.mp4)
--   hero-image/   (object keys e.g. hero-image/<file>.jpg)
--
-- category-media/
--   anime/
--   movies/
--   sports/
--   motivation/
--
-- site-media/
--   banners/
--   posters/
--
-- admin-media/
--   scanner/
--   logos/

insert into storage.buckets (id, name, public)
values
  ('hero-media', 'hero-media', true),
  ('category-media', 'category-media', true),
  ('site-media', 'site-media', true),
  ('admin-media', 'admin-media', true)
on conflict (id) do nothing;

drop policy if exists "storage_public_read_hero_category_site_admin" on storage.objects;
drop policy if exists "storage_authenticated_insert_hero_category_site_admin" on storage.objects;
drop policy if exists "storage_authenticated_update_hero_category_site_admin" on storage.objects;
drop policy if exists "storage_authenticated_delete_hero_category_site_admin" on storage.objects;

-- Public read for all four buckets (anon + authenticated).
create policy "storage_public_read_hero_category_site_admin"
on storage.objects
for select
using (
  bucket_id in (
    'hero-media',
    'category-media',
    'site-media',
    'admin-media'
  )
);

-- Upload / replace / delete restricted to authenticated users only.
create policy "storage_authenticated_insert_hero_category_site_admin"
on storage.objects
for insert
with check (
  bucket_id in (
    'hero-media',
    'category-media',
    'site-media',
    'admin-media'
  )
  and auth.role() = 'authenticated'
);

create policy "storage_authenticated_update_hero_category_site_admin"
on storage.objects
for update
using (
  bucket_id in (
    'hero-media',
    'category-media',
    'site-media',
    'admin-media'
  )
  and auth.role() = 'authenticated'
)
with check (
  bucket_id in (
    'hero-media',
    'category-media',
    'site-media',
    'admin-media'
  )
  and auth.role() = 'authenticated'
);

create policy "storage_authenticated_delete_hero_category_site_admin"
on storage.objects
for delete
using (
  bucket_id in (
    'hero-media',
    'category-media',
    'site-media',
    'admin-media'
  )
  and auth.role() = 'authenticated'
);
