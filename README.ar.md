# ANTIDOTE — LIFE OS

> مركز قيادة شخصي للتنفيذ المالي والمهني والحياتي.
> ليس تطبيق مهام — بل نظام يحوّل مهمة التحول السنوية إلى حلقة تنفيذ يومية.

```
Vision → Annual Goals → Quarterly Targets → Monthly Objectives → Weekly Plan
→ Daily Actions → Tracking → Review → Adjustment
```

**ANTIDOTE** هو تطبيق ويب خاص بمستخدم واحد، مبني حول سؤال جوهري واحد: _هل ساعدني النظام اليوم على اتخاذ قرارات وأفعال أفضل؟_ لوحة القيادة اليومية مصممة للإجابة على خمسة أسئلة كل صباح:

1. ماذا أفعل اليوم؟
2. ما الذي قد يزيد دخلي؟
3. أين أنا من هدف الزواج؟
4. ما الذي ينتظر من العملاء؟
5. متى أتوقف اليوم؟

---

## ✨ المزايا

| الوحدة               | المسار                       | الوصف                                                                          |
| -------------------- | ---------------------------- | ------------------------------------------------------------------------------ |
| **لوحة القيادة**     | `/dashboard`                 | شاشة "صباح الخير" — أهم 3، المال، إجراء الإيرادات، متابعة العملاء، تفريغ الذهن |
| **خطة اليوم**        | `/today`                     | بناء خطة اليوم، مهمة الصباح، تدفق إنهاء اليوم                                  |
| **المهام**           | `/tasks`                     | مهام بأولوية محسوبة (الاستعجال + الأثر المالي/الاستراتيجي − الجهد)             |
| **الأهداف**          | `/goals`                     | شجرة أهداف هرمية: الرؤية → السنة → الربع → الشهر → الأسبوع → اليوم             |
| **المشاريع**         | `/projects`                  | تتبع المشاريع المرتبطة بالأهداف                                                |
| **المالية**          | `/finances`                  | تتبع المالية الشخصية وأرقام جاهزية الزواج                                      |
| **الفريلانس**        | `/freelance`                 | خط أنابيب الإيرادات — العروض، العمل الجاري، المدفوعات                          |
| **العملاء**          | `/clients`                   | إدارة علاقات العملاء مع تتبع المتابعات                                         |
| **الفرص**            | `/opportunities`             | التقاط وتقييم فرص الدخل                                                        |
| **الملاحظات**        | `/notes`                     | قاعدة المعرفة                                                                  |
| **العادات**          | `/habits`                    | تتبع العادات والسلاسل (Streaks)                                                |
| **الروتينات**        | `/routines`                  | تعريف الروتينات اليومية                                                        |
| **التقويم**          | `/calendar`                  | تقسيم الوقت والجدولة                                                           |
| **المراجعات**        | `/reviews`                   | معالجات المراجعة الأسبوعية / الربع سنوية / السنوية                             |
| **الطاقة**           | `/energy`                    | تتبع مستويات الطاقة                                                            |
| **القرارات**         | `/decisions`                 | سجل القرارات                                                                   |
| **تفريغ الذهن**      | `/brain-dump`                | التقاط سريع → تحويل إلى مهام/مشاريع/أهداف                                      |
| **الوكيل الذكي**     | `/agent`                     | طبقة المساعد الذكي (Server-only، محمية بمفتاح)                                 |
| **التحليلات**        | `/analytics`                 | الرسوم البيانية والاتجاهات (Recharts)                                          |
| **الزواج / العلاقة** | `/marriage`, `/relationship` | المالية المشتركة وتتبع مهمة العلاقة                                            |

واجهة ثنائية اللغة: **العربية (RTL، الافتراضية) والإنجليزية**، قابلة للتبديل أثناء التشغيل. ثيمات داكنة/فاتحة عبر `next-themes`.

---

## 🛠 التقنيات المستخدمة

