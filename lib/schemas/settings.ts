import { z } from "zod";
import { WEEKDAYS } from "@/lib/constants/enums";

export const settingsSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(1, { message: "Display name cannot be empty." })
    .max(100),
  timezone: z.string().trim().default("Africa/Cairo"),
  currency: z.string().trim().default("EGP"),
  weekly_off_day: z.enum(WEEKDAYS).default("friday"),

  // JSONB settings object
  work_hours_per_day: z.coerce.number().min(1).max(24).default(8),
  preferred_start_time: z.string().trim().default("09:00"),
  primary_stream: z.string().trim().default("MERN / Next.js Freelance"),
  secondary_stream: z.string().trim().default("Discord Bots"),

  // Marriage & Savings Goals
  marriage_target_amount: z.coerce.number().min(0).default(250000),
  marriage_target_months: z.coerce.number().min(1).default(12),
  marriage_fallback_months: z.coerce.number().min(1).default(24),
  marriage_housing_strategy: z
    .string()
    .trim()
    .default("Rent initially, buy later"),

  // Sales Targets
  proposals_per_week: z.coerce.number().min(0).default(5),
  outreach_per_day: z.coerce.number().min(0).default(3),

  // Relationship settings
  relationship_shared_day: z.enum(WEEKDAYS).default("friday"),
  relationship_budget_preference: z
    .enum(["free", "low", "medium", "high"])
    .default("low"),

  // Privacy & AI
  ai_enabled: z.boolean().default(false),
  ai_relationship_access: z.boolean().default(false),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export type SettingsState =
  | {
      ok?: boolean;
      errors?: Record<string, string[] | undefined>;
      message?: string;
    }
  | undefined;
