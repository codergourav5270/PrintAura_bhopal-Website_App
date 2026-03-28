-- Site-wide settings (single row). Run in Supabase SQL editor if migrations are not applied automatically.

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  website_name text,
  email text,
  phone text,
  hero_background jsonb default '{}'::jsonb,
  category_data jsonb default '{}'::jsonb,
  admin_settings jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.settings enable row level security;

drop policy if exists "settings_read_all" on public.settings;
create policy "settings_read_all" on public.settings
  for select using (true);

drop policy if exists "settings_insert_auth" on public.settings;
create policy "settings_insert_auth" on public.settings
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "settings_update_auth" on public.settings;
create policy "settings_update_auth" on public.settings
  for update using (auth.role() = 'authenticated');
