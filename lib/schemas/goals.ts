import { z } from "zod";
import { GOAL_LEVELS, GOAL_STATUSES } from "@/lib/constants/enums";

export const goalSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Goal title cannot be empty." })
    .max(200, { message: "Goal title must be under 200 characters." }),
  level: z.enum(GOAL_LEVELS, {
    error: "Invalid goal level.",
  }),
  description: z.string().trim().max(2000).optional().nullable(),
  parent_id: z.string().uuid().optional().nullable().or(z.literal("")),
  target_value: z.coerce.number().min(0).optional().nullable(),
  unit: z.string().trim().max(50).optional().nullable(),
  status: z.enum(GOAL_STATUSES).default("active"),
  period_start: z.string().optional().nullable().or(z.literal("")),
  period_end: z.string().optional().nullable().or(z.literal("")),
  sort_order: z.coerce.number().default(0),
});

export type GoalInput = z.infer<typeof goalSchema>;

export type GoalState =
  | {
      ok?: boolean;
      errors?: Record<string, string[] | undefined>;
      message?: string;
    }
  | undefined;
