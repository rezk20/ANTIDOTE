# ANTIDOTE — LIFE OS

> A personal command center for financial, career, and life execution.
> Not a todo app — a system that translates a yearly transformation mission into a daily executable loop.

```
Vision → Annual Goals → Quarterly Targets → Monthly Objectives → Weekly Plan
→ Daily Actions → Tracking → Review → Adjustment
```

**ANTIDOTE** is a private, single-user web application built around one north-star question: _did the system help the owner make better actions today?_ The daily dashboard is designed to answer five questions every morning:

1. What do I do today?
2. What could increase my income?
3. Where am I from the marriage goal?
4. What's waiting from clients?
5. When do I stop today?

---

## ✨ Features

| Module                      | Route                        | Purpose                                                                            |
| --------------------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| **Dashboard**               | `/dashboard`                 | "Good Morning" screen — Top 3, Money, Revenue Action, Client Follow-up, Brain Dump |
| **Today Plan**              | `/today`                     | Day plan builder, morning mission, shutdown flow                                   |
| **Tasks**                   | `/tasks`                     | Priority-scored tasks (urgency + financial/strategic impact − effort)              |
| **Goals**                   | `/goals`                     | Hierarchical goal tree: Vision → Year → Quarter → Month → Week → Day               |
| **Projects**                | `/projects`                  | Project tracking linked to goals                                                   |
| **Finances**                | `/finances`                  | Personal finance tracking & marriage-readiness numbers                             |
| **Freelance**               | `/freelance`                 | Revenue pipeline — proposals, active work, payments                                |
| **Clients**                 | `/clients`                   | Client CRM with follow-up tracking                                                 |
| **Opportunities**           | `/opportunities`             | Income opportunity capture & evaluation                                            |
| **Notes**                   | `/notes`                     | Knowledge base                                                                     |
| **Habits**                  | `/habits`                    | Habit tracking & streaks                                                           |
| **Routines**                | `/routines`                  | Daily routine definitions                                                          |
| **Calendar**                | `/calendar`                  | Time-blocking & schedule                                                           |
| **Reviews**                 | `/reviews`                   | Weekly / quarterly / yearly review wizards                                         |
| **Energy**                  | `/energy`                    | Energy level tracking                                                              |
| **Decisions**               | `/decisions`                 | Decision log                                                                       |
| **Brain Dump**              | `/brain-dump`                | Fast capture → convert to tasks/projects/goals                                     |
| **AI Agent**                | `/agent`                     | AI assistant layer (server-only, keyed)                                            |
| **Analytics**               | `/analytics`                 | Charts & trends (Recharts)                                                         |
| **Marriage / Relationship** | `/marriage`, `/relationship` | Shared-finance & relationship mission tracking                                     |

Bilingual UI: **Arabic (RTL, default) and English**, switchable at runtime. Dark/light themes via `next-themes`.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) + React 19, TypeScript (strict)
- **Styling:** Tailwind CSS v4, `tailwind-merge`, `clsx`, lucide-react icons
- **Database & Auth:** [Supabase](https://supabase.com) (`@supabase/ssr` + `supabase-js`) with Row-Level Security
- **Validation:** Zod
- **Charts:** Recharts
- **Testing:** Vitest (unit) + Playwright (E2E) + RLS security regression tests
- **Tooling:** ESLint, Prettier (`prettier-plugin-tailwindcss`), tsx

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 22, npm ≥ 10
- A Supabase project (cloud — no local Docker stack required)

### 1. Install & configure

```bash
npm install
cp .env.example .env.local   # then fill in the values
```

| Variable                         | Required        | Description                                                                                                    |
| -------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | ✅              | Supabase project URL                                                                                           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | ✅              | Supabase anon key (Settings → API)                                                                             |
| `SUPABASE_SERVICE_ROLE_KEY`      | ⚠️ scripts only | Bypasses RLS — used **only** by `scripts/seed.ts` & `scripts/reset-dev.ts`. Never import from `app/` or `lib/` |
| `OWNER_EMAIL` / `OWNER_PASSWORD` | ✅              | Owner account created by the seed script                                                                       |
| `NEXT_PUBLIC_SITE_URL`           | prod            | Canonical site URL (SEO metadata, auth callbacks)                                                              |
| `AI_PROVIDER_API_KEY`            | optional        | AI agent layer                                                                                                 |
| `CRON_SECRET`                    | optional        | Protects `/api/cron/*`                                                                                         |
| `GOOGLE_SITE_VERIFICATION`       | optional        | Google Search Console verification                                                                             |

### 2. Database

```bash
npm run db:push      # apply Supabase migrations
npm run db:seed      # create the owner account + seed data
```

### 3. Run

```bash
npm run dev          # http://localhost:3000
```

---

## 📜 Scripts

| Command                           | Description                                       |
| --------------------------------- | ------------------------------------------------- |
| `npm run dev`                     | Development server                                |
| `npm run build` / `npm start`     | Production build / serve                          |
| `npm run lint`                    | ESLint                                            |
| `npm run typecheck`               | TypeScript, no emit                               |
| `npm run format` / `format:check` | Prettier                                          |
| `npm run test` / `test:watch`     | Vitest unit tests                                 |
| `npm run test:rls`                | RLS security regression tests (`tests/security/`) |
| `npm run test:e2e`                | Playwright E2E (`tests/e2e/`)                     |
| `npm run db:push`                 | Push Supabase migrations                          |
| `npm run db:seed`                 | Seed owner account & baseline data                |
| `npm run db:reset-dev`            | Reset the dev database                            |

---

## 📁 Project Structure

```
app/
  (app)/            # authenticated group — sidebar layout, all private modules
  (auth)/           # login + auth callback
  robots.ts         # robots.txt (private routes disallowed)
  sitemap.ts        # sitemap.xml (public pages only)
  layout.tsx        # root layout, metadata, JSON-LD
components/         # UI by domain (landing/, tasks/, finance/, reviews/, ...)
lib/
  actions/          # server actions
  dal/              # data-access layer (auth session, etc.)
  ai/               # AI agent helpers (server-only)
  i18n/             # ar/en translations
supabase/
  migrations/       # SQL schema migrations
scripts/            # seed / reset / guard scripts
tests/
  unit/  e2e/  security/
docs/               # implementation plan, architecture review, master spec
```

---

## 🔒 Security Notes

- **Single-user system.** All `(app)` routes sit behind authentication and are blocked from search indexes in `app/robots.ts`.
- **RLS everywhere:** the Postgres schema relies on Row-Level Security; regression tests live in `tests/security/rls-regression.ts`.
- **`SUPABASE_SERVICE_ROLE_KEY` bypasses RLS** — server-side scripts only, never exposed to the client. The `server-only` package guards sensitive modules.
- API keys for the AI layer are server-only route handlers, never client bundles.

---

## 📚 Further Documentation

- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) — full phased implementation plan (v2)
- [`docs/LIFE_OS_MASTER_PROMPT.md`](docs/LIFE_OS_MASTER_PROMPT.md) — product specification
- [`docs/ARCHITECTURE_REVIEW.md`](docs/ARCHITECTURE_REVIEW.md) — architecture review findings
- [`docs/LIFE_CAREER_AND_LIFE_PLAN_AR.md`](docs/LIFE_CAREER_AND_LIFE_PLAN_AR.md) — the life/career plan behind the product (Arabic)

---

## Deployment

Deploy on Vercel (or any Node host). Set `NEXT_PUBLIC_SITE_URL` to the production domain so canonical URLs, Open Graph images, and auth callbacks resolve correctly.

---

_Private project — single owner. Not intended for public use or contribution._
