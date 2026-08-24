import { z } from "zod";
import { LEAD_STAGES, LEAD_EVENT_TYPES } from "@/lib/constants/enums";

export const createLeadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Lead title is required")
    .max(200, "Lead title must be 200 characters or less"),
  source: z.string().trim().max(100).optional().nullable(),
  url: z.string().trim().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  stage: z.enum(LEAD_STAGES).default("new"),
  expected_value: z.coerce
    .number()
    .nonnegative("Expected value must be 0 or greater")
    .optional()
    .nullable(),
  probability: z.coerce
    .number()
    .min(0, "Probability must be between 0 and 1")
    .max(1, "Probability must be between 0 and 1")
    .optional()
    .nullable(),
  client_id: z.string().uuid().optional().nullable().or(z.literal("")),
  proposal_amount: z.coerce.number().nonnegative().optional().nullable(),
  proposal_sent_at: z.string().optional().nullable().or(z.literal("")),
  proposal_notes: z.string().trim().max(2000).optional().nullable(),
  last_contact_at: z.string().optional().nullable().or(z.literal("")),
  next_follow_up_at: z.string().optional().nullable().or(z.literal("")),
  lost_reason: z.string().trim().max(500).optional().nullable(),
  notes: z.string().trim().max(5000).optional().nullable(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const moveLeadStageSchema = z.object({
  lead_id: z.string().uuid("Invalid lead ID"),
  stage: z.enum(LEAD_STAGES),
  lost_reason: z.string().trim().max(500).optional().nullable(),
  proposal_amount: z.coerce.number().nonnegative().optional().nullable(),
  next_follow_up_at: z.string().optional().nullable().or(z.literal("")),
  note: z.string().trim().max(1000).optional().nullable(),
});

export const logLeadEventSchema = z.object({
  lead_id: z.string().uuid("Invalid lead ID"),
  event_type: z.enum(LEAD_EVENT_TYPES),
  occurred_at: z.string().optional().nullable(),
  amount: z.coerce.number().nonnegative().optional().nullable(),
  note: z.string().trim().max(2000).optional().nullable(),
});

export const convertToClientSchema = z.object({
  lead_id: z.string().uuid("Invalid lead ID"),
  client_name: z.string().trim().min(1, "Client name is required").max(200),
  company: z.string().trim().max(200).optional().nullable(),
  contact: z.string().trim().max(200).optional().nullable(),
  create_project: z.boolean().default(false),
  project_name: z.string().trim().max(200).optional().nullable(),
  project_budget: z.coerce.number().nonnegative().optional().nullable(),
});

export const recordLeadPaymentSchema = z.object({
  lead_id: z.string().uuid("Invalid lead ID"),
  amount: z.coerce.number().positive("Payment amount must be greater than zero"),
  occurred_on: z.string().min(1, "Date is required"),
  note: z.string().trim().max(1000).optional().nullable(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type MoveLeadStageInput = z.infer<typeof moveLeadStageSchema>;
export type LogLeadEventInput = z.infer<typeof logLeadEventSchema>;
export type ConvertToClientInput = z.infer<typeof convertToClientSchema>;
export type RecordLeadPaymentInput = z.infer<typeof recordLeadPaymentSchema>;

export type LeadState = {
  errors?: Record<string, string[]>;
  message?: string;
  ok?: boolean;
};
