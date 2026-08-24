-- ============================================================
-- LIFE OS — Migration 0001: Foundation (Phase F1)
-- profiles table, triggers, RLS
-- ============================================================

-- Shared trigger function: keep updated_at current on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1:1 profile for every auth user.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  email text,
  timezone text not null default 'Africa/Cairo',
  currency text not null default 'EGP',
  weekly_off_day text not null default 'friday'
    constraint profiles_weekly_off_day_check
    check (weekly_off_day in ('saturday','sunday','monday','tuesday','wednesday','thursday','friday')),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row when a new auth user is inserted.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1), 'Owner'),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.profiles force row level security;

create policy profiles_owner_all on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
