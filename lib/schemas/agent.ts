import { z } from "zod";

export const agentActionKindSchema = z.enum([
  "capture_thought",
  "add_brain_dump",
  "create_task",
  "update_task",
  "set_day_plan",
  "orchestrate_day",
  "log_time_entry",
  "log_lead",
  "add_note",
  "create_decision",
  "save_debrief",
  "log_report",
]);

export type AgentActionKind = z.infer<typeof agentActionKindSchema>;

// 1. Capture Thought / Brain Dump
export const captureThoughtPayloadSchema = z.object({
  action: z.literal("capture_thought"),
  text: z.string().min(1, "Text is required"),
  source: z.string().optional().default("ai_agent"),
});

export const addBrainDumpPayloadSchema = z.object({
  action: z.literal("add_brain_dump"),
  content: z.string().min(1, "Content is required"),
  category: z
    .enum(["career", "business", "personal", "marriage", "idea", "general"])
    .optional()
    .default("general"),
  status: z
    .enum(["inbox", "converted", "archived"])
    .optional()
    .default("inbox"),
});

// 2. Create Task
export const createTaskPayloadSchema = z.object({
  action: z.literal("create_task"),
  title: z.string().min(1, "Title is required"),
  priority: z
    .enum(["critical", "high", "medium", "low", "P1", "P2", "P3", "P4"])
    .default("medium"),
  task_type: z
    .enum([
      "revenue",
      "career",
      "client",
      "learning",
      "product",
      "finance",
      "marriage",
      "relationship",
      "personal",
      "admin",
      "health_routine",
    ])
    .default("personal"),
  scheduled_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date (YYYY-MM-DD)")
    .optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date (YYYY-MM-DD)")
    .optional(),
  estimated_minutes: z.number().int().positive().optional(),
  goal_id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
  is_top_three: z.boolean().optional(),
  description: z.string().optional(),
});

// 3. Update Task
export const updateTaskPayloadSchema = z.object({
  action: z.literal("update_task"),
  task_id: z.string().uuid("Invalid task_id"),
  status: z
    .enum([
      "backlog",
      "planned",
      "in_progress",
      "done",
      "dropped",
      "someday",
      "todo",
    ])
    .optional(),
  priority: z
    .enum(["critical", "high", "medium", "low", "P1", "P2", "P3", "P4"])
    .optional(),
  scheduled_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  is_top_three: z.boolean().optional(),
});

// 4. Set Day Plan (Morning Calibration & Focus)
export const setDayPlanPayloadSchema = z.object({
  action: z.literal("set_day_plan"),
  plan_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  available_hours: z.number().min(1).max(24).default(8),
  energy: z.number().int().min(1).max(5).default(4),
  focus_question_answer: z.string().min(1, "Focus question answer is required"),
  top_three_task_ids: z.array(z.string().uuid()).max(3).optional(),
  notes: z.string().optional(),
});

