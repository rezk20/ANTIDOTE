# Plan Revision Report

> **Date:** 2026-08-24
> **Revises:** `docs/IMPLEMENTATION_PLAN.md` (v1 → v2)
> **Source of changes:** Final verdict and findings of `docs/ARCHITECTURE_REVIEW.md` (APPROVED WITH CHANGES).
> **Scope:** Planning documents only. No application code written, no packages installed, no features built.

---

## Changes Applied

### The 9 verdict changes

1. **Local Supabase/Docker path removed → Supabase Cloud dev+prod.**
   Applied to: header environment facts, §6.1 stack table, §6.3 env vars, §15 dependencies (Supabase CLI used for `db push`/type-gen against cloud only), Phase F1 tasks, Phase 18, Risks, §19. Old open decisions D-1 and D-13 resolved and moved to the "resolved by review" table (R-entries).

2. **Git initialization is the first foundation task.**
   Applied to: Phase F1 task 1 is now `git init` + `.gitignore` verification (`.env.local`/`.env*` excluded except `.env.example`) + initial commit, before any package install. Also added to §8 security checklist and F1 acceptance criteria ("no secrets in repo").

3. **Caching/revalidation strategy replaced.**
   Applied to: §6.2 now states explicitly — `cacheComponents` OFF; **`revalidatePath()`/`refresh()` after every mutation; `updateTag`/`revalidateTag`/`cacheTag`/`use cache` are not used anywhere**; React `cache()` kept for render-pass deduplication in the DAL; parallel reads via `Promise.all`. §11 action contract updated ("no tag-based revalidation anywhere"). Phase 6 dashboard task specifies `Promise.all` reads.

4. **Initial migration reduced to required MVP tables; non-MVP tables deferred to consuming phases.**
   Applied to: §7 fully restructured. Migration `0002_mvp_core.sql` (Phase F1) now creates exactly 11 tables: goals, tasks, buckets, transactions, projects, clients, leads, lead_events, notes, brain_dumps, reviews (+ profiles in 0001). Deferred: `day_plans`/`week_plans` → `0003` (Phase 6); `marriage_expenses`/`services`/`outreach_templates` → `0004` (Phase 4); `decisions`/`opportunities` → `0005` (Phase 13); life-layer tables → `0006`/`0007` (Phases 9/10); `notifications` → `0008` (Phase 15). Migration discipline rule added: no table exists before it has a consumer; every migration phase re-runs the RLS regression test.

5. **Revenue Loop moved earlier + `lead_events` + first-class workflow.**
   Applied to: new Phase 4 (immediately after Tasks, before Finance/Today/Dashboard). `lead_events` table added (§7.2) with event types covering the full chain: discovered → outreach → proposal_sent → follow_up → call → negotiation → won/lost → delivered → invoiced/paid → review_requested → referral_received. Every lead create/stage move logs an event; `recordLeadPayment` creates a linked transaction + `paid` event. FR-4 rewritten around the activity log; §10 route phases updated; Phase 13 analytics now compute funnel metrics **from events, not stage snapshots**. Full revenue-loop E2E added (Phase 4 tests, §14).

6. **Quick Capture introduced early (capture-only), conversion later.**
   Applied to: Phase F2 now includes the global Brain Dump capture box, `createDump` action, and `/brain-dump` inbox page. Conversion flow (dump → task/note/goal) stays in Phase 7. FR-11 rewritten ("capture is a day-one mechanism"); §67 condition 6 is now satisfied from F2 onward.

7. **Dashboard v1 reduced to 5 cards.**
   Applied to: Phase 6 dashboard scope frozen at **Top 3, Money, Revenue Action, Next Client Follow-up, Brain Dump** + greeting/date/shutdown time. Deferred elements documented with their homes: active-project card → Projects page; relationship card → Phase 9 (real data); weekly charts → Phase 13; morning one-thing question → `/today`. FR-19, §4 MVP definition, §10 routes, and acceptance criteria all updated ("dashboard has exactly the 5 cards", "no stubs").

