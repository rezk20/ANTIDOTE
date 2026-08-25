# LIFE OS — Implementation Plan

> **Status:** REVISED (v2) — incorporates all findings of `docs/ARCHITECTURE_REVIEW.md`. Approved with changes; ready for implementation.
> **Source spec:** `docs/LIFE_OS_MASTER_PROMPT.md` (sections referenced as §N).
> **Revision record:** v1 (2026-08-24) initial plan → architecture review → v2 (this document). See `docs/PLAN_REVISION_REPORT.md` for the change log.
> **Baseline project:** Clean Next.js 16.2.3 (App Router) + React 19.2 + Tailwind v4 + TypeScript strict. Nothing else installed.
> **Environment facts (probed 2026-08-24):** Node v22.19.0, npm 10.9.3, git 2.51.0 available. **Docker NOT installed** → no local Supabase stack. **Project is not yet a git repository** → git init is the first task of Phase F1.

---

## 1. Product Vision (Understanding)

LIFE OS is a **personal command center**, not a todo app. It translates a yearly transformation mission into a daily executable loop:

```
Vision → Annual Goals → Quarterly Targets → Monthly Objectives → Weekly Plan
→ Daily Actions → Tracking → Review → Adjustment
```

It serves one user (the owner): a MERN/Next.js developer in Egypt with ~18,000 EGP savings, aiming for ~250,000 EGP marriage readiness within ~12 months, earning via MERN freelance (primary), Discord bots (secondary), and an experimental OSRS-adjacent product (not to be relied on). The system must actively **help decide**: prioritize income work, protect Fridays, prevent overplanning, surface reality checks when numbers don't support goals, and respond to failure with replanning instead of guilt.

**North Star (§127):** *Did the system help the user make better actions today?* — not task counts, charts, or streaks.

**The dashboard must answer 5 questions daily (§126):** What do I do today? What could increase my income? Where am I from the marriage goal? What's waiting from clients? When do I stop today?

**Revenue is the product's primary mission** (§3 Rule 1, §1 context: zero current income, 12-month marriage deadline). The revenue loop is therefore a **first-class core workflow**, built early and modeled as an activity-driven system — not a late analytics feature.

---

## 2. Functional Requirements (Extracted)

### FR-1 Goal System & Hierarchy (§2, §21, §31)
- Editable mission + 10 yearly objectives seeded from spec.
- Hierarchy: Vision → Year → Quarter → Month → Week outcomes → Daily actions; every task linkable upward.
- Year roadmap phases (Stabilize / Monetize / Optimize / Prepare) as guidance content.

### FR-2 Task System (§14, §15, §32, §88, §90)
- Task fields: title, description, area, project, goal, priority, effort, duration, deadline, status, recurring, energy_level, revenue_impact, relationship_impact, timestamps.
- Task types: Revenue, Career, Client, Learning, Product, Finance, Marriage, Relationship, Personal, Admin, Health/Routine.
- Priority score = Urgency + Financial Impact + Strategic Impact + Deadline Proximity − Effort (ordering aid only, user can override).
- Stale-task rule: no movement for 3 days → prompt Do / Delegate / Reschedule / Delete.
- Backlog review: every item must be Do / Schedule / Delegate / Delete / Someday.

### FR-3 Daily Planning (§12, §13, §104, §122)
- "Today's Mission": Top 3, Work Block, Money Action, Personal Action, Relationship Action, Shutdown Time.
- Auto-build day plan from calendar, tasks, deadlines, energy, available hours, primary work stream, weekly goals, sleep quality.
- Capacity guard: never schedule more hours than available; reduce load when sleep-deprived; raise priority near deadlines.
- Morning "one thing" question; end-of-day shutdown flow producing tomorrow's starting point.

### FR-4 Freelance Engine — PRIMARY, first-class workflow (§4, §23, §25, §55, §107–§112, §117, §121)
- Lead pipeline with stages: New → Qualified → Contacted → Proposal Sent → Follow-up → Interview/Call → Negotiation → Won → In Progress → Delivered → Paid → Review Requested → Referral Requested (+ Lost).
- **Activity log (`lead_events`):** every touch (discovered, outreach, proposal sent, follow-up, call, negotiation, won/lost, delivered, invoiced, paid, review requested, referral received, note) is a first-class record — the workflow drives follow-up behavior, it doesn't just record state.
- Kanban board (grouped display columns: New, Qualified, Outreach, Proposal, Follow-up, Call, Negotiation, Won, Lost).
- Metrics (Phase 13 analytics): applications, reply rate, call rate, close rate, revenue, avg project value, avg days to close, repeat client rate — computed from `lead_events`, not stage snapshots.
- Daily sales targets (configurable): opportunities found, proposals, follow-ups, outreach, calls, content.
- Distinction between **Build Work** vs **Revenue Work** surfaced at task-creation time and in the Today plan.
- Client records (§25 fields), outreach templates, retainer/referral prompts, red-flag checklist, client call prep page, personal CRM.
- **Payments link to the money engine:** an `invoiced`/`paid` event pairs with a `transactions` row linked via `lead_id`.

### FR-5 Discord Bots Engine — SECONDARY (§5, §73)
- Service catalog (10 editable services) with base/min price, estimated hours, complexity, profitability, portfolio example, delivery estimate, maintenance plan.
- Client qualification fields; upsell suggestions after delivery; offer ladder.

### FR-6 Experimental Product Lab — THIRD (§6, §35, §74, §75, §76, §77)
- Product cards with required fields (problem, target user, value prop, legal constraints, risk score, build hrs/week, MVP deadline, kill criteria…).
- Partnership checklist gate (roles, ownership, revenue split, exit terms) before development.
- Kill switch: success metric + deadline + minimum validation + kill criteria; auto re-evaluation prompt.
- Partner profiles + monthly partner review; negotiation notes.

### FR-7 Financial Engine (§7, §8, §9, §49, §56, §78, §79, §80, §114, §115, §116)
- Configurable starting point (18,000 EGP savings / 250,000 target / gap).
- Calculations: gap, required monthly/weekly/daily savings; distinguish Revenue vs Net Savings.
- Money categories tree (Income/Expenses/Savings Goals per §9); transactions with amount, type, category, date, source, project, note, recurring.
- Wallets/Buckets (Marriage, Emergency, Business, Personal…) — no mixing of money. Bucket balances are **computed** (`starting_balance + Σ income − Σ expenses`), never stored.
- Dashboard: current state, progress metrics, 3-scenario forecast (Conservative/Base/Aggressive) computed from actual data (forecast in Phase 13).
- Alerts: behind target, sustained income increase, unexpected expense impact. Suggest, never decide.
- Monthly income targets: Minimum / Comfort / Stretch. Cash-flow calendar with projected end-of-month cash.
- Purchase decision support (cost, opportunity cost, impact, Buy/Delay/Avoid).

### FR-8 Marriage Mission (§10, §57)
- Target date/amount, saved, remaining, monthly needed, upcoming expenses, payment deadlines, completion %.
- Expense breakdown items (furniture, hall, etc.) with estimated/actual/paid/remaining/deadline/priority.
- Readiness checklist dimensions (Money, Housing, Furniture, Wedding, Income Stability, Emergency Reserve, Relationship Readiness) — separate progress each, no fake single score.
- Anti-chaos rule: include relationship time & planning conversations, not just money.

### FR-9 Relationship Engine "Us" (§11, §81, §82, §83)
- Shared ideas (budget-tagged: Free/Low/Medium/High), budget-aware suggestions, shared wishlist, weekly check-in (5 reflection questions, no pseudo-psychology scoring).
- Creative optional features: random date generator, question of the week, memories, trip board.
- Privacy: relationship data excluded from general analytics, never sent to AI without opt-in (**enforced in code, not prompts**), export/delete available.

### FR-10 Notes & Knowledge (§16, §59)
- Mini-Notion: Markdown, tags, folders (13 suggested), search, pin, archive, note↔note links.
- Personal knowledge base for better AI context (preferences, important dates, skills).

### FR-11 Brain Dump / Quick Capture (§17)
- **Capture is a day-one mechanism:** fast capture ships with the app shell (Phase F2), before any other feature.
- Conversion (→ Task / Note / Idea / Goal / Reminder / Question) ships with the Notes phase. Never auto-delete.

### FR-12 Reviews (§18, §19, §20, §38, §84, )
- Weekly review (13 questions) with multi-dimensional scores (Revenue, Career, Financial, Relationship, Execution, Routine).
- Monthly review with metrics + KEEP/START/STOP/DOUBLE DOWN.
- Quarterly review; Year-in-Review page.
- Evening daily review → tomorrow's starting point. Productivity health check (overload detection → reduce plan).

### FR-13 Routine, Habits, Sleep/Energy (§28, §29, §30, §85, §86)
- Routine templates (Morning/Workday/Evening/Night) — general habits only, no medical content.
- Optional habits with "Restart Today" anti-streak behavior.
- Sleep/energy/focus logging (1–5); simple correlations after weeks; no diagnosis.
- Deep-work timer (start/stop/duration/project/focus rating); monthly time audit (planned vs actual by category).

### FR-14 Schedule (§27, §116)
- Calendar Day (time blocks) / Week / Month (deadlines) / Year (milestones).
- Collision detection (client deadlines vs personal vs Friday protected time) with confirmation flow.

### FR-15 Analytics (§47, §50, §51, §52)
- Career, Productivity, Finance, Projects, Relationship analytics; opportunity scoring (EV × Probability / Effort, comparison aid only); recommended next opportunity; weekly work allocation that adapts to reality.

### FR-16 Decision Desk (§34)
- Decision records with full template (options, upside/downside, cost, risk, reversibility, review date).

### FR-17 AI Layer (§36, §37, §38, §120, §121) — Phase 14
- Assistant with ~12 commands; structured context selection via **typed, unit-tested context packs** (never bulk-send all data); morning brief; evening review; case-study generator; client call prep.
- Rules: no secrets/passwords in prompts, hard prompt/context token budget, usage limits, disable toggle, relationship data gated in code.
- **Core functionality never requires AI:** computed (non-AI) morning brief and insights ship regardless of the AI toggle.

### FR-18 Notifications & Automations (§39, §48)
- Sparse notification types: deadline, follow-up, daily start, shutdown, finance reminder, weekly review, marriage payment. Quiet hours.
- Automations: morning plan, evening review, Friday weekly review, monthly review, deadline/follow-up/savings reminders.

### FR-19 Dashboard & UX (§40, §68, §69, §125)
- First screen: "Good Morning, [Name]" + one-sentence mission + Top 3 + Money + Revenue Action + Next Client Follow-up + Brain Dump input; greeting, date, shutdown time.
- Command Center sidebar; quick actions from any page; global search; end-of-day minimal screen.

### FR-20 Settings, Export, Backup (§46, §62, §63, §132, §133)
- Full settings (personal, goals, work, relationship, privacy).
- Export JSON / CSV (finance) / Markdown (notes). Manual export + automated DB backups + backup status.
- Initial seed reflecting the user's snapshot (§132, §133).

---

## 3. Non-Functional Requirements

