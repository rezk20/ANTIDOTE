import { z } from "zod";

export const opportunitySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Opportunity title must be at least 2 characters"),
  kind: z
    .enum([
      "job",
      "freelance",
      "discord_client",
      "remote",
      "partnership",
      "product",
      "other",
    ])
    .default("freelance"),
  expected_value: z.coerce.number().min(0).default(0),
  probability: z.coerce.number().min(0).max(1).default(0.5),
  time_required_hours: z.coerce.number().min(0.5).default(10),
  risk: z.enum(["low", "medium", "high"]).default("medium"),
  next_action: z.string().nullable().optional(),
  status: z.enum(["open", "pursuing", "won", "dropped"]).default("open"),
});

export const opportunityFormSchema = opportunitySchema.omit({ id: true });

export type OpportunityInput = z.infer<typeof opportunitySchema>;
export type OpportunityFormInput = z.infer<typeof opportunityFormSchema>;
