-- ============================================================
-- LIFE OS — Migration 0003: Day and Week Plans (Phase 6)
-- Creates day_plans and week_plans tables with RLS and triggers.
-- ============================================================

-- ----------------------------------------------------------
-- day_plans
-- ----------------------------------------------------------
create table if not exists public.day_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_date date not null,
  available_hours numeric(4,1) not null default 6.0,
  energy smallint not null default 3 constraint day_plans_energy_check check (energy between 1 and 5),
  focus_question_answer text,
  money_action_task_id uuid references public.tasks (id) on delete set null,
  personal_action_task_id uuid references public.tasks (id) on delete set null,
  relationship_action_task_id uuid references public.tasks (id) on delete set null,
  shutdown_time time,
  status text not null default 'active'
    constraint day_plans_status_check
    check (status in ('draft', 'active', 'closed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint day_plans_user_date_key unique (user_id, plan_date)
);

create trigger day_plans_set_updated_at
  before update on public.day_plans
  for each row execute function public.set_updated_at();

create index if not exists day_plans_user_date_idx on public.day_plans (user_id, plan_date);
create index if not exists day_plans_user_status_idx on public.day_plans (user_id, status);

alter table public.day_plans enable row level security;
alter table public.day_plans force row level security;

create policy day_plans_tenant_isolation on public.day_plans
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ----------------------------------------------------------
-- week_plans
-- ----------------------------------------------------------
create table if not exists public.week_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  week_start date not null,
  outcomes text[] not null default '{}',
  allocation jsonb not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint week_plans_user_week_key unique (user_id, week_start)
);

create trigger week_plans_set_updated_at
  before update on public.week_plans
  for each row execute function public.set_updated_at();

create index if not exists week_plans_user_week_idx on public.week_plans (user_id, week_start);

alter table public.week_plans enable row level security;
alter table public.week_plans force row level security;

create policy week_plans_tenant_isolation on public.week_plans
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());