| # | Requirement | Source |
|---|-------------|--------|
| NFR-1 | Type-safe end to end (TypeScript strict) | §96 |
| NFR-2 | Security: HTTPS, hashed passwords (auth provider), session protection, CSRF-safe mutations (Server Actions are POST-only with framework action validation — no extra CSRF machinery needed), input validation, rate limiting on auth + AI + export, server-side authorization, RLS, no secrets in frontend, env vars, no sensitive data in logs, backup strategy | §43 |
| NFR-3 | Dark/Light mode, responsive, fast, keyboard-friendly, mobile-usable | §41, §64 |
| NFR-4 | Every feature ships loading / empty / error states, validation, undo/confirm where needed — enforced as a PR-level checklist, not only phase-level | §97 |
| NFR-5 | ESLint + Prettier + unit tests for logic + integration tests for critical flows + error boundaries | §96 |
| NFR-6 | Non-punitive tone everywhere (copy centralized in `lib/constants/copy.ts`); no aggressive gamification; hierarchy "what matters today" over "all data" | §41, §70, §71 |
| NFR-7 | No illegal/evasion features (no anti-cheat circumvention content stored or generated) | §8, §6, §43 |
| NFR-8 | Deploy on Vercel + Supabase Cloud; no complex infrastructure; no Docker dependency in the dev workflow | §42 |
| NFR-9 | Data ownership: export/delete, no lock-in; delete-all requires re-authentication | §62, §83 |
| NFR-10 | Modular, testable, documented, maintainable — optimized for long-term development | §96 |

---

## 4. MVP Definition (Phase 1 of product roadmap)

Per §66–§67 and the revised build order, the MVP is the version that lets the owner **use the system daily**:

**In scope (MVP):**
1. Auth (single owner account, login/logout, protected routes).
2. Settings (core) + app shell + theme.
3. Tasks + Goals (full task model, hierarchy, priority ordering).
4. **Revenue Loop — first-class:** leads + lead events + clients + projects, full workflow discovery → outreach → proposal → follow-up → call → negotiation → won/lost → delivery → invoice/payment → review → referral.
5. Finance (transactions, buckets, categories, marriage-goal math, financial dashboard).
6. Today (day plan: Top 3, money/personal/relationship actions, shutdown).
7. Dashboard v1 — exactly: **Top 3, Money, Revenue Action, Next Client Follow-up, Brain Dump** (+ greeting/date/shutdown time).
8. Notes + Brain Dump conversion.
9. Weekly Review (light) + Seed data (§133).

**MVP success condition (§67):** in the fewest possible pages the user can: see today's plan, know financial position, see current opportunities, log income/expense, see what's pending, write a brain dump, review the week.

**Explicitly NOT in MVP:** AI layer, advanced analytics/forecast, marriage full mission page, relationship engine, habits/routines, calendar full views, PWA/offline, notifications engine, Discord bots catalog UI, product lab UI, decisions/opportunities pages (tables created when their phases consume them).

---

## 5. Phase 2 & Phase 3+ Features

**Phase 2 — Life Layer (§66):** Marriage Mission page, Relationship Engine (Us), Habits, Routines, Sleep/Energy logging, full Weekly/Monthly reviews, Calendar/Schedule, Time tracking.

**Phase 3 — Intelligence:** AI assistant, morning brief, evening review, smart recommendations, case-study generator, client call prep, AI insights on freelance metrics.

**Phase 4 — Advanced Analytics:** Forecast scenarios, opportunity scoring, project profitability/effective hourly rate, trend analysis, time audit, Discord Bots engine UI, Product Lab UI, Decision Desk, Personal Brand/Portfolio engines, Personal CRM.

**Phase 5 — Polish:** PWA, offline drafts, better mobile UX, keyboard shortcuts, accessibility pass, notifications/automations, export/backup UI, deployment hardening.

---

## 6. Technical Architecture

### 6.1 Stack (locked by current project + spec §42 + review findings)

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 16.2.3, App Router, React Server Components** | Already installed. ⚠️ This is NOT vanilla Next 15: `middleware.ts` is renamed **`proxy.ts`** (Node runtime, root-level, static matcher), `cookies()/headers()/params/searchParams` are **async**, Turbopack is default, `next lint` removed (ESLint CLI directly). All code must follow `node_modules/next/dist/docs/`. |
| Language | TypeScript `strict: true` | §96 |
| UI | Tailwind CSS v4 (installed) + **shadcn/ui** component system + lucide-react icons | "Component system محترم" (§42); shadcn is copy-in, no runtime dependency lock-in. CLI compatibility with Tailwind v4/Next 16 verified during Phase F2; fallback: hand-rolled primitives. |
| Charts | **Recharts** (installed only when Phase 13 starts) | §42 "charts library عند الحاجة" |
| Backend | **Server Actions** for mutations; Route Handlers only where needed (AI proxy, export downloads, cron) | §42 |
| Database | **Supabase Cloud Postgres** — **two projects: `dev` and `prod`** — with SQL migrations + **RLS**. No local Supabase/Docker path (Docker not installed on this machine). | Review B-1 |
| Auth | **Supabase Auth** (email + password) via `@supabase/ssr` | §42 "Auth provider جاهز"; gives hashing, sessions, and `auth.uid()` for RLS with zero custom crypto |
| Data access | `@supabase/supabase-js` SSR client (user-scoped, RLS enforced) + generated DB types; complex aggregations as Postgres views/RPC functions only if ever needed | Keeps authorization in the DB; avoids a second ORM dependency |
| Validation | **Zod** (shared client + server schemas) | §43, §96 |
| Dates | **date-fns** | Week math, timezones-light |
| Theme | **next-themes** (dark/light) | §41 |
| Deployment | Vercel + Supabase Cloud (prod project) | §42 |
| Tests | Vitest + Testing Library (unit), Playwright (E2E) against the **dev** Supabase project with a deterministic reset/seed script | §96, Next 16 official guides, review I-7 |

### 6.2 Runtime architecture

```
Browser
  ├─ Server Components (pages/layouts) ── read via DAL (lib/dal) ──┐
  ├─ Client Components (forms, kanban DnD, timers)                 │
  │     └─ invoke Server Actions (lib/actions/*) ──────────────────┤
  │                                                                 ▼
  │                                              Supabase Cloud (Postgres + Auth)
  │                                              - RLS: user_id = auth.uid()
  └─ proxy.ts: optimistic session check → redirect /login           ▲
                                                                    │
Server Actions: verifySession (DAL) → Zod validate → supabase-js ───┘
               → revalidatePath / refresh → UI shows fresh data
```

Principles:
- **Server-first:** pages are async Server Components fetching via DAL; Client Components only for interactivity (forms, drag-drop, timers, command palette).
- **Data Access Layer (DAL):** `verifySession()` (memoized with React `cache()`) + per-domain query functions returning DTOs — auth check lives next to data, per Next.js auth guide. React `cache()` also deduplicates repeated DAL calls within one render pass.
- **Every Server Action re-verifies auth** (actions are public POST endpoints; a proxy matcher exclusion also skips action coverage — verified in local docs — so action-level checks are mandatory, not optional).
- **RLS as second line of defense:** even a DAL bug cannot leak another user's rows.
- **Pure domain logic** (priority score, savings math, forecast, opportunity score, day-plan capacity) in `lib/logic/*` — framework-free, unit-tested.
- **Caching model (review B-3 — verified against local docs):** `cacheComponents` stays **OFF**. In the default model, `fetch` is not cached and supabase-js queries are never cached by Next.js — there is nothing for tag invalidation to act on. Therefore:
  - **After every mutation:** `revalidatePath(affectedPath)` and/or `refresh()` (current route). **`updateTag` / `revalidateTag` / `cacheTag` / `use cache` are NOT used anywhere in this architecture.**
  - **Per-render deduplication:** React `cache()` around DAL functions.
  - **Parallel reads:** dashboard/page DAL calls issued via `Promise.all`, never serialized awaits.
  - Revisit `cacheComponents` only if performance ever demands it (private single-user app — unlikely).

### 6.3 Environment variables

```
NEXT_PUBLIC_SUPABASE_URL          # public (dev project in .env.local, prod in Vercel)
NEXT_PUBLIC_SUPABASE_ANON_KEY     # public (safe: RLS enforced)
SUPABASE_SERVICE_ROLE_KEY         # server-only: seed/reset scripts ONLY; never imported from app/ or lib/ runtime modules (enforced, see §8.9)
AI_PROVIDER_API_KEY               # Phase 14 only, server-only
CRON_SECRET                       # Phase 15: protects /api/cron/*
SEED_CONFIRM                      # seed script safety flag (see §8.9)
```

Two Supabase projects: **dev** (used by `.env.local`, E2E, day-to-day work) and **prod** (Vercel production only). Migrations are versioned SQL applied to both via `supabase db push` or SQL executed through the dashboard — no Docker anywhere in the workflow.

---

## 7. Database Schema (Supabase Cloud Postgres)

Conventions (per Supabase best-practices skill):
- `uuid` PKs via `gen_random_uuid()` (Supabase standard; `user_id` must be uuid to FK `auth.users`; data volumes are tiny so v4-UUID fragmentation is negligible).
- `timestamptz` for all timestamps; `date` for day-level fields; `numeric(12,2)` for money; `text` over `varchar(n)`; `boolean` for flags.
- Every table has `user_id uuid not null references auth.users(id) on delete cascade`.
- `created_at timestamptz not null default now()`, `updated_at timestamptz not null default now()` (trigger-maintained).
- **RLS enabled + forced** on every table with a single policy: `using (auth.uid() = user_id) with check (auth.uid() = user_id)`.
- Indexes on every FK + hot query columns (listed per table).
- Enums as `text` + `check` constraints (easy to extend via migration).
- **Timezone rule:** all day-level keys (`plan_date`, `log_date`, `week_start`, `period_start`, `occurred_on` grouping) are computed in the **user's timezone** (stored on `profiles.timezone`). Daily/weekly uniqueness constraints are keyed on these tz-derived dates to avoid duplicate-key races at midnight boundaries.
- **Migration discipline:** tables are created in the phase that first consumes them (additive migrations only — no table is created before it has a consumer). Every migration phase runs the standing RLS regression test (§14).

### 7.1 Migration `0001_foundation.sql` (Phase F1)

**`profiles`** — 1:1 with `auth.users`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | references auth.users(id), on delete cascade |
| display_name | text not null | |
| email | text | |
| timezone | text not null default 'Africa/Cairo' | |
| currency | text not null default 'EGP' | |
| weekly_off_day | text not null default 'friday' | check in weekday names |
| settings | jsonb not null default '{}' | typed in app via Zod: work hours/day, preferred start, marriage target amount+date, income targets (min/comfort/stretch), proposal/outreach targets, primary/secondary work stream, relationship shared day + budget pref, allocation ratios, quiet hours, ai_enabled, ai_relationship_access |

Plus: `handle_new_user` trigger (auto-create profile on auth.users insert), `set_updated_at` trigger function, RLS policy.

### 7.2 Migration `0002_mvp_core.sql` (Phase F1) — the 11 MVP tables

