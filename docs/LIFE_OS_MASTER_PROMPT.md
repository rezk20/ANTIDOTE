# LIFE OS — Master Prompt & Product Specification

> **Purpose:** هذا الملف هو الـ Master Prompt / Product Requirements Document لبناء نظام شخصي لإدارة الحياة والشغل والفلوس والعلاقات، وليس مجرد Todo App.
>
> **طريقة الاستخدام:** انسخ هذا الملف بالكامل إلى Claude Code / Cursor / Codex / أي Coding Agent، واطلب منه تنفيذ المشروع على مراحل مع الالتزام بكل ما ورد هنا. لا تقفز مباشرة إلى كتابة كل الكود دفعة واحدة. المطلوب بناء نظام قابل للاستخدام يوميًا وقابل للتوسع.

---

# 0. ROLE — دور الـ AI Agent

أنت Senior Product Engineer + Full-Stack Architect + Productivity Systems Designer + Personal Operations Planner.

مهمتك بناء تطبيق اسمه المبدئي:

**LIFE OS**

وصفه:

> Personal Operating System لإدارة سنة التحول القادمة: الشغل، الدخل، الفريلانس، المشاريع الجانبية، الادخار، تجهيز الزواج، الوقت، الروتين، العلاقة، التعلم، الصحة اليومية العامة، الملاحظات، والمراجعة الأسبوعية.

التطبيق يجب ألا يتصرف كـ Todo List تقليدية. يجب أن يعمل كـ **مركز قيادة شخصي** يترجم الأهداف الكبيرة إلى:

`Vision → Annual Goals → Quarterly Targets → Monthly Objectives → Weekly Plan → Daily Actions → Tracking → Review → Adjustment`

لا تفترض أن المستخدم يستطيع تنظيم حياته بنفسه. النظام نفسه يجب أن يساعده على اتخاذ القرار، ترتيب الأولويات، كشف التأخير، ومنع تحميل اليوم بأكثر مما يمكن تنفيذه.

---

# 1. CONTEXT — وضع المستخدم الذي سيبنى النظام لأجله

المستخدم:

- مطور MERN / Next.js ويريد أن يجعل البرمجة مصدر دخله الأساسي.
- لديه خلفية قوية في الأمن السيبراني، لكنه لا يريد أن يكون هذا هو المسار المهني الأساسي حاليًا.
- لديه خبرة عملية في Discord Bots باستخدام Node.js / Discord.js.
- لديه مشروع سابق مرتبط بسيرفر OSRS، وقد بنى جزءًا من الويب سايت والبوت.
- يريد استغلال خبرته في Discord Bots كمصدر دخل Freelance سريع نسبيًا.
- يريد أيضًا بناء منتج OSRS Client / Automation-oriented product كمشروع جانبي محتمل.
- لا يوجد لديه دخل ثابت حاليًا.
- لديه مدخرات بداية قدرها 18,000 جنيه مصري.
- يريد رفع دخله بسرعة لأنه يخطط للزواج خلال سنة تقريبًا بدلًا من الانتظار لسنتين.
- تقديره الحالي للحد الأدنى المطلوب للزواج والتجهيزات حوالي 250,000 جنيه.
- هدفه الإضافي شراء شقة لاحقًا، لكن قبول الإيجار كحل مرحلي.
- يريد العمل Freelance بالدولار، والعمل Remote عندما تتوفر فرصة مناسبة.
- يريد السفر خارج مصر على المدى المتوسط، لكن بعد تحقيق قدر معقول من الاستقرار المالي.
- لديه إجازة أسبوعية ثابتة يوم الجمعة غالبًا يقضيها مع خطيبته.
- النوم والروتين اليومي غير ثابتين، والتركيز يتشتت بسبب كثرة التفكير.
- المطلوب من النظام أن يساعده على الاستقرار بدلًا من زيادة الضغط عليه.

### IMPORTANT

هذه البيانات هي Baseline وليست قوانين ثابتة. التطبيق يجب أن يسمح بتعديل:

- هدف الزواج.
- المبلغ المستهدف.
- الدخل الشهري المستهدف.
- موعد الزواج.
- ساعات العمل.
- أولويات المشاريع.
- المصروفات.
- الادخار.
- مواعيد النوم والاستيقاظ.

كل شيء يجب أن يكون configurable.

---

# 2. MAIN MISSION — الهدف الأكبر لمدة سنة

أنشئ داخل التطبيق Objective رئيسي باسم:

## Mission: Build Financial Stability + Career + Marriage Readiness

والهدف الأساسي للسنة:

1. بناء مصدر دخل قوي ومستقر.
2. الوصول إلى مبلغ مناسب لتجهيز الزواج.
3. بناء Freelance pipeline حقيقي.
4. تطوير مستوى MERN / Next.js المهني.
5. بناء دخل جانبي من Discord Bots عند توفر فرص مربحة.
6. اختبار المنتج الجانبي OSRS ضمن حدود قانونية وآمنة، دون بناء الخطة المالية الأساسية عليه.
7. بناء حضور مهني وPortfolio قوي.
8. تجهيز مسار Remote Work / International Opportunities.
9. الحفاظ على يوم راحة وعلاقة صحية مع الخطيبة.
10. تقليل الفوضى الذهنية الناتجة عن عدم وضوح الخطوات.

---

# 3. NON-NEGOTIABLE PRINCIPLES

هذه القواعد يجب أن تكون جزءًا من Logic النظام:

### Rule 1 — Income First

عندما يوجد تعارض بين مهمة قد تنتج دخلًا قريبًا ومهمة تحسين غير ضرورية للمشروع، يتم إعطاء أولوية لمسار الدخل.

### Rule 2 — One Main Work Stream at a Time

اليوم لا يتحول إلى:

- MERN 8h
- Discord 4h
- OSRS 4h
- Learning 3h

لأن هذا غير واقعي.

النظام يستخدم مفهوم:

**Primary Work Stream**

و

**Secondary Project**

فقط.

### Rule 3 — Friday Is Protected

الجمعة يوم راحة اجتماعية وعاطفية قدر الإمكان.

لا يتم اقتراح Work Sprint ثقيل يوم الجمعة إلا إذا كان هناك ظرف استثنائي.

### Rule 4 — Avoid Burnout

أي خطة يومية تتجاوز طاقة المستخدم يجب أن تُرفض تلقائيًا ويعاد توزيعها.

### Rule 5 — Progress Over Perfection

إنجاز 70–80% من خطة واقعية أفضل من بناء خطة مثالية لا يتم تنفيذها.

### Rule 6 — Reality Check

إذا كانت الأرقام لا تدعم الهدف، يظهر النظام تحذيرًا صريحًا ويقترح Scenarios بديلة.

### Rule 7 — Side Projects Must Earn Their Time

أي مشروع جانبي يجب أن يكون له:

- hypothesis
- expected upside
- time budget
- milestone
- kill criteria

إذا لم يحقق المشروع تقدمًا حقيقيًا في فترة محددة، يقلل النظام الوقت المخصص له.

### Rule 8 — No Illegal/Evasion Features

أي جزء متعلق بألعاب أو منصات طرف ثالث يجب ألا يتضمن وظائف تهدف إلى تجاوز أنظمة الحظر، Anti-Cheat، اكتشاف البوتات، أو إخفاء النشاط غير المسموح به.

النظام يمكنه إدارة مشروع قانوني/تقني ومتابعة مراحله، لكنه لا يجب أن يولد تعليمات للتحايل على سياسات المنصات.

---

# 4. THE THREE WORK ENGINES

يجب أن يدعم التطبيق 3 مسارات واضحة.

## A. PRIMARY — MERN / Next.js Freelance & Remote Work

هذا هو المسار الأساسي للدخل.

أهدافه:

- الحصول على أول عميل سريعًا.
- رفع متوسط قيمة المشروع.
- بناء Portfolio.
- التقديم المنتظم.
- بناء Leads Pipeline.
- تحويل أول عميل إلى Retainer أو Referral.
- الوصول لاحقًا إلى Remote Contract.

### Tasks Engine

يجب أن يدعم:

- البحث عن فرص.
- حفظ Job/Client Lead.
- تقييم الفرصة.
- كتابة Proposal.
- إرسال Proposal.
- Follow-up.
- Interview.
- Negotiation.
- Won/Lost.
- Payment.
- Review/Testimonial.
- Referral.

### Lead stages

```text
New
→ Qualified
→ Contacted
→ Proposal Sent
→ Follow-up
→ Interview / Call
→ Negotiation
→ Won
→ In Progress
→ Delivered
→ Paid
→ Review Requested
→ Referral Requested
```

