import { z } from "zod";

export const dailyLogFormSchema = z.object({
  id: z.string().uuid().optional(),
  log_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "تاريخ غير صالح (YYYY-MM-DD)"),
  sleep_at: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "وقت النوم غير صالح (HH:MM)").nullable().optional().or(z.literal("")),
  woke_at: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "وقت الاستيقاظ غير صالح (HH:MM)").nullable().optional().or(z.literal("")),
  hours_slept: z.coerce.number().min(0, "ساعات النوم يجب أن تكون 0 أو أكثر").max(24, "ساعات النوم القصوى 24").nullable().optional(),
  energy: z.coerce.number().int().min(1, "تقييم الطاقة بين 1 و 5").max(5, "تقييم الطاقة بين 1 و 5").nullable().optional(),
  focus: z.coerce.number().int().min(1, "تقييم التركيز بين 1 و 5").max(5, "تقييم التركيز بين 1 و 5").nullable().optional(),
  note: z.string().nullable().optional(),
});
export type DailyLogFormData = z.infer<typeof dailyLogFormSchema>;