**`goals`** — hierarchy via `parent_id`
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| level | text not null | check: vision, year, quarter, month, week |
| parent_id | uuid null | FK goals(id) **on delete set null** |
| title | text not null | |
| description | text | |
| period_start / period_end | date | |
| target_value | numeric | optional measurable target |
| unit | text | e.g. EGP, clients, proposals |
| status | text not null default 'active' | check: active, achieved, dropped, paused |
| sort_order | int not null default 0 | |

idx: (user_id, level), (user_id, parent_id)

**`tasks`**
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| title | text not null | |
| description | text | |
| area | text | work / money / relationship / personal / learning / admin / health |
| task_type | text not null | check: revenue, career, client, learning, product, finance, marriage, relationship, personal, admin, health_routine (§15) |
| priority | text not null default 'medium' | check: critical, high, medium, low |
| effort | smallint | 1–5 (subtracted in score) |
| duration_min | int | |
| scheduled_date | date null | the day it's planned for (tz-derived) |
| deadline | timestamptz null | |
| status | text not null default 'backlog' | check: backlog, planned, in_progress, done, dropped, someday |
| is_top_three | boolean not null default false | for day plan Top 3 |
| recurring_rule | text null | simple grammar: `daily` / `weekly:mon,thu` / `monthly:1` (documented in code; generation is idempotent — see below) |
| recurring_source_id | uuid null | FK tasks(id) on delete set null; set on materialized recurring instances to make generation idempotent |
| energy_level | smallint | 1–5 |
| revenue_impact / strategic_impact / relationship_impact | smallint | 0–5, score inputs |
| urgency | smallint | 0–5 (or derived from deadline; stored for manual override) |
| goal_id / project_id / lead_id | uuid null | FKs, all **on delete set null** — deleting a goal/project/lead NEVER deletes tasks |
| completed_at | timestamptz | |
| sort_order | int not null default 0 | |

idx: (user_id, scheduled_date, status), (user_id, status), (user_id, project_id), (user_id, goal_id), (user_id, lead_id), (user_id, deadline)

**Recurring-task idempotency rule:** the day-plan generator materializes a recurring instance only if no task exists with the same `recurring_source_id` + `scheduled_date` (checked in the insert query, e.g. `where not exists` / unique partial index on `(user_id, recurring_source_id, scheduled_date) where recurring_source_id is not null`). Re-running generation never duplicates instances.

**`buckets`** (wallets / savings goals §78, §9)
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| name | text not null | |
| kind | text not null | check: marriage, emergency, business, personal, hardware, travel, apartment, other |
| target_amount | numeric(12,2) | |
| starting_balance | numeric(12,2) not null default 0 | seed: marriage = 18,000 |
| is_active | boolean not null default true | |

Balance = `starting_balance + Σ income − Σ expenses` over transactions in bucket (**computed, never stored**).

**`transactions`**
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| amount | numeric(12,2) not null | check > 0 |
| kind | text not null | check: income, expense |
| category | text not null | §9 tree; app-validated, extensible (e.g. `income:mern`, `expense:hosting`) |
| occurred_on | date not null | |
| source | text | client/platform |
| project_id / lead_id | uuid null | FKs, **on delete set null** |
| bucket_id | uuid null | FK buckets **on delete restrict** — a bucket with transactions cannot be deleted (must be deactivated instead) |
| note | text | |
| is_recurring | boolean not null default false | |
| currency | text not null default 'EGP' | |

idx: (user_id, occurred_on), (user_id, kind, occurred_on), (user_id, bucket_id), (user_id, project_id), (user_id, lead_id)

**`projects`**
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| name | text not null | |
| kind | text not null | check: client, internal, experimental, learning |
| brief / requirements | text | |
| status | text not null default 'idea' | check: idea, active, paused, done, killed |
| client_id | uuid null | FK clients **on delete set null** |
| budget | numeric(12,2) | |
| started_on / deadline | date | |
| meta | jsonb not null default '{}' | experimental products (Phase 13): hypothesis, expected_upside, time_budget_hrs_week, mvp_deadline, kill_criteria, risk_score, partnership checklist, validation status |

idx: (user_id, status), (user_id, client_id)

**`clients`**
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| name | text not null | |
| company | text | |
| contact | text | |
| source | text | |
| status | text not null default 'active' | check: active, past, lost |
| started_on / deadline | date | |
| payment_status | text | check: none, pending, partial, paid |
| notes / next_action | text | |
| follow_up_date | date | |
| testimonial_status / referral_status | text | check: none, asked, received, declined |

idx: (user_id, status), (user_id, follow_up_date)

**`leads`** (proposal fields folded in — one active proposal per lead)
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| title | text not null | opportunity/lead name |
| source / url | text | platform, community, link |
| stage | text not null default 'new' | check: new, qualified, contacted, proposal_sent, follow_up, call, negotiation, won, in_progress, delivered, paid, review_requested, referral_requested, lost (§4 full ladder) |
| expected_value | numeric(12,2) | |
| probability | numeric(5,2) | 0–1 |
| client_id | uuid null | FK clients **on delete set null** — set when lead converts |
| proposal_amount | numeric(12,2) | |
| proposal_sent_at | timestamptz | |
| proposal_notes | text | |
| last_contact_at | timestamptz | |
| next_follow_up_at | timestamptz | powers dashboard "Next Client Follow-up" card + reminders |
| lost_reason | text | |
| notes | text | |

idx: (user_id, stage), (user_id, next_follow_up_at), (user_id, client_id)

Kanban mapping (§23 columns → stages): New=`new`; Qualified=`qualified`; Outreach=`contacted`; Proposal=`proposal_sent`; Follow-up=`follow_up`; Call=`call`; Negotiation=`negotiation`; Won=`won..referral_requested`; Lost=`lost`.

**`lead_events`** — first-class revenue-loop activity log (review I-2)
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| lead_id | uuid not null | FK leads **on delete cascade** |
| event_type | text not null | check: discovered, outreach, proposal_sent, follow_up, call, negotiation, won, lost, delivered, invoiced, paid, review_requested, referral_received, note |
| occurred_at | timestamptz not null default now() | |
| amount | numeric(12,2) null | for invoiced/paid events |
| transaction_id | uuid null | FK transactions **on delete set null** — links invoiced/paid events to the money engine |
| note | text | |

idx: (user_id, lead_id, occurred_at), (user_id, event_type, occurred_at)

Workflow coverage: discovery=`discovered` · outreach=`outreach` · proposal=`proposal_sent` · follow-up=`follow_up` · call=`call` · negotiation=`negotiation` · close=`won`/`lost` · delivery=`delivered` (+ project) · invoice/payment=`invoiced`/`paid` (+ transaction) · review=`review_requested` · referral=`referral_received`.

**`notes`**
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| title | text not null default '' | |
| content | text not null default '' | Markdown |
| folder | text not null default '00 Inbox' | §16 suggested folders |
| tags | text[] not null default '{}' | |
| pinned | boolean not null default false | |
| archived | boolean not null default false | |

idx: (user_id, folder, archived), GIN (tags)

**`brain_dumps`**
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| content | text not null | |
| status | text not null default 'inbox' | check: inbox, converted, archived |
| converted_type | text | task / note / idea / goal / reminder / question (set in Phase 7 conversion flow) |
| converted_id | uuid | soft ref, intentionally FK-less (target may be deleted) — documented |

**`reviews`** — daily/weekly/monthly/quarterly/yearly unified
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | unique (user_id, review_type, period_start) — `period_start` computed in user tz |
| review_type | text not null | check: daily, weekly, monthly, quarterly, yearly |
| period_start | date not null | |
| period_end | date | |
| answers | jsonb not null default '{}' | typed per review type (§18 questions, §38 evening questions) |
| scores | jsonb not null default '{}' | weekly: six progress dimensions; monthly: KEEP/START/STOP/DOUBLE_DOWN |

### 7.3 Migration `0003_day_week_plans.sql` (Phase 6 — with Today/Dashboard)

**`day_plans`** — one per date
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | unique (user_id, plan_date) — tz-derived |
| plan_date | date not null | |
| available_hours | numeric(4,1) | |
| energy | smallint | 1–5 snapshot |
| focus_question_answer | text | "the one thing that makes today a win" |
| money_action_task_id / personal_action_task_id / relationship_action_task_id | uuid null | FK tasks on delete set null |
| shutdown_time | time | |
| status | text not null default 'active' | check: draft, active, closed |
| notes | text | |

**`week_plans`**
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | unique (user_id, week_start) — tz-derived |
| week_start | date not null | Saturday by default (configurable) |
| outcomes | text[] | top weekly outcomes |
| allocation | jsonb | consumed by Phase 13 allocation feature; until then written but not surfaced |
| notes | text | |

### 7.4 Migration `0004_revenue_extras.sql` (Phase 4 — with Revenue Loop polish)

**`marriage_expenses`**
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| item | text not null | |
| category | text | furniture, finishing, rent_deposit, hall, clothing, photography, transport, misc |
| estimated_cost / actual_cost / paid_amount | numeric(12,2) | paid default 0 |
| deadline | date | |
| priority | text not null default 'medium' | check: critical, high, medium, low |
| status | text not null default 'planned' | check: planned, in_progress, paid, dropped |
| notes | text | |

idx: (user_id, deadline), (user_id, status)

**`services`** (Discord Bots catalog — UI Phase 13)
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| name | text not null | |
| base_price / min_price | numeric(12,2) | |
| estimated_hours | numeric(6,1) | |
| complexity | text | check: low, medium, high |
| profitability | numeric(6,2) | est. hourly |
| portfolio_example / delivery_estimate / maintenance_plan | text | |
| is_active | boolean not null default true | |

**`outreach_templates`**
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| name | text not null | |
| kind | text not null | check: cold_dm, email, proposal, follow_up, referral_request, testimonial_request |
| body | text not null | |

### 7.5 Migration `0005_decisions_opportunities.sql` (Phase 13)

**`decisions`**
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| title | text not null | |
| why_now / upside / downside / cost / time_required / risk / worst_case / best_case / decision | text | §34 template |
| options | jsonb | [{label, notes}] |
| reversible | boolean | |
| review_date | date | |
| status | text not null default 'open' | check: open, decided, reviewed |

**`opportunities`**
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| title | text not null | |
| kind | text not null | check: job, freelance, discord_client, remote, partnership, product, other |
| expected_value | numeric(12,2) | |
| probability | numeric(5,2) | 0–1 |
| time_required_hours | numeric(8,1) | |
| risk | text | check: low, medium, high |
| next_action | text | |
| status | text not null default 'open' | check: open, pursuing, won, dropped |

Score (display only): `expected_value × probability / NULLIF(time_required_hours, 0)`.

### 7.6 Life layer migrations (Phases 9/10)

**`0006_life_part1.sql` (Phase 9):** `relationship_ideas` (title, category check(date, home, game, movie, cooking, walk, low_budget, free, occasion, other), budget_level check(free, low, medium, high), notes, last_used_at), `relationship_wishlist` (title, kind check(place, thing, game, movie, trip, apartment, other), notes, is_done), `relationship_checkins` (week_start date unique/user tz-derived, answers jsonb — 5 questions §11).