### Daily Sales Targets

النظام لا يفرض رقمًا ثابتًا إلى الأبد.

يبدأ المستخدم Target قابل للتعديل مثل:

- عدد الفرص التي تم البحث عنها.
- عدد الـ Proposals.
- عدد Follow-ups.
- عدد Outreach Messages.
- عدد Calls.
- عدد المحتوى المنشور.

ويتابع:

`Attempts → Replies → Calls → Wins → Revenue`

### Core Rule

لا تعتبر "اشتغلت على البورتفوليو" نشاطًا تجاريًا بديلًا عن إرسال عروض فعلية.

يجب أن يظهر للمستخدم الفرق بين:

**Build Work**
و
**Revenue Work**

حتى لا يقضي أسابيع في التحسينات دون محاولة بيع.

---

# 5. SECONDARY INCOME ENGINE — Discord Bots

Discord Bots هو مسار دخل جانبي مربح محتمل بناءً على خبرة المستخدم السابقة.

التطبيق يجب أن يديره مثل Micro Agency / Freelance Service.

### Service Catalog

أنشئ أنواع خدمات قابلة للتعديل مثل:

- Custom Discord Bot.
- Moderation Bot.
- Ticket System.
- Verification System.
- Subscription / Role Automation.
- Dashboard.
- Server Integration.
- Game Community Tools.
- API Integration.
- Maintenance Retainer.

### لكل خدمة:

- Base price.
- Minimum price.
- Estimated hours.
- Complexity.
- Profitability.
- Portfolio example.
- Delivery estimate.
- Maintenance plan.

### Client Qualification

كل عميل جديد يُسجل فيه:

- المشكلة.
- المطلوب.
- الميزانية.
- deadline.
- هل عنده قرار شراء؟
- هل لديه سيرفر قائم؟
- هل يحتاج maintenance؟
- هل يستحق وقت المستخدم؟

### Upsell Engine

بعد تسليم أي Bot، اقترح تلقائيًا خدمات مثل:

- Monthly maintenance.
- Hosting management.
- Feature updates.
- Dashboard.
- Analytics.
- Backup.
- Monitoring.

الهدف تحويل المشروع لمصدر دخل متكرر بدلًا من Project مرة واحدة.

---

# 6. THIRD ENGINE — Experimental Product

أنشئ قسمًا باسم:

**Experimental Product Lab**

يستخدم لمشاريع مثل OSRS Client أو أي منتج آخر.

لا يتم اعتباره جزءًا من الدخل المتوقع إلا إذا حقق Validation.

### Required fields

- Product name.
- Problem.
- Target user.
- Value proposition.
- Legal/platform constraints.
- Risk score.
- Build hours per week.
- MVP deadline.
- First paying customer target.
- Monthly revenue target.
- Marketing owner.
- Technical owner.
- Revenue split.
- Cost.
- Kill criteria.

### Critical Rule

لا يوجد أي Development إضافي لمشروع مشترك قبل كتابة:

- Roles.
- Ownership.
- Revenue split.
- Who pays expenses.
- Who controls accounts.
- Who owns source code.
- What happens if partnership ends.
- What happens if one party stops working.
- Exit terms.

ليس مطلوبًا نظام عقود قانونية داخل التطبيق، لكن يجب أن تكون هذه checklist قبل التنفيذ.

### OSRS-specific guardrail

تعامل مع هذا المنتج كـ Experimental / High-Risk business.

لا تجعل خطة الزواج تعتمد عليه.

لا تخزن داخل التطبيق أي أسرار أو تعليمات تتعلق بتجاوز أنظمة Anti-Cheat أو إخفاء نشاط مخالف لسياسات طرف ثالث.

---

# 7. ANNUAL FINANCIAL ENGINE

أحد أهم أجزاء النظام.

## Starting Point

```text
Current Savings: 18,000 EGP
Marriage Goal: ~250,000 EGP
Initial Gap: ~232,000 EGP
```

يجب ألا يثبت النظام هذه الأرقام نهائيًا؛ المستخدم يغيرها من Settings.

## Calculations

### Gap

```text
Target Amount - Current Savings
```

### Required Monthly Savings

```text
Remaining Gap / Months Remaining
```

### Required Weekly Savings

```text
Remaining Gap / Weeks Remaining
```

### Required Daily Average

```text
Remaining Gap / Days Remaining
```

لكن يجب التفريق بين:

**Revenue**
و
**Net Savings**

لأن الدخل ليس كله قابلًا للادخار.

---

# 8. FINANCIAL DASHBOARD

اعمل Dashboard تعرض:

### Current

- Current Savings.
- Current Revenue.
- Current Expenses.
- Net Savings.
- Debt إن وجد.
- Marriage Fund.
- Emergency Fund.
- Business Fund.
.

### Progress

- % toward marriage goal.
- Money saved this month.
- Money saved this year.
- Average monthly income.
- Average monthly savings.
- Best income month.
- Lowest income month.

### Forecast

أظهر 3 سيناريوهات:

#### Conservative

دخل منخفض + تنفيذ متوسط.

#### Base

دخل واقعي + تنفيذ جيد.

#### Aggressive

دخل مرتفع + Freelance قوي.

لا تستخدم أرقامًا مستقبلية جامدة. اجعل النظام يحسب Forecast من بيانات المستخدم الفعلية.

---

# 9. MONEY CATEGORIES

يجب أن يدعم:

```text
Income
├── MERN
├── Freelance
├── Discord Bots
├── Retainers
├── Product
└── Other

Expenses
├── Personal
├── Transport
├── Food
├── Family
├── Business
├── Hosting
├── Software
├── Learning
└── Other

Savings Goals
├── Marriage
├── Emergency
├── Laptop/Hardware
├── Travel
└── Apartment
```

كل Transaction تحتوي على:

- amount
- type
- category
- date
- source
- project
- note
- recurring

---

# 10. MARRIAGE PLAN

أنشئ قسمًا خاصًا باسم:

**Marriage Mission**

يعرض:

- Target date.
- Target amount.
- Current saved.
- Remaining.
- Monthly amount needed.
- Top upcoming expenses.
- Payment deadlines.
- Completion percentage.

### Breakdown

يسمح للمستخدم بإنشاء عناصر مثل:

- Furniture.
- Finishing.
- Rent deposit.
- Wedding hall.
- Clothing.
- Photography.
- Transportation.
- Miscellaneous.

لكل عنصر:

- Estimated cost.
- Actual cost.
- Paid.
- Remaining.
- Deadline.
- Priority.

### Anti-chaos Rule

لا تجعل التطبيق يحول الزواج إلى مشروع مالي فقط.

يجب أن يحتوي أيضًا على:

- Relationship time.
- Shared experiences.
- Communication reminders.
- Planning conversations.
- Fun activities.

---

# 11. RELATIONSHIP ENGINE

قسم اسمه:

**Us**

هدفه دعم العلاقة وليس مراقبتها بطريقة مزعجة.

### Features

#### Shared Ideas

يخزن:

- Date ideas.
- Home activities.
- Games.
- Movies.
- Cooking ideas.
- Walks.
- Low-budget activities.
- Free activities.
- Special occasions.

#### Budget-aware Suggestions

قبل اقتراح نشاط، اعرف Budget اليوم:

```text
Free
Low
Medium
High
```

إذا كان الوضع المالي ضاغطًا، لا يقترح النظام نشاطات مكلفة تلقائيًا.

#### Shared Wishlist

قائمة:

- Places to visit.
- Things to buy together.
- Games.
- Movies.
- Future trips.
- Apartment ideas.

#### Relationship Check-in

مرة أسبوعيًا:

- كيف كان الأسبوع؟
- هل كان لدينا وقت جيد معًا؟
- هل يوجد شيء يحتاج كلامًا؟
- ما الشيء الجميل الذي حدث؟
- ما الشيء الذي نريد عمله الأسبوع القادم؟

لا تستخدم درجات نفسية مصطنعة لتشخيص العلاقة. الهدف reflection فقط.

---

# 12. DAILY LIFE OS

القلب اليومي للنظام.

عند فتح التطبيق صباحًا، لا تعرض 50 مهمة.

اعرض:

## Today's Mission

### Top 3

ثلاث نتائج أساسية فقط.

### Work Block

Primary work stream.

### Money Action

مهمة واحدة مرتبطة بزيادة الدخل.

### Personal Action

مهمة بسيطة للحياة الشخصية.

### Relationship Action

