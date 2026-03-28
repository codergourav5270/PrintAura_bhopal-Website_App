create table if not exists public.hero_settings (
  id uuid primary key default gen_random_uuid(),
  hero_background_image text,
  hero_background_video text,
  hero_height text,
  hero_text text,
  created_at timestamp default now()
);

create table if not exists public.category_settings (
  id uuid primary key default gen_random_uuid(),
  category_name text,
  category_poster text,
  category_video text,
  created_at timestamp default now()
);

create table if not exists public.admin_settings (
  id uuid primary key default gen_random_uuid(),
  upi_id text,
  payment_scanner text,
  admin_email text,
  admin_settings jsonb,
  created_at timestamp default now()
);

alter table public.hero_settings enable row level security;
alter table public.category_settings enable row level security;
alter table public.admin_settings enable row level security;

create policy "Allow read"
on public.hero_settings
for select
using (true);

create policy "Allow read"
on public.category_settings
for select
using (true);

create policy "Allow read"
on public.admin_settings
for select
using (true);
