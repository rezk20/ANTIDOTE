import { z } from "zod";

export const MARRIAGE_EXPENSE_CATEGORIES = [
  "furniture",
  "finishing",
  "rent_deposit",
  "hall",
  "clothing",
  "photography",
  "transport",
  "appliances",
  "jewelry",
  "misc",
] as const;
export type MarriageExpenseCategory = (typeof MARRIAGE_EXPENSE_CATEGORIES)[number];

export const MARRIAGE_EXPENSE_STATUSES = [
  "planned",
  "in_progress",
  "paid",
  "dropped",
] as const;
export type MarriageExpenseStatus = (typeof MARRIAGE_EXPENSE_STATUSES)[number];

export const marriageExpenseFormSchema = z.object({
  id: z.string().uuid().optional(),
  item: z.string().min(1, "اسم المصروف / البند مطلوب"),
  category: z.enum(MARRIAGE_EXPENSE_CATEGORIES).default("furniture"),
  estimated_cost: z.coerce.number().min(0, "المبلغ التقديري يجب ألا يقل عن 0"),
  actual_cost: z.coerce.number().min(0).nullable().optional(),
  paid_amount: z.coerce.number().min(0).default(0),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "تاريخ الاستحقاق غير صالح (YYYY-MM-DD)").nullable().optional().or(z.literal("")),
  priority: z.enum(["critical", "high", "medium", "low"]).default("medium"),
  status: z.enum(MARRIAGE_EXPENSE_STATUSES).default("planned"),
  notes: z.string().nullable().optional(),
});
export type MarriageExpenseFormData = z.infer<typeof marriageExpenseFormSchema>;

export const recordPaymentSchema = z.object({
  expense_id: z.string().uuid(),
  amount: z.coerce.number().min(1, "مبلغ السداد يجب أن يكون أكبر من 0"),
});
export type RecordPaymentFormData = z.infer<typeof recordPaymentSchema>;