مهمة صغيرة مرتبطة بالعلاقة.

### Shutdown Time

وقت لإغلاق العمل.

---

# 13. DAILY PLANNER ENGINE

يجب أن يبني خطة اليوم تلقائيًا من:

- Calendar.
- Tasks.
- Deadlines.
- Energy level.
- Available hours.
- Primary Work Stream.
- Weekly goals.
- Sleep quality.

### Smart Planning Rules

إذا كان هناك:

```text
10 hours available
8 hours work
2 hours personal
```

لا تضع 16 ساعة مهام.

إذا كان المستخدم متأخرًا عن النوم، خفف workload بدلًا من إضافة ساعات.

إذا كان هناك deadline قريب، يرفع الأولوية تلقائيًا.

إذا task لم تتحرك 3 أيام:

```text
Do it
Delegate it
Reschedule it
Delete it
```

ولا تتركها في backlog للأبد.

---

# 14. TASK SYSTEM

كل Task يجب أن تحتوي على:

- title
- description
- area
- project
- goal
- priority
- effort
- duration
- deadline
- status
- recurring
- energy_level
- revenue_impact
- relationship_impact
- created_at
- completed_at

### Priority Score

يمكن استخدام Score مبدئي:

```text
Priority Score =
Urgency
+ Financial Impact
+ Strategic Impact
+ Deadline Proximity
- Effort
```

لكن يجب ألا يكون هذا الرقم مرئيًا كحقيقة علمية؛ هو مجرد مساعد ترتيب.

---

# 15. TASK TYPES

```text
Revenue
Career
Client
Learning
Product
Finance
Marriage
Relationship
Personal
Admin
Health/Routine
```

---

# 16. NOTES SYSTEM

أنشئ Notes Engine شبيه بـ Mini Notion.

يجب أن يدعم:

- Markdown.
- Tags.
- Folders.
- Search.
- Pin.
- Archive.
- Links بين الملاحظات.

### Suggested folders

```text
00 Inbox
01 Life
02 Work
03 Freelance
04 Discord Bots
05 Products
06 Finance
07 Marriage
08 Relationship
09 Learning
10 Career
11 Ideas
12 Archive
```

---

# 17. JOURNAL / BRAIN DUMP

أنشئ مكانًا اسمه:

**Brain Dump**

الفكرة:

المستخدم لا يريد الاحتفاظ بكل الأفكار في دماغه.

يمكنه كتابة أي شيء بسرعة.

ثم النظام يقترح تحويل النص إلى:

- Task.
- Note.
- Idea.
- Goal.
- Reminder.
- Question.

لا يتم الحذف تلقائيًا.

---

# 18. WEEKLY REVIEW

يوم الجمعة أو نهاية الأسبوع، النظام يفتح Weekly Review.

### Questions

1. ماذا أنجزت؟
2. كم دخلت؟
3. كم ادخرت؟
4. كم Proposal أرسلت؟
5. كم عميل كلمته؟
6. كم مشروعًا أغلقت؟
7. هل تقدمت في MERN؟
8. هل تقدمت في Discord Bots؟
9. هل مشروع المنتج تحرك؟
10. هل أعطيت وقتًا جيدًا لخطيبتي؟
11. ما أكبر شيء عطلك؟
12. ماذا يجب أن يتوقف؟
13. ما أهم 3 أهداف للأسبوع القادم؟

### Weekly Score

لا تستخدم Score واحد فقط.

اعرض:

- Revenue Progress.
- Career Progress.
- Financial Progress.
- Relationship Progress.
- Execution Progress.
- Routine Consistency.

---

# 19. MONTHLY REVIEW

كل شهر:

- Revenue.
- Expenses.
- Savings.
- Leads.
- Proposals.
- Clients.
- Delivery time.
- Average project value.
- Product progress.
- Portfolio progress.
- Relationship time.
- Sleep/routine consistency.

ثم AI recommendation:

```text
KEEP
START
STOP
DOUBLE DOWN
```

---

# 20. QUARTERLY SYSTEM

السنة تنقسم إلى 4 Quarters.

لكن لا تعتمد على 12 شهرًا ثابتة بشكل أعمى.

كل Quarter يراجع:

- Income.
- Savings.
- Career.
- Client pipeline.
- Marriage readiness.
- Product validation.

إذا فشل مسار، لا ينتظر النظام نهاية السنة.

يُعيد توزيع الوقت.

---

# 21. YEAR ROADMAP

## PHASE 1 — Stabilize

الهدف:

- تنظيم النوم.
- إنشاء النظام.
- Portfolio usable.
- Offer واضحة.
- بدء outreach يومي.
- الحصول على أول دخل متكرر.

### Priority

```text
Revenue > Stability > Portfolio Polish > Experiments
```

## PHASE 2 — Monetize

الهدف:

- زيادة عدد العملاء.
- رفع متوسط قيمة المشاريع.
- إنشاء Retainers.
- بناء Social Proof.

## PHASE 3 — Optimize

الهدف:

- تقليل العملاء منخفضي القيمة.
- التركيز على الخدمات الأعلى ربحًا.
- رفع الأسعار تدريجيًا بناءً على النتائج والخبرة.
- بناء Remote pipeline.

## PHASE 4 — Prepare

الهدف:

- الوصول للهدف المالي أو أقرب نقطة ممكنة.
- تجهيز الزواج.
- بناء Emergency Fund.
- تثبيت دخل شهري.
- بدء خطوات السفر/Remote career بشكل أكبر.

---

# 22. FIRST 14 DAYS — EXECUTION MODE

يجب أن يحتوي النظام على خطة جاهزة لأول أسبوعين.

## Day 1

- إنشاء Accounts/Workspace.
- كتابة الهدف المالي.
- تحديد Target Date.
- تحديد عدد ساعات العمل المتاحة.
- إنشاء الخدمات الأساسية.
- إنشاء Income tracker.

## Day 2

- تنظيف Portfolio.
- اختيار 2–3 أقوى مشاريع.
- كتابة Case Studies.
- تجهيز Contact information.

## Day 3

- إنشاء Freelance profiles.
- تجهيز Proposal templates.
- إنشاء Lead tracker.

## Day 4

- البحث عن فرص حقيقية.
- تسجيل الفرص.
- إرسال أول دفعة Proposals.

## Day 5

- Follow-ups.
- تحسين العروض بناءً على الردود.
- نشر/مشاركة شيء مهني إن أمكن.

## Friday

- No heavy work.
- Relationship time.
- Weekly review خفيف.

## Week 2

كرر pipeline مع تحسين كل يوم.

لا تستخدم أول أسبوعين لبناء تفاصيل UI لا تؤثر على الدخل.

---

# 23. FREELANCE MACHINE

أنشئ صفحة:

**Freelance Command Center**

تحتوي على:

### Lead Board

Kanban:

```text
New
Qualified
Outreach
Proposal
Follow-up
Call
Negotiation
Won
Lost
```

### Metrics

- Applications sent.
- Reply rate.
- Call rate.
- Close rate.
- Revenue.
- Average project value.
- Average days to close.
- Repeat client rate.

### AI Insights

مثل:

> أنت أرسلت عروضًا كثيرة لكن Reply Rate منخفض → راجع الـ positioning أو جودة الاستهداف.

> عدد العملاء جيد لكن متوسط السعر منخفض → اختبر Packages أعلى.

> لديك عدة مشاريع قديمة بلا Follow-up → أعد التواصل.

---

# 24. PERSONAL BRAND ENGINE

أنشئ قسمًا لإدارة الظهور المهني.

### Channels

- Portfolio.
- LinkedIn.
- GitHub.
- Freelance platforms.
- Discord communities.
- X/Twitter إن أراد المستخدم.
- YouTube إن أراد.

### Content types

- Case Study.
- Project demo.
- Technical post.
- Lesson learned.
- Before/After.
- Short tutorial.
- Client result.

### Weekly target

يحدد المستخدم عدد المحتويات.

لا تجعل Content Creation أهم من Revenue Work في مرحلة البداية.

---

# 25. CLIENT RELATIONSHIP SYSTEM

كل Client يجب أن يكون له:

- Name.
- Company/Community.
- Contact.
- Source.
- Service.
- Value.
- Status.
- Start date.
- Deadline.
- Payment status.
- Notes.
- Next action.
- Follow-up date.
- Testimonial status.
- Referral status.

---

# 26. PROJECT MANAGEMENT

Project page يجب أن تحتوي:

- Brief.
- Requirements.
- Milestones.
- Tasks.
- Files/Links.
- Client messages notes.
- Deadline.
- Budget.
- Revenue.
- Expenses.
- Profit.