8. **Phase 0–2 replaced by F1 + F2.**
   Applied to: Phase F1 — Security & Data Foundation is one complete vertical slice with ordered sub-steps: git → tooling/deps → test configs → Supabase cloud wiring → migrations 0001+0002 → seed → auth → proxy guard → DAL `verifySession()` → RLS regression test; ends with owner logged in on an authenticated proof page showing seeded counts. Phase F2 — App Shell, Settings & Quick Capture. All downstream phase numbers and dependencies renumbered consistently (see Final Phase Structure). No remaining references to the old Phase 0/1/2 structure.

9. **Testing strengthened.**
   Applied to §14 and phase tests:
   - **Standing RLS regression test** (`tests/security/`, `npm run test:rls`): for every table, a second authenticated user reads 0 rows and writes fail; runs in the gate of every phase that adds a migration (F1, 4, 6, 9, 10, 13, 15).
   - **Full Revenue Loop E2E** in Phase 4 (create → events → stages → convert → payment → review/referral).
   - **Finance totals E2E** in Phase 5 (dashboard/finance totals vs known fixtures: income − expenses = net; bucket balances).
   - **Bucket balance + savings edge-case unit tests** (zero months remaining, negative net savings, mid-month start) plus recurring-idempotency and timezone day-boundary unit tests.
   - **Deterministic dev E2E seed/reset:** `scripts/reset-dev.ts` wipes and re-seeds the dev Supabase project before E2E suites.

### Database relationship improvements (from review)

- `tasks.goal_id/project_id/lead_id` → **ON DELETE SET NULL**; stated explicitly that deleting a goal/project/lead **never cascade-deletes tasks** (Phase 3 acceptance criterion verifies this).
- `goals.parent_id`, `leads.client_id`, `projects.client_id`, `transactions.project_id/lead_id`, `lead_events.transaction_id`, `day_plans.*_task_id`, `time_entries.task_id/project_id` → ON DELETE SET NULL.
- `lead_events.lead_id` → ON DELETE CASCADE (events belong to the lead).
- `transactions.bucket_id` → **ON DELETE RESTRICT**; bucket deletion blocked while referenced; `deactivateBucket` action added instead.
- `lead_events` indexes: `(user_id, lead_id, occurred_at)` and `(user_id, event_type, occurred_at)`.
- **Recurring task generation idempotent:** `tasks.recurring_source_id` + unique partial index on `(user_id, recurring_source_id, scheduled_date)`; generator uses "insert if not exists" semantics; Phase 6 acceptance criterion: re-running generation adds no duplicates.
- **Timezone boundaries:** global timezone rule added to §7 — all day-level keys (`plan_date`, `log_date`, `week_start`, `period_start`, uniqueness constraints) computed in the user's timezone; `reviews` and `day_plans`/`week_plans`/`habit_logs` uniqueness noted as tz-derived; unit tests for tz day boundaries added.
- JSONB governance formalized (§7.8): Zod schema per jsonb column, `.partial()` updates, unknown keys stripped, version-bump convention in `lib/schemas/README.md`.
- `brain_dumps.converted_id` documented as intentionally FK-less soft reference.

### Security hardening findings (from review)

