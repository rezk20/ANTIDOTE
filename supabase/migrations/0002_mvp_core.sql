-- ============================================================
-- LIFE OS — Migration 0002: MVP Core Schema (Phase F1)
-- The 11 MVP tables: goals, tasks, buckets, transactions,
-- projects, clients, leads, lead_events, notes, brain_dumps,
-- reviews. RLS enabled + forced on every table.
--
-- FK delete behaviors (per revised plan §7.2):
--   tasks.goal_id/project_id/lead_id      -> on delete set null
--   goals.parent_id                       -> on delete set null
--   leads.client_id, projects.client_id   -> on delete set null
--   transactions.project_id/lead_id       -> on delete set null
--   transactions.bucket_id                -> on delete restrict
--   lead_events.lead_id                   -> on delete cascade
--   lead_events.transaction_id            -> on delete set null
-- ============================================================

-- ----------------------------------------------------------
-- goals
-- ----------------------------------------------------------
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  level text not null
    constraint goals_level_check
    check (level in ('vision','year','quarter','month','week')),
  parent_id uuid references public.goals (id) on delete set null,
  title text not null,
  description text,
  period_start date,
  period_end date,
  target_value numeric,
  unit text,
  status text not null default 'active'
    constraint goals_status_check
    check (status in ('active','achieved','dropped','paused')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger goals_set_updated_at
  before update on public.goals
  for each row execute function public.set_updated_at();

create index if not exists goals_user_level_idx on public.goals (user_id, level);
create index if not exists goals_user_parent_idx on public.goals (user_id, parent_id);

-- ----------------------------------------------------------
-- tasks
-- ----------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  area text
    constraint tasks_area_check
    check (area in ('work','money','relationship','personal','learning','admin','health')),
  task_type text not null
    constraint tasks_task_type_check
    check (task_type in ('revenue','career','client','learning','product','finance','marriage','relationship','personal','admin','health_routine')),
  priority text not null default 'medium'
    constraint tasks_priority_check
    check (priority in ('critical','high','medium','low')),
  effort smallint constraint tasks_effort_check check (effort between 1 and 5),
  duration_min integer,
  scheduled_date date,
  deadline timestamptz,
  status text not null default 'backlog'
    constraint tasks_status_check
    check (status in ('backlog','planned','in_progress','done','dropped','someday')),
  is_top_three boolean not null default false,
  recurring_rule text,
  recurring_source_id uuid references public.tasks (id) on delete set null,
  energy_level smallint constraint tasks_energy_check check (energy_level between 1 and 5),
  revenue_impact smallint constraint tasks_revenue_impact_check check (revenue_impact between 0 and 5),
  strategic_impact smallint constraint tasks_strategic_impact_check check (strategic_impact between 0 and 5),
  relationship_impact smallint constraint tasks_relationship_impact_check check (relationship_impact between 0 and 5),
  urgency smallint constraint tasks_urgency_check check (urgency between 0 and 5),
  goal_id uuid references public.goals (id) on delete set null,
  project_id uuid, -- FK added after projects exists (see below)
  lead_id uuid,    -- FK added after leads exists (see below)
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

create index if not exists tasks_user_date_status_idx on public.tasks (user_id, scheduled_date, status);
create index if not exists tasks_user_status_idx on public.tasks (user_id, status);
create index if not exists tasks_user_goal_idx on public.tasks (user_id, goal_id);
create index if not exists tasks_user_deadline_idx on public.tasks (user_id, deadline);

-- Idempotent recurring-task materialization:
-- at most one instance per (user, source task, scheduled date).
create unique index if not exists tasks_recurring_instance_unique_idx
  on public.tasks (user_id, recurring_source_id, scheduled_date)
  where recurring_source_id is not null;

-- ----------------------------------------------------------
-- buckets (wallets / savings goals)
-- ----------------------------------------------------------
create table if not exists public.buckets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  kind text not null
    constraint buckets_kind_check
    check (kind in ('marriage','emergency','business','personal','hardware','travel','apartment','other')),
  target_amount numeric(12,2),
  starting_balance numeric(12,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger buckets_set_updated_at
  before update on public.buckets
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------
-- transactions
-- ----------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  amount numeric(12,2) not null constraint transactions_amount_check check (amount > 0),
  kind text not null
    constraint transactions_kind_check
    check (kind in ('income','expense')),
  category text not null,
  occurred_on date not null,
  source text,
  project_id uuid, -- FK added after projects exists (see below)
  lead_id uuid,    -- FK added after leads exists (see below)
  bucket_id uuid references public.buckets (id) on delete restrict,
  note text,
  is_recurring boolean not null default false,
  currency text not null default 'EGP',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger transactions_set_updated_at
  before update on public.transactions
  for each row execute function public.set_updated_at();

create index if not exists transactions_user_date_idx on public.transactions (user_id, occurred_on);
create index if not exists transactions_user_kind_date_idx on public.transactions (user_id, kind, occurred_on);
create index if not exists transactions_user_bucket_idx on public.transactions (user_id, bucket_id);

-- ----------------------------------------------------------
-- projects
-- ----------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  kind text not null
    constraint projects_kind_check
    check (kind in ('client','internal','experimental','learning')),
  brief text,
  requirements text,
  status text not null default 'idea'
    constraint projects_status_check
    check (status in ('idea','active','paused','done','killed')),
  client_id uuid, -- FK added after clients exists (see below)
  budget numeric(12,2),
  started_on date,
  deadline date,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create index if not exists projects_user_status_idx on public.projects (user_id, status);

-- ----------------------------------------------------------
-- clients
-- ----------------------------------------------------------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  company text,
  contact text,
  source text,
  status text not null default 'active'
    constraint clients_status_check
    check (status in ('active','past','lost')),
  started_on date,
  deadline date,
  payment_status text
    constraint clients_payment_status_check
    check (payment_status in ('none','pending','partial','paid')),
  notes text,
  next_action text,
  follow_up_date date,
  testimonial_status text
    constraint clients_testimonial_status_check
    check (testimonial_status in ('none','asked','received','declined')),
  referral_status text
    constraint clients_referral_status_check
    check (referral_status in ('none','asked','received','declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

create index if not exists clients_user_status_idx on public.clients (user_id, status);
create index if not exists clients_user_follow_up_idx on public.clients (user_id, follow_up_date);

-- ----------------------------------------------------------
-- leads
-- ----------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  source text,
  url text,
  stage text not null default 'new'
    constraint leads_stage_check
    check (stage in ('new','qualified','contacted','proposal_sent','follow_up','call','negotiation','won','in_progress','delivered','paid','review_requested','referral_requested','lost')),
  expected_value numeric(12,2),
  probability numeric(5,2) constraint leads_probability_check check (probability between 0 and 1),
  client_id uuid references public.clients (id) on delete set null,
  proposal_amount numeric(12,2),
  proposal_sent_at timestamptz,
  proposal_notes text,
  last_contact_at timestamptz,
  next_follow_up_at timestamptz,
  lost_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

create index if not exists leads_user_stage_idx on public.leads (user_id, stage);
create index if not exists leads_user_follow_up_idx on public.leads (user_id, next_follow_up_at);
create index if not exists leads_user_client_idx on public.leads (user_id, client_id);

-- ----------------------------------------------------------
-- lead_events — first-class revenue-loop activity log
-- ----------------------------------------------------------
create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  event_type text not null
    constraint lead_events_type_check
    check (event_type in ('discovered','outreach','proposal_sent','follow_up','call','negotiation','won','lost','delivered','invoiced','paid','review_requested','referral_received','note')),
  occurred_at timestamptz not null default now(),
  amount numeric(12,2),
  transaction_id uuid references public.transactions (id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists lead_events_user_lead_time_idx on public.lead_events (user_id, lead_id, occurred_at);
create index if not exists lead_events_user_type_time_idx on public.lead_events (user_id, event_type, occurred_at);

-- ----------------------------------------------------------
-- notes
-- ----------------------------------------------------------
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default '',
  content text not null default '',
  folder text not null default '00 Inbox',
  tags text[] not null default '{}',
  pinned boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger notes_set_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();

create index if not exists notes_user_folder_idx on public.notes (user_id, folder, archived);
create index if not exists notes_tags_idx on public.notes using gin (tags);

-- ----------------------------------------------------------
-- brain_dumps
-- ----------------------------------------------------------
create table if not exists public.brain_dumps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  status text not null default 'inbox'
    constraint brain_dumps_status_check
    check (status in ('inbox','converted','archived')),
  -- Soft reference (intentionally no FK): the conversion target may be
  -- deleted later without invalidating the dump history.
  converted_type text
    constraint brain_dumps_converted_type_check
    check (converted_type in ('task','note','idea','goal','reminder','question')),
  converted_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger brain_dumps_set_updated_at
  before update on public.brain_dumps
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------
-- reviews (daily/weekly/monthly/quarterly/yearly unified)
-- ----------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  review_type text not null
    constraint reviews_type_check
    check (review_type in ('daily','weekly','monthly','quarterly','yearly')),
  -- period_start is computed in the user's timezone by the app.
  period_start date not null,
  period_end date,
  answers jsonb not null default '{}'::jsonb,
  scores jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_unique_period unique (user_id, review_type, period_start)
);

create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------
-- Cross-table FKs added after all referenced tables exist.
-- Deleting a goal/project/lead/client NEVER deletes tasks or
-- transactions — dangling references become NULL.
-- ----------------------------------------------------------
alter table public.tasks
  add constraint tasks_project_id_fkey
  foreign key (project_id) references public.projects (id) on delete set null;

alter table public.tasks
  add constraint tasks_lead_id_fkey
  foreign key (lead_id) references public.leads (id) on delete set null;

create index if not exists tasks_user_project_idx on public.tasks (user_id, project_id);
create index if not exists tasks_user_lead_idx on public.tasks (user_id, lead_id);

alter table public.transactions
  add constraint transactions_project_id_fkey
  foreign key (project_id) references public.projects (id) on delete set null;

alter table public.transactions
  add constraint transactions_lead_id_fkey
  foreign key (lead_id) references public.leads (id) on delete set null;

create index if not exists transactions_user_project_idx on public.transactions (user_id, project_id);
create index if not exists transactions_user_lead_idx on public.transactions (user_id, lead_id);

alter table public.projects
  add constraint projects_client_id_fkey
  foreign key (client_id) references public.clients (id) on delete set null;

create index if not exists projects_user_client_idx on public.projects (user_id, client_id);

-- ----------------------------------------------------------
-- RLS: enable + force on every table, single owner policy each.
-- ----------------------------------------------------------
alter table public.goals enable row level security;
alter table public.goals force row level security;
create policy goals_owner_all on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.tasks enable row level security;
alter table public.tasks force row level security;
create policy tasks_owner_all on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.buckets enable row level security;
alter table public.buckets force row level security;
create policy buckets_owner_all on public.buckets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.transactions enable row level security;
alter table public.transactions force row level security;
create policy transactions_owner_all on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.projects enable row level security;
alter table public.projects force row level security;
create policy projects_owner_all on public.projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.clients enable row level security;
alter table public.clients force row level security;
create policy clients_owner_all on public.clients
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.leads enable row level security;
alter table public.leads force row level security;
create policy leads_owner_all on public.leads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.lead_events enable row level security;
alter table public.lead_events force row level security;
create policy lead_events_owner_all on public.lead_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.notes enable row level security;
alter table public.notes force row level security;
create policy notes_owner_all on public.notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.brain_dumps enable row level security;
alter table public.brain_dumps force row level security;
create policy brain_dumps_owner_all on public.brain_dumps
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.reviews enable row level security;
alter table public.reviews force row level security;
create policy reviews_owner_all on public.reviews
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
