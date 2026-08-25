-- Migration: 0006_habits_routines_time.sql
-- Description: Habits, Routines, Daily Logs (Sleep/Energy), and Time Tracking tables

-- 1. habits
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  category text not null default 'health_routine'
    constraint habits_category_check
    check (category in ('health_routine', 'deep_work', 'revenue', 'learning', 'relationship', 'finance', 'personal')),
  target_per_week smallint not null default 7,
  is_active boolean not null default true,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists habits_user_active_idx on public.habits (user_id, is_active);

alter table public.habits enable row level security;
alter table public.habits force row level security;

create policy habits_owner_all on public.habits
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2. habit_logs
create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  log_date date not null default current_date,
  note text,
  created_at timestamptz not null default now(),
  constraint habit_logs_user_habit_date_unique unique (user_id, habit_id, log_date)
);

create index if not exists habit_logs_user_date_idx on public.habit_logs (user_id, log_date desc);

alter table public.habit_logs enable row level security;
alter table public.habit_logs force row level security;

create policy habit_logs_owner_all on public.habit_logs
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3. routines
create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  time_of_day text not null
    constraint routines_time_of_day_check
    check (time_of_day in ('morning', 'workday', 'evening', 'night')),
  items jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists routines_user_time_idx on public.routines (user_id, time_of_day);

alter table public.routines enable row level security;
alter table public.routines force row level security;

create policy routines_owner_all on public.routines
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. daily_logs (Sleep & Energy)
create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date,
  sleep_at time,
  woke_at time,
  hours_slept numeric(4,1),
  energy smallint
    constraint daily_logs_energy_check
    check (energy between 1 and 5),
  focus smallint
    constraint daily_logs_focus_check
    check (focus between 1 and 5),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_logs_user_date_unique unique (user_id, log_date)
);

create index if not exists daily_logs_user_date_idx on public.daily_logs (user_id, log_date desc);

alter table public.daily_logs enable row level security;
alter table public.daily_logs force row level security;

create policy daily_logs_owner_all on public.daily_logs
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. time_entries
create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  kind text not null default 'deep_work'
    constraint time_entries_kind_check
    check (kind in ('deep_work', 'delivery', 'sales', 'learning', 'product', 'admin', 'relationship', 'rest')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_min int not null default 0,
  focus_rating smallint
    constraint time_entries_focus_rating_check
    check (focus_rating between 1 and 5),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists time_entries_user_started_idx on public.time_entries (user_id, started_at desc);

alter table public.time_entries enable row level security;
alter table public.time_entries force row level security;

create policy time_entries_owner_all on public.time_entries
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