### Project profitability

```text
Revenue - Direct Costs = Gross Profit
Gross Profit / Hours = Effective Hourly Rate
```

استخدم هذا الرقم لمعرفة أي نوع مشاريع يجب تكبيره.

---

# 27. SCHEDULE SYSTEM

Calendar modes:

### Day

Time blocks.

### Week

Main commitments.

### Month

Deadlines.

### Year

Major milestones.

### Rules

لا تسمح بتداخل:

- Client deadlines.
- Personal commitments.
- Friday relationship time.

إلا بعد Confirmation.

---

# 28. ROUTINE SYSTEM

أنشئ Routine Templates:

## Morning

- Wake.
- Water.
- Hygiene.
- Prayer / quiet time حسب تفضيل المستخدم.
- First deep-work block.

## Workday

- Primary Work.
- Short breaks.
- Sales action.
- Delivery.

## Evening

- Shutdown.
- Relationship / personal.
- Light learning.
- Prepare tomorrow.

## Night

- Screen wind-down.
- Review.
- Sleep preparation.

لا تعتبر المواعيد الطبية أو الصحة التشخيصية جزءًا من النظام. النظام يتعامل فقط مع العادات العامة والتذكيرات.

---

# 29. SLEEP / ENERGY TRACKING

لأن الإنتاجية تعتمد على الطاقة، أنشئ Tracking بسيط:

- Sleep time.
- Wake time.
- Hours slept.
- Energy 1–5.
- Focus 1–5.

بعد عدة أسابيع، اعرض Correlations بسيطة مثل:

> الأيام التي يكون فيها النوم أفضل، متوسط إنجاز المهام أعلى.

لا تقدم تشخيصًا طبيًا.

إذا ظهرت مشكلة صحية مقلقة، يقتصر التطبيق على اقتراح أخذ استشارة مختص، دون تشخيص.

---

# 30. HABIT SYSTEM

Habits اختيارية وليست قائمة عبودية.

أمثلة:

- Sleep consistency.
- Deep work.
- Outreach.
- Learning.
- Finance update.
- Relationship time.
- Weekly review.

### Anti-streak obsession

إذا ضاع يوم، لا تجعل streak fail يؤدي إلى جلد الذات.

اعرض:

**Restart Today.**

---

# 31. GOAL HIERARCHY

طبقة الأهداف:

```text
Vision
  ↓
Year Goals
  ↓
Quarter Goals
  ↓
Month Goals
  ↓
Week Outcomes
  ↓
Daily Actions
```

مثال:

```text
VISION:
Build a stable life with my future wife.

YEAR GOAL:
Reach financial readiness for marriage.

QUARTER GOAL:
Build reliable freelance income.

MONTH GOAL:
Close X clients.

WEEK:
Send X qualified proposals + follow-ups.

DAY:
Send 3 high-quality proposals.
```

كل Task يجب أن يستطيع المستخدم ربطها بهدف أعلى.

---

# 32. SMART PRIORITY ENGINE

كل صباح، احسب:

```text
Impact
Urgency
Revenue
Strategic Value
Effort
Energy Required
Deadline
```

ثم اقترح ترتيب المهام.

لكن يجب أن يسمح للمستخدم Override يدوي.

---

# 33. OPPORTUNITY RADAR

أنشئ صفحة:

**Opportunities**

تجمع:

- Jobs.
- Freelance gigs.
- Discord Bot clients.
- Remote jobs.
- Partnerships.
- Product opportunities.
.

لكل Opportunity:

- Expected value.
- Probability.
- Time required.
- Risk.
- Next action.
.

ثم:

```text
Opportunity Score = Expected Value × Probability / Effort
```

استخدمه فقط للمقارنة وليس كحقيقة مطلقة.

---

# 34. DECISION SYSTEM

أنشئ صفحة:

**Decision Desk**

للقرارات الكبيرة.

Template:

```text
Decision:

Why now?

Options:
A
B
C

Upside:

Downside:

Cost:

Time:

Risk:

Worst case:

Best case:

Reversible or irreversible?

Decision:

Review date:
```

---

# 35. PROJECT KILL SWITCH

كل مشروع جانبي يجب أن يملك:

```text
Success Metric
Deadline
Minimum Validation
Kill Criteria
```

مثال:

> إذا لم يصل المشروع إلى Validation المحدد بعد عدد معين من أسابيع العمل، يعاد تقييمه بدل الاستمرار تلقائيًا.

---

# 36. AI ASSISTANT LAYER

التطبيق يجب أن يحتوي على AI Assistant داخلي اختياري.

### AI commands

```text
Plan my day
Review my week
What should I work on?
What is blocking my marriage goal?
How much do I need to save this month?
Where is my time going?
Which clients should I follow up with?
What should I stop doing?
Give me 3 low-budget date ideas
Help me prepare for a client call
Turn this brain dump into tasks
Summarize my month
```

### AI must have access to structured context

- Goals.
- Tasks.
- Projects.
- Finances.
- Calendar.
- Leads.
- Reviews.

لكن يجب ألا يرسل كل البيانات في كل request دون حاجة. استخدم context selection.

---

# 37. AI MORNING BRIEF

كل صباح:

```text
GOOD MORNING

Main Objective:
...

Top 3:
1.
2.
3.

Money Move:
...

Career Move:
...

Relationship Move:
...

Today's Warning:
...

Recommended Shutdown:
...
```

---

# 38. AI EVENING REVIEW

في نهاية اليوم:

```text
What got done?
What did not?
Why?
Revenue actions completed?
Relationship time?
Energy?
What moves to tomorrow?
```

ثم يخرج:

**Tomorrow's starting point**

حتى لا يبدأ المستخدم يومه وهو محتار.

---

# 39. NOTIFICATION ENGINE

لا تكثر Notifications.

أنواع أساسية:

- Deadline.
- Follow-up.
- Daily start.
- Shutdown.
- Finance reminder.
- Weekly review.
- Marriage payment deadline.

يجب دعم Quiet Hours.

---

# 40. DASHBOARD DESIGN

الـ Dashboard الرئيسية يجب أن تكون بسيطة بصريًا لكنها عميقة.

### Header

- Greeting.
- Date.
- Current streaks بشكل محدود.
- Current financial goal progress.

### Main Area

#### Today's Mission

Top 3.

#### Revenue Pipeline

Quick numbers.

#### Marriage Goal

Progress bar.

#### Current Projects

Status.

#### Relationship

Next shared activity.

#### Weekly Progress

Compact charts.

### Right / Secondary Area

- Quick Note.
- Brain Dump.
- Add Task.
- Add Transaction.
- Add Lead.

---

# 41. UI / UX PRINCIPLES

الواجهة يجب أن تكون:

- Modern.
- Dark/Light mode.
- Responsive.
- Fast.
- Minimal distractions.
- Keyboard friendly.
- Mobile usable.

Avoid:

- Huge dashboards مليئة بـ 30 chart.
- Animations عدوانية.
- Gamification مبالغ فيها.
- ألوان تحذر المستخدم طوال الوقت.

استخدم Hierarchy واضحة:

**What matters today?**

قبل:

**All the data in my life.**

---

# 42. TECH STACK

يفضل تنفيذ المشروع كالتالي:

## Frontend

- Next.js.
- TypeScript.
- React.
- Tailwind CSS.
- Component system محترم.
- Charts library عند الحاجة.

## Backend

يمكن استخدام Next.js Server Actions / Route Handlers.

## Database

يفضل PostgreSQL عبر Supabase أو أي PostgreSQL managed service مناسب.

## Auth

Password-protected private app.

يفضل استخدام Auth provider جاهز أو Secure credential auth بدل تخزين كلمات المرور plain text.

## Deployment

Vercel.

## Optional

- PWA.
- Offline support لبعض البيانات.
- IndexedDB/cache عند الحاجة.
- Email notifications عند الحاجة.

لا تضف Infrastructure معقدة دون حاجة.

---

# 43. SECURITY

هذه private life data.

لذلك:

- HTTPS.
- Secure authentication.
- Password hashing.
- Session protection.
- CSRF protection حسب architecture.
- Input validation.
- Rate limiting.
- Server-side authorization.
- Database Row Level Security إذا كانت المنصة تدعمها.
- No secrets in frontend.
- Environment variables.
- No logs containing sensitive financial or relationship data.
- Backup strategy.

---

# 44. DATA MODEL

صمم schema واضحًا على الأقل للكيانات:

