import { z } from "zod";

export const HABIT_CATEGORIES = [
  "health_routine",
  "deep_work",
  "revenue",
  "learning",
  "relationship",
  "finance",
  "personal",
] as const;
export type HabitCategory = (typeof HABIT_CATEGORIES)[number];

export const habitFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "اسم العادة مطلوب"),
  description: z.string().nullable().optional(),
  category: z.enum(HABIT_CATEGORIES).default("health_routine"),
  target_per_week: z.coerce.number().int().min(1, "المستهدف يجب أن يكون بين 1 و 7").max(7, "المستهدف الأقصى 7 أيام").default(7),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().default(0),
});
export type HabitFormData = z.infer<typeof habitFormSchema>;

export const toggleHabitLogSchema = z.object({
  habit_id: z.string().uuid(),
  log_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "تاريخ غير صالح (YYYY-MM-DD)"),
  completed: z.boolean(),
  note: z.string().nullable().optional(),
});
export type ToggleHabitLogData = z.infer<typeof toggleHabitLogSchema>;
