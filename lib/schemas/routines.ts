import { z } from "zod";

export const ROUTINE_TIMES_OF_DAY = [
  "morning",
  "workday",
  "evening",
  "night",
] as const;
export type RoutineTimeOfDay = (typeof ROUTINE_TIMES_OF_DAY)[number];

export const routineItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "عنوان البند مطلوب"),
  duration_min: z.coerce.number().int().min(1, "المدة بالدقائق يجب أن تكون 1 على الأقل").default(15),
  is_active: z.boolean().default(true),
  notes: z.string().optional(),
});
export type RoutineItem = z.infer<typeof routineItemSchema>;

export const routineFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "اسم الروتين مطلوب"),
  time_of_day: z.enum(ROUTINE_TIMES_OF_DAY),
  items: z.array(routineItemSchema).default([]),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().default(0),
});
export type RoutineFormData = z.infer<typeof routineFormSchema>;
