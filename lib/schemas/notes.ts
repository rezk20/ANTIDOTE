import { z } from "zod";

export const NOTE_FOLDERS = [
  "inbox",
  "business-strategy",
  "freelance-clients",
  "discord-bots",
  "products-saas",
  "marriage-home",
  "finances-investments",
  "learning-growth",
  "habits-health",
  "systems-workflows",
  "decisions-log",
  "templates",
  "archive",
] as const;

export type NoteFolder = (typeof NOTE_FOLDERS)[number];

const emptyStringToNull = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? null : val;

export const noteSchema = z.object({
  id: z.string().uuid().optional(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),
  content: z.string().default(""),
  folder: z.string().trim().min(1, "Folder is required").default("inbox"),
  tags: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          return val
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        }
      }
      return val ?? [];
    },
    z.array(z.string().trim().min(1)).default([]),
  ),
  pinned: z.preprocess((v) => v === true || v === "true" || v === "on", z.boolean()).default(false),
  archived: z.preprocess((v) => v === true || v === "true" || v === "on", z.boolean()).default(false),
});

export type NoteInput = z.infer<typeof noteSchema>;

export type NoteState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<keyof NoteInput | "_form", string[]>>;
  noteId?: string;
};

export const noteFilterSchema = z.object({
  folder: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  tag: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  search: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  archived: z.boolean().default(false),
  pinnedFirst: z.boolean().default(true),
});

export type NoteFilterInput = z.infer<typeof noteFilterSchema>;
