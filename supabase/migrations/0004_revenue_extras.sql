-- ============================================================
-- LIFE OS — Migration 0004: Revenue Extras & Catalogs (Phase 4)
-- marriage_expenses, services (Discord bots/freelance),
-- outreach_templates. RLS enabled + forced on every table.
-- ============================================================

-- ----------------------------------------------------------
-- marriage_expenses
-- ----------------------------------------------------------
create table if not exists public.marriage_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item text not null,
  category text
    constraint marriage_expenses_category_check
    check (category in ('furniture','finishing','rent_deposit','hall','clothing','photography','transport','appliances','jewelry','misc')),
  estimated_cost numeric(12,2) not null default 0,
  actual_cost numeric(12,2),
  paid_amount numeric(12,2) not null default 0,
  deadline date,
  priority text not null default 'medium'
    constraint marriage_expenses_priority_check
    check (priority in ('critical','high','medium','low')),
  status text not null default 'planned'
    constraint marriage_expenses_status_check
    check (status in ('planned','in_progress','paid','dropped')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger marriage_expenses_set_updated_at
  before update on public.marriage_expenses
  for each row execute function public.set_updated_at();

create index if not exists marriage_expenses_user_deadline_idx on public.marriage_expenses (user_id, deadline);
create index if not exists marriage_expenses_user_status_idx on public.marriage_expenses (user_id, status);

alter table public.marriage_expenses enable row level security;
alter table public.marriage_expenses force row level security;

create policy marriage_expenses_owner_all on public.marriage_expenses
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ----------------------------------------------------------
-- services (Discord bots / Web App catalog)
-- ----------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  base_price numeric(12,2),
  min_price numeric(12,2),
  estimated_hours numeric(6,1),
  complexity text
    constraint services_complexity_check
    check (complexity in ('low','medium','high')),
  profitability numeric(6,2),
  portfolio_example text,
  delivery_estimate text,
  maintenance_plan text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create index if not exists services_user_active_idx on public.services (user_id, is_active);

alter table public.services enable row level security;
alter table public.services force row level security;

create policy services_owner_all on public.services
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ----------------------------------------------------------
-- outreach_templates
-- ----------------------------------------------------------
create table if not exists public.outreach_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  kind text not null
    constraint outreach_templates_kind_check
    check (kind in ('cold_dm','email','proposal','follow_up','referral_request','testimonial_request')),
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger outreach_templates_set_updated_at
  before update on public.outreach_templates
  for each row execute function public.set_updated_at();

create index if not exists outreach_templates_user_kind_idx on public.outreach_templates (user_id, kind);

alter table public.outreach_templates enable row level security;
alter table public.outreach_templates force row level security;

create policy outreach_templates_owner_all on public.outreach_templates
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
