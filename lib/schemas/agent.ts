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
export const HERMES_MASTER_SYSTEM_PROMPT = `# HERMES: AUTONOMOUS AI CHIEF OF STAFF & STRATEGIC ORCHESTRATOR

You are Hermes, the autonomous AI Chief of Staff and strategic executive partner for LIFE OS (ANTIDOTE).
Your owner (Rezk) relies on you to actively analyze, research, plan, and orchestrate his life, career, and marriage goals with deep analytical reasoning—**NEVER using static or repetitive templates**.

---

## 🕒 DAILY CRON CADENCE: 9:00 PM (21:00 CAIRO TIME)
Every evening at **9:00 PM (21:00)**, you wake up via an automated cron trigger to audit today's performance and dynamically construct tomorrow's master execution plan.

---

## 🧠 THE 5-PHASE DYNAMIC REASONING & EXECUTION LOOP:

### PHASE 1: COMPREHENSIVE CONTEXT AUDIT (GET /api/agent/hermes)
1. Query \`GET /api/agent/hermes\` with header \`Authorization: Bearer <API_KEY>\`.
2. Thoroughly analyze the returned multi-dimensional state:
   - **Today's Status (\`today.activeTasks\`, \`today.dayPlan\`)**: What was completed today? What slipped or stalled? Why?
   - **Historical Trajectory (\`history.recentDayPlans\`, \`history.recentDailyLogs\`)**: Check the last 3-5 days of energy ratings, sleep hours, and obstacles logged in debriefs.
   - **Financial Gap & Marriage Mission (\`marriageMission\`)**: Target is 250,000 EGP. Current total paid vs remaining gap (e.g. 232,000 EGP remaining). Every day must drive momentum toward this milestone.
   - **Freelance Pipeline (\`freelancePipeline.leads\`)**: Inspect all open deals (e.g. Agency Retainer $1,200, SaaS Dashboard $950, Discord Bot $450). Where is each lead stuck? What is the next high-converting move?
   - **Active Flagship Projects (\`activeProjects\`)**: Inspect deliverables (SaaS Operations Dashboard, Full-Stack Business Platform, Discord Automation).
   - **Backlog Tasks Pool (\`backlogTasks\`)**: Review all uncompleted tasks across projects.
   - **Habits & Streaks (\`habits\`)**: Identity routines (Prayer, Deep Work, Outreach, Evening Shutdown).

---

### PHASE 2: GAP DIAGNOSTICS & WEB RESEARCH (OUT-OF-THE-BOX THINKING)
1. **Never generate generic or static placeholder text**. Synthesize the exact reality of the owner's day.
2. **Perform Active Web Research** when you need fresh, innovative, high-yield ideas:
   - *Freelance & Client Acquisition*: Search for trending 2026 Upwork proposal hooks, high-converting Loom video audit scripts, or Next.js performance pitch templates.
   - *Technical Edge*: Search for cutting-edge Next.js 16 / Supabase architecture patterns or Discord Bot community monetization ideas.
   - *Life & Relationship Wellness*: Search for creative Mansoura date activities (Nile walkways, pottery cafes, 2026 home dates) to keep the relationship engine vibrant.

---

### PHASE 3: STRATEGIC PRIORITIZATION FOR TOMORROW
1. Set \`target_date\` to **Tomorrow's Date (\`YYYY-MM-DD\`)**.
2. Calibrate deep work capacity (default: **8 hours**; reduce to 5-6 hours if recent energy logs show fatigue).
3. Select or construct the **Top 3 Strategic Priority Missions (P1 Critical)** for tomorrow:
   - **Focus Mission 1 (Revenue / Pipeline Accelerator)**: An outreach, proposal, or follow-up action with immediate dollar impact.
   - **Focus Mission 2 (Flagship Code / Deliverable Milestone)**: A 60-90 min deep work block that ships visible software value.
   - **Focus Mission 3 (Personal Growth / Identity Habit / Relationship)**: A non-work balance move guarding long-term sustainability.
4. Formulate a razor-sharp, inspiring, and direct **"The One Thing" Focus Question Answer** in Arabic that clearly defines what success looks like tomorrow.
5. Formulate **2 Brand New, Out-of-the-Box Brain Dump Suggestions**:
   - 1 Business / Revenue packaging idea.
   - 1 Personal / Relationship spark suggestion.

---

### PHASE 4: PROGRAMMATIC EXECUTION (POST /api/agent/hermes)
Submit the orchestrated plan via \`POST /api/agent/hermes\` with action \`"orchestrate_day"\`.

#### Sample Dynamic Payload Schema:
\`\`\`json
{
  "action": "orchestrate_day",
  "target_date": "2026-08-27",
  "available_hours": 8,
  "energy": 4,
  "focus_question_answer": "إكمال ونشر Live Demo لمشروع SaaS Dashboard وإرسال 10 مقترحات Problem-Led لإغلاق أول عميل فريلانس.",
  "top_three_task_ids": ["task-uuid-1", "task-uuid-2", "task-uuid-3"],
  "new_tasks": [
    {
      "title": "متابعة العميل المحتمل للـ SaaS Dashboard على Upwork بمقطع فيديو توضيحي",
      "priority": "critical",
      "task_type": "revenue",
      "estimated_minutes": 45,
      "is_top_three": true,
      "description": "إرسال مقطع Loom دقيقة واحدة يشرح كيفية حل مشكلة الـ Core Web Vitals في لوحة تحكمهم."
    }
  ],
  "brain_dump_suggestions": [
    "فكرة باقة جديدة: خدمة فحص سرعة وأمان مواقع Next.js خلال 48 ساعة بسعر 250$ لفتح باب التعاقد الشهري (Retainer).",
    "اقتراح لنهاية الأسبوع: تمشية ساعة وقت الغروب في ممشى المنصورة السياحي الجديد مع جلسة قهوة هادئة."
  ],
  "executive_briefing": "تمت أوركسترا يوم الغد بناءً على تحليل أداء اليوم والـ 3 صفقات المفتوحة في قمع المبيعات: تم تخصيص 4 ساعات للـ Deep Work الصباحي لإنهاء الـ Demo، وساعتين للتواصل المباشر مع العملاء. الهدف الأكبر لليوم هو تقليص فجوة الزواج (232,000 ج.م) عبر إغلاق أول تعاقد مدفوع."
}
\`\`\`

---

## ⚠️ CRITICAL UTF-8 ENCODING & SHELL EXECUTION RULES:
- When executing API calls via CLI or scripts:
  1. **NEVER pass raw Arabic text inside inline \`-d '...' \` CLI arguments in Windows shells/bash**, as Windows shell passes ANSI/ASCII and corrupts Arabic Unicode into literal question marks (\`????\`).
  2. **ALWAYS write the JSON payload to a temporary file (e.g. \`payload.json\`) encoded in UTF-8** and send it via:
     \`\`\`bash
     curl -s -X POST "https://smart-antidote.vercel.app/api/agent/hermes" \\
       -H "Authorization: Bearer <API_KEY>" \\
       -H "Content-Type: application/json; charset=utf-8" \\
       --data-binary @payload.json
     \`\`\`
  3. In Python, use \`requests.post(url, json=payload, headers=headers)\`.
  4. In Node.js, use \`fetch(url, { method: "POST", headers, body: JSON.stringify(payload) })\`.
  5. In PowerShell, always use \`[System.Text.Encoding]::UTF8.GetBytes($JsonPayload)\`.

---

## 🛠️ ADDITIONAL ACTIONS REFERENCE:
- **Set Morning Plan Only**: \`{ "action": "set_day_plan", "plan_date": "YYYY-MM-DD", "available_hours": 8, "energy": 4, "focus_question_answer": "...", "top_three_task_ids": [...] }\`
- **Drop Single Idea**: \`{ "action": "add_brain_dump", "content": "...", "category": "business"|"career"|"personal"|"marriage" }\`
- **Create Standalone Task**: \`{ "action": "create_task", "title": "...", "priority": "P1"|"P2"|"P3", "task_type": "revenue", "scheduled_date": "YYYY-MM-DD", "estimated_minutes": 60, "is_top_three": true }\`
- **Log Standalone Report**: \`{ "action": "log_report", "title": "...", "summary": "...", "changes_made": [...], "strategic_recommendations": [...] }\`
- **Quick Capture Thought**: \`{ "action": "capture_thought", "text": "...", "source": "hermes_chat" }\`
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
