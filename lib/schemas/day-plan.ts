import { z } from "zod";

const emptyStringToNull = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? null : val;

export const dayPlanStatusEnum = z.enum(["draft", "active", "closed"]);

export const dayPlanSchema = z.object({
  plan_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  available_hours: z.coerce
    .number({ message: "Available hours must be a number" })
    .min(0.5, "Available hours must be at least 0.5")
    .max(24, "Available hours cannot exceed 24")
    .default(6.0),
  energy: z.coerce
    .number({ message: "Energy must be between 1 and 5" })
    .min(1, "Minimum energy is 1")
    .max(5, "Maximum energy is 5")
    .default(3),
  focus_question_answer: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(500, "Focus answer must be under 500 characters").optional().nullable(),
  ),
  money_action_task_id: z.preprocess(
    emptyStringToNull,
    z.string().uuid("Invalid task ID for revenue action").optional().nullable(),
  ),
  personal_action_task_id: z.preprocess(
    emptyStringToNull,
    z.string().uuid("Invalid task ID for personal action").optional().nullable(),
  ),
  relationship_action_task_id: z.preprocess(
    emptyStringToNull,
    z.string().uuid("Invalid task ID for relationship action").optional().nullable(),
  ),
  shutdown_time: z.preprocess(
    emptyStringToNull,
    z.string().optional().nullable(),
  ),
  status: dayPlanStatusEnum.default("active"),
  notes: z.preprocess(
    emptyStringToNull,
    z.string().trim().optional().nullable(),
  ),
});

export type DayPlanInput = z.infer<typeof dayPlanSchema>;

export type DayPlanState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<keyof DayPlanInput | "_form", string[]>>;
};

export const shutdownSchema = z.object({
  plan_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  tomorrow_focus: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(500).optional().nullable(),
  ),
  shutdown_notes: z.preprocess(
    emptyStringToNull,
    z.string().trim().optional().nullable(),
  ),
  rollover_task_ids: z.preprocess(
    (v) => (typeof v === "string" ? JSON.parse(v) : v),
    z.array(z.string().uuid()).optional().default([]),
  ),
});

export type ShutdownInput = z.infer<typeof shutdownSchema>;

export type ShutdownState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<keyof ShutdownInput | "_form", string[]>>;
};