- **Seed script protection:** `SEED_CONFIRM=yes` required; refuses to target the prod project without explicit `--prod` flag; dev-by-default (§7.9, §8.9, F1 acceptance criteria, Risks table).
- **Service-role key confinement:** no `lib/supabase/admin.ts` exists; the admin client lives inside `scripts/` only; ESLint no-restricted-imports boundary rule + code-review checklist line block `scripts/**` imports from `app/**`/`lib/**` (§8.9, folder structure updated).
- **.gitignore verified before first commit** (F1 task 1, §8).
- **Export/delete hardening:** delete-all requires **password re-entry + typed confirmation**; export route streams with `Content-Disposition` and logs usage (timestamp only, no content) (§11, Phase 16 tasks/acceptance, NFR-2/NFR-9).
- **Relationship-data privacy enforced in code:** `settings.ai_relationship_access` gate lives in the AI context builder — relationship tables are not queryable from `lib/ai` unless enabled; verified by unit test (§8.3/FR-9/FR-17, Phase 9 task 4, Phase 14 task 2 + tests).
- **AI context builder typed and unit-tested:** one typed context pack per command; unit tests assert pack contents, the relationship gate, and sanitization (Phase 14, §14 unit row).
- **Hard AI prompt/context budget:** token budget per request with truncate-with-notice behavior (Phase 14 task 2, FR-17, acceptance criteria).
- Additional hardening carried in: login attempt throttling (kept), `CRON_SECRET` for `/api/cron/*` (Phase 15), rate limiting listed for login + AI + export (NFR-2), email-confirmation handling for the owner account (F1 task 8), redacting logger `lib/utils/log.ts` (folder structure).

### Bookkeeping changes

- Roadmap fully renumbered; all cross-references (§10 routes, §11 actions, §14 tests, §15 deps, §17 phases, §18 risks) updated to the new numbering.
- Open decisions D-1, D-2, D-3, D-11, D-13 closed (moved to "resolved by review" table alongside new R-1..R-6 resolution records).
- Risks table updated (RLS regression, prod-seed protection, dashboard freeze, AI budget, shadcn/Tailwind-v4 verification).
- §19 "What I Need From You" reduced to: plan confirmation, Supabase projects, D-4/D-8 answers.

---

## Changes Not Applied

**None.** All 9 verdict changes, all database relationship improvements, and all security hardening findings from `docs/ARCHITECTURE_REVIEW.md` were applied. The review's "Nice to Have" items (N-1..N-8) were intentionally left as documented deferrals by the review itself and remain deferred (e.g., kanban DnD decision at Phase 4, tsvector search later, proxy unit tests optional).

One clarification rather than a change: the review's recommended roadmap listed "Notifications/Automations" and did not explicitly restate the monthly/quarterly review flows that the v1 plan bundled with them. To avoid losing scope, these were kept as an explicit **Phase 12 (Monthly/Quarterly Reviews & Finance Alerts)** — this preserves v1 plan content the review did not ask to remove.

---

## Final Phase Structure

| # | Phase | Deliverable (usable increment) |
|---|---|---|
| **F1** | Security & Data Foundation | git → tooling → Supabase cloud (dev+prod) → migrations 0001+0002 (profiles + 11 MVP tables + RLS) → seed → auth → proxy guard → DAL → RLS regression test. Owner logs in; data isolated; vertical slice proven |
| **F2** | App Shell, Settings & Quick Capture | Sidebar/topbar/theme, settings CRUD, UX patterns, placeholders, **Brain Dump capture-only** |
| **3** | Tasks & Goals | Task engine + goal hierarchy + priority ordering + stale-task prompts |
| **4** | Revenue Loop (first-class) | Leads + lead_events + clients + projects; full workflow discovery→…→referral; payment↔transaction link; migration 0004 |
| **5** | Finance Engine | Transactions, buckets, categories, marriage-goal math, monthly targets |
| **6** | Today + Focused Dashboard | Migration 0003; day-plan generator; `/today`; dashboard v1 = 5 cards |
| **7** | Notes + Capture Conversion | Notes CRUD/search/pin/archive; dump → task/note/goal |
| **8** | Weekly Review → **✅ MVP CHECKPOINT** | Reviews framework + weekly flow; §67/§101/§102 gate; user sign-off |
| **9** | Marriage Mission & Relationship | `/marriage`, `/relationship` (Us), migration 0006, dashboard relationship card |
| **10** | Habits, Routines, Sleep/Energy, Time Tracking | Life layer complete; migration 0007; deep-work timer |
| **11** | Calendar & Schedule | Day/Week/Month/Year views; collision handling; cash-flow strip |
| **12** | Monthly/Quarterly Reviews & Finance Alerts | Review cadence complete; §49 alert logic |
| **13** | Analytics, Decisions, Opportunities & Engines UI | Migration 0005; `/analytics` + forecast; decisions/opportunities/discord-bots/product lab |
| **14** | AI Layer | Optional assistant; typed context packs; budgets; code-enforced privacy gates |
| **15** | Notifications & Automations | Migration 0008; in-app center; CRON_SECRET-protected jobs |
| **16** | Export, Backup, Global Search, Shortcuts | Data ownership + power UX; delete-all re-auth |
| **17** | Mobile, PWA, Offline Drafts, Accessibility | Phone-first capture; installability; a11y pass |
| **18** | Production Deployment & Hardening | Vercel + Supabase prod; security review; backup drill; final acceptance |

