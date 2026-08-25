import { z } from "zod";

export const agentActionKindSchema = z.enum([
  "capture_thought",
  "create_task",
  "update_task",
  "log_time_entry",
  "log_lead",
  "add_note",
  "create_decision",
  "save_debrief",
]);

export type AgentActionKind = z.infer<typeof agentActionKindSchema>;

// 1. Capture Thought / Brain Dump
export const captureThoughtPayloadSchema = z.object({
  action: z.literal("capture_thought"),
  text: z.string().min(1, "Text is required"),
  source: z.string().optional().default("ai_agent"),
});

// 2. Create Task
export const createTaskPayloadSchema = z.object({
  action: z.literal("create_task"),
  title: z.string().min(1, "Title is required"),
  priority: z.enum(["critical", "high", "medium", "low", "P1", "P2", "P3", "P4"]).default("medium"),
  task_type: z.enum([
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
  ]).default("personal"),
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date (YYYY-MM-DD)").optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date (YYYY-MM-DD)").optional(),
  estimated_minutes: z.number().int().positive().optional(),
  goal_id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
});

// 3. Update Task
export const updateTaskPayloadSchema = z.object({
  action: z.literal("update_task"),
  task_id: z.string().uuid("Invalid task_id"),
  status: z.enum(["backlog", "planned", "in_progress", "done", "dropped", "someday", "todo"]).optional(),
  priority: z.enum(["critical", "high", "medium", "low", "P1", "P2", "P3", "P4"]).optional(),
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
});

// 4. Log Time Entry
export const logTimeEntryPayloadSchema = z.object({
  action: z.literal("log_time_entry"),
  duration_min: z.number().int().positive("Duration must be positive"),
  kind: z.enum(["deep_work", "delivery", "sales", "learning", "product", "admin", "relationship", "rest"]).default("deep_work"),
  task_id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
  focus_rating: z.number().int().min(1).max(5).optional().default(4),
  note: z.string().optional(),
  started_at: z.string().optional(),
});

// 5. Log Lead
export const logLeadPayloadSchema = z.object({
  action: z.literal("log_lead"),
  title: z.string().min(1, "Lead title / client name is required"),
  source: z.string().optional().default("agent_outreach"),
  expected_value: z.number().positive().optional(),
  stage: z.enum([
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
  ]).default("new"),
  notes: z.string().optional(),
});

// 6. Add Note
export const addNotePayloadSchema = z.object({
  action: z.literal("add_note"),
  title: z.string().min(1, "Title is required"),
  content: z.string().default(""),
  folder: z.string().default("general"),
  tags: z.array(z.string()).default([]),
});

// 7. Create Decision
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

