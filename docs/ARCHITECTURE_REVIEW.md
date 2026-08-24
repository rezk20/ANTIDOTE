# Architecture Review

> **Scope:** Senior-level pre-implementation review of `docs/LIFE_OS_MASTER_PROMPT.md` and `docs/IMPLEMENTATION_PLAN.md`, validated against the installed project (Next.js 16.2.3, React 19.2.4, Tailwind v4, TS strict) and the local framework documentation in `node_modules/next/dist/docs/`.
> **Date:** 2026-08-24
> **Status of plan under review:** `IMPLEMENTATION_PLAN.md` is **NOT modified** by this review.
> **Environment probes performed:** Node v22.19.0, npm 10.9.3, git 2.51.0 available; **Docker NOT installed**; project directory is **not a git repository**.

---

## Executive Summary

The implementation plan is architecturally sound in its core choices: Next.js 16 App Router with Server Components, Supabase Auth + Postgres with RLS, a DAL with `verifySession()`, Zod validation, pure domain-logic modules, and a phased roadmap with an explicit MVP gate. All Next.js-16-sensitive assumptions were verified against the bundled local docs and hold up (proxy.ts convention, async request APIs, Server Actions security model, Turbopack default).

However, the review found **3 blockers** (environment/tooling facts that break stated plan steps), **over-modeling of the MVP database** (18 tables where 11 are truly required), a **caching strategy that doesn't match the default Next 16 rendering model**, a **dashboard that ships too many cards too early**, a **revenue loop that is scheduled too late and modeled too thinly** for the product's primary goal, and **quick capture that arrives too late** for the product's anti-chaos mission.

None of these require rethinking the architecture. They require re-sequencing phases, shrinking the first migration, and correcting two technical mechanisms.

**Verdict: APPROVED WITH CHANGES** (see Final Verdict).

---

## Blockers

Issues that MUST be resolved before coding.

### B-1. Docker is not installed — local Supabase CLI path is dead

- **Current situation:** Plan Phase 0 and Open Decision D-1/D-13 propose "local Supabase CLI for migrations & tests" as the fallback/default dev database path.
- **Problem:** The Supabase CLI runs a local Postgres + auth stack **via Docker**. This machine has no Docker (`docker --version` → not found). Following the plan as written, Phase 0 blocks on tooling that cannot run.
- **Recommendation:** Default to a **cloud Supabase project** with **two projects: `dev` and `prod`** (both free-tier is fine). Migrations applied with `supabase db push` (works without Docker for cloud targets) or plain SQL executed through the Supabase dashboard/SQL editor. RLS tests run against the dev project. Revisit local Supabase only if Docker is installed later.
- **Why:** Removes the only hard tooling dependency; keeps migrations as versioned SQL files either way.
- **Impact:** Phase 0 task list changes (no `supabase init` local stack); D-1/D-13 resolve to "cloud, two projects". Requires the user to create/authorize the Supabase projects before Phase 0.
- **Priority:** **Blocker.**

### B-2. Project is not a git repository — the mandated dev loop cannot run

- **Current situation:** The master prompt §100 mandates `Plan → Implement → Run → Test → Review → Fix → Commit → Next`, and the plan repeats this as a ground rule. Yet `D:\Life\Life_OS` is **not a git repository**.
- **Problem:** "Commit" is undefined; there is no rollback safety net for an 18-phase build.
- **Recommendation:** Make **`git init` + initial commit + `.gitignore` verification (`.env.local` excluded) the literal first task of Phase 0**, before any package install.
- **Why:** Every subsequent phase needs a clean rollback point; this is a 2-minute task that de-risks everything after it.
- **Impact:** Phase 0 task order.
- **Priority:** **Blocker.**

### B-3. Caching strategy does not match the default Next 16 rendering model