```text
User
Goal
Quarter
MonthPlan
WeekPlan
DayPlan
Task
Project
Client
Lead
Proposal
TimeEntry
Transaction
SavingsGoal
MarriageExpense
RelationshipIdea
RelationshipCheckin
Habit
Routine
Note
BrainDump
JournalEntry
Review
Notification
Decision
Opportunity
```

لا تنشئ 50 table إذا لم تكن ضرورية. يمكن دمج الكيانات عندما يكون ذلك منطقيًا.

---

# 45. SUGGESTED ROUTES

```text
/
/dashboard
/today
/calendar
/tasks
/projects
/clients
/freelance
/opportunities
/discord-bots
/products
/finances
/marriage
/relationship
/routines
/habits
/notes
/brain-dump
/reviews
/analytics
/decisions
/settings
```

---

# 46. SETTINGS

Settings يجب أن تسمح بـ:

### Personal

- Name.
- Timezone.
- Currency.
- Work hours.
- Preferred start time.
- Weekly off day.

### Goals

- Marriage target.
- Savings target.
- Income target.
- Travel target.

### Work

- Primary work.
- Secondary work.
- Target proposal count.
- Target outreach count.

### Relationship

- Shared day.
- Budget preference.

### Privacy

- Export data.
- Delete data.
- AI enabled/disabled.

---

# 47. ANALYTICS

التحليلات التي تهم فعلاً:

## Career

- Applications.
- Reply rate.
- Interviews.
- Wins.
- Revenue.

## Productivity

- Planned vs completed.
- Deep work hours.
- Task carryover.
- Overplanning frequency.

## Finance

- Income.
- Expense.
- Savings.
- Goal progress.

## Projects

- Hours.
- Revenue.
- Effective hourly rate.
- Delay.

## Relationship

- Shared activities.
- Weekly check-in completion.

لا تجعل analytics تتحول إلى ضغط يومي. الهدف اتخاذ قرارات أفضل.

---

# 48. AUTOMATIONS

ممكن لاحقًا دعم:

### Every morning

Generate Daily Plan.

### Every evening

Generate Shutdown Review.

### Every Friday

Generate Weekly Review.

### Every month

Generate Monthly Review.

### Before client deadline

Reminder.

### Follow-up date

Reminder.

### Savings deadline

Reminder.

---

# 49. FINANCE ALERT LOGIC

أمثلة:

### Behind target

> أنت أقل من خطة الادخار الحالية بـ X جنيه. راجع المصروفات أو ارفع دخل هذا الشهر.

### Income increase

إذا ارتفع الدخل لمدة عدة أسابيع:

> هل تريد رفع هدف الادخار؟

### Unexpected expense

> هذا المصروف أثر على هدف الزواج. هل تحتاج إعادة توزيع الخطة؟

النظام يقترح، ولا يتخذ قرارات مالية نيابة عن المستخدم.

---

# 50. WORK OPPORTUNITY PRIORITIZATION

عند وجود عدة فرص:

### مثال factors

```text
Client quality
Budget
Probability of winning
Strategic value
Portfolio value
Deadline
Estimated hours
Stress level
Recurring potential
```

ثم يعرض:

**Recommended next opportunity**

مع سبب مختصر.

---

# 51. WEEKLY WORK ALLOCATION

النظام يقسم وقت العمل تقريبًا بين:

### Primary Revenue

أكبر نسبة من الوقت.

### Sales / Outreach

جزء ثابت، حتى في أسابيع الشغل.

### Learning / Improvement

جزء صغير.

### Experimental Product

وقت محدود.

النسب لا تكون hard-coded.

النظام يقيس الواقع ويعدل.

---

# 52. EXAMPLE ALLOCATION LOGIC

عندما لا يوجد عملاء:

```text
Revenue Search
> Portfolio
> Outreach
> Proposals
> Learning
> Product
```

عندما يوجد عميل:

```text
Client Delivery
> Sales Pipeline
> Admin
> Learning
> Product
```

عندما يصبح الدخل مستقرًا:

```text
Delivery
> Sales
> Productization
> Product
> Learning
```

---

# 53. SKILL DEVELOPMENT SYSTEM

المستخدم لا يحتاج Learning Roadmaps عملاقة بدون تطبيق.

كل Skill يجب أن ترتبط بـ:

- Why?
- Market value?
- Project?
- Deadline?
- Proof of skill?

### Examples

- Next.js.
- TypeScript.
- Backend architecture.
- Database design.
- Auth.
- Payments.
- Deployment.
- Testing.
- Performance.
- System design.

كل Learning task يجب أن ينتج Artifact أو تطبيقًا كلما كان ذلك مناسبًا.

---

# 54. PORTFOLIO ENGINE

قسم:

**Portfolio Factory**

لكل مشروع:

```text
Problem
Solution
Stack
My Role
Architecture
Challenges
Result
Screenshots
Demo
Repository
Case Study
Client/Testimonial
```

التطبيق يذكّر المستخدم بتحويل كل مشروع جيد إلى Case Study.

---

# 55. OUTREACH ENGINE

يسمح بحفظ templates:

- Cold DM.
- Email.
- Freelance Proposal.
- Follow-up.
- Referral Request.
- Testimonial Request.

لكن لا تجعل النظام Spam machine.

يجب أن يحث على:

- Personalization.
- Qualification.
- Relevance.
- Respect.

---

# 56. MONTHLY INCOME TARGET ENGINE

بدل وضع هدف مالي واحد فقط، استخدم:

```text
Minimum target
Comfort target
Stretch target
```

مثال قابل للتعديل:

```text
Minimum = Survival + Progress
Comfort = Strong progress
Stretch = Aggressive progress
```

التطبيق يقارن الدخل الفعلي بكل سيناريو.

---

# 57. MARRIAGE READINESS SCORE

لا تستخدم Score واحدًا يتظاهر بأنه علمي.

استخدم Checklist dimensions:

```text
Money
Housing
Furniture
Wedding
Income Stability
Emergency Reserve
Relationship Readiness
```

كل جزء له Progress منفصل.

---

# 58. TRAVEL / REMOTE CAREER TRACK

أنشئ قسمًا باسم:

**Exit Plan**

الهدف: تجهيز المستخدم للعمل خارج مصر أو Remote بشكل أقوى على المدى المتوسط.

Tracks:

### Remote Career

- Remote jobs.
- International clients.
- USD income.
- Portfolio.
- Communication.
- Interview prep.

### Relocation

- Destination ideas.
- Requirements.
- Documents.
- Budget.
- Timeline.

لا تعتبر السفر هدف السنة الأول إذا كان ذلك يؤثر على الاستقرار المالي الأساسي.

---

# 59. PERSONAL KNOWLEDGE BASE

اجعل النظام قادرًا على الاحتفاظ بمعلومات شخصية غير حساسة مثل:

- Favorite activities.
- Preferred work hours.
- Preferred tools.
- Important dates.
- Personal goals.
- Career interests.
- Skills.
.

حتى تكون اقتراحات الـAI أفضل.

---

# 60. QUICK ACTIONS

من أي صفحة:

```text
N → New Task
T → New Transaction
L → New Lead
N → New Note
B → Brain Dump
R → Relationship Activity
```

استخدم shortcut names غير متعارضة عند التنفيذ.

---

# 61. SEARCH

Global search في:

- Tasks.
- Projects.
- Clients.
- Notes.
- Transactions.
- Opportunities.
.

---

# 62. DATA EXPORT

المستخدم يجب أن يملك:

- Export JSON.
- Export CSV للمالية.
- Export Markdown للـNotes.
.

لا تجعل النظام lock-in.

---

# 63. BACKUP

اعمل:

- Automated DB backups إن كانت المنصة تدعم ذلك.
- Manual export.
- Backup status.
.

---

# 64. MOBILE EXPERIENCE

التطبيق يجب أن يكون useful من الهاتف.

خصوصًا:

- Add task.
- Add lead.
- Add transaction.
- Brain dump.
- Today's plan.
- Relationship ideas.
.

---

# 65. OFFLINE EXPERIENCE

إذا كان ذلك سهلًا هندسيًا:

- Cache Today's Plan.
- Notes draft.
- Brain dump draft.
- Quick task creation.

ثم Sync.

لا تبنِ Offline architecture ضخمة إذا لم تكن ضرورية للنسخة الأولى.

---

# 66. BUILD PHASES

لا تبنِ كل شيء مرة واحدة.

## Phase 0 — Planning

Deliverables:

- Architecture.
- Wireframes.
- Data model.
- Routes.
- Component map.
.

## Phase 1 — MVP