**`0007_life_part2.sql` (Phase 10):** `habits` (name, description, target_per_week smallint default 7, is_active), `habit_logs` (habit_id FK cascade, log_date date, note; unique(user_id, habit_id, log_date)), `routines` (name, time_of_day check(morning, workday, evening, night), items jsonb, is_active, sort_order), `daily_logs` (log_date date unique/user, sleep_at time, woke_at time, hours_slept numeric(4,1), energy smallint 1–5, focus smallint 1–5, note), `time_entries` (task_id/project_id null FKs on delete set null, kind check(deep_work, delivery, sales, learning, product, admin, relationship, rest), started_at, ended_at, duration_min int, focus_rating smallint 1–5, note).

**`0008_notifications.sql` (Phase 15):** `notifications` (kind check(deadline, follow_up, daily_start, shutdown, finance, weekly_review, marriage_payment, system), title, body, scheduled_at timestamptz, read_at timestamptz, meta jsonb).

### 7.7 Later-phase tables (Phase 13+, defined when reached)

`partners`, `partner_reviews`, `skills`, `portfolio_items`, `contacts` (personal CRM), `content_items` (personal brand), `case_studies`, `note_links` (if note↔note links are built). Intentionally not designed yet to avoid speculative schema.

### 7.8 JSONB governance

Every jsonb column (`settings`, `answers`, `scores`, `meta`, `allocation`, routine `items`, notification `meta`) has a Zod schema with defaults; updates use `.partial()`; unknown keys are stripped on read. Any jsonb shape change gets a version-bump note in `lib/schemas/` (convention file: `lib/schemas/README.md`).

### 7.9 Seed data (§133 + §132)

Applied via a **service-role seed script** (`scripts/seed.ts`) — safety rules in §8.9:
- Owner profile from §132 snapshot (name, Africa/Cairo, EGP, Friday off, settings incl. marriage target 250,000 / 12 months, savings 18,000).
- Goals: Marriage Fund, Stable Monthly Income, Freelance Client #1, Remote Opportunity, Portfolio Upgrade (+ Vision + Year parents).
- Projects: MERN Freelance Pipeline, Discord Bot Services, Experimental Product, LIFE OS.
- Recurring weekly tasks: Outreach, Proposal sending, Portfolio improvement, Finance update, Relationship time, Weekly review.
- Buckets: Marriage (starting 18,000, target 250,000), Emergency, Business, Personal.
- Default money categories list, 13 note folders, 10 Discord services catalog (Phase 4), default routine templates (Phase 10).
- A separate **`scripts/reset-dev.ts`** wipes and re-seeds the **dev** project deterministically for repeatable E2E runs (§14).

---

## 8. Authentication & Authorization Model

**Model: single-owner private app.** No public signup UI. The owner account is created once (seed script). Login page at `/login`.

1. **Authentication:** Supabase Auth email+password (`signInWithPassword`). Passwords hashed by Supabase (bcrypt). Rate-limit login attempts in the login action (simple counter + lockout window). Email confirmation is disabled for the owner account in both Supabase projects (single user, no email loop) — verified during F1.
2. **Session:** `@supabase/ssr` creates the Supabase client per request, reading/writing the auth cookie in Server Actions/Route Handlers/proxy. HttpOnly, Secure in prod, SameSite=Lax — managed by the library.
3. **Optimistic route guard:** `proxy.ts` (Next 16 name — NOT `middleware.ts`; Node runtime; static matcher) runs on all routes: no valid session cookie on protected route → redirect `/login`; authenticated on `/login` → redirect `/dashboard`. Cookie-only check, no DB call. Note (verified in local docs): a matcher exclusion also skips Server Action coverage for that path — which is why rule 4 is mandatory.
4. **Secure checks (primary defense):** `lib/dal/verifySession()` — memoized with React `cache()`, validates session via Supabase `auth.getUser()` (server call), redirects if invalid. Called by every DAL query function and every Server Action.
5. **Database defense (RLS):** every table `enable` + `force` RLS with `auth.uid() = user_id` policies. The app connects with the user's JWT (anon key + session), so even bypassed app logic can't read foreign rows.
6. **Authorization scope:** single role (owner). No RBAC. Relationship features remain owner-only.
7. **Server Actions:** each action starts with `verifySession()`; treat every action as a public POST endpoint.
8. **Logout:** delete session via Supabase `signOut()` + redirect `/login`.
9. **Service-role isolation (hardened per review):**
   - `SUPABASE_SERVICE_ROLE_KEY` is read **only** by `scripts/seed.ts` and `scripts/reset-dev.ts`. There is **no `lib/supabase/admin.ts`** importable by app code — the admin client lives inside `scripts/` only.
   - `scripts/seed.ts` refuses to run unless `SEED_CONFIRM=yes` is set, and refuses to target the **prod** project URL unless an explicit `--prod` flag is also passed. It asserts the target is the dev project by default.
   - A code-review checklist line + ESLint no-restricted-imports rule (added in F1) blocks `scripts/**` imports from `app/**` and `lib/**`.
10. **Password change:** Supabase Auth `updateUser({ password })` from Settings (Phase 16).

---

## 9. Folder Structure

```
Life_OS/
├─ app/
│  ├─ layout.tsx                    # root: html/body, fonts, ThemeProvider
│  ├─ globals.css
│  ├─ proxy.ts                      # Next 16 route guard (renamed middleware)
│  ├─ (auth)/
│  │  └─ login/page.tsx
│  ├─ (app)/                        # authenticated group: sidebar layout
│  │  ├─ layout.tsx                 # Command Center sidebar + quick-capture + search
│  │  ├─ home/page.tsx              # F1 minimal authenticated landing (later redirects to /dashboard)
│  │  ├─ dashboard/page.tsx         # "Good Morning" screen — 5 cards (§68, §126)
│  │  ├─ today/page.tsx
│  │  ├─ calendar/page.tsx          # Phase 11
│  │  ├─ tasks/page.tsx
│  │  ├─ goals/page.tsx
│  │  ├─ projects/page.tsx
│  │  ├─ projects/[id]/page.tsx
│  │  ├─ clients/page.tsx
│  │  ├─ clients/[id]/page.tsx
│  │  ├─ freelance/page.tsx         # Revenue Command Center: kanban + events + targets
│  │  ├─ opportunities/page.tsx     # Phase 13
│  │  ├─ discord-bots/page.tsx      # Phase 13
│  │  ├─ products/page.tsx          # Phase 13 (Product Lab)
│  │  ├─ finances/page.tsx
│  │  ├─ marriage/page.tsx          # Phase 9
│  │  ├─ relationship/page.tsx      # Phase 9
│  │  ├─ routines/page.tsx          # Phase 10
│  │  ├─ habits/page.tsx            # Phase 10
│  │  ├─ notes/page.tsx
│  │  ├─ notes/[id]/page.tsx
│  │  ├─ brain-dump/page.tsx        # inbox from F2; conversion UI Phase 7
│  │  ├─ reviews/page.tsx
│  │  ├─ reviews/[type]/[period]/page.tsx
│  │  ├─ analytics/page.tsx         # Phase 13
│  │  ├─ decisions/page.tsx         # Phase 13
│  │  ├─ settings/page.tsx
│  │  ├─ loading.tsx / error.tsx / not-found.tsx
│  │  └─ api/
│  │     ├─ ai/route.ts             # Phase 14 (server-only LLM proxy)
│  │     ├─ export/route.ts         # Phase 16: JSON/CSV/Markdown downloads
│  │     └─ cron/[job]/route.ts     # Phase 15: CRON_SECRET-protected jobs
│  └─ page.tsx                      # "/" → redirect to /dashboard or /login
├─ components/
│  ├─ ui/                           # shadcn primitives (button, dialog, input…)
│  ├─ layout/                       # sidebar, topbar, command palette, theme toggle
│  ├─ tasks/  finance/  leads/  notes/  reviews/  dashboard/  today/  capture/  forms/
├─ lib/
│  ├─ supabase/{server.ts,types.ts} # NO admin client here (scripts-only)
│  ├─ dal/{index.ts,auth.ts,tasks.ts,goals.ts,finance.ts,leads.ts,projects.ts,clients.ts,notes.ts,reviews.ts,…}
│  ├─ actions/{auth.ts,tasks.ts,goals.ts,finance.ts,leads.ts,projects.ts,clients.ts,notes.ts,brain-dump.ts,reviews.ts,settings.ts,day-plan.ts}
│  ├─ schemas/                      # Zod schemas per domain (shared client/server) + README.md jsonb governance
│  ├─ logic/                        # pure domain math: priority.ts,savings.ts,forecast.ts,opportunity.ts,dates.ts,allocation.ts,day-plan.ts,recurring.ts
│  ├─ constants/                    # categories, stages, enums, default templates, copy.ts (tone rules)
│  ├─ ai/                           # Phase 14: provider adapter, typed context packs, budgets (server-only guarded)
│  └─ utils/                        # incl. log.ts (redacting logger), money.ts, dates.ts
├─ supabase/
│  └─ migrations/                   # numbered SQL (schema + RLS + indexes), applied via db push / dashboard
├─ scripts/
│  ├─ seed.ts                       # service-role, SEED_CONFIRM-gated, dev-by-default (§8.9)
│  └─ reset-dev.ts                  # deterministic dev wipe+reseed for E2E
├─ tests/
│  ├─ unit/                         # vitest: lib/logic + schemas + AI context packs
│  ├─ security/                     # standing RLS regression test
│  └─ e2e/                          # playwright specs (auth, revenue loop, finance totals, …)
├─ docs/                            # master prompt, plan, review, revision report
├─ .env.local (gitignored) / .env.example
├─ vitest.config.mts, playwright.config.ts
└─ (existing: next.config.ts, tsconfig.json, eslint.config.mjs, postcss.config.mjs)
```

Path alias `@/*` → project root (already configured).

---

## 10. Routes / Pages

| Route | Purpose | Phase |
|---|---|---|
| `/` | redirect → `/dashboard` (authed) or `/login` | F1 |
| `/login` | email+password | F1 |
| `/home` | minimal authenticated landing (F1 proof page); redirects to `/dashboard` once it exists | F1 |
| `/dashboard` | Good Morning screen — **5 cards only:** Top 3, Money, Revenue Action, Next Client Follow-up, Brain Dump (+ greeting/date/shutdown time); answers §126 five questions | 6 |
| `/today` | Day plan builder + Today's Mission + shutdown flow | 6 |
| `/tasks` | Task list w/ filters (status/type/project/date), quick edit, stale-task prompts | 3 |
| `/goals` | Goal hierarchy tree + CRUD | 3 |
| `/freelance` | Revenue Command Center: lead kanban + event log + daily sales targets | 4 |
| `/clients`, `/clients/[id]` | Client list/detail (§25 fields) | 4 |
| `/projects`, `/projects/[id]` | Project list/detail (brief, milestones, tasks, money rollup) | 4 |
| `/finances` | Transactions CRUD, buckets, category summary, marriage-goal math, monthly targets | 5 |
| `/notes`, `/notes/[id]` | Folders, tags, search, pin/archive, markdown editor | 7 |
| `/brain-dump` | Capture inbox (from F2) + conversion flow (Phase 7) | F2 / 7 |
| `/reviews` | Weekly/monthly review list + fill-in flow | 8 |
| `/settings` | Personal, goals, work, relationship, privacy (export/delete/AI toggle) | F2 (core) → extended later |
| `/marriage` | Marriage Mission | 9 |
| `/relationship` | Us: ideas, wishlist, check-in | 9 |
| `/habits`, `/routines` | Life layer | 10 |
| `/calendar` | Day/Week/Month/Year views | 11 |
| `/analytics` | Career/Productivity/Finance/Projects/Relationship + forecast | 13 |
| `/opportunities`, `/decisions`, `/discord-bots`, `/products` | Engines UI | 13 |
| `/api/ai` | LLM proxy (server-only) | 14 |
| `/api/cron/[job]` | Scheduled generators/reminders (CRON_SECRET) | 15 |
| `/api/export` | Data export downloads | 16 |