---

## Final MVP Definition

The MVP is complete at the **Phase 8 checkpoint**. It contains exactly:

1. **Auth** — single owner account, login/logout, proxy guard, DAL session verification, RLS-isolated data.
2. **App shell + Settings (core)** — Command Center sidebar, dark/light theme, personal/goals/work settings.
3. **Quick Capture** — global Brain Dump box + inbox (from F2), with conversion to task/note/goal (Phase 7).
4. **Tasks + Goals** — full task model (§14/§15), hierarchy (§31), priority ordering with override, stale-task prompts, safe deletes.
5. **Revenue Loop (first-class)** — leads with activity log (`lead_events`), kanban board, clients, projects, convert-to-client, payment→transaction linking, daily sales targets, follow-up queue.
6. **Finance** — transactions, buckets (computed balances), money categories, marriage-goal calculations, monthly Min/Comfort/Stretch targets, marriage expenses.
7. **Today** — day-plan generation with capacity guard + Friday protection, Top 3, action slots, shutdown flow → tomorrow's starting point.
8. **Dashboard v1** — exactly 5 cards: Top 3 · Money · Revenue Action · Next Client Follow-up · Brain Dump (+ greeting/date/shutdown), answering §126's five questions with real data.
9. **Notes** — markdown, folders, tags, search, pin/archive.
10. **Weekly Review** — 13 questions prefilled with real metrics, six progress dimensions, history.
11. **Seed data** — owner snapshot (§132) + goals/projects/recurring tasks/buckets (§133).

**Not in MVP:** AI layer, forecast/advanced analytics, marriage mission page, relationship engine, habits/routines/sleep, calendar, monthly/quarterly reviews, notifications, decisions/opportunities/engines UI, export/search/shortcuts, PWA/offline, production deployment.

**Gate:** §67 conditions 1–7 + §101/§102 acceptance tests + all automated gates green + user sign-off.

---

## Remaining Open Decisions

| # | Decision | Default if unanswered |
|---|---|---|
| D-4 | UI language: English vs Arabic vs bilingual | English UI; copy centralized for later Arabic |
| D-5 | Currency handling: single currency vs per-transaction FX | `currency` field stored; totals in profile currency; EGP-equivalent for USD income |
| D-6 | Recurring tasks grammar | Simple `daily` / `weekly:x` / `monthly:n`, idempotent materialization |
| D-7 | Partner/fiancée access | Single-user now; schema multi-user-safe for later |
| D-8 | AI provider + budget (needed at Phase 14) | Decide at Phase 14; provider-agnostic until then |
| D-9 | Notifications channel | In-app center only (Phase 15) |
| D-10 | Forecast formula multipliers | Conservative 0.6× / Base 1.0× / Aggressive 1.5× of avg last-3-months net savings |
| D-12 | Vercel account / custom domain | Vercel hobby + `*.vercel.app` |

Also needed before Phase F1: the **dev Supabase project** must exist (prod can wait until Phase 18).

---

## Ready for Implementation?

**READY**
