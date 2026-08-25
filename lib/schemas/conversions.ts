import { z } from "zod";
import {
  TASK_AREAS,
  TASK_PRIORITIES,
  TASK_TYPES,
  GOAL_LEVELS,
  LEAD_STAGES,
} from "@/lib/constants/enums";

export const conversionTargetTypeEnum = z.enum(["task", "note", "goal", "lead"]);
export type ConversionTargetType = z.infer<typeof conversionTargetTypeEnum>;

const emptyStringToNull = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? null : val;

export const convertDumpSchema = z.object({
  dump_id: z.string().uuid("Invalid dump ID"),
  target_type: conversionTargetTypeEnum,

  // Fields for Task conversion
  task_title: z.preprocess(emptyStringToNull, z.string().trim().min(1).optional().nullable()),
  task_area: z.enum(TASK_AREAS).default("work"),
  task_priority: z.enum(TASK_PRIORITIES).default("medium"),
  task_type: z.enum(TASK_TYPES).default("revenue"),
  task_scheduled_date: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  task_is_top_three: z.preprocess((v) => v === true || v === "true" || v === "on", z.boolean()).default(false),

  // Fields for Note conversion
  note_title: z.preprocess(emptyStringToNull, z.string().trim().min(1).optional().nullable()),
  note_folder: z.string().trim().default("inbox"),
  note_content: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  note_tags: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          return val.split(",").map((t) => t.trim()).filter(Boolean);
        }
      }
      return val ?? [];
    },
    z.array(z.string().trim()).default([]),
  ),

  // Fields for Goal conversion
  goal_title: z.preprocess(emptyStringToNull, z.string().trim().min(1).optional().nullable()),
  goal_level: z.enum(GOAL_LEVELS).default("quarter"),
  goal_target_value: z.preprocess(
    emptyStringToNull,
    z.coerce.number().optional().nullable(),
  ),
  goal_unit: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  goal_description: z.preprocess(emptyStringToNull, z.string().optional().nullable()),

  // Fields for Lead conversion
  lead_title: z.preprocess(emptyStringToNull, z.string().trim().min(1).optional().nullable()),
  lead_stage: z.enum(LEAD_STAGES).default("proposal_sent"),
  lead_expected_value: z.preprocess(
    emptyStringToNull,
    z.coerce.number().min(0).optional().nullable(),
  ),
  lead_notes: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
});

export type ConvertDumpInput = z.infer<typeof convertDumpSchema>;

export type ConvertDumpState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<string, string[]>>;
  convertedType?: string;
  convertedId?: string;
};