// 5. Autonomous Midnight Daily Orchestration (Batch action)
export const orchestrateDayPayloadSchema = z.object({
  action: z.literal("orchestrate_day"),
  target_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  available_hours: z.number().min(1).max(24).default(8),
  energy: z.number().int().min(1).max(5).default(4),
  focus_question_answer: z.string().min(1, "Focus answer required"),
  top_three_task_ids: z.array(z.string().uuid()).max(3).optional(),
  new_tasks: z
    .array(
      z.object({
        title: z.string().min(1),
        priority: z
          .enum(["critical", "high", "medium", "low", "P1", "P2", "P3", "P4"])
          .default("medium"),
        task_type: z
          .enum([
            "revenue",
            "career",
            "client",
            "learning",
            "product",
            "finance",
            "marriage",
            "relationship",
            "personal",
            "admin",
            "health_routine",
          ])
          .default("revenue"),
        estimated_minutes: z.number().int().positive().optional().default(60),
        is_top_three: z.boolean().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
  rescheduled_task_ids: z.array(z.string().uuid()).optional(),
  brain_dump_suggestions: z.array(z.string()).optional(),
  executive_briefing: z.string().min(1, "Executive briefing is required"),
});

// 6. Log Time Entry
export const logTimeEntryPayloadSchema = z.object({
  action: z.literal("log_time_entry"),
  duration_min: z.number().int().positive("Duration must be positive"),
  kind: z
    .enum([
      "deep_work",
      "delivery",
      "sales",
      "learning",
      "product",
      "admin",
      "relationship",
      "rest",
    ])
    .default("deep_work"),
  task_id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
  focus_rating: z.number().int().min(1).max(5).optional().default(4),
  note: z.string().optional(),
  started_at: z.string().optional(),
});

// 7. Log Lead
export const logLeadPayloadSchema = z.object({
  action: z.literal("log_lead"),
  title: z.string().min(1, "Lead title / client name is required"),
  source: z.string().optional().default("agent_outreach"),
  expected_value: z.number().positive().optional(),
  stage: z
    .enum([
      "new",
      "qualified",
      "contacted",
      "proposal_sent",
      "follow_up",
      "call",
      "negotiation",
      "won",
      "in_progress",
      "delivered",
      "paid",
      "lost",
    ])
    .default("new"),
  notes: z.string().optional(),
});

// 8. Add Note
export const addNotePayloadSchema = z.object({
  action: z.literal("add_note"),
  title: z.string().min(1, "Title is required"),
  content: z.string().default(""),
  folder: z.string().default("general"),
  tags: z.array(z.string()).default([]),
});

// 9. Create Decision
export const createDecisionPayloadSchema = z.object({
  action: z.literal("create_decision"),
  title: z.string().min(1, "Decision title is required"),
  why_now: z.string().optional(),
  upside: z.string().optional(),
  downside: z.string().optional(),
  cost: z.string().optional(),
  risk: z.enum(["low", "medium", "high"]).default("medium"),
  worst_case: z.string().optional(),
  best_case: z.string().optional(),
  reversible: z.boolean().default(true),
});

// 10. Save Debrief
export const saveDebriefPayloadSchema = z.object({
  action: z.literal("save_debrief"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  energy_rating: z.number().int().min(1).max(5).default(4),
  accomplishments: z.string().optional(),
  obstacles: z.string().optional(),
  gratitude: z.string().optional(),
  tomorrow_focus: z.string().optional(),
});

// 11. Log Agent Report / Audit Trail
export const logReportPayloadSchema = z.object({
  action: z.literal("log_report"),
  title: z.string().min(1, "Report title is required"),
  summary: z.string().min(1, "Summary is required"),
  changes_made: z.array(z.string()).optional().default([]),
  strategic_recommendations: z.array(z.string()).optional().default([]),
  full_markdown: z.string().optional(),
});

// Combined Action Payload Schema
export const agentActionSchema = z.discriminatedUnion("action", [
  captureThoughtPayloadSchema,
  addBrainDumpPayloadSchema,
  createTaskPayloadSchema,
  updateTaskPayloadSchema,
  setDayPlanPayloadSchema,
  orchestrateDayPayloadSchema,
  logTimeEntryPayloadSchema,
  logLeadPayloadSchema,
  addNotePayloadSchema,
  createDecisionPayloadSchema,
  saveDebriefPayloadSchema,
  logReportPayloadSchema,
]);

export type AgentActionPayload = z.infer<typeof agentActionSchema>;

/**
 * Master System Prompt for Hermes / External LLM running the daily Midnight Cron Orchestration
 */
export const HERMES_MASTER_SYSTEM_PROMPT = `# HERMES: AUTONOMOUS LIFE OS CHIEF OF STAFF & STRATEGIC ORCHESTRATOR

You are Hermes, the autonomous AI Chief of Staff and life-operating copilot for LIFE OS (ANTIDOTE).
You have programmatic access via REST API to plan, organize, and track the owner's career, marriage target (250,000 EGP), freelance MERN/Next.js revenue engine (30k/mo), deep work blocks, and life rhythms.

---

## 🕒 DAILY MIDNIGHT SCHEDULE (12:00 AM CRON PROTOCOL)

Every night at **12:00 AM (00:00)**, you execute an autonomous orchestration cycle so the owner wakes up with a calibrated, ready-to-execute day plan.

### 4-Step Orchestration Workflow:

1. **INSPECT LIVE CONTEXT (GET /api/agent/hermes)**:
   - Call \`GET /api/agent/hermes\` with header \`Authorization: Bearer <API_KEY>\`.
   - Read today's backlog tasks, active goals, open projects, leads in pipeline, and marriage budget status.

2. **CALIBRATE MORNING MISSION & PRIORITIES**:
   - Determine available deep work capacity (typically 8 hours).
   - Select or generate the **Top 3 Strategic Focus Tasks (P1 Critical)** for tomorrow:
     * Focus Task 1: Revenue / Client / Outreach Action (e.g. Upwork Proposals, Lead follow-ups).
     * Focus Task 2: Flagship Product / Code Milestone (e.g. SaaS Dashboard feature, Demo deployment).
     * Focus Task 3: Personal / Habit / Relationship Growth (e.g. Partner activity, Evening shutdown).
   - Formulate a razor-sharp **"The One Thing" Focus Question Answer** that defines success for tomorrow.

3. **EXECUTE PROGRAMMATIC UPDATES (POST /api/agent/hermes)**:
   - Call \`POST /api/agent/hermes\` with action \`"orchestrate_day"\` or \`"set_day_plan"\`.
   - Automatically assign \`scheduled_date\` to upcoming tasks and mark \`is_top_three = true\` for the top 3.
   - If new high-leverage opportunities arise, drop creative business suggestions via \`"add_brain_dump"\`.

4. **RECORD EXECUTIVE AUDIT BRIEFING (\`"log_report"\`)**:
   - Log an executive report summarizing:
     * What was planned and prioritized for the day.
     * Strategic rationale for chosen tasks.
     * Suggested improvements and ideas.

---

## 🛠️ API REFERENCE & PAYLOADS

### Base URL: \`https://smart-antidote.vercel.app/api/agent/hermes\`
### Headers: \`Authorization: Bearer <YOUR_AGENT_API_KEY>\`, \`Content-Type: application/json\`

### 1. Autonomous Midnight Orchestration (\`action: "orchestrate_day"\`):
\`\`\`json
{
  "action": "orchestrate_day",
  "target_date": "2026-08-26",
  "available_hours": 8,
  "energy": 4,
  "focus_question_answer": "إنهاء ونشر Live Demo لمشروع SaaS Dashboard وإرسال 5 مقترحات Upwork.",
  "top_three_task_ids": ["uuid-1", "uuid-2", "uuid-3"],
  "new_tasks": [
    {
      "title": "متابعة العميل المحتمل للـ SaaS Dashboard على Upwork",
      "priority": "critical",
      "task_type": "revenue",
      "estimated_minutes": 45,
      "is_top_three": true,
      "description": "إرسال مقطع فيديو دقيقة واحدة يشرح كيفية حل مشكلة الـ Performance."
    }
  ],
  "brain_dump_suggestions": [
    "فكرة باقة جديدة: أتمتة ديسكورد + لوحة إدارة اشتراكات لمجتمعات الألعاب.",
    "اقتراح خروجة نهاية الأسبوع: تمشية الغروب في الممشى السياحي بالمنصورة."
  ],
  "executive_briefing": "تم تجهيز خطة الصباح بنجاح: تم تخصيص 4 ساعات للـ Deep Work و 2 ساعة للـ Outreach والمبيعات. الهدف الأكبر اليوم هو إغلاق أول عميل فريلانس."
}
\`\`\`

### 2. Set Morning Plan (\`action: "set_day_plan"\`):
\`\`\`json
{
  "action": "set_day_plan",
  "plan_date": "2026-08-26",
  "available_hours": 8,
  "energy": 4,
  "focus_question_answer": "إنجاز المهام الاستراتيجية الثلاث وتجنب المشتتات.",
  "top_three_task_ids": ["uuid-task-1", "uuid-task-2", "uuid-task-3"],
  "notes": "خطة مضبوطة بدقة بناء على أولويات الـ MERN Stack وصندوق الزواج."
}
\`\`\`

### 3. Drop Brain Dump Ideas (\`action: "add_brain_dump"\`):
\`\`\`json
{
  "action": "add_brain_dump",
  "content": "فكرة خدمة مصغرة: تحسين سرعة مواقع Next.js و Core Web Vitals للشركات.",
  "category": "business"
}
\`\`\`

### 4. Create Action Task (\`action: "create_task"\`):
\`\`\`json
{
  "action": "create_task",
  "title": "تصميم نموذج المقترحات التفاعلي بـ Next.js",
  "priority": "P1",
  "task_type": "revenue",
  "scheduled_date": "2026-08-26",
  "estimated_minutes": 90,
  "is_top_three": true
}
\`\`\`

### 5. Log Executive Briefing Report (\`action: "log_report"\`):
\`\`\`json
{
  "action": "log_report",
  "title": "تقرير التخطيط اليومي - 26 أغسطس 2026",
  "summary": "تمت مراجعة خطة اليوم وتوزيع 8 ساعات عمل مركزة على 3 مراحل تنفيذية.",
  "changes_made": [
    "تحديد أهم 3 مهام لليوم وجدولتها في /today",
    "ترحيل المهام الإدارية المنخفضة للمساء",
    "إضافة فكرة جديدة في Brain Dump لتوسيع باقات الفريلانس"
  ],
  "strategic_recommendations": [
    "التركيز على كتلة الـ Deep Work الصباحية بدون فتح السوشيال ميديا.",
    "متابعة الـ 3 صفقات المفتوحة في قمع المبيعات لزيادة احتمالية الإغلاق."
  ]
}
\`\`\`

### 6. Quick Capture Thought (\`action: "capture_thought"\`):
\`\`\`json
{
  "action": "capture_thought",
  "text": "متابعة العميل بخصوص المقترح الفني",
  "source": "hermes_chat"
}
\`\`\`
`;

export const HERMES_TOOL_DEFINITIONS = [
  {
    type: "function",
    function: {
      name: "get_life_os_context",
      description:
        "Fetch real-time LIFE OS context including today's schedule, active tasks, financial marriage fund status, freelance leads, and goals.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "orchestrate_day",
      description:
        "Autonomous 12:00 AM Midnight daily planner that sets morning mission, creates tasks, marks top 3, and writes executive briefing.",
      parameters: {
        type: "object",
        properties: {
          target_date: {
            type: "string",
            description: "Target date in YYYY-MM-DD format",
          },
          available_hours: {
            type: "number",
            description: "Total available deep work hours",
          },
          energy: {
            type: "number",
            description: "Expected energy rating from 1 to 5",
          },
          focus_question_answer: {
            type: "string",
            description: "The One Thing focus for the day",
          },
          executive_briefing: {
            type: "string",
            description: "Executive summary of planned schedule",
          },
        },
        required: [
          "target_date",
          "focus_question_answer",
          "executive_briefing",
        ],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_day_plan",
      description:
        "Calibrate the morning plan and available hours for a target date.",
      parameters: {
        type: "object",
        properties: {
          plan_date: { type: "string" },
          available_hours: { type: "number" },
          energy: { type: "number" },
          focus_question_answer: { type: "string" },
        },
        required: ["plan_date", "focus_question_answer"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "capture_thought",
      description:
        "Quickly capture an idea or thought into the Brain Dump inbox without breaking flow.",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string", description: "Raw thought text content" },
          source: { type: "string" },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_brain_dump",
      description:
        "Add a creative strategic suggestion or idea to the Brain Dump inbox.",
      parameters: {
        type: "object",
        properties: {
          content: { type: "string" },
          category: {
            type: "string",
            enum: [
              "career",
              "business",
              "personal",
              "marriage",
              "idea",
              "general",
            ],
          },
        },
        required: ["content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_task",
      description:
        "Create an actionable task linked to a project or strategic goal.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          priority: {
            type: "string",
            enum: ["P1", "P2", "P3", "P4", "critical", "high", "medium", "low"],
          },
          task_type: { type: "string" },
          scheduled_date: { type: "string" },
          estimated_minutes: { type: "number" },
          is_top_three: { type: "boolean" },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_task",
      description:
        "Update the status, priority, or scheduled date of an existing task.",
      parameters: {
        type: "object",
        properties: {
          task_id: { type: "string" },
          status: {
            type: "string",
            enum: [
              "backlog",
              "planned",
              "in_progress",
              "done",
              "dropped",
              "someday",
            ],
          },
          priority: { type: "string" },
          scheduled_date: { type: "string" },
        },
        required: ["task_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "log_time_entry",
      description:
        "Record a focused Deep Work, Client delivery, or Sales outreach session.",
      parameters: {
        type: "object",
        properties: {
          duration_min: { type: "number" },
          kind: {
            type: "string",
            enum: [
              "deep_work",
              "delivery",
              "sales",
              "learning",
              "product",
              "admin",
              "relationship",
              "rest",
            ],
          },
          focus_rating: { type: "number" },
          note: { type: "string" },
        },
        required: ["duration_min"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "log_lead",
      description:
        "Track an incoming prospective client lead in the freelance pipeline.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          stage: { type: "string" },
          expected_value: { type: "number" },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_note",
      description:
        "Save structured knowledge, technical playbook, or architecture note.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          folder: { type: "string" },
        },
        required: ["title", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_decision",
      description:
        "Open a Decision Canvas to evaluate irreversible vs reversible forks in the road.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          risk: { type: "string", enum: ["low", "medium", "high"] },
          reversible: { type: "boolean" },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "save_debrief",
      description:
        "Save daily shutdown debrief wins, obstacles, and tomorrow's focus.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string" },
          energy_rating: { type: "number" },
          accomplishments: { type: "string" },
          tomorrow_focus: { type: "string" },
        },
        required: ["date"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "log_report",
      description:
        "Log an executive briefing report of what was planned and executed.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          changes_made: { type: "array", items: { type: "string" } },
          strategic_recommendations: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["title", "summary"],
      },
    },
  },
];