**Deferred dashboard elements (each has a home elsewhere):** active-project card → Projects page; relationship card → Phase 9 (only when real data exists); weekly charts → Phase 13 analytics; morning "one thing" question → lives on `/today`, not the dashboard.

---

## 11. Server Actions / API Surface

All mutations are **Server Actions** (`'use server'` files in `lib/actions/`). Each: `verifySession()` → Zod parse → Supabase mutation → **`revalidatePath(affected)` and/or `refresh()`** → return typed result (`{ ok, data?, errors? }`) for `useActionState`. (No tag-based revalidation anywhere — see §6.2.)

| Module | Actions |
|---|---|
| auth | `login`, `logout`, `changePassword` |
| tasks | `createTask`, `updateTask`, `deleteTask`, `setTaskStatus`, `completeTask`, `moveTaskDate`, `setTopThree`, `resolveStaleTask` (do/reschedule/delete) |
| goals | `createGoal`, `updateGoal`, `deleteGoal` (never cascades tasks — FKs set null), `linkTaskToGoal` |
| day-plan | `generateDayPlan` (idempotent recurring materialization), `saveDayPlan`, `closeDay` (shutdown flow → daily review + tomorrow start) |
| week-plan | `saveWeekPlan` |
| finance | `createTransaction`, `updateTransaction`, `deleteTransaction`, `createBucket`, `updateBucket`, `deactivateBucket` (delete is blocked while transactions reference it), `createMarriageExpense`, `updateMarriageExpense` |
| leads | `createLead` (logs `discovered` event), `updateLead`, `moveLeadStage` (logs matching event), `logLeadEvent`, `convertLeadToClient`, `markLost`, `recordLeadPayment` (creates linked transaction + `paid` event) |
| clients | `createClient`, `updateClient`, `deleteClient` |
| projects | `createProject`, `updateProject`, `setProjectStatus` |
| notes | `createNote`, `updateNote`, `deleteNote`, `togglePin`, `archiveNote`, `linkNotes` |
| brain-dump | `createDump` (F2), `convertDump` (Phase 7: → task/note/goal/idea), `archiveDump` |
| reviews | `createReview`, `updateReview` |
| settings | `updateSettings`, `exportData`, `deleteAllData` (password re-entry + typed confirmation) |
| life layer (P9/P10) | relationship ideas/wishlist/checkins CRUD, habits CRUD + `logHabit`, routines CRUD, `saveDailyLog`, time entry `startTimer/stopTimer` |
| engines (P13) | services CRUD, outreach templates CRUD, decisions CRUD, opportunities CRUD |