Must have:

- Auth.
- Dashboard.
- Tasks.
- Today.
- Goals.
- Finance.
- Leads.
- Projects.
- Notes.
.

## Phase 2 — Life Layer

- Marriage.
- Relationship.
- Habits.
- Routine.
- Weekly reviews.
.

## Phase 3 — Intelligence

- AI assistant.
- AI morning brief.
- AI review.
- Smart recommendations.
.

## Phase 4 — Advanced Analytics

- Forecast.
- Opportunity scoring.
- Profitability.
- Trend analysis.
.

## Phase 5 — Polish

- PWA.
- Offline drafts.
- Better mobile UX.
- Keyboard shortcuts.
- Accessibility.

---

# 67. MVP DEFINITION

MVP لا يعني نسخة سيئة.

MVP يعني النسخة التي تجعل المستخدم يبدأ استخدام النظام يوميًا.

### MVP success condition

في أقل عدد ممكن من الصفحات، يستطيع المستخدم:

1. يرى ماذا يفعل اليوم.
2. يعرف هدفه المالي.
3. يعرف فرصه الحالية.
4. يسجل دخله ومصروفه.
5. يعرف ما الذي ينتظر منه.
6. يكتب Brain Dump.
7. يراجع أسبوعه.

إذا لم يتحقق ذلك، لا تنتقل إلى animations أو advanced AI.

---

# 68. FIRST SCREEN AFTER LOGIN

يجب أن يكون:

# Good Morning, [Name]

### Today

**One sentence mission.**

### Top 3

1.
2.
3.

### Money

`Saved / Target`

### Work

`Active project`

### Opportunity

`Next lead to follow up`

### Relationship

`Next shared activity`

### Brain Dump

Quick input.

---

# 69. END-OF-DAY EXPERIENCE

لا تعرض Dashboard كاملة.

فقط:

```text
DAY COMPLETE

Wins

Money action

Work completed

Relationship

What moves to tomorrow?

Energy

Sleep plan
```

---

# 70. SYSTEM BEHAVIOR WHEN USER FAILS

ممنوع استخدام tone عقابي.

لا تقل:

> فشلت.

استخدم:

> الخطة لم تكن مناسبة للواقع. لنعد توزيعها.

ثم:

- Identify why.
- Reduce overload.
- Move critical tasks.
- Delete low-value tasks.
- Resume.

---

# 71. SYSTEM BEHAVIOR WHEN USER SUCCEEDS

لا يكتفي بـ:

> Congratulations.

بل يحلل:

- ماذا نجح؟
- ما الذي تسبب فيه؟
- هل يمكن تكراره؟
- هل يمكن رفع السعر؟
- هل يمكن تحويله إلى recurring revenue؟

---

# 72. REVENUE LADDER

التطبيق يجب أن يساعد المستخدم على الانتقال تدريجيًا:

```text
First Client
↓
First Repeat Client
↓
Retainer
↓
Higher Ticket Project
↓
Specialized Offer
↓
Remote Contract
↓
Productized Service
↓
Product / Recurring Revenue
```

لا تفترض الوصول للمرحلة الأخيرة بسرعة.

---

# 73. DISCORD BOT OFFER LADDER

مثال داخلي قابل للتعديل:

```text
Basic Bot
→ Custom Bot
→ Bot + Dashboard
→ Bot + Hosting
→ Monthly Maintenance
→ Full Community Automation
```

الهدف ليس بيع كود فقط، بل بيع نتيجة وحل.

---

# 74. PRODUCT VALIDATION

قبل ساعات طويلة من بناء منتج جديد:

```text
Problem
→ Talk to users
→ Prototype
→ Validate demand
→ First payment / commitment
→ MVP
→ Retention
→ Scale
```

لا تجعل Coding وحده يعتبر validation.

---

# 75. PARTNER MANAGEMENT

لأي شريك:

### Partner profile

- Name.
- Role.
- Responsibilities.
- Contribution.
- Revenue split.
- Expenses.
- Assets.
- Exit condition.
.

### Partner Review

شهريًا:

- Was work delivered?
- Did marketing happen?
- Did revenue increase?
- Is the agreement still fair?

---

# 76. CLIENT / PARTNER BOUNDARY RULES

التطبيق يذكّر المستخدم أن:

- Role في Discord قد يكون Marketing asset لكنه ليس بديلًا عن اتفاق مكتوب.
- Public credit يجب أن يكون واضحًا ومقبولًا مسبقًا.
- أي عمل مجاني يجب أن تكون له قيمة استراتيجية محددة.
- لا يوجد تنفيذ إضافي لمشروع بلا شروط واضحة إذا كان العمل يستهلك وقتًا مؤثرًا على الهدف المالي.

---

# 77. NEGOTIATION NOTE SYSTEM

أنشئ لكل Client/Partner:

**Negotiation Notes**

مع:

- What I want.
- Why it is fair.
- What I can offer.
- What I will not accept.
- Alternative.
- Deadline for decision.
.

---

# 78. CASH PROTECTION

النظام يجب أن يعرض:

**Available Cash**

ولا يسمح للمستخدم أن يخلط:

- Business money.
- Personal money.
- Marriage savings.
.

اعمل Wallets / Buckets مفاهيمية.

---

# 79. EMERGENCY FUND

اجعل Emergency Fund هدفًا منفصلًا.

لا تجعل كل المدخرات تذهب للزواج دون أي هامش أمان إن أمكن.

لكن لا تضع رقمًا طبيًا/ماليًا إلزاميًا دون بيانات فعلية عن المصروفات.

---

# 80. FINANCIAL DECISION SUPPORT

إذا أراد المستخدم شراء شيء:

أظهر:

```text
Cost
Opportunity Cost
Impact on Marriage Goal
Impact on Business
Urgency
Alternative
```

ثم:

**Buy / Delay / Avoid**

لكن القرار النهائي للمستخدم.

---

# 81. LOW-COST RELATIONSHIP IDEAS ENGINE

يجب أن يستطيع النظام إنتاج أفكار لا تتطلب مالًا كثيرًا.

أمثلة categories:

- At home.
- Walking.
- Cooking together.
- Board/video games.
- Movie night.
- Photo walk.
- Planning future apartment.
- Shared playlist.
- Memory journal.
- Mini challenge.
.

اقتراحات مخصصة حسب:

- Budget.
- Time.
- Weather إذا كان هناك integration مناسب.
- Preferences.
.

---

# 82. CREATIVE RELATIONSHIP FEATURES

أضف أفكارًا مثل:

- Random Date Generator.
- Question of the Week.
- Couple Challenge.
- Shared Wishlist.
- Future Trip Board.
- Our Favorite Memories.
- Monthly Mini Celebration.

يجب أن تكون features اختيارية وليست مزعجة.

---

# 83. PRIVACY FOR RELATIONSHIP DATA

بيانات العلاقة خاصة.

- لا تظهر في analytics عامة.
- لا ترسل إلى AI بدون اختيار المستخدم.
- لا تُستخدم للإعلانات.
- يجب توفير delete/export.

---

# 84. PRODUCTIVITY HEALTH CHECK

كل أسبوع:

```text
Are you planning too much?
Are you working too late?
Are tasks constantly moving?
Is your revenue activity consistent?
Are you taking a day off?
```

إذا ظهرت علامات overload:

قلل الخطة، لا تزودها.

---

# 85. DEEP WORK TRACKER

للمهام المهمة:

- Start.
- Stop.
- Duration.
- Project.
- Focus rating.
.

ثم اعرض:

```text
Deep Work this week
Revenue Work this week
Learning this week
Relationship time this week
```

---

# 86. TIME AUDIT

كل شهر:

Compare:

```text
Planned
vs
Actual
```

Categories:

- Revenue.
- Delivery.
- Sales.
- Learning.
- Product.
- Admin.
- Relationship.
- Rest.
.

ثم:

**Where did your time actually go?**

---

# 87. PRIORITY COLLISION HANDLER

إذا كان هناك:

- Client deadline.
- Proposal target.
- Product milestone.
- Personal event.

في نفس اليوم:

النظام يحدد collision ويقترح:

1. Which one is irreversible?
2. Which one creates money?
3. Which one has consequences?
4. Which one can move?

ثم يطلب قرارًا من المستخدم إذا لزم.

---

# 88. BACKLOG MANAGEMENT

كل أسبوع:

Backlog Review.

كل عنصر يجب أن يصبح:

```text
Do
Schedule
Delegate
Delete
Someday
```

لا تسمح بوجود backlog أبدي بلا تصنيف.

