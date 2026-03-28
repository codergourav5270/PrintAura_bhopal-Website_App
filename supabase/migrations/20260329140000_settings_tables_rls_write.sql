-- STEP-11: Authenticated insert/update/delete for settings-adjacent tables (public read unchanged).

drop policy if exists "hero_settings_insert_auth" on public.hero_settings;
create policy "hero_settings_insert_auth" on public.hero_settings
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "hero_settings_update_auth" on public.hero_settings;
create policy "hero_settings_update_auth" on public.hero_settings
  for update using (auth.role() = 'authenticated');

drop policy if exists "hero_settings_delete_auth" on public.hero_settings;
create policy "hero_settings_delete_auth" on public.hero_settings
  for delete using (auth.role() = 'authenticated');

drop policy if exists "category_settings_insert_auth" on public.category_settings;
create policy "category_settings_insert_auth" on public.category_settings
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "category_settings_update_auth" on public.category_settings;
create policy "category_settings_update_auth" on public.category_settings
  for update using (auth.role() = 'authenticated');

drop policy if exists "category_settings_delete_auth" on public.category_settings;
create policy "category_settings_delete_auth" on public.category_settings
  for delete using (auth.role() = 'authenticated');

drop policy if exists "admin_settings_insert_auth" on public.admin_settings;
create policy "admin_settings_insert_auth" on public.admin_settings
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "admin_settings_update_auth" on public.admin_settings;
create policy "admin_settings_update_auth" on public.admin_settings
  for update using (auth.role() = 'authenticated');

drop policy if exists "admin_settings_delete_auth" on public.admin_settings;
create policy "admin_settings_delete_auth" on public.admin_settings
  for delete using (auth.role() = 'authenticated');
