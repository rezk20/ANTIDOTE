import { z } from "zod";
import { TASK_TYPES, TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants/enums";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Task title cannot be empty." })
    .max(300, { message: "Task title must be under 300 characters." }),
  description: z.string().trim().max(3000).optional().nullable(),
  area: z.string().trim().max(50).optional().nullable(),
  task_type: z.enum(TASK_TYPES, {
    error: "Invalid task type.",
  }),
  priority: z.enum(TASK_PRIORITIES).default("medium"),
  effort: z.coerce.number().min(1).max(5).default(3),
  duration_min: z.coerce.number().min(1).max(1440).optional().nullable(),
  scheduled_date: z.string().optional().nullable().or(z.literal("")),
  deadline: z.string().optional().nullable().or(z.literal("")),
  status: z.enum(TASK_STATUSES).default("backlog"),
  is_top_three: z.boolean().default(false),
  recurring_rule: z.string().trim().optional().nullable().or(z.literal("")),
  energy_level: z.coerce.number().min(1).max(5).default(3),
  revenue_impact: z.coerce.number().min(0).max(5).default(0),
  strategic_impact: z.coerce.number().min(0).max(5).default(0),
  relationship_impact: z.coerce.number().min(0).max(5).default(0),
  urgency: z.coerce.number().min(0).max(5).default(0),
  goal_id: z.string().uuid().optional().nullable().or(z.literal("")),
  project_id: z.string().uuid().optional().nullable().or(z.literal("")),
  lead_id: z.string().uuid().optional().nullable().or(z.literal("")),
  sort_order: z.coerce.number().default(0),
});

export type TaskInput = z.infer<typeof taskSchema>;

export type TaskState =
  | {
      ok?: boolean;
      errors?: Record<string, string[] | undefined>;
      message?: string;
    }
  | undefined;
