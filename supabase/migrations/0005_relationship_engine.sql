-- Migration: 0005_relationship_engine.sql
-- Description: Relationship Engine tables (ideas, wishlist, weekly checkins)

-- 1. relationship_ideas
create table if not exists public.relationship_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null default 'date'
    constraint relationship_ideas_category_check
    check (category in ('date', 'home_activity', 'conversation', 'trip', 'surprise')),
  budget_tier text not null default 'low'
    constraint relationship_ideas_budget_tier_check
    check (budget_tier in ('free', 'low', 'medium', 'high')),
  estimated_cost numeric(12,2) not null default 0,
  notes text,
  is_completed boolean not null default false,
  last_done_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists relationship_ideas_user_category_idx on public.relationship_ideas (user_id, category);
create index if not exists relationship_ideas_user_budget_idx on public.relationship_ideas (user_id, budget_tier);

alter table public.relationship_ideas enable row level security;
alter table public.relationship_ideas force row level security;

create policy relationship_ideas_owner_all on public.relationship_ideas
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2. relationship_wishlist
create table if not exists public.relationship_wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null default 'gift'
    constraint relationship_wishlist_category_check
    check (category in ('gift', 'home', 'experience', 'other')),
  estimated_price numeric(12,2),
  url text,
  priority text not null default 'medium'
    constraint relationship_wishlist_priority_check
    check (priority in ('critical', 'high', 'medium', 'low')),
  is_bought boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists relationship_wishlist_user_priority_idx on public.relationship_wishlist (user_id, priority);

alter table public.relationship_wishlist enable row level security;
alter table public.relationship_wishlist force row level security;

create policy relationship_wishlist_owner_all on public.relationship_wishlist
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3. relationship_checkins
create table if not exists public.relationship_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null default current_date,
  answers jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists relationship_checkins_user_date_idx on public.relationship_checkins (user_id, checkin_date desc);

alter table public.relationship_checkins enable row level security;
alter table public.relationship_checkins force row level security;

create policy relationship_checkins_owner_all on public.relationship_checkins
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
