import { z } from "zod";

export const decisionOptionSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Option label is required"),
  notes: z.string().optional(),
});

export const decisionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Decision title must be at least 2 characters"),
  why_now: z.string().nullable().optional(),
  options: z.array(decisionOptionSchema).default([]),
  upside: z.string().nullable().optional(),
  downside: z.string().nullable().optional(),
  cost: z.string().nullable().optional(),
  time_required: z.string().nullable().optional(),
  risk: z.string().nullable().optional(),
  worst_case: z.string().nullable().optional(),
  best_case: z.string().nullable().optional(),
  reversible: z.boolean().default(true),
  decision: z.string().nullable().optional(),
  review_date: z.string().nullable().optional(), // YYYY-MM-DD
  status: z.enum(["open", "decided", "reviewed"]).default("open"),
});

export const decisionFormSchema = decisionSchema.omit({ id: true });

export type DecisionOptionInput = z.infer<typeof decisionOptionSchema>;
export type DecisionInput = z.infer<typeof decisionSchema>;
export type DecisionFormInput = z.infer<typeof decisionFormSchema>;