- **الإطار:** [Next.js 16](https://nextjs.org) (App Router) + React 19، TypeScript (strict)
- **التنسيق:** Tailwind CSS v4، `tailwind-merge`، `clsx`، أيقونات lucide-react
- **قاعدة البيانات والمصادقة:** [Supabase](https://supabase.com) (`@supabase/ssr` + `supabase-js`) مع Row-Level Security
- **التحقق من البيانات:** Zod
- **الرسوم البيانية:** Recharts
- **الاختبارات:** Vitest (وحدة) + Playwright (E2E) + اختبارات انحدار أمنية لـ RLS
- **الأدوات:** ESLint، Prettier (`prettier-plugin-tailwindcss`)، tsx

---

## 🚀 البدء

### المتطلبات

- Node.js ≥ 22، npm ≥ 10
- مشروع Supabase (سحابي — لا حاجة لحزمة Supabase محلية عبر Docker)

### 1. التثبيت والإعداد

```bash
npm install
cp .env.example .env.local   # ثم عبّئ القيم
```

| المتغير                          | مطلوب؟           | الوصف                                                                                                           |
| -------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | ✅               | رابط مشروع Supabase                                                                                             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | ✅               | مفتاح anon من Supabase (Settings → API)                                                                         |
| `SUPABASE_SERVICE_ROLE_KEY`      | ⚠️ للسكربتات فقط | يتجاوز RLS — يُستخدم **فقط** في `scripts/seed.ts` و`scripts/reset-dev.ts`. لا تستورده أبداً من `app/` أو `lib/` |
| `OWNER_EMAIL` / `OWNER_PASSWORD` | ✅               | حساب المالك الذي ينشئه سكربت الـ seed                                                                           |
| `NEXT_PUBLIC_SITE_URL`           | للإنتاج          | رابط الموقع الرسمي (بيانات SEO الوصفية، واستدعاءات المصادقة)                                                    |
| `AI_PROVIDER_API_KEY`            | اختياري          | طبقة الوكيل الذكي                                                                                               |
| `CRON_SECRET`                    | اختياري          | يحمي مسارات `/api/cron/*`                                                                                       |
| `GOOGLE_SITE_VERIFICATION`       | اختياري          | التحقق من Google Search Console                                                                                 |

### 2. قاعدة البيانات

```bash
npm run db:push      # تطبيق ترحيلات (migrations) Supabase
npm run db:seed      # إنشاء حساب المالك + تعبئة البيانات الأولية
```

### 3. التشغيل

```bash
npm run dev          # http://localhost:3000
```

---

## 📜 السكربتات

| الأمر                             | الوصف                                            |
| --------------------------------- | ------------------------------------------------ |
| `npm run dev`                     | خادم التطوير                                     |
| `npm run build` / `npm start`     | بناء الإنتاج / التشغيل                           |
| `npm run lint`                    | ESLint                                           |
| `npm run typecheck`               | فحص TypeScript دون إخراج                         |
| `npm run format` / `format:check` | Prettier                                         |
| `npm run test` / `test:watch`     | اختبارات الوحدة (Vitest)                         |
| `npm run test:rls`                | اختبارات انحدار أمنية لـ RLS (`tests/security/`) |
| `npm run test:e2e`                | اختبارات E2E عبر Playwright (`tests/e2e/`)       |
| `npm run db:push`                 | دفع ترحيلات Supabase                             |
| `npm run db:seed`                 | تعبئة حساب المالك والبيانات الأساسية             |
| `npm run db:reset-dev`            | إعادة تعيين قاعدة بيانات التطوير                 |

---

## 📁 بنية المشروع

```
app/
  (app)/            # مجموعة الصفحات المحمية — تخطيط الشريط الجانبي، جميع الوحدات الخاصة
  (auth)/           # تسجيل الدخول + استدعاء المصادقة
  robots.ts         # robots.txt (المسارات الخاصة محجوبة)
  sitemap.ts        # sitemap.xml (الصفحات العامة فقط)
  layout.tsx        # التخطيط الجذري، البيانات الوصفية، JSON-LD
components/         # الواجهة حسب النطاق (landing/, tasks/, finance/, reviews/, ...)
lib/
  actions/          # Server Actions
  dal/              # طبقة الوصول للبيانات (جلسة المصادقة، إلخ)
  ai/               # مساعدات الوكيل الذكي (server-only)
  i18n/             # ترجمات عربي/إنجليزي
supabase/
  migrations/       # ترحيلات مخطط SQL
scripts/            # سكربتات seed / reset / guards
tests/
  unit/  e2e/  security/
docs/               # خطة التنفيذ، مراجعة المعمارية، المواصفة الرئيسية
```

---

## 🔒 ملاحظات أمنية

- **نظام بمستخدم واحد.** جميع مسارات `(app)` خلف المصادقة، ومحجوبة من فهارس البحث في `app/robots.ts`.
- **RLS في كل مكان:** مخطط Postgres يعتمد على Row-Level Security؛ واختبارات الانحدار موجودة في `tests/security/rls-regression.ts`.
- **`SUPABASE_SERVICE_ROLE_KEY` يتجاوز RLS** — للسكربتات من جهة الخادم فقط، ولا يُكشف أبداً للعميل. حزمة `server-only` تحمي الوحدات الحساسة.
- مفاتيح طبقة الذكاء الاصطناعي تُدار في Route Handlers من جهة الخادم فقط، ولا تدخل أبداً في حزم العميل.

---

## 📚 وثائق إضافية

- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) — خطة التنفيذ الكاملة بالمراحل (v2)
- [`docs/LIFE_OS_MASTER_PROMPT.md`](docs/LIFE_OS_MASTER_PROMPT.md) — مواصفة المنتج
- [`docs/ARCHITECTURE_REVIEW.md`](docs/ARCHITECTURE_REVIEW.md) — نتائج مراجعة المعمارية
- [`docs/LIFE_CAREER_AND_LIFE_PLAN_AR.md`](docs/LIFE_CAREER_AND_LIFE_PLAN_AR.md) — خطة الحياة والمسار المهني وراء المنتج (عربي)

---

## النشر

انشر المشروع على Vercel (أو أي استضافة Node). اضبط `NEXT_PUBLIC_SITE_URL` على نطاق الإنتاج حتى تُبنى روابط canonical وصور Open Graph واستدعاءات المصادقة بشكل صحيح.

---

_مشروع خاص — مالك واحد. غير مخصص للاستخدام العام أو المساهمة._