---

# 89. IDEA VAULT

احتفظ بالأفكار.

لكن لا تسمح لها بخطف الأولوية.

كل Idea لها:

- Problem.
- Potential.
- Time.
- Cost.
- Next experiment.
.

---

# 90. MORNING PRIORITY QUESTION

عند ضغط العمل:

يعرض النظام:

> ما الشيء الواحد الذي لو تم اليوم سيجعل اليوم ناجحًا؟

ثم Top 3.

---

# 91. WEEKLY FINANCIAL QUESTION

> هل هذا الأسبوع قرّبني ماليًا من الزواج؟

يتم ربط السؤال بالأرقام الفعلية، وليس بالمشاعر فقط.

---

# 92. MONTHLY CAREER QUESTION

> هل أصبحت أكثر قابلية للبيع مقارنة بالشهر الماضي؟

مقارنة:

- Portfolio.
- Offer.
- Communication.
- Case studies.
- Client results.
- Technical skill.
.

---

# 93. MONTHLY RELATIONSHIP QUESTION

> هل كنت شريكًا حاضرًا أم مجرد شخص مشغول طوال الوقت؟

reflection فقط، بدون guilt.

---

# 94. SUCCESS METRICS FOR THE YEAR

Primary:

1. Net Savings.
2. Average Monthly Income.
3. Stable Monthly Income.
4. Number of Paying Clients.
5. Repeat Clients.
6. Marriage Readiness.

Secondary:

7. Portfolio quality.
8. Remote opportunities.
9. Product validation.
10. Routine consistency.
11. Relationship quality.

---

# 95. END-OF-YEAR STATE

المطلوب أن يستطيع المستخدم في نهاية السنة فتح صفحة:

# Year in Review

وترى:

- Starting savings.
- Ending savings.
- Total income.
- Total expenses.
- Total clients.
- Biggest client.
- Best project.
- Biggest mistake.
- Biggest lesson.
- Relationship highlights.
- Career growth.
- What changed?
- Next year plan.

---

# 96. SOFTWARE QUALITY

يجب أن يكون المشروع:

- Type-safe.
- Modular.
- Testable.
- Documented.
- Maintainable.
.

Use:

- ESLint.
- Prettier.
- TypeScript strict mode.
- Unit tests where valuable.
- Integration tests for critical flows.
- Error boundaries.
- Loading states.
- Empty states.
- Proper validation.

---

# 97. UX QUALITY CHECKLIST

قبل اعتبار Feature مكتملة:

- Loading state موجود؟
- Empty state موجود؟
- Error state موجود؟
- Mobile جيد؟
- Keyboard accessible؟
- Validation؟
- Undo/confirmation عند الحاجة؟
- Data persisted؟
- Security checked؟

---

# 98. AI IMPLEMENTATION RULES

عند استخدام LLM:

- لا ترسل كلمات مرور.
- لا ترسل API secrets.
- لا ترسل بيانات لا يحتاجها الطلب.
- استخدم structured context.
- Log usage/cost إذا لزم.
- ضع limits.
- اسمح بتعطيل AI.

---

# 99. BUILD ORDER — EXACT IMPLEMENTATION ORDER

نفّذ بهذا الترتيب:

### Step 1
Architecture + schema + auth.

### Step 2
Dashboard + Today.

### Step 3
Tasks + Goals.

### Step 4
Projects + Clients + Leads.

### Step 5
Finance + Marriage Goal.

### Step 6
Notes + Brain Dump.

### Step 7
Weekly/Monthly Review.

### Step 8
Relationship Engine.

### Step 9
Routine + Habits + Time tracking.

### Step 10
Analytics.

### Step 11
AI Assistant.

### Step 12
PWA / offline improvements.

### Step 13
Polish + testing + deployment.

---

# 100. DEVELOPMENT RULE

لا تكتب كل المشروع في response واحد.

الـ AI Agent يجب أن يعمل:

```text
Plan
→ Implement
→ Run
→ Test
→ Review
→ Fix
→ Commit
→ Next phase
```

عند كل Phase:

1. اعرض ما ستبنيه.
2. نفذه.
3. اختبره.
4. اذكر الملفات التي تغيرت.
5. اذكر المشاكل المتبقية.
6. لا تنتقل إلى Phase التالي إذا كانت الـCore functionality مكسورة.

---

# 101. ACCEPTANCE TEST — DAILY USE

يجب أن يستطيع المستخدم في أقل من دقيقة:

- معرفة ماذا يفعل اليوم.
- معرفة موقفه المالي.
- معرفة أول خطوة لزيادة الدخل.
- رؤية أهم Client action.
- معرفة موعد Relationship activity.

وفي أقل من 2 دقائق:

- إضافة Task.
- إضافة Lead.
- إضافة Transaction.
- كتابة Note.

---

# 102. ACCEPTANCE TEST — WEEKLY USE

في نهاية الأسبوع يستطيع:

- مراجعة دخله.
- مراجعة الادخار.
- معرفة الفرص.
- معرفة المشاريع المتأخرة.
- معرفة ماذا يجب إيقافه.
- بناء خطة الأسبوع القادم.

---

# 103. ACCEPTANCE TEST — MONTHLY USE

في نهاية الشهر:

- تظهر حقيقة الأداء.
- يظهر forecast.
- يظهر الفرق عن هدف الزواج.
- تظهر أفضل مصادر الدخل.
- تظهر أكثر الأعمال استهلاكًا للوقت.
- يظهر قرار واضح بشأن المشروع الجانبي.

---

# 104. DEFAULT DAILY TEMPLATE

استخدم هذا كـ default ويمكن تغييره:

```text
Morning
├── Personal setup
├── Deep work / primary revenue
├── Short break
├── Client / revenue action
├── Delivery / implementation
└── Shutdown

Evening
├── Relationship / personal time
├── Light learning if energy allows
├── Plan tomorrow
└── Wind down

Friday
└── Rest + relationship + weekly review
```

---

# 105. DEFAULT WEEKLY TEMPLATE

```text
Saturday → Execution
Sunday  → Execution
Monday  → Execution
Tuesday → Execution
Wednesday → Execution
Thursday → Execution + planning
Friday → Recovery + relationship + review
```

الجدول ليس قانونًا، بل Default.

---

# 106. BUSINESS FLYWHEEL

صمم النظام ليساعد على خلق Flywheel:

```text
Portfolio
↓
Outreach
↓
Client
↓
Delivery
↓
Testimonial
↓
Case Study
↓
Higher Trust
↓
Higher Price
↓
Better Client
↓
Referral
```

هذه الدورة أهم من مطاردة عشرات المشاريع العشوائية.

---

# 107. RETAINER ENGINE

بعد كل مشروع:

يعرض التطبيق سؤالًا:

> هل يمكن تحويل هذا المشروع إلى Maintenance/Retainer؟

ثم يقترح:

- Monthly updates.
- Bug fixing.
- Monitoring.
- Hosting.
- New features.
- Support.
.

---

# 108. REFERRAL ENGINE

بعد العميل الراضي:

```text
Ask for testimonial
→ Ask for referral
→ Add case study
→ Add portfolio proof
```

ويذكّر المستخدم عند الوقت المناسب.

---

# 109. CLIENT RED FLAGS

أضف Checklist:

- يرفض تحديد scope.
- يطلب تغييرات بلا نهاية.
- يريد عملًا مجانيًا طويلًا.
- يرفض أي شروط واضحة.
- يتأخر في الدفع.
- يختفي ثم يعود deadline قريب.

إذا زادت Red Flags، يظهر:

**Review client before committing more hours.**

---

# 110. OPPORTUNITY FILTER

لا تقبل أي مشروع لمجرد أنه Client.

اسأل:

```text
Is it profitable?
Is it credible?
Is it learnable?
Can it generate referrals?
Can it become recurring?
Does it fit my direction?
```

---

# 111. CAREER POSITIONING

النظام يجب أن يساعد المستخدم تدريجيًا على الانتقال من:

```text
Developer who can code
```

إلى:

```text
Developer who solves business problems
```

ثم إلى:

```text
Specialized developer with proof
```

لذلك كل Project يجب أن يركز على:

**Outcome > Technology**

---

# 112. PORTFOLIO PRIORITY

عند وجود وقت محدود:

أفضل Case Study حقيقية > 10 مشاريع تجريبية صغيرة.

النظام يقيس عدد الـproof assets بدل عدد المشاريع فقط.

---

# 113. LEARNING PRIORITY

التعلم يجب أن يأتي من مشاكل العمل قدر الإمكان.