- **Current situation:** Plan §6.2/§11 prescribe `updateTag`/`revalidateTag` after every mutation ("updateTag/revalidatePath → UI refresh").
- **Problem:** Verified against local docs: with `cacheComponents` **off** (the plan's own choice), the app uses the *previous caching model* (`caching-without-cache-components.md`). In that model **`fetch` is not cached by default, and supabase-js queries are not `fetch` calls — Next.js never caches them**. There is no cached data for `updateTag`/`revalidateTag` to invalidate; `revalidateTag` additionally now *requires* a cacheLife profile argument (v16 breaking change), so using it gratuitously adds friction for zero benefit. The correct primitives for a dynamic, per-user RSC app are **`revalidatePath(path)` and `refresh()`** after mutations — both confirmed in local docs.
- **Recommendation:** Rewrite the mutation contract as: *Server Action → mutate via supabase-js → `revalidatePath` for affected routes (or `refresh()` for the current route) → return typed result*. Drop `updateTag`/`revalidateTag`/`cacheTag` from the plan entirely unless `cacheComponents` is later enabled. Keep React `cache()` for per-render request deduplication in the DAL (confirmed correct pattern in local docs).
- **Why:** Prevents building an invalidation machinery that invalidates nothing, and avoids a class of "why didn't my UI update" confusion during implementation.
- **Impact:** Edits to plan §6.2, §11, and every phase's action checklist (mechanical).
- **Priority:** **Blocker** (wrong mechanism baked into every phase otherwise).

---

## Important Changes

Changes strongly recommended before implementation.

### I-1. Reduce MVP database over-modeling — 11 tables, not 18 (evaluates proposal C)

- **Current situation:** Plan Phase 2 migration `0002_core.sql` creates 18 tables up front: goals, tasks, day_plans, week_plans, buckets, transactions, marriage_expenses, projects, clients, leads, notes, brain_dumps, reviews, decisions, opportunities, services, outreach_templates (+ profiles from Phase 0).
- **Problem:** Seven of these have **zero consuming UI before Phase 7+**, and four of them (`decisions`, `opportunities`, `services`, `outreach_templates`) have no MVP UI at all (Phase 10/13). Creating them early violates the plan's own §44 principle ("لا تنشئ 50 table إذا لم تكن ضرورية"), grows the RLS surface to police, and — most importantly — **freezes design decisions at the moment of least knowledge**. E.g., `services` and `outreach_templates` column sets are guesses until the revenue loop is actually used; `opportunities` overlaps heavily with `leads` and may merge.
- **Recommendation:** Split into three migrations aligned to consumption:
  - **`0002_mvp_core.sql` (Phase 2):** profiles (already 0001), goals, tasks, buckets, transactions, projects, clients, leads, notes, brain_dumps, reviews → **11 tables**.
  - **`0003_day_week_plans.sql` (Phase 5, with Today/Dashboard):** day_plans, week_plans — designed when the day-plan generator is actually being built.
  - **`0004_revenue_extras.sql` (Phase 7, with Freelance):** marriage_expenses (consumed by finance/marriage), services, outreach_templates — designed with real revenue-loop usage in hand.
  - **Deferred to their phases:** decisions + opportunities (Phase 13), life-layer tables (Phase 10/11 as already planned).
- **Why:** Tables are cheap to add later (additive migrations, no data backfill); they are expensive to redesign once seeded and referenced. This also shrinks the Phase 2 RLS test matrix.
- **Impact:** Plan §7 reorganized; Phase 2 scope shrinks ~40%; Phases 5/7 gain a small migration task each. No feature is lost.
- **Priority:** **High.**

### I-2. Make the Revenue Loop a first-class core workflow (evaluates proposal F) — justified, with scope control

- **Current situation:** The full pipeline (lead discovery → outreach → proposal → follow-up → call → negotiation → won → delivery → payment → review → referral) lands in Phase 7, *after* Today/Dashboard/Finance, and is modeled mostly as a kanban + metrics. The spec itself says income is Rule 1 (§3) and the user's context is zero current income with a 12-month marriage deadline.
- **Problem:** The product's primary mission is financial. Shipping the revenue engine after four feature phases means the owner spends the first weeks of real usage without the system's most valuable capability. Also, the current `leads` table models *state* but not *activity*: there is no first-class record of "sent proposal on X", "followed up on Y", "call on Z" — which is exactly what follow-up discipline and the §23 metrics (reply rate, days-to-close) need.
- **Recommendation:**
  1. **Re-sequence:** move the revenue engine up so it ships **immediately after Tasks** (new order: foundation → auth → core schema → shell/settings → tasks/goals → **revenue loop (leads/clients/projects)** → finance → today/dashboard → notes+capture → weekly review). Rationale: Today/Dashboard are *aggregators*; they are better built last-in-MVP because every card then has real data, and the §126 "Opportunity: next lead to follow up" card stops being a stub.
  2. **Add a `lead_events` table** (Phase with revenue loop): `id, user_id, lead_id FK cascade, event_type (discovered, outreach, proposal_sent, follow_up, call, negotiation, won, lost, delivered, invoiced, paid, review_requested, referral_received, note), occurred_at timestamptz, amount numeric null, note text`. This makes the workflow a **first-class activity log**, powers follow-up reminders, and makes reply/close rates honest (computed from events, not stage snapshots). Stage remains the current state; events are the history.
  3. **Keep scope controlled:** the *workflow* (capture lead → log touch → move stage → convert to client → link project → record payment) is core; the *analytics dashboards about the workflow* (funnel charts, AI insights) stay in Phase 13. This is the correct reading of "first-class workflow, not just analytics".
- **Why:** Aligns build order with the product's own priority rule; the activity log is the difference between a CRM that *records* and one that *drives* follow-up behavior — the latter is what the spec asks for (§4 "Follow-up", §107/§108 engines).
- **Impact:** Roadmap re-ordering (see Recommended Final Roadmap); one new small table; dashboard phase becomes simpler (no stubs).
- **Priority:** **High.**

### I-3. Introduce Quick Capture (Brain Dump) earlier (evaluates proposal E) — justified

- **Current situation:** Brain Dump is Phase 8, after Finance and the entire revenue engine.
- **Problem:** The spec's user profile is explicit: "التركيز يتشتت بسبب كثرة التفكير" and the system exists to get thoughts out of his head (§17). Quick capture is the *lowest-friction, highest-daily-value* feature in the whole product, and it is technically trivial (one table, one textarea, one action). Holding it until Phase 8 means the first usable version of the app can't do the one thing the user needs multiple times per day.
- **Recommendation:** Split Brain Dump into two deliveries:
  - **Capture-only (move to Phase 3, with the app shell):** `brain_dumps` table (part of core migration), dashboard/global quick-capture box, `createDump` action, inbox list page. No conversion flow yet.
  - **Conversion flow (stays with Notes phase):** convert → task/note/goal, archive, backlinks.
- **Why:** Capture without conversion still delivers 80% of the value (the thought is safe); conversion needs the task/note systems to exist.
- **Impact:** Phase 3 gains ~half a day of work; brain_dumps moves into the core migration (consistent with I-1); Phase 8 shrinks.
- **Priority:** **High.**

### I-4. First dashboard iteration must be radically focused (evaluates proposal D) — justified

- **Current situation:** Plan Phase 5 dashboard ships: greeting, mission sentence, Top 3, Money card, Work card (active project), Opportunity card, Relationship placeholder, Brain Dump input, morning "one thing" question.
- **Problem:** §40/§41 and §127 warn against exactly this accretion. The "Work (active project)" card duplicates what Tasks/Today already show; the Relationship card is a placeholder for months; each card is another DAL query on the most-visited page.
- **Recommendation:** Dashboard v1 = exactly five elements, matching the five daily questions (§126):
  1. **Top 3** (What do I do today?)
  2. **Money** — saved/target + required-this-month (Where am I from the marriage goal?)
  3. **Revenue Action** — today's single income-generating action (What could increase my income?)
  4. **Next Client Follow-up** — the lead with the nearest `next_follow_up_at` (What's waiting from clients?)
  5. **Brain Dump** quick input (capture)
  Plus: greeting + date + shutdown time. **Deferred:** Work/active-project card (Phase with projects polish, if ever), Relationship card (Phase 10 when real data exists), weekly-progress charts (Phase 13 analytics), morning one-thing question (stays on `/today`, not dashboard).
- **Why:** A dashboard that answers 5 questions in one glance beats one that answers 8 questions in three scrolls. Every deferred card has a home elsewhere.
- **Impact:** Phase 5 (dashboard part) scope shrinks; §126 mapping becomes explicit per card.
- **Priority:** **High.**

### I-5. Merge Auth + Profile + Core DB into one security/data foundation (evaluates proposal B) — justified, as re-sequencing not as one mega-phase

- **Current situation:** Plan runs Phase 1 (Auth) → Phase 2 (Core schema + RLS + seed) → Phase 3 (Shell + Settings) as three separate phases.
- **Problem:** Auth without data is untestable beyond "redirect works" (login lands where? on an empty shell). Core schema without auth cannot exercise RLS as `auth.uid()` meaningfully. Settings (Phase 3) is the first consumer of profiles, but profiles are created in Phase 0/1. The three phases are one logical unit — "a signed-in owner with a protected, row-secured database and a shell" — artificially split, creating two intermediate states nobody uses.
- **Recommendation:** Re-sequence into **two** phases:
  - **F1 — Security & Data Foundation:** git init, packages, Supabase wiring, migrations 0001+0002 (profiles + MVP core tables + RLS), seed, auth (login/logout), `proxy.ts` guard, `verifySession()` DAL, login E2E, **RLS second-user test**. Ends with: owner logs in, lands on a minimal authenticated home page that shows seeded data counts (proof the whole vertical slice works).
  - **F2 — App Shell & Settings:** sidebar/topbar/theme, settings CRUD, loading/empty/error patterns, placeholder pages.
- **Why:** RLS is the security cornerstone of the whole app; testing it in the same phase that creates both the auth identity and the rows is when it's cheapest to get right. Each resulting phase still produces a usable increment (F1: "I can log in and my data is isolated"; F2: "I can navigate and configure").
- **Impact:** Phases 0–2 of the plan collapse/re-split into F1/F2; total effort unchanged, integration risk reduced.
- **Priority:** **High.**

### I-6. Simplify Phase 0 (evaluates proposal A) — partially justified; subsumed by I-5

- **Current situation:** Phase 0 bundles git (missing), package installs, shadcn init, Supabase connection, migration 0001, seed skeleton, vitest+playwright setup, smoke tests.
- **Problem:** It's a grab-bag with two different risk profiles (tooling setup vs. DB foundation) and, per B-1/B-2, two invalid assumptions.
- **Recommendation:** Don't create more phases; instead fold Phase 0's tooling tasks into F1 as an explicit ordered sub-step list: (1) git init + commit, (2) install deps, (3) prettier/eslint/format scripts + vitest/playwright configs + smoke tests, (4) Supabase cloud wiring + env, (5) migrations + seed, (6) auth + guard. shadcn/ui init moves to F2 (it serves the shell, not the foundation). This keeps the phase count down while making the foundation steps reviewable checkpoints.
- **Why:** The risk in Phase 0 was never size — it was ordering and the Docker/git assumptions. Explicit sub-steps with gates fix that without phase proliferation.
- **Impact:** Plan §17 Phase 0 rewritten into F1 sub-steps.
- **Priority:** **Medium** (achieved by I-5's restructuring).

### I-7. Testing gaps: RLS harness, revenue loop, and money math need named coverage

- **Current situation:** Plan §14 lists unit/E2E/RLS-smoke, but the RLS test is a one-off "smoke", and no E2E exists for the revenue loop or for dashboard money correctness.
- **Problem:** (a) RLS is the single most security-critical layer; a one-time smoke in Phase 2 won't catch a future table added without policies. (b) The revenue loop is the product's spine; its lifecycle (create → events → stage moves → convert → payment) is the highest-value E2E in the system. (c) Financial numbers are the trust core — a wrong total on the dashboard is a product-fatal bug.
- **Recommendation:**
  1. **Standing RLS regression test** (script or E2E fixture): for every table, assert a second authenticated user reads 0 rows and writes fail. Run it in the phase gate of any phase that adds a migration.
  2. **Revenue-loop E2E** in the revenue phase: full lifecycle including a `lead_events` entry and conversion to client.
  3. **Finance E2E** asserting dashboard/finance-page totals against known fixture transactions (income − expenses = net; bucket balance math).
  4. Keep unit coverage for all `lib/logic` math (already planned) — add bucket-balance and required-savings edge cases (zero months remaining, negative net, mid-month start).
- **Why:** These are the flows where a silent bug costs real money or real privacy.
- **Impact:** 3 named test suites added to phase acceptance criteria.
- **Priority:** **High.**

---

## Nice to Have

Changes that can safely wait.

| # | Item | Current | Recommendation | Why it can wait | Priority |
|---|---|---|---|---|---|
| N-1 | `updated_at` trigger vs app-set | Plan uses DB trigger | Keep trigger (correct); no action | Already right | Low |
| N-2 | Notes full-text search | `ilike` MVP, tsvector later | Keep as planned; add GIN tsvector only when search feels slow | Data volume tiny for a year | Low |
| N-3 | Kanban library choice | "evaluate at Phase 7" | Decide at revenue phase: start with stage `<select>` fallback, add @dnd-kit only if drag feels necessary | Board is usable without DnD | Low |
| N-4 | `week_plans.allocation` jsonb | Planned | Consider dropping until Phase 13 allocation feature actually consumes it | Unused jsonb is harmless but noise | Low |
| N-5 | Recurring-task grammar | Simple `daily/weekly:x/monthly:n` | Keep; document the grammar in code before implementing the generator | Decision already made (D-6) | Low |
| N-6 | PWA approach | "evaluate at Phase 17" | Fine; likely manifest + minimal SW, no framework | Far future | Low |
| N-7 | `next/experimental/testing/server` for proxy unit tests | Not planned | Optionally add `unstable_doesProxyMatch` tests for the guard matcher | Experimental API; E2E covers it | Low |
| N-8 | Rate limiting mechanism | "simple counter" for login | Fine for single-user; if ever insufficient, Vercel KV/upstash later | Single user = tiny attack surface | Low |

---

## Stack Validation

Verified against `node_modules/next/dist/docs/` (Next 16.2.3) and the installed project:

| Assumption in plan | Verdict | Evidence |
|---|---|---|
| `proxy.ts` replaces `middleware.ts`, Node runtime, root-level file | ✅ Confirmed | `03-file-conventions/proxy.md`: middleware deprecated/renamed; runtime is Node.js and not configurable; matcher must be static constants |
| Proxy matcher excluding a path also skips Server Actions on that path; actions must self-verify auth | ✅ Confirmed — plan already complies | proxy.md "Good to know": Server Functions are POSTs to the route; "Always verify authentication and authorization inside each Server Function" |
| Async `cookies()/headers()/params/searchParams` | ✅ Confirmed | version-16.md: sync access fully removed in 16 |
| `revalidateTag` requires cacheLife profile; `updateTag` for read-your-writes | ✅ Confirmed, **but see B-3** — these apply to the Cache Components model; with default model they're the wrong tool | version-16.md + caching-without-cache-components.md |
| Default (non-cacheComponents) model: supabase-js queries uncached; `revalidatePath`/`refresh()` are the right refresh primitives; React `cache()` for render-pass dedupe | ✅ Confirmed | caching-without-cache-components.md §On-demand revalidation, §Deduplicating requests |
| Server Actions: `'use server'` files, FormData, `useActionState`, cookies settable in actions, `redirect()` after | ✅ Confirmed | getting-started/mutating-data.md |
| Auth pattern: form → server action → Zod → provider; DAL with memoized `verifySession`; DTOs; layouts don't re-render on nav so auth checks belong in DAL/pages not layouts | ✅ Confirmed | guides/authentication.md — plan matches this exactly |
| Turbopack default; `next lint` removed (ESLint CLI); flat ESLint config | ✅ Confirmed; project already scaffolded with flat config + `lint: eslint` script | version-16.md, installed `eslint.config.mjs` |
| Vitest + Playwright setup patterns | ✅ Confirmed | guides/testing/vitest.md, playwright.md |
| Node 20.9+ requirement | ✅ Environment has Node 22.19 | probe |
| Tailwind v4 via `@tailwindcss/postcss` | ✅ Installed | package.json |
| `cacheComponents` OFF initially | ✅ Right call for a per-user dynamic app; docs confirm the extra Suspense discipline it demands | caching.md |
| Supabase: `@supabase/ssr` cookie handling, RLS `auth.uid()`, service-role isolation, generated types | ✅ Standard, plan complies; **note:** generated types require `supabase gen types` (works without Docker against a cloud project) or manual typing — add to F1 tasks | supabase skill references |
| shadcn/ui + Radix + Next 16/Tailwind v4 | ⚠️ Plausible but unverified locally (not installed yet) — verify CLI compatibility during F2, fall back to hand-rolled primitives if the CLI fights Tailwind v4 config | — |

**Environment facts (new):** Node v22.19.0 ✅ · git 2.51.0 ✅ · **Docker absent ❌** · **not a git repo ❌** → drives B-1/B-2.

---

## Database Review

**Conventions (plan §7):** uuid PKs via `gen_random_uuid()`, `timestamptz`, `numeric(12,2)` money, text+check enums, `user_id` FK to `auth.users` with cascade, RLS enable+force, FK indexes. All consistent with the Supabase best-practices skill. The skill's preference for `bigint identity`/UUIDv7 is consciously traded against Supabase's `auth.uid()` uuid contract and the app's tiny data volume — **correct trade, keep it.**

**Over-modeling (see I-1):** 18 → 11 tables for MVP. Tables to delay: `day_plans`/`week_plans` (Phase with Today), `marriage_expenses`/`services`/`outreach_templates` (Phase with revenue/finance), `decisions`/`opportunities` (Phase 13), life-layer tables (already deferred).

**New table recommended (see I-2):** `lead_events` — activity log for the revenue loop.

**Relationship & constraint review:**
- `tasks` has four nullable FKs (goal, project, lead, + future). Fine, but **add `on delete set null`** on all of them (plan should state this explicitly) so deleting a project/goal never cascades away tasks.
- `leads.client_id` set-null on client delete; `transactions.project_id/lead_id` set-null; `buckets` delete should be **restricted** if transactions reference it (or set-null + warning) — plan should pick: recommend `on delete restrict` to prevent accidental money-history orphans.
- `brain_dumps.converted_id` intentionally FK-less (soft ref) — correct, document it.
- `reviews` unique `(user_id, review_type, period_start)` — correct; daily reviews from `closeDay` must compute `period_start` in the user's timezone to avoid duplicate-key races at midnight.
- `day_plans` unique `(user_id, plan_date)` — same timezone caution.
- `tasks.recurring_rule` + `scheduled_date`: recurring instances are materialized per-day (plan's approach) — ensure a unique guard or idempotent generator so re-running day-plan generation doesn't duplicate recurring tasks.

**Future migration risks identified:**
- `settings`/`meta`/`answers` jsonb columns: schemaless drift is the main long-term risk. Mitigation already in plan (Zod per jsonb column, strip unknown keys) — **keep, and add a `lib/schemas/migrations.md` convention: any jsonb shape change gets a Zod schema version bump note.**
- Money category as free text with app validation: fine; if reporting needs hard integrity later, a `categories` lookup table is an additive migration — no blocker.
- No partitioning needed (single user, small volume) — skill's partitioning rule correctly ignored.

**Indexes:** plan's index list is adequate for MVP. Add: `lead_events (user_id, lead_id, occurred_at)` and `transactions (user_id, bucket_id, occurred_on)` when those tables land.

---

## Security Review

| Area | Assessment |
|---|---|
| Authentication | ✅ Supabase Auth email+password; hashing by provider; login throttling planned. Add: confirm Supabase email-confirmation flow is disabled or handled for the single owner (else first login surprises). |
| Session | ✅ `@supabase/ssr` cookie management; HttpOnly/Secure/SameSite handled by library. |
| Route guard | ✅ `proxy.ts` optimistic check + DAL secure check — matches Next docs' two-tier model exactly. Note from local docs: matcher exclusions also skip Server Action coverage → plan's "every action re-verifies" rule is mandatory, not optional. |
| RLS | ✅ enable+force+single policy pattern. **Gap (I-7):** needs a standing regression test, not a one-off smoke. Also: `force row level security` matters because the app may connect as table owner in some contexts — keep it. |
| Service-role key | ✅ Confined to seed script. **Strengthen:** put `scripts/seed.ts` behind an explicit `CONFIRM=yes` env flag and assert `NODE_ENV !== 'production'` unless a `--prod` flag is passed; never import `lib/supabase/admin.ts` from anything under `app/` or `lib/dal` (add an ESLint boundary rule or a code-review checklist line). |
| Secrets | ✅ env-based; `.env.local` gitignored. Add to F1: verify `.gitignore` covers `.env*` except `.env.example` **before the first commit**. |
| Rate limiting | ⚠️ Login throttling planned (good). **Gap:** `/api/ai` (Phase 14) and `/api/export` need it too; export of the full dataset should be logged (timestamp only, no content). |
| Export/Delete | ⚠️ Planned for Phase 16. **Strengthen:** delete-all must be a server action with re-auth (password re-entry) + a typed confirmation; export route must stream (not buffer) and set `Content-Disposition`; both must be covered by E2E. |
| AI data boundaries | ✅ Opt-in, provider-agnostic, server-only key, relationship-data gate. **Strengthen (see AI Review):** enforce the relationship-data gate in the context-builder code path, not in prompt instructions. |
| Logging | ✅ "no sensitive data in logs" stated. Make it concrete: a `lib/utils/log.ts` wrapper that never serializes transaction amounts/note content/relationship fields — cheaper to enforce than developer discipline. |
| CSRF | ✅ Server Actions are POST-only with Next's action validation; Supabase requests carry the user JWT. No extra CSRF machinery needed — state this explicitly in the plan to close §43's "حسب architecture". |

---

## Phase Boundary Review

**Assessment of the original 19 phases:** granularity is mostly right (S–M sized), but four boundary problems exist:

1. **Phases 0/1/2 are one vertical slice split into three** → merge/re-split per I-5 into F1 (security+data foundation) and F2 (shell+settings). Each still ends with a usable, testable increment.
2. **Revenue loop too late (Phase 7)** → move up per I-2. The dependency chain actually allows it: leads/clients/projects need only tasks (for linked tasks) and the shell. Finance does *not* need to precede projects — project money rollups can read transactions created in the finance phase; but leads→clients→projects is the user's daily bread and should come first.
3. **Dashboard built mid-sequence with stubs (Phase 5)** → move dashboard assembly to after its data sources exist (per I-2 re-sequence). `/today` can still ship earlier since it only needs tasks.
4. **Brain Dump too late (Phase 8)** → capture-only in F2 per I-3.

**Unnecessary dependencies removed by the re-sequence:** dashboard no longer depends on leads (it's built after); finance no longer blocks projects; notes phase no longer blocks capture.

**Every phase still produces a usable increment** in the recommended roadmap (below) — verified phase by phase.

**Phase sizes:** F1 is the largest phase; it is big but coherent (one vertical slice) and has explicit sub-step gates. Phase "Revenue Loop" is second-largest; if it grows during implementation, split kanban-DnD into a follow-up sub-phase (the board works with a stage select).

---

## MVP Review

MVP definition (plan §4) is correct against §66/§67. With the changes above, the MVP surface becomes:

**In:** Auth · Settings · Tasks+Goals · **Revenue Loop (leads/events/clients/projects)** · Finance (transactions/buckets/marriage math) · Today · Dashboard (5 cards) · Notes · Brain Dump (capture+convert) · Weekly Review · Seed.

**MVP success re-check against §67's 7 conditions** with new ordering: (1) see today ✅ Today phase; (2) know financial goal ✅ Finance; (3) know opportunities ✅ Revenue loop (now earlier, real not stub); (4) log income/expense ✅ Finance; (5) know what's pending ✅ Today+Dashboard; (6) brain dump ✅ F2 (capture) — *now satisfied weeks earlier*; (7) review week ✅ Reviews phase.

**Still correctly excluded from MVP:** AI, forecast, marriage mission page, relationship, habits/routines, calendar, analytics, notifications, PWA, Discord/product/decision/opportunity UIs.

**One addition to MVP acceptance:** the §101 timing test ("add lead < 2 min") should be run against the revenue loop phase, not only at the final checkpoint.

---

## Revenue Engine Review

**Workflow completeness check** (required chain vs. plan coverage):

| Step | Modeled? | UI phase (original → recommended) | Notes |
|---|---|---|---|
| Find (discovery) | ✅ lead create + source | 7 → **Revenue phase** | |
| Outreach | ⚠️ stage only | 7 → Revenue | **Needs `lead_events`** to log touches |
| Proposal | ✅ proposal fields on lead | 7 → Revenue | amount + sent_at present |
| Follow-up | ✅ next_follow_up_at | 7 → Revenue | Powers dashboard card + reminders |
| Call | ⚠️ stage only | 7 → Revenue | Event log covers it |
| Negotiation | ⚠️ stage only | 7 → Revenue | Event log |
| Close (Won/Lost) | ✅ + lost_reason | 7 → Revenue | |
| Deliver | ✅ stages in_progress/delivered + project link | 7 → Revenue | Project page carries delivery |
| Invoice/Payment | ⚠️ stage `paid` only | 7 → Revenue | **Recommend:** payment = transaction (finance) linked via `lead_id` + `invoiced`/`paid` events — connects revenue to money engine cleanly |
| Review/Testimonial | ✅ client testimonial_status | 7 → Revenue | |
| Referral | ✅ referral_status | 7 → Revenue | |

**Verdict:** the chain is *modelable* today but was scheduled and framed as secondary UI. With I-2 (re-sequence + `lead_events` + payment↔transaction link) it becomes the product's first-class spine. Metrics/funnel charts remain Phase 13 — correct separation: **workflow now, analytics about the workflow later.**

**Guardrails from spec to honor in the revenue phase:** Build Work vs Revenue Work distinction (§4 core rule) must be visible at task-creation time (task_type already supports it) — surface it in the Today plan, not just analytics.

---

## UX Review

- **Dashboard (I-4):** cut to 5 cards + greeting/shutdown. Every cut card has a home: active project → Projects page; relationship → Phase 10 card when real; charts → Analytics.
- **§97 checklist (loading/empty/error/mobile/keyboard/validation/undo/persist/security):** plan mandates it per feature — keep as a PR-level checkbox, not just phase-level.
- **Tone rules (§70/§71):** copy guidelines should live in one constants file (`lib/constants/copy.ts`) so "الخطة لم تكن مناسبة للواقع" style responses are consistent — add to F2.
- **Quick actions (§60 conflict resolved as T/M/L/N/B/R + Cmd-K):** fine; implement the command palette only once quick-add targets exist (F2 for capture, revenue phase for lead).
- **Mobile:** capture box, today, and add-transaction/add-lead are the mobile-critical surfaces; test them at 360px in the phase they ship, don't defer all mobile testing to Phase 17.
- **Dark/light from day one (F2):** correct — retrofitting theme is expensive.

---

## Testing Review

**Coverage matrix after I-7 additions:**

| Layer | Planned | Gap found | Fix |
|---|---|---|---|
| Unit (Vitest) | logic math + schemas | bucket balance, recurring-instance idempotency, timezone day boundaries | add cases (cheap) |
| Component | forms via Testing Library | none critical | keep |
| RLS | one-off smoke in Phase 2 | **no regression for future migrations** | standing second-user test, run at every migration phase |
| E2E auth | guard/login/logout | none | keep |
| E2E revenue | ❌ missing | **highest-value flow untested** | full lifecycle spec in revenue phase |
| E2E finance | partial | dashboard totals vs fixtures | add assertion spec |
| E2E reviews | planned | ok | keep |
| Proxy unit | not planned | optional | `unstable_doesProxyMatch` (nice-to-have) |

**Missing critical business flows identified (now covered):** revenue lifecycle, money totals correctness, RLS regression, delete-all/export safety (Phase 16 E2E).

**Test infra note:** E2E runs against the **dev Supabase project** (B-1 resolution); add a `test:e2e:seed` script that resets dev data deterministically so specs are repeatable.

---

## Performance Review

Anticipated issues, all manageable at this scale — listed so they're designed around, not discovered:

1. **Dashboard N+1:** 5 cards = ~6–8 queries. Fine at this scale, but keep them as **one DAL function per card issued in parallel (`Promise.all`) inside a single server component**, not sequential awaits. With the non-cacheComponents model every visit re-queries Supabase — acceptable (single user), just don't serialize.
2. **`verifySession()` cost:** calls Supabase `auth.getUser()` (network) — memoize per render with React `cache()` (planned ✅). Don't call it in loops.
3. **Proxy runs on every route:** keep it cookie-only, zero DB calls (planned ✅).
4. **Kanban board:** lead counts will stay small (<200/yr); no pagination needed, but index `(user_id, stage)` is already planned.
5. **Transactions aggregation:** monthly rollups over a few hundred rows — trivial. If ever slow, move to a Postgres view/RPC; don't pre-build.
6. **Notes search `ilike`:** fine for a year of notes.
7. **Bundle:** watch shadcn/Radix accumulation; recharts only in analytics phase (planned ✅); date-fns tree-shakes well.
8. **No `cacheComponents`** means no static shell — first paint is a full server render per visit. For a private tool this is the right trade; revisit only if it ever feels slow.

---

## AI Review

- **Optionality:** ✅ plan keeps AI last (Phase 14), behind a settings toggle, with **computed (non-AI) morning brief shipping regardless** — this is the correct pattern: core functionality must never require the LLM. Keep it explicit as an acceptance criterion.
- **Context isolation:** ✅ context-builder selects slices per command. **Strengthen:** implement selection as code (typed context packs per command) with a unit test asserting what each pack contains — never rely on prompt-level instructions for privacy.
- **Relationship-data privacy (§83):** ✅ opt-in planned. **Strengthen:** the gate must be in the context-builder (relationship tables simply not queryable unless `settings.ai_relationship_access === true`), verified by unit test.
- **Secrets:** ✅ server-only route handler; add the same `server-only` package guard to `lib/ai/*`.
- **Limits:** per-day cap + kill switch planned ✅; also cap prompt size in the context builder (hard token budget) to bound cost.
- **Logging:** log usage metadata (command, tokens, cost) — never content (aligns with security logging rule).

---

## Recommended Final Roadmap

Revised sequence incorporating B-1..B-3, I-1..I-7 (phase names map to plan phases; unchanged phases omitted for brevity):

| # | Phase | Key content | Increment |
|---|---|---|---|
| **F1** | **Security & Data Foundation** (replaces Phases 0–2) | git init → deps → lint/format/test configs + smoke tests → Supabase cloud (dev+prod) wiring → migrations 0001+0002 (profiles + 11 MVP tables + RLS) → seed → auth login/logout → `proxy.ts` guard → `verifySession` DAL → RLS regression test | Owner logs in; data isolated; vertical slice proven |
| **F2** | **App Shell, Settings & Quick Capture** (Phase 3 + capture-only) | sidebar/topbar/theme, settings CRUD, loading/empty/error patterns, placeholders, **brain-dump capture box + inbox** | Navigable, configurable, capture works daily |
| **P3** | **Tasks & Goals** (Phase 4) | unchanged | Task engine live |
| **P4** | **Revenue Loop** (Phase 7 moved up + `lead_events`) | leads CRUD + events + stages, clients, projects, convert-to-client, payment↔transaction link, follow-up surfacing, revenue-loop E2E | The money spine works |
| **P5** | **Finance Engine** (Phase 6) | transactions, buckets, marriage math, monthly targets, marriage_expenses migration | Money tracked & measured |
| **P6** | **Today + Focused Dashboard** (Phase 5, reduced per I-4) | day_plans/week_plans migration, day-plan generator, `/today`, dashboard v1 = Top 3 / Money / Revenue Action / Next Follow-up / Brain Dump | The daily command center |
| **P7** | **Notes + Capture Conversion** (Phase 8 minus capture) | notes CRUD/search/pin/archive, dump→task/note/goal conversion | Knowledge layer |
| **P8** | **Weekly Review → MVP CHECKPOINT** (Phase 9) | reviews framework + weekly flow; §67/§101/§102 gate | **MVP done, sign-off** |
| P9+ | Phases 10–18 of the original plan | unchanged order: Marriage+Relationship → Habits/Routines/Sleep/Time → Calendar → Analytics+Engines UI → AI → Notifications/Automations → Export/Search/Shortcuts → Mobile/PWA/A11y → Production hardening | as planned |

Net effect: same architecture, **the revenue loop and quick capture ship weeks earlier, the dashboard ships smaller and later (with real data), the first migration is 7 tables smaller, and the foundation is one tested vertical slice instead of three loose phases.**

---

## Final Verdict

# APPROVED WITH CHANGES

The plan's architecture (Next 16 RSC + Server Actions, Supabase Auth + RLS, DAL, Zod, pure logic modules, phased roadmap with MVP gate) is validated and should stand. Implementation may begin **after** the following are applied to `IMPLEMENTATION_PLAN.md` in a revision pass:

1. **B-1** — Drop local-Supabase/Docker path; cloud dev+prod projects.
2. **B-2** — `git init` as first task of the foundation phase.
3. **B-3** — Replace `updateTag`/`revalidateTag` strategy with `revalidatePath`/`refresh()` (default caching model).
4. **I-1** — Shrink first migration to 11 tables; defer the rest to consuming phases.
5. **I-2** — Re-sequence revenue loop before finance/dashboard; add `lead_events`; link payments to transactions.
6. **I-3** — Quick-capture (capture-only) in the shell phase.
7. **I-4** — Dashboard v1 = 5 cards only.
8. **I-5/I-6** — Collapse Phases 0–2 into F1 (foundation vertical slice) + F2 (shell/settings/capture).
9. **I-7** — Standing RLS regression test, revenue-loop E2E, finance-totals E2E.

Open decisions D-1/D-13 resolve via B-1 (cloud, two projects). D-2/D-3/D-4/D-11 recommendations stand as proposed. D-8 (AI provider) remains deferred to the AI phase.

**Awaiting instruction:** say the word and I will apply these nine changes to `IMPLEMENTATION_PLAN.md` (no code or installs until then).
