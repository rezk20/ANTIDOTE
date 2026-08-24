import { z } from "zod";
import {
  CLIENT_STATUSES,
  PAYMENT_STATUSES,
  TESTIMONIAL_STATUSES,
  REFERRAL_STATUSES,
} from "@/lib/constants/enums";

export const createClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Client name is required")
    .max(200, "Client name must be 200 characters or less"),
  company: z.string().trim().max(200).optional().nullable(),
  contact: z.string().trim().max(200).optional().nullable(),
  source: z.string().trim().max(100).optional().nullable(),
  status: z.enum(CLIENT_STATUSES).default("active"),
  started_on: z.string().optional().nullable().or(z.literal("")),
  deadline: z.string().optional().nullable().or(z.literal("")),
  payment_status: z.enum(PAYMENT_STATUSES).optional().nullable(),
  notes: z.string().trim().max(5000).optional().nullable(),
  next_action: z.string().trim().max(500).optional().nullable(),
  follow_up_date: z.string().optional().nullable().or(z.literal("")),
  testimonial_status: z.enum(TESTIMONIAL_STATUSES).default("none"),
  referral_status: z.enum(REFERRAL_STATUSES).default("none"),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

export type ClientState = {
  errors?: Record<string, string[]>;
  message?: string;
  ok?: boolean;
};