**Route Handlers (only where Server Actions don't fit):**
- `POST /api/ai` — Phase 14: streams LLM responses; server-only API key; typed context packs; hard token budget; per-user rate limit.
- `GET /api/export?format=json|csv|md&scope=…` — Phase 16: authenticated, streamed downloads with `Content-Disposition`.
- `POST /api/cron/[job]` — Phase 15: Vercel Cron; rejects requests without `CRON_SECRET`.

---

## 12. State Management Strategy

- **Server state is the source of truth.** Pages are Server Components reading the DAL; after mutations, `revalidatePath`/`refresh()` refreshes the UI. No client-side cache library (no SWR/React Query) in MVP.
- **No global client store** (no Redux/Zustand). Client state is local and short-lived:
  - Forms: `useActionState` + `useFormStatus` (pending states, validation errors).
  - Optimistic UI for snappy interactions (task complete toggle, kanban card move): `useOptimistic`.
  - Kanban drag-and-drop: local state + server action on drop.
  - Filters/tab state: URL search params (`useSearchParams`) — shareable, back-button friendly.
  - Command palette / quick-add dialogs: local component state.
  - Focus timer: local state + time-entry server action on stop.
- **Theme:** `next-themes` (system default, persisted preference).

---

## 13. Validation Strategy

- **Zod schemas in `lib/schemas/*`** — single source of truth shared by client and server.
- **Server (authoritative):** every Server Action `safeParse`s FormData/JSON; invalid → early return with flattened field errors; nothing reaches Supabase unvalidated. DAL additionally relies on DB constraints (checks, FKs, NOT NULL).
- **Client (UX):** same schemas power inline field errors on blur/submit; never trusted.
- **JSONB columns** each have Zod schemas with defaults + `.partial()` updates; unknown keys stripped (§7.8).
- **Enums:** TS union types generated from `lib/constants/*`, mirrored by DB `check` constraints.
- **Money:** parse to `numeric` strings; never floats in storage; display formatting centralized in `lib/utils/money.ts`.
- **Dates:** ISO strings across the wire; `date-fns` for week/period math; all day-level math done in the user's timezone (stored on profile) — day-keyed uniqueness depends on this (§7).

---

## 14. Testing Strategy

| Layer | Tool | What |
|---|---|---|
| Unit | **Vitest** (+ vite-tsconfig-paths) | `lib/logic/*`: priority score, gap/required-savings (**incl. edge cases: zero months remaining, negative net savings, mid-month start**), forecast scenarios, opportunity score, effective hourly rate, week math, **bucket balance computation**, **recurring-instance idempotency**, **timezone day-boundary handling**; Zod schemas accept/reject; **AI typed context packs (Phase 14): content selection + relationship-data gate + token budget** |
| Component | Vitest + **Testing Library** + jsdom | critical interactive components (task form, transaction form, kanban column) — async Server Components tested via E2E instead (per Next docs) |
| **Security (standing)** | Vitest/script against **dev Supabase** | **RLS regression: for EVERY table, a second authenticated test user reads 0 rows and writes fail. Runs in the gate of every phase that adds a migration** (Phase F1, 4, 6, 9, 10, 13, 15) |
| E2E | **Playwright** (Chromium) against dev server + **dev Supabase project** | **auth:** guard redirect, login success/failure, logout · **revenue loop (Phase 4): full lifecycle — create lead → log outreach/proposal/follow-up events → stage moves → convert to client → link project → record payment (transaction created) → review/referral events** · **finance (Phase 5): dashboard/finance totals vs known fixture transactions (income − expenses = net; bucket balances)** · tasks/goals CRUD · day plan generate→top 3→close day · notes + dump conversion · weekly review submit |
| E2E data discipline | `scripts/reset-dev.ts` | deterministic wipe+reseed of the dev project before E2E suites; specs never depend on leftover state |
| Manual | UX checklist §97 per feature (PR-level checkbox) | loading/empty/error/mobile/keyboard/validation/undo/persist/security |

Rules: tests live in `tests/`; `npm run test` (vitest), `npm run test:e2e` (playwright), `npm run test:rls` (security). Phase gate before completion: `lint + typecheck + unit + build` green, plus the phase's listed tests. No test theater — every phase's acceptance criteria map to at least one automated check where feasible.

---

## 15. Dependencies (installed during Phase F1 — NOT installed yet)

**Runtime:**
| Package | Why |
|---|---|
| `@supabase/supabase-js` | DB + auth client |
| `@supabase/ssr` | Next.js SSR cookie session handling |
| `zod` | validation |
| `date-fns` | date/week math |
| `next-themes` | dark/light mode |
| `server-only` | guard server-only modules (DAL, session, AI) |
| `lucide-react` | icons (shadcn dependency) |
| `recharts` | charts — install at Phase 13 only |
| shadcn/ui CLI deps (`class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/*` as needed) | added incrementally per component via shadcn CLI in Phase F2 |

**Dev:**
| Package | Why |
|---|---|
| `vitest`, `@vitejs/plugin-react`, `vite-tsconfig-paths`, `jsdom`, `@testing-library/react`, `@testing-library/dom` | unit tests (per Next 16 vitest guide) |
| `@playwright/test` | E2E |
| `prettier`, `prettier-plugin-tailwindcss` | formatting (§96) |
| `supabase` (CLI) | `db push` / type generation against **cloud** projects only (no local Docker stack — not installed) |

**Deliberately NOT added:** Redux/Zustand, React Query/SWR, Drizzle/Prisma (supabase-js + SQL views suffice; revisit if query complexity explodes), state machines, DnD libraries until kanban work (then likely `@dnd-kit/core`, with a stage-`<select>` fallback so the board works without DnD), PWA tooling until Phase 17.

---

## 16. Contradictions, Ambiguities & Decisions

### Contradictions found in spec (resolved)
| # | Issue | Resolution |
|---|---|---|
| C-1 | §4 lists 13 lead stages; §23 kanban lists 9 different-ish columns | Single `stage` enum = §4's 13 + `lost`; kanban columns are **display groupings** (§7.2). Post-won stages appear as sub-states inside "Won" and in client/project views. |
| C-2 | §60 quick actions assign `N` to both New Task and New Note | Non-conflicting set: `T` task, `M` transaction (money), `L` lead, `N` note, `B` brain dump, `R` relationship activity, plus `Ctrl/Cmd+K` command palette as the primary quick-add. |
| C-3 | §44 lists `Proposal`, `JournalEntry`, `Quarter`, `MonthPlan` as entities, but §44 also says merge when sensible | Proposals fold into `leads`; journal entries fold into `reviews` (type=daily); Quarter/Month plans fold into `goals` (level) + `reviews`. |
| C-4 | §22 "first 14 days ready plan" vs §130 warning against living inside the system | Ships as a seeded checklist note + optional tasks, not a dedicated module. |

### Decisions resolved by the architecture review (no longer open)
| # | Decision | Resolution |
|---|---|---|
| D-1 | Supabase project setup | **Supabase Cloud, two projects (dev + prod).** No local Supabase/Docker path — Docker is not installed on this machine. |
| D-2 | Auth approach | **Supabase Auth** via `@supabase/ssr`. |
| D-3 | Signup | **Login-only**; owner created by seed script. |
| D-11 | Week start day | **Saturday** (matches §105; configurable in settings). |
| D-13 | Dev vs prod database | **Separate dev and prod Supabase projects**; E2E runs against dev with deterministic reset. |
| R-1 | Caching model | `cacheComponents` OFF; `revalidatePath`/`refresh()` after mutations; React `cache()` for render-pass dedupe; no tag revalidation. |
| R-2 | Revenue loop placement | First-class core workflow in Phase 4 (before finance/dashboard), with `lead_events` activity log. |
| R-3 | Quick capture placement | Capture-only Brain Dump ships in Phase F2; conversion in Phase 7. |
| R-4 | Dashboard v1 scope | 5 cards only (Top 3, Money, Revenue Action, Next Follow-up, Brain Dump) + greeting/date/shutdown. |
| R-5 | Foundation structure | Phases 0–2 replaced by F1 (security & data foundation vertical slice) + F2 (shell, settings, quick capture). |
| R-6 | Migration strategy | Tables created in the phase that consumes them: 0001+0002 (F1), 0003 (P6), 0004 (P4), 0005 (P13), 0006–0008 (P9/10/15). |

### Remaining open decisions (defaults apply until answered)
| # | Decision | Recommendation (default if no answer) |
|---|---|---|
| D-4 | **UI language**: English vs Arabic vs bilingual | Bilingual UI: English + Arabic, English default, full RTL support. |
| D-5 | **Currency handling**: primary EGP, single currency vs per-transaction FX | MVP: transactions carry a `currency` field but totals assume profile currency; USD income recorded with EGP-equivalent amount + note. Full FX later. |
| D-6 | **Recurring tasks grammar** | Simple `daily` / `weekly:mon,thu` / `monthly:1` grammar, idempotent materialization. |
| D-7 | **Partner/fiancée access** | Single-user now; schema is multi-user-safe (user_id + RLS). Sharing = later phase if ever. |
| D-8 | **AI provider** (Phase 14): which LLM/API? Budget/limits? | Decide at Phase 14; architecture is provider-agnostic behind `/api/ai`. |
| D-9 | **Notifications channel** | In-app center (Phase 15). Push/email later if wanted. |
| D-10 | **Forecast formulas** (§8) | Conservative = 0.6 × avg last-3-months net savings; Base = 1.0 ×; Aggressive = 1.5 × (min 1 month data, else "not enough data"). Configurable later. |
| D-12 | **Deployment accounts**: Vercel account/project + custom domain? | Vercel hobby + `*.vercel.app` domain for now. |

---

## 17. Implementation Roadmap (Executable Phases)

> Ground rules for every phase (§100): Plan → Implement → Run → Test → Review → Fix → Commit → Next. Never start the next phase with broken core functionality. Each phase ends with: `npm run lint` + `tsc --noEmit` + unit tests + `next build` all green, plus the phase's listed tests. Every phase that adds a migration also runs the standing RLS regression test.

---

### Phase F1 — Security & Data Foundation (complete vertical slice)
**Objective:** one tested vertical slice: owner can log in, lands on an authenticated page showing seeded data, and every row is RLS-isolated. Replaces old Phases 0–2.
**Files/modules:** `.gitignore` verification, `package.json`, `.env.example`, `.env.local`, prettier config, `eslint.config.mjs` (+ no-restricted-imports boundary rule), `vitest.config.mts`, `playwright.config.ts`, `supabase/migrations/0001_foundation.sql`, `supabase/migrations/0002_mvp_core.sql`, `lib/supabase/server.ts`, `lib/dal/auth.ts` (verifySession), `lib/actions/auth.ts`, `lib/schemas/auth.ts`, `app/proxy.ts`, `app/(auth)/login/page.tsx`, `app/(app)/home/page.tsx` (minimal proof page), `app/page.tsx` redirect, `scripts/seed.ts`, `scripts/reset-dev.ts`, `tests/security/rls.test.ts`, `lib/constants/*` (enums/categories/folders).
**Dependencies:** none (first phase). Requires the two Supabase Cloud projects (dev/prod) to exist.
**Implementation tasks (ordered sub-steps with gates):**
1. **`git init`** + verify `.gitignore` excludes `.env.local`/`.env*` (except `.env.example`) + initial commit of the clean scaffold.
2. Install dependencies (§15 first batch: supabase-js, ssr, zod, date-fns, next-themes, server-only, vitest set, playwright, prettier) + scripts: `lint`, `format`, `typecheck`, `test`, `test:rls`, `test:e2e`, `db:push`, `db:seed`, `db:reset-dev`.
3. Vitest + Playwright configs with smoke tests (unit 2+2; E2E homepage renders).
4. Supabase Cloud wiring: dev + prod projects, env vars in `.env.local`, verify connection from a throwaway server component; generate DB types.
5. Migration 0001: profiles + `handle_new_user` trigger + RLS + `set_updated_at` trigger.
6. Migration 0002: the 11 MVP-core tables (§7.2) with FK behaviors (tasks FKs set null; bucket restrict), indexes, RLS enable+force+policies, recurring-instance unique partial index.
7. Seed script (service-role, `SEED_CONFIRM`-gated, dev-by-default, `--prod` flag required for prod) + `reset-dev.ts`; run seed on dev.
8. Auth: `login`/`logout` actions with Zod + attempt throttling; login page UI (loading/error states, keyboard accessible); email-confirmation handling for owner.
9. `proxy.ts` guard: protected vs public routes, cookie-only session check, redirects; matcher skips `_next/*` + static assets.
10. `verifySession()` DAL (memoized, `auth.getUser()`).
11. **Standing RLS regression test** — second test user reads 0 rows / writes fail across all tables.
**Acceptance criteria:** all npm gates pass; unauthenticated visit to any `(app)` route → `/login`; wrong password shows non-leaking error; login lands on `/home` showing seeded counts (goals/tasks/buckets); profile auto-created on user insert; RLS regression green; no secrets in repo; seed refuses prod without explicit flags.
**Tests:** unit: auth schema; E2E: guard redirect, login success/failure, logout, seeded home page; security: RLS regression.
**Definition of done:** vertical slice proven + committed + security checklist (HttpOnly cookie, no session in client bundles, actions re-verify, service-role confined to scripts).

---

### Phase F2 — App Shell, Settings & Quick Capture
**Objective:** the Command Center users live in: sidebar (§125), topbar, theme, settings (core), UX patterns — **plus day-one quick capture** (Brain Dump capture-only).
**Files/modules:** `app/(app)/layout.tsx`, `components/layout/*`, shadcn/ui init + base primitives, `app/(app)/settings/page.tsx` + `lib/actions/settings.ts` + `lib/schemas/settings.ts`, `components/ui` patterns (`EmptyState`, `ErrorState`, `PageHeader`, skeletons), `app/(app)/error.tsx|loading.tsx|not-found.tsx`, placeholder pages for all MVP routes, `lib/dal/brain-dump.ts` (capture), `lib/actions/brain-dump.ts` (`createDump`), `app/(app)/brain-dump/page.tsx` (inbox list), `components/capture/quick-capture.tsx` (global box in shell + home/dashboard).
**Dependencies:** F1.
**Implementation tasks:**
1. Init shadcn/ui (verify Tailwind v4/Next 16 compatibility; fallback: hand-rolled primitives); add button, input, label, card, dialog, dropdown-menu, select, textarea, toast/sonner, skeleton, badge, tabs.
2. Sidebar with §125 sections + active states + mobile collapse; topbar; theme toggle (dark/light/system) persisted.
3. Settings form (personal: name/timezone/currency/work hours/start time/off day; goals: marriage target+date, savings target, income targets; work: primary/secondary stream, proposal/outreach targets) → `updateSettings` with Zod.
4. Loading/empty/error component patterns used by all future pages; `lib/constants/copy.ts` tone rules (§70/§71).
5. **Quick capture:** global Brain Dump box (shell), `createDump` action, `/brain-dump` inbox page. Capture only — no conversion yet.
6. Placeholder pages (title + empty state) for all MVP routes.
**Acceptance criteria:** navigation works desktop+mobile; settings save and rehydrate; theme persists; capture from any page lands in inbox; §97 patterns demonstrable.
**Tests:** E2E: settings round-trip, quick capture → inbox; unit: settings schema defaults/merge, dump schema.
**Definition of done:** shell navigable, settings persisted, capture usable daily, patterns documented.

---

### Phase 3 — Tasks & Goals Engine
**Objective:** full task CRUD + goal hierarchy + priority ordering — the system's backbone.
**Files/modules:** `lib/dal/tasks.ts`, `lib/dal/goals.ts`, `lib/actions/tasks.ts`, `lib/actions/goals.ts`, `lib/schemas/tasks.ts`, `lib/schemas/goals.ts`, `lib/logic/priority.ts`, `lib/logic/recurring.ts`, `app/(app)/tasks/*`, `app/(app)/goals/*`, `components/tasks/*`, `components/goals/*`.
**Dependencies:** F2.
**Implementation tasks:**
1. Task schemas + DAL (list w/ filters: status, type, project, date, overdue; get; create; update; delete).
2. Task actions incl. `setTaskStatus`, `completeTask` (sets completed_at), `moveTaskDate`.
3. Priority score function (unit-tested) + suggested ordering + manual override (sort_order).
4. Tasks page: filters via search params, list, quick-complete, create/edit dialog form with validation, delete confirm. Build-vs-Revenue distinction surfaced via task_type.
5. Goals page: hierarchy tree (vision→week), CRUD, link task → goal. Goal deletion never deletes tasks (FK set null — verified).
6. Stale-task query (no update 3 days, not done) surfaced as banner/list with Do/Reschedule/Delete actions.
7. Recurring rule parser (unit-tested) — instances materialized by day-plan generation (Phase 6), idempotently.
**Acceptance criteria:** create/edit/complete/delete task < 30s; filters work; priority ordering visible and overridable; goal tree renders seeded hierarchy; linking persists; stale tasks detected; deleting a goal/project leaves its tasks intact.
**Tests:** unit: priority score, recurring parser; E2E: task CRUD, goal CRUD + safe delete, filter persistence in URL.
**Definition of done:** §14/§15/§31/§88 covered for MVP scope; all gates green.

---

### Phase 4 — Revenue Loop (first-class core workflow)
**Objective:** the product's spine: leads with activity log, clients, projects — full workflow discovery → outreach → proposal → follow-up → call → negotiation → won/lost → delivery → invoice/payment → review → referral.
**Files/modules:** migration `0004_revenue_extras.sql` (marriage_expenses, services, outreach_templates), `lib/dal/leads.ts|clients.ts|projects.ts`, `lib/actions/leads.ts|clients.ts|projects.ts`, `lib/schemas/leads.ts|…`, `app/(app)/freelance/*`, `app/(app)/clients/*`, `app/(app)/projects/*`, `components/leads/*` (board + event timeline), `components/clients/*`, `components/projects/*`. DnD: start with stage `<select>`; add `@dnd-kit/core` only if drag is judged necessary.
**Dependencies:** Phase 3 (linked tasks).
**Implementation tasks:**
1. Lead CRUD; every create logs `discovered`; every stage move logs the matching `lead_event`; event timeline on lead detail; `logLeadEvent` for manual touches/notes.
2. Lead board (grouped columns per C-1 mapping) + lead detail: proposal fields, follow-up date, notes, convert-to-client, mark lost (reason).
3. Clients list/detail with §25 fields + follow-up date surfacing.
4. Projects list/detail: brief, status, linked tasks, linked transactions placeholder (wired in Phase 5), profit rollup stub, deadline.
5. **Payment link:** `recordLeadPayment` creates a transaction (kind=income, lead_id set) + `paid` event in one action (transaction table exists from F1; finance UI comes Phase 5).
6. Daily sales targets widget (settings targets vs this week's logged events: proposals, follow-ups, outreach, calls).
7. Follow-up queue: leads ordered by `next_follow_up_at` (feeds dashboard card in Phase 6).
8. Marriage expenses CRUD (table lands here; surfaced on finances Phase 5 and marriage page Phase 9).
9. Seed: services catalog + outreach templates data.
**Acceptance criteria:** full lifecycle executable end-to-end; converting a lead creates client + links; payment creates a transaction; follow-up queue correct; §101 "add lead < 2 min" timed; board works without DnD.
**Tests:** **E2E: revenue-loop lifecycle (create → events → stages → convert → payment → review/referral)**; unit: event↔stage mapping, sales-target counts; RLS regression re-run (new migration).
**Definition of done:** §4/§23/§25/§26 workflow scope live; §67 conditions 3 & 5 satisfied.

---

### Phase 5 — Finance Engine
**Objective:** transactions, buckets, categories, marriage-goal math, financial dashboard.
**Files/modules:** `lib/dal/finance.ts`, `lib/actions/finance.ts`, `lib/schemas/finance.ts`, `lib/logic/finance.ts` (monthly totals, net savings, bucket balances, target comparison), `app/(app)/finances/*`, `components/finance/*`.
**Dependencies:** Phase 4 (lead↔transaction links exist).
**Implementation tasks:**
1. Transaction CRUD + filters (month, kind, category, project, lead) + monthly summary.
2. Buckets UI: computed balances, marriage bucket progress vs target; deactivate (not delete) while referenced.
3. Marriage-goal calculations: target, saved, remaining, required monthly/weekly/daily, months remaining (settings target date, user tz).
4. Monthly income targets (Min/Comfort/Stretch) vs actual.
5. Revenue vs Net Savings distinction; savings rate.
6. Project money rollup wired (revenue/expenses/profit from linked transactions).
7. Marriage expenses surfaced on finances page.
**Acceptance criteria:** add transaction < 20s (§101); bucket balances correct after income/expense; marriage math matches hand calculation; month navigation works; deleting a transaction recomputes totals; bucket delete blocked while referenced.
**Tests:** unit: totals/net savings/bucket balance/required math incl. edge cases (zero months remaining, negative net, mid-month start); **E2E: transaction CRUD + finance/dashboard totals vs known fixtures**; RLS regression re-run if migration touched.
**Definition of done:** §7/§8/§9 MVP scope + §67 conditions 2 & 4 satisfied.

---

### Phase 6 — Today + Focused Dashboard
**Objective:** `/today` day-plan experience and `/dashboard` Good Morning screen — **5 cards only** — answering §126's five questions with real data from Phases 3–5.
**Files/modules:** migration `0003_day_week_plans.sql`, `lib/dal/day-plan.ts`, `lib/actions/day-plan.ts`, `lib/logic/day-plan.ts` (capacity guard, deadline boost, Friday rule, idempotent recurring materialization), `lib/logic/savings.ts`, `app/(app)/today/*`, `app/(app)/dashboard/*`, `components/today/*`, `components/dashboard/*`.
**Dependencies:** Phases 3 (tasks), 4 (leads/follow-ups), 5 (money numbers).
**Implementation tasks:**
1. Migration 0003 (day_plans, week_plans; tz-derived unique dates).
2. Day plan generator: candidate tasks (scheduled, overdue, deadline-near, recurring instances — idempotent) → capacity check vs available hours → suggests Top 3 + money/personal/relationship actions + shutdown time; user edits/approves; manual override always possible.
3. Capacity rules: planned duration ≤ available hours; low energy → lighter load; Friday → no heavy sprints by default (§Rule 3).
4. Today page: Today's Mission layout (§12), Top 3 toggles, action slots, morning "one thing" question, shutdown flow (`closeDay` → daily review + tomorrow starting point).
5. **Dashboard v1 = exactly:** greeting + date + shutdown time, and cards: **Top 3** · **Money** (saved/target + required this month) · **Revenue Action** (today's income-generating task) · **Next Client Follow-up** (nearest `next_follow_up_at`) · **Brain Dump** quick input. All DAL reads issued via `Promise.all`.
6. `/` redirect now targets `/dashboard`.
**Acceptance criteria:** Good Morning screen renders real data (no stubs) in < 1s server render; day plan never exceeds available hours; Friday guard visible; shutdown produces tomorrow start; recurring generation re-run adds no duplicates; §101 "under 1 minute" questions answerable; dashboard has exactly the 5 cards.
**Tests:** unit: capacity guard, savings math, Friday rule, recurring idempotency, tz day boundaries; E2E: generate day plan → toggle top 3 → close day; dashboard cards show fixture data; RLS regression re-run (new migration).
**Definition of done:** §12/§13/§68/§69/§126 demonstrable with real data.

---

### Phase 7 — Notes + Capture Conversion
**Objective:** knowledge layer: markdown notes with folders/tags/search/pin/archive + Brain Dump conversion flow.
**Files/modules:** `lib/dal/notes.ts`, `lib/actions/notes.ts|brain-dump.ts` (extend), `lib/schemas/notes.ts`, `app/(app)/notes/*`, `components/notes/*` (markdown editor — evaluate lightweight md editor at this phase), conversion UI on `/brain-dump`.
**Dependencies:** Phase 3 (task/goal targets), F2 (capture inbox exists).
**Implementation tasks:**
1. Notes CRUD, folder sidebar (13 seeded), tags, pin, archive, full-text search (`ilike` MVP; `tsvector` later if slow).
2. Markdown editor + safe rendering.
3. Conversion flow: dump → creates task/note/goal with backlink (`converted_type`/`converted_id`), dump archived. Never auto-delete.
**Acceptance criteria:** write note < 30s; search finds by title/content; convert dump → task appears on Tasks with source dump archived; pin/archive work.
**Tests:** E2E: note CRUD + search, dump → convert → verify task; unit: schemas.
**Definition of done:** §16/§17 fully covered; §67 condition 6 satisfied (capture since F2, conversion now).

---

### Phase 8 — Weekly Review + Reviews Framework → ✅ MVP CHECKPOINT
**Objective:** reviews engine: weekly review flow with multi-dimensional scores; framework supporting daily/monthly later.
**Files/modules:** `lib/dal/reviews.ts`, `lib/actions/reviews.ts`, `lib/schemas/reviews.ts`, `app/(app)/reviews/*`, `components/reviews/*`.
**Dependencies:** Phases 3–6 (review pulls real metrics: income, proposals/events, completed tasks).
**Implementation tasks:**
1. Review model + weekly template (§18's 13 questions) with auto-prefilled metrics (income this week, net savings, proposals sent, follow-ups, tasks completed).
2. Weekly scores: six progress dimensions entered/reflected (not a single fake score).
3. Reviews list page (history), fill-in flow, save/update.
4. "Next week top 3 goals" captured → optionally create next week's goals/tasks.
5. Daily review records from `closeDay` viewable.
**Acceptance criteria:** Friday flow: open review → real numbers → answer → save → in history; §102 weekly acceptance answerable.
**Tests:** E2E: weekly review submit round-trip; unit: metric aggregation.
**Definition of done:** §18 covered; §67 condition 7 satisfied.

---

### ✅ MVP CHECKPOINT (gate before anything else)
- §67 success conditions 1–7 verified manually + via E2E.
- §101 daily-use acceptance test (< 1 min reads, < 2 min adds — incl. add lead) timed manually.
- §102 weekly-use acceptance test passes with real seed+test data.
- lint/typecheck/unit/e2e/RLS/build all green; deploy preview to Vercel works against dev Supabase.
- **User sign-off required to proceed past this point.**

---

### Phase 9 — Marriage Mission & Relationship Engine (Life Layer start)
**Objective:** `/marriage` full mission page + `/relationship` (Us).
**Files/modules:** migration `0006_life_part1.sql`, `app/(app)/marriage/*`, `app/(app)/relationship/*`, DAL/actions/schemas for both, `lib/logic/marriage.ts` (readiness dimensions), dashboard relationship card added (now that real data exists).
**Dependencies:** MVP checkpoint; Phase 5 (marriage expenses, buckets).
**Implementation tasks:**
1. Marriage Mission page: target date/amount, saved, remaining, monthly needed, upcoming expenses by deadline, payment deadlines, completion %, readiness checklist dimensions (each own progress), anti-chaos section.
2. Relationship: ideas library (budget-tagged, seeded), budget-aware suggestion (uses current-month net savings pressure), wishlist CRUD, weekly check-in form (5 questions, reflection only).
3. Dashboard relationship card wired: next shared activity/idea.
4. Privacy: relationship data excluded from analytics queries; `settings.ai_relationship_access` stored now, enforced in Phase 14 context builder.
**Acceptance criteria:** marriage numbers consistent with finance engine; suggestion respects budget level when month is net-negative; check-in saves weekly; §83 privacy verifiable in query layer.
**Tests:** unit: readiness/remaining math; E2E: marriage page w/ seed, check-in submit, budget filter; RLS regression re-run.
**Definition of done:** §10/§11/§57/§81/§83 covered.

---

### Phase 10 — Habits, Routines, Sleep/Energy, Time Tracking
**Objective:** life layer completion: `/habits`, `/routines`, daily log, deep-work timer.
**Files/modules:** migration `0007_life_part2.sql`, DAL/actions/schemas, `app/(app)/habits/*`, `app/(app)/routines/*`, `components/today/timer.tsx`, time-entry actions.
**Dependencies:** Phase 9; Phase 6 (day plan consumes energy/sleep).
**Implementation tasks:**
1. Habits CRUD + daily check-off + "Restart Today" (no guilt streaks).
2. Routines: 4 templates seeded (§28), editable items, daily view.
3. Daily log: sleep/wake/energy/focus quick form on Today page (morning + night).
4. Day planner consumes real sleep/energy data (adjust capacity suggestion).
5. Deep-work timer: start/stop on task → time_entry with focus rating; weekly totals (deep work / revenue / learning / relationship).
6. Sleep↔completion correlation note after 3+ weeks of data (simple, non-medical).
**Acceptance criteria:** log day in < 30s; timer creates entry with correct duration (incl. across-midnight); low-energy day produces lighter plan suggestion; habit miss shows restart, not failure.
**Tests:** unit: duration calc across midnight, weekly totals; E2E: habit log, daily log, timer flow; RLS regression re-run.
**Definition of done:** §28/§29/§30/§85 covered.

---

### Phase 11 — Calendar & Schedule
**Objective:** `/calendar` with day time-blocks, week commitments, month deadlines; collision warnings.
**Files/modules:** `app/(app)/calendar/*`, `components/calendar/*` (evaluate: hand-rolled CSS grid vs library), `lib/logic/schedule.ts` (collision detection).
**Dependencies:** Phase 10 (time entries, routines), Phase 3 (tasks w/ deadlines).
**Implementation tasks:**
1. Day view: time blocks from routines + planned tasks + time entries.
2. Week view: main commitments; Month view: deadlines (tasks, projects, marriage payments); Year view: milestones (goals).
3. Collision detection: overlapping client deadline / personal commitment / protected Friday time → warning + confirmation required (§27).
4. Cash-flow calendar strip (§116): expected income/expenses/marriage payments + projected end-of-month cash.
**Acceptance criteria:** all four modes render real data; scheduling over Friday protection triggers confirmation; projected cash math correct.
**Tests:** unit: collision + projection logic; E2E: month view deadlines, Friday collision flow.
**Definition of done:** §27/§116 covered.

---

### Phase 12 — Monthly/Quarterly Reviews & Finance Alerts
**Objective:** complete the review cadence and proactive finance messaging.
**Files/modules:** reviews templates (monthly/quarterly/yearly), `lib/logic/alerts.ts`, alert cards on finances/dashboard.
**Dependencies:** Phase 8 (reviews framework), Phase 5 (finance data).
**Implementation tasks:**
1. Monthly review flow (§19 metrics + KEEP/START/STOP/DOUBLE DOWN) prefilled from real data.
2. Quarterly review  + Year in Review .
3. Finance alert logic (§49): behind-target, income-rise, unexpected-expense — suggestion cards, never decisions.
**Acceptance criteria:** monthly review prefills real metrics; alerts fire per unit-tested conditions; tone non-punitive.
**Tests:** unit: alert conditions; E2E: monthly review submit.
**Definition of done:** §19/§20/§49/ covered.

---

### Phase 13 — Analytics, Decisions, Opportunities & Engines UI
**Objective:** `/analytics` + remaining engine pages: decisions, opportunities, discord-bots catalog, product lab.
**Files/modules:** migration `0005_decisions_opportunities.sql`, `app/(app)/analytics/*`, `/decisions/*`, `/opportunities/*`, `/discord-bots/*`, `/products/*`; `lib/logic/forecast.ts`, `lib/logic/opportunity.ts`, `lib/logic/profitability.ts`; install `recharts`.
**Dependencies:** Phases 4–12 (data to analyze).
**Implementation tasks:**
1. Analytics: career funnel (from `lead_events`: applications→replies→wins→revenue, reply/call/close rates, days-to-close), productivity (planned vs completed, carryover, overplanning frequency), finance trends, project profitability (effective hourly rate), relationship time — charts + plain-language summaries; no pressure framing (§47).
2. Forecast: 3 scenarios from actual data (D-10 formula) + reality-check warnings (§Rule 6).
3. Opportunity scoring + "recommended next opportunity" with reason.
4. Decision Desk CRUD with §34 template.
5. Discord Bots: service catalog CRUD + client qualification checklist + upsell prompts on delivered leads.
6. Product Lab: product cards with §6 fields + partnership checklist gate (blocks "active development" status until checklist complete) + kill-switch evaluation prompt (§35).
7. Work allocation view (§51/§52): planned vs actual split with adaptive suggestion (consumes `week_plans.allocation`).
**Acceptance criteria:** all metrics traceable to real rows (events, not snapshots); forecast updates when transactions change; product can't go active without checklist; opportunity ordering matches formula.
**Tests:** unit: forecast/scoring/profitability math; E2E: analytics renders with seed, decision CRUD, product gate; RLS regression re-run.
**Definition of done:** §5/§6/§19/§20/§33/§34/§35/§47/§50/§51/§52 covered.

---

### Phase 14 — AI Layer (Intelligence)
**Objective:** optional AI assistant behind `/api/ai`: commands, morning brief, evening review, insights — with strict, code-enforced data hygiene.
**Files/modules:** `app/(app)/api/ai/route.ts`, `lib/ai/*` (provider adapter, **typed context packs**, prompts, budgets, limits) guarded by `server-only`, `components/ai/*`, settings AI toggles enforcement.
**Dependencies:** Phase 13; **D-8 (provider) must be answered**; all core data working (§129 rule 10).
**Implementation tasks:**
1. Provider-agnostic adapter + server-only key handling + per-day usage limit + kill switch (`settings.ai_enabled`). **Computed (non-AI) morning brief already ships from Phase 6 — AI enhances, never gates.**
2. **Typed context packs:** one typed builder per command selecting only needed slices (goals, today's tasks, finance summary, leads due). **Hard token budget** per request; oversize → truncate with notice. **Relationship tables are not queryable from `lib/ai` unless `settings.ai_relationship_access === true` — enforced in code, verified by unit test.**
3. §36 commands as structured prompts returning rendered cards.
4. AI Morning Brief (§37) + AI Evening Review inside `closeDay` (§38).
5. Freelance AI insights (§23) on `/freelance` — rule-based first, LLM-optional.
6. Sanitization: strip secrets/PII; usage logging (command/tokens/cost — never content).
**Acceptance criteria:** AI disabled → everything works (computed briefs); enabled → grounded answers citing real numbers; relationship data never leaves without opt-in (unit-tested); rate limit + token budget enforced.
**Tests:** unit: context pack selection, relationship gate, token budget, sanitization; E2E: toggle off/on, mock-provider command round-trip.
**Definition of done:** §36/§37/§38/§98/§120/§121 covered.

---

### Phase 15 — Notifications & Automations
**Objective:** in-app notification center + scheduled generation hooks.
**Files/modules:** migration `0008_notifications.sql`, notifications DAL/actions, `components/layout/notifications.tsx`, `app/(app)/api/cron/[job]/route.ts` (CRON_SECRET-protected) + Vercel Cron config.
**Dependencies:** Phase 12 (review cadence), Phase 9 (marriage payment deadlines).
**Implementation tasks:**
1. Notification center (bell + list, read/unread) with §39 types only; quiet hours from settings.
2. Generators via cron: deadline approaching (tasks/projects/marriage payments), follow-up due (leads `next_follow_up_at`), weekly review Friday, daily start/shutdown nudges.
3. Cron route rejects missing/invalid `CRON_SECRET`.
**Acceptance criteria:** cron creates correct notifications against test data; quiet hours suppress; unauthorized cron calls rejected.
**Tests:** unit: generator conditions; E2E: notification render/read; cron auth test; RLS regression re-run.
**Definition of done:** §39/§48 covered.

---

### Phase 16 — Export, Backup, Global Search, Shortcuts
**Objective:** data ownership + power-user UX.
**Files/modules:** `/api/export` route, settings export/delete UI, global search (command palette), keyboard shortcuts (§60 resolved mapping C-2).
**Dependencies:** all data modules.
**Implementation tasks:**
1. Export: full JSON, finance CSV, notes Markdown — streamed downloads with `Content-Disposition`, auth-checked, usage logged (timestamp only).
2. **Delete-all-data flow: password re-entry + typed confirmation chain** — §83/§46.
3. Backup status card in settings (Supabase backup info + last manual export date).
4. Global search across tasks/projects/clients/notes/transactions/opportunities (§61) in Ctrl+K palette.
5. Keyboard shortcuts: T/M/L/N/B/R + palette; non-conflicting; documented in UI.
**Acceptance criteria:** exports valid (JSON parses, CSV opens, MD renders); delete requires re-auth and wipes RLS-scoped rows; search finds across entities; shortcuts work from any page.
**Tests:** E2E: export download, delete-all re-auth gate, search results, shortcut opens correct dialog.
**Definition of done:** §60/§61/§62/§63 covered.

---

### Phase 17 — Mobile, PWA, Offline Drafts, Accessibility (Polish)
**Objective:** phone-first quick capture + installability + a11y pass.
**Files/modules:** PWA manifest + service worker (approach chosen at phase start), offline draft storage (localStorage/IndexedDB for brain dump + quick task), a11y audit fixes.
**Dependencies:** Phase 16.
**Implementation tasks:**
1. Mobile UX pass on §64 critical screens (add task/lead/transaction, brain dump, today, relationship ideas).
2. PWA: manifest, icons, install prompt; offline shell for `/today`.
3. Offline drafts: brain dump + quick task captured offline → sync on reconnect (simple queue, last-write-wins with notify).
4. Accessibility: keyboard flows, focus management, contrast, screen-reader labels; respect reduced motion.
5. Performance pass: bundle audit, loading states, Lighthouse targets.
**Acceptance criteria:** §64 flows usable one-handed on a 360px viewport; brain dump offline → syncs; axe finds no critical violations.
**Tests:** Playwright mobile viewport specs; axe-core integration; manual device test.
**Definition of done:** §41/§64/§65 + §97 checklist across all pages.

---

### Phase 18 — Production Deployment & Hardening
**Objective:** live on Vercel + Supabase **prod project** with security review.
**Files/modules:** env config (prod), `next.config.ts` security headers, Vercel project, Supabase prod migrations + prod seed, backup schedule verification.
**Dependencies:** Phase 17; D-12 (Vercel account).
**Implementation tasks:**
1. Run migrations on prod via `db push`/dashboard; seed prod owner (explicit `--prod` flag per §8.9).
2. Deploy to Vercel; verify proxy guard, cookies (Secure), server actions against prod DB.
3. Security headers, rate limiting on login + AI + export routes, verify no service-role key in any client bundle, log hygiene check (§43).
4. Backup: enable Supabase scheduled backups/PITR per plan tier; document restore procedure; run one restore drill.
5. Final acceptance: §101/§102/§103 + §134 design test walked through manually.
**Acceptance criteria:** full daily/weekly/monthly acceptance tests pass on production URL; security checklist §43 fully green; backup restore drill succeeds.
**Tests:** E2E suite against preview env; manual security checklist.
**Definition of done:** system in daily use by the owner; §135.

---

## 18. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Scope explosion (spec is ~135 sections) | High | Strict phase gates; MVP checkpoint sign-off; §128/§130 as rejection criteria for anything extra |
| Next.js 16 breaking changes vs training data | High | Mandatory: read `node_modules/next/dist/docs/` per feature; `proxy.ts`, async APIs, `revalidatePath`/`refresh()` model already accounted for |
| Over-engineering the system instead of using it | High | §130 rule baked into DoD; revenue loop ships early so real usage starts early |
| Supabase RLS misconfiguration | High | Force RLS, single policy pattern, **standing RLS regression test at every migration phase** |
| Accidental prod seed/wipe | High | `SEED_CONFIRM` gate + `--prod` flag + dev-by-default scripts (§8.9) |
| Dashboard becomes a 30-chart monster | Medium | Dashboard v1 frozen at 5 cards; §126 five-question test gates any dashboard change |
| AI cost/privacy | Medium | Provider-agnostic, hard token budget, usage limits, opt-in, code-enforced relationship gate, no sensitive logs |
| Recurring tasks complexity creep | Medium | Simple grammar MVP (D-6), idempotent materialization; RRULE only if actually needed |
| Kanban DnD library churn | Low | Stage-`<select>` fallback first; @dnd-kit only if drag judged necessary in Phase 4 |
| shadcn CLI vs Tailwind v4 friction | Low | Verify in F2; fallback to hand-rolled primitives |

---

## 19. What I Need From You to Start

1. Confirmation that the revised plan matches your intent (the architecture review changes are applied).
2. The two Supabase Cloud projects (dev + prod) created, or permission to proceed with dev-only first and add prod at Phase 18.
3. Answers to remaining open decisions **D-4** (UI language) and **D-8** (AI provider — can wait until Phase 14). All others default as recommended.

*Nothing will be installed or coded until you give the go-ahead.*
