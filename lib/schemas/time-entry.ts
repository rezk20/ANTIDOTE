import { z } from "zod";

export const TIME_ENTRY_KINDS = [
  "deep_work",
  "delivery",
  "sales",
  "learning",
  "product",
  "admin",
  "relationship",
  "rest",
] as const;
export type TimeEntryKind = (typeof TIME_ENTRY_KINDS)[number];

export const timeEntryFormSchema = z.object({
  id: z.string().uuid().optional(),
  task_id: z.string().uuid().nullable().optional(),
  project_id: z.string().uuid().nullable().optional(),
  kind: z.enum(TIME_ENTRY_KINDS).default("deep_work"),
  started_at: z.string().min(1, "وقت البداية مطلوب"),
  ended_at: z.string().nullable().optional(),
  duration_min: z.coerce.number().int().min(1, "المدة بالدقائق يجب أن تكون 1 على الأقل"),
  focus_rating: z.coerce.number().int().min(1, "تقييم التركيز بين 1 و 5").max(5, "تقييم التركيز بين 1 و 5").nullable().optional(),
  note: z.string().nullable().optional(),
});
export type TimeEntryFormData = z.infer<typeof timeEntryFormSchema>;

export const timerSessionSchema = z.object({
  task_id: z.string().uuid().nullable().optional(),
  project_id: z.string().uuid().nullable().optional(),
  kind: z.enum(TIME_ENTRY_KINDS).default("deep_work"),
  started_at: z.string().min(1, "وقت البداية مطلوب"),
  ended_at: z.string().min(1, "وقت النهاية مطلوب"),
  focus_rating: z.coerce.number().int().min(1).max(5).default(4),
  note: z.string().nullable().optional(),
});
export type TimerSessionData = z.infer<typeof timerSessionSchema>;
