-- ============================================================
-- LIFE OS — Migration 0007: Decisions & Opportunities (Phase 13)
-- decisions (Decision Desk §34) and opportunities (Prioritization §50)
-- RLS enabled + forced on every table.
-- ============================================================

-- ----------------------------------------------------------
-- decisions (Decision Desk §34)
-- ----------------------------------------------------------
create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  why_now text,
  options jsonb not null default '[]'::jsonb,
  upside text,
  downside text,
  cost text,
  time_required text,
  risk text,
  worst_case text,
  best_case text,
  reversible boolean not null default true,
  decision text,
  review_date date,
  status text not null default 'open'
    constraint decisions_status_check
    check (status in ('open', 'decided', 'reviewed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger decisions_set_updated_at
  before update on public.decisions
  for each row execute function public.set_updated_at();

create index if not exists decisions_user_status_idx on public.decisions (user_id, status);
create index if not exists decisions_user_review_date_idx on public.decisions (user_id, review_date);

alter table public.decisions enable row level security;
alter table public.decisions force row level security;

create policy decisions_owner_all on public.decisions
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ----------------------------------------------------------
-- opportunities (Work Opportunities Prioritization §50)
-- ----------------------------------------------------------
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  kind text not null default 'freelance'
    constraint opportunities_kind_check
    check (kind in ('job', 'freelance', 'discord_client', 'remote', 'partnership', 'product', 'other')),
  expected_value numeric(12,2) not null default 0,
  probability numeric(5,2) not null default 0.5,
  time_required_hours numeric(8,1) not null default 10,
  risk text not null default 'medium'
    constraint opportunities_risk_check
    check (risk in ('low', 'medium', 'high')),
  next_action text,
  status text not null default 'open'
    constraint opportunities_status_check
    check (status in ('open', 'pursuing', 'won', 'dropped')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger opportunities_set_updated_at
  before update on public.opportunities
  for each row execute function public.set_updated_at();

create index if not exists opportunities_user_status_idx on public.opportunities (user_id, status);
create index if not exists opportunities_user_kind_idx on public.opportunities (user_id, kind);

alter table public.opportunities enable row level security;
alter table public.opportunities force row level security;

create policy opportunities_owner_all on public.opportunities
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
