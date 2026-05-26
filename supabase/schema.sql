-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).

create table if not exists public.waitlist (
  id          bigint generated always as identity primary key,
  email       text unique not null,
  name        text,
  source      text,
  created_at  timestamptz not null default now()
);

create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);

-- Lock down anonymous access. The /api/waitlist edge function uses the
-- service-role key (which bypasses RLS), so client-side reads/writes stay blocked.
alter table public.waitlist enable row level security;