// 8. Save Daily Debrief
export const saveDebriefPayloadSchema = z.object({
  action: z.literal("save_debrief"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date (YYYY-MM-DD)"),
  energy_rating: z.number().int().min(1).max(5).default(4),
  accomplishments: z.string().optional(),
  obstacles: z.string().optional(),
  gratitude: z.string().optional(),
  tomorrow_focus: z.string().optional(),
});

// Combined Action Payload Schema
export const agentActionSchema = z.discriminatedUnion("action", [
  captureThoughtPayloadSchema,
  createTaskPayloadSchema,
  updateTaskPayloadSchema,
  logTimeEntryPayloadSchema,
  logLeadPayloadSchema,
  addNotePayloadSchema,
  createDecisionPayloadSchema,
  saveDebriefPayloadSchema,
]);

export type AgentActionPayload = z.infer<typeof agentActionSchema>;

/**
 * Master System Prompt for Hermes or external AI agents interacting with LIFE OS
 */
export const HERMES_MASTER_SYSTEM_PROMPT = `You are Hermes, an autonomous AI executive partner and operating copilot integrated directly into LIFE OS (ANTIDOTE).

### Your Core Directives:
1. **Context-Grounded Operations**: When starting any session or when requested, always inspect the live context provided by the LIFE OS API (GET /api/agent/hermes).
2. **Prioritization & Focus (§Rule 1, §Rule 2)**: Help the owner guard high-leverage Deep Work, prevent context switching, and keep the critical 250k EGP marriage goal and freelance pipeline front and center.
3. **Execution Rigor (§Rule 4)**: Never produce vague motivational advice. Always propose structured, atomic actions with priority (P1/P2/P3), clear estimates, or specific next moves.
4. **Non-Punitive Tone (§41, §70, §71)**: If tasks slip or reviews reveal friction, provide objective, actionable adjustments rather than guilt or pressure.
5. **Tool & Action Execution**:
   - To capture thoughts/ideas: Execute action "capture_thought".
   - To schedule work: Execute action "create_task" or "update_task".
   - To record deep work sessions: Execute action "log_time_entry".
   - To track prospective deals: Execute action "log_lead".
   - To document insights/learning: Execute action "add_note".
   - To weigh high-impact forks in the road: Execute action "create_decision".
   - To close the day: Execute action "save_debrief".

### API Interaction Protocol:
- **Base Endpoint**: \`/api/agent/hermes\`
- **Authentication**: Include \`Authorization: Bearer <YOUR_AGENT_API_KEY>\` header with all HTTP requests, or run within an active authenticated browser session.
- **GET Request**: Returns full live state (Today's tasks, Day plan, Active Goals, Marriage budget progress, Open Leads, Recent notes).
- **POST Request**: JSON payload containing \`{ "action": "<ACTION_NAME>", ...params }\`.
`;

/**
 * OpenAI / Function Calling JSON Schemas for Hermes tool use
 */
export const HERMES_TOOL_DEFINITIONS = [
  {
    type: "function",
    function: {
      name: "get_life_os_context",
      description: "Fetch real-time LIFE OS context including today's schedule, active tasks, financial marriage fund status, freelance leads, and goals.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "capture_thought",
      description: "Quickly capture an idea, task, or raw note into the Brain Dump inbox for later triage.",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string", description: "The captured thought or note content." },
          source: { type: "string", description: "Source of capture (e.g. 'hermes_chat', 'telegram', 'voice')." },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_task",
      description: "Create an actionable task in LIFE OS with priority, scheduled date, and optional goal alignment.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Clear, verb-first task title." },
          priority: { type: "string", enum: ["P1", "P2", "P3", "P4"], description: "P1 (Urgent/Critical), P2 (High), P3 (Medium), P4 (Low)." },
          scheduled_date: { type: "string", description: "Target date in YYYY-MM-DD format." },
          estimated_minutes: { type: "number", description: "Estimated completion time in minutes." },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "log_time_entry",
      description: "Log a completed work session (deep work, delivery, or learning) towards project and productivity metrics.",
      parameters: {
        type: "object",
        properties: {
          duration_min: { type: "number", description: "Duration of the work session in minutes." },
          kind: { type: "string", enum: ["deep_work", "delivery", "learning", "admin", "shallow"], description: "Category of work." },
          focus_rating: { type: "number", minimum: 1, maximum: 5, description: "Focus quality rating from 1 to 5." },
          note: { type: "string", description: "Optional brief note on what was accomplished." },
        },
        required: ["duration_min"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "log_lead",
      description: "Create or log a freelance client lead into the acquisition pipeline.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Client or project title." },
          expected_value: { type: "number", description: "Expected deal value in EGP." },
          stage: { type: "string", enum: ["lead", "contacted", "call_scheduled", "proposal_sent", "negotiating", "won", "lost"] },
          notes: { type: "string", description: "Context, requirements, or client background." },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_note",
      description: "Create a structured knowledge note in a specific folder with tags.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Note title." },
          content: { type: "string", description: "Markdown body content." },
          folder: { type: "string", description: "Target folder (e.g., 'freelance', 'tech', 'general')." },
          tags: { type: "array", items: { type: "string" }, description: "Tags for categorization." },
        },
        required: ["title", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_decision",
      description: "Log a structured decision canvas with upside, downside, worst case, and reversibility.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Decision statement." },
          why_now: { type: "string", description: "Trigger reason." },
          upside: { type: "string", description: "Potential upside / gains." },
          downside: { type: "string", description: "Potential downside / risks." },
          reversible: { type: "boolean", description: "True if Type 2 (reversible), false if Type 1 (irreversible)." },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "save_debrief",
      description: "Save a daily evening debrief and energy rating.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "Date in YYYY-MM-DD format." },
          energy_rating: { type: "number", minimum: 1, maximum: 5, description: "Daily energy score (1-5)." },
          accomplishments: { type: "string", description: "Highlights and wins." },
          obstacles: { type: "string", description: "Frictions or blocks faced." },
          tomorrow_focus: { type: "string", description: "Top focus for tomorrow." },
        },
        required: ["date"],
      },
    },
  },
];
