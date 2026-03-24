# Poster Galaxy — Premium poster e-commerce

Production-ready React 18 + Vite storefront with Supabase (database, auth, storage), Razorpay payments, and a full admin dashboard.

## Quick start

```bash
npm install
cp .env.example .env
# Fill in Supabase URL, anon key, Razorpay key id, admin email
npm run dev
```

- Storefront: `http://localhost:5173`
- Admin login: `http://localhost:5173/admin/login` (Supabase user email must match `VITE_ADMIN_EMAIL`)

## Razorpay (online payments)

1. Deploy to [Vercel](https://vercel.com) so the serverless route `api/create-razorpay-order.js` is available.
2. In the Vercel project, set **server-side** env vars: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (not `VITE_*`).
3. Keep `VITE_RAZORPAY_KEY_ID` in the frontend for the Checkout widget.

**Cash on delivery** works without the API route (order is stored as `payment_method: cod`, `payment_status: pending`).

Local Vite dev: calls to `/api/create-razorpay-order` are not available unless you use `vercel dev` from this folder or proxy to a deployed URL.

## Seed sample products (optional)

With the app running in **development**, open the browser console:

```js
await window.runPosterGalaxySeed()
```

Or:

```js
const m = await import('/src/lib/seed.js')
await m.runSeed()
```

Run **once** after tables and RLS allow inserts.

## Deployment checklist

1. Create a [Supabase](https://supabase.com) project → copy **Project URL** and **anon public** key.
2. Run the SQL below in **SQL Editor** (tables, indexes, optional RLS).
3. Storage → create bucket **`poster-images`** → set **public**.
4. Authentication → create a user with the same email as `VITE_ADMIN_EMAIL`.
5. Vercel → import repo → set env vars (`VITE_*` and `RAZORPAY_*` for the API route).
6. Deploy → `vercel --prod` or Git push.
7. Test `/admin/login`, add a poster under **Products**, confirm it appears on `/shop`.

---

## Supabase SQL (run in SQL Editor)

```sql
-- Extensions
create extension if not exists "pgcrypto";

-- PRODUCTS
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text,
  tags text[] default '{}',
  price integer not null default 0,
  original_price integer,
  image_url text,
  sizes jsonb default '[]'::jsonb,
  badge text,
  in_stock boolean default true,
  created_at timestamptz default now()
);

-- ORDERS
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text,
  customer_email text,
  customer_phone text,
  delivery_address jsonb,
  items jsonb default '[]'::jsonb,
  subtotal integer default 0,
  discount integer default 0,
  shipping integer default 0,
  total integer default 0,
  payment_method text,
  payment_status text default 'pending',
  razorpay_order_id text,
  razorpay_payment_id text,
  order_status text default 'placed',
  coupon_used text,
  created_at timestamptz default now()
);

-- CUSTOMERS
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  phone text,
  total_orders integer default 0,
  total_spent integer default 0,
  created_at timestamptz default now()
);

-- COUPONS
create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_percent integer not null default 10,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Optional: indexes
create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_badge on public.products (badge);
create index if not exists idx_orders_created on public.orders (created_at desc);
create index if not exists idx_orders_email on public.orders (customer_email);

-- RLS (adjust admin email). For a small store you can enable RLS and use policies tied to auth email.
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.customers enable row level security;
alter table public.coupons enable row level security;

-- Anonymous read for storefront
create policy "products_public_read" on public.products for select using (true);
create policy "coupons_public_read_active" on public.coupons for select using (is_active = true);

-- Authenticated users (admin) full access — replace with your admin email
create policy "products_admin_all" on public.products for all using (
  auth.jwt() ->> 'email' = 'admin@yourstore.com'
) with check (
  auth.jwt() ->> 'email' = 'admin@yourstore.com'
);

create policy "orders_admin_all" on public.orders for all using (
  auth.jwt() ->> 'email' = 'admin@yourstore.com'
) with check (
  auth.jwt() ->> 'email' = 'admin@yourstore.com'
);

create policy "customers_admin_all" on public.customers for all using (
  auth.jwt() ->> 'email' = 'admin@yourstore.com'
) with check (
  auth.jwt() ->> 'email' = 'admin@yourstore.com'
);

create policy "coupons_admin_all" on public.coupons for all using (
  auth.jwt() ->> 'email' = 'admin@yourstore.com'
) with check (
  auth.jwt() ->> 'email' = 'admin@yourstore.com'
);

-- Allow anyone to insert orders (checkout) and read coupons validation — tighten for production as needed
create policy "orders_public_insert" on public.orders for insert with check (true);
create policy "customers_public_upsert" on public.customers for all using (true) with check (true);

-- If you prefer stricter customers access, replace the above with insert/update only for service role or logged-in users.
```

**Important:** Replace `'admin@yourstore.com'` in policies with the same email as `VITE_ADMIN_EMAIL`. If policies block inserts during checkout, temporarily allow `anon` insert on `orders` / `customers` or use the Supabase dashboard to match your security model.

---

## Manual QA (admin flow)

1. Open `/admin/login` → enter admin email + password.
2. **Products** → **Add new poster** → upload image, fill fields → **Save**.
3. Confirm poster on `/shop`.
4. Place a test order (COD easiest locally).
5. **Orders** → update status; **Customers** and **Payments** should reflect data.

---

## Tech stack

- React 18, React Router 6, Vite
- Tailwind CSS, Lucide React, Recharts
- Supabase (Auth, Postgres, Storage)
- Razorpay (via Vercel serverless order creation)
- Cart + wishlist: Context API + `localStorage`

License: use freely for your store.
