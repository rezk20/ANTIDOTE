import { z } from "zod";
import { PROJECT_KINDS, PROJECT_STATUSES } from "@/lib/constants/enums";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .max(200, "Project name must be 200 characters or less"),
  kind: z.enum(PROJECT_KINDS).default("client"),
  brief: z.string().trim().max(2000).optional().nullable(),
  requirements: z.string().trim().max(5000).optional().nullable(),
  status: z.enum(PROJECT_STATUSES).default("active"),
  client_id: z.string().uuid().optional().nullable().or(z.literal("")),
  budget: z.coerce.number().nonnegative().optional().nullable(),
  started_on: z.string().optional().nullable().or(z.literal("")),
  deadline: z.string().optional().nullable().or(z.literal("")),
  meta: z.record(z.string(), z.unknown()).optional().default({}),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export type ProjectState = {
  errors?: Record<string, string[]>;
  message?: string;
  ok?: boolean;
};