مثال:

Client يحتاج payments.

بدل:

> أدرس payments أسبوعين.

استخدم:

> Study → Build → Deploy → Document

---

# 114. FINANCIAL PRIORITY WATERFALL

عند وصول دخل:

اقترح تقسيمه حسب Settings إلى buckets مثل:

```text
Business
Marriage
Emergency
Personal
```

النسب قابلة للتعديل وليست توصية مالية ثابتة.

---

# 115. SAVINGS MOMENTUM

اعرض:

```text
This Month
vs
Last Month
vs
Target
```

ثم:

- Improving.
- Flat.
- Falling.

بدون tone سلبي.

---

# 116. CASH FLOW CALENDAR

اعرض التزامات قادمة:

- Expected income.
- Expected expenses.
- Marriage payments.
- Subscriptions.
.

ثم:

**Projected end-of-month cash**

---

# 117. PERSONAL CRM

العلاقات المهنية المهمة يجب ألا تضيع.

سجل:

- Contact.
- Context.
- Last interaction.
- Next follow-up.
- Opportunity.
- Notes.
.

وهذا يشمل:

- Clients.
- Developers.
- Referrers.
- Community owners.
- Potential partners.
.

---

# 118. NETWORKING ENGINE

أسبوعيًا:

Target قابل للتعديل مثل:

- 3 meaningful professional conversations.
- 1 referral ask.
- 1 useful public contribution.

لا تحوّل Networking إلى spam.

---

# 119. DISCORD COMMUNITY MARKETING

بما أن المستخدم لديه خبرة في Discord:

يمكن للنظام تتبع:

- Communities.
- Admins.
- Opportunities.
- Conversations.
- Portfolio shares.
.

ويجب أن يركز على:

**Value-first networking**

وليس إرسال عروض عشوائية.

---

# 120. CASE STUDY GENERATOR

من بيانات Project:

AI يقترح:

```text
Problem
Solution
Implementation
Challenges
Outcome
What I learned
```

المستخدم يراجع قبل النشر.

---

# 121. CLIENT CALL PREP

قبل مكالمة:

ينشئ النظام صفحة:

- Client background.
- Problem.
- Questions.
- Estimated scope.
- Budget questions.
- Risks.
- Next action.
.

---

# 122. DAILY SHUTDOWN RULE

في نهاية يوم العمل:

1. Update task status.
2. Log revenue actions.
3. Update client next actions.
4. Capture loose thoughts.
5. Choose tomorrow's Top 3.
6. Close work.

ثم يحمي وقت المساء.

---

# 123. FOCUS MODE

عند بدء مهمة:

Focus Mode يعرض فقط:

- Task.
- Timer.
- Project.
- Notes.
- Stop button.
.

لا تعرض بقية Dashboard أثناء التركيز.

---

# 124. NOISE REDUCTION

في أوقات Deep Work:

لا تظهر:

- Finance charts.
- Idea feed.
- Relationship notifications.

إلا للضرورة.

---

# 125. CUSTOM COMMAND CENTER

ضع Sidebar:

```text
Command Center
Today
Calendar
Tasks
Work
Clients
Projects
Money
Marriage
Us
Notes
Reviews
Analytics
Settings
```

---

# 126. THE MASTER DASHBOARD QUESTIONS

كل يوم يجب أن يستطيع النظام الإجابة على 5 أسئلة:

1. ماذا أفعل اليوم؟
2. ما المهمة التي قد تزيد دخلي؟
3. أين أنا من هدف الزواج؟
4. ماذا ينتظرني من العملاء؟
5. متى أتوقف اليوم؟

إذا لم يستطيع النظام الإجابة، الـDashboard غير ناجحة.

---

# 127. PRODUCT NORTH STAR

North Star Metric للتطبيق:

> **Did the system help the user make better actions today?**

ليس:

- عدد المهام.
- عدد الصفحات.
- عدد charts.
- عدد streaks.

---

# 128. DEVELOPMENT PHILOSOPHY

كل Feature جديدة يجب أن تجيب على:

```text
Does this reduce confusion?
Does this save time?
Does this increase income?
Does this protect important relationships?
Does this improve decision quality?
```

إذا لم تحقق قيمة واضحة، لا تضفها لمجرد أن شكلها جميل.

---

# 129. FINAL IMPLEMENTATION COMMAND

ابدأ الآن ببناء المشروع وفق هذا المستند.

الترتيب الإجباري:

1. اعرض architecture مختصرة.
2. اقترح database schema.
3. اقترح routes/components.
4. أنشئ المشروع.
5. نفذ Phase 1.
6. شغّل lint/typecheck/tests.
7. أصلح الأخطاء.
8. نفذ Phase 2.
9. كرر.
10. لا تبنِ الـAI layer قبل أن تعمل البيانات الأساسية جيدًا.

عند كل مرحلة، استخدم:

```text
STATUS
DONE
IN PROGRESS
BLOCKED
NEXT
```

---

# 130. IMPORTANT PRODUCT DECISION

هذا النظام ليس الهدف النهائي.

**الهدف النهائي هو الحياة التي يديرها النظام.**

لا تسمح ببناء نظام Productivity يجعل المستخدم يقضي ساعات في إدارة النظام نفسه بدل إدارة حياته.

قاعدة أساسية:

> **Use the system. Don't live inside the system.**

---

# 131. FINAL PERSONAL OPERATING MODEL

النظام في النهاية يجب أن يعمل وفق هذا التسلسل:

```text
VISION
↓
GOALS
↓
MONEY TARGET
↓
WORK STRATEGY
↓
CLIENT PIPELINE
↓
PROJECTS
↓
WEEKLY PLAN
↓
TODAY
↓
TOP 3
↓
EXECUTE
↓
REVIEW
↓
LEARN
↓
ADJUST
↓
REPEAT
```

وفي نفس الوقت يحافظ على:

```text
WORK
+ MONEY
+ FUTURE MARRIAGE
+ RELATIONSHIP
+ REST
+ PERSONAL GROWTH
```

وليس:

```text
WORK
WORK
WORK
WORK
```

---

# 132. USER'S CURRENT STARTING SNAPSHOT

استخدم هذه البيانات كـ initial seed في التطبيق، مع إمكانية تعديلها بالكامل:

```yaml
career:
  primary_path: "MERN / Next.js Freelance"
  secondary_path: "Discord Bots"
  experimental_path: "OSRS-related product"
  security: "Background knowledge, not current primary career"

finance:
  current_savings_egp: 18000
  marriage_goal_egp: 250000
  current_income: 0

marriage:
  preferred_timeline_months: 12
  fallback_timeline_months: 24
  housing_strategy: "Rent initially, buy later"

work:
  desired_structure: "Primary work up to ~8 hours when work exists + limited experimental project time"
  friday_off: true

relationship:
  weekly_shared_day: "Friday"
  low_budget_activities_allowed: true

travel:
  priority: "After financial stabilization"
  desired_direction: "Remote first, relocation later"
```

---

# 133. FIRST DATABASE SEED

أنشئ عند تشغيل المشروع بيانات تجريبية أو Initial seed تعكس وضع المستخدم:

### Goals

- Marriage Fund.
- Stable Monthly Income.
- Freelance Client #1.
- Remote Opportunity.
- Portfolio Upgrade.

### Projects

- MERN Freelance Pipeline.
- Discord Bot Services.
- Experimental Product.
- LIFE OS.

### Weekly recurring

- Outreach.
- Proposal sending.
- Portfolio improvement.
- Finance update.
- Relationship time.
- Weekly review.

---

# 134. FINAL DESIGN TEST

بعد الانتهاء، اسأل نفسك:

> لو فتحت التطبيق وأنا تايه الساعة 9 صباحًا، هل سيقول لي بوضوح ماذا أفعل الآن ولماذا؟

> لو لم أحقق أي دخل هذا الأسبوع، هل سيكشف أين فشلت العملية؟

> لو حققت دخلًا جيدًا، هل سيحول النجاح إلى ادخار واستقرار؟

> لو أصبح المشروع الجانبي يأخذ وقتًا أكثر من اللازم، هل سينبهني؟

> لو كنت مضغوطًا، هل يقلل الحمل بدل زيادته؟

> لو قضيت أسبوعًا سيئًا، هل يساعدني على العودة بدل جعلي أشعر بالفشل؟

إذا كانت الإجابة نعم، فـ LIFE OS يؤدي وظيفته.

---

# 135. THE ONE-LINE MISSION

> **Build a calmer, wealthier, more stable life — one deliberate day at a time.**

