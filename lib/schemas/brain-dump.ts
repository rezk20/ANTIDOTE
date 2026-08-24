import { z } from "zod";

export const brainDumpSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Capture content cannot be empty." })
    .max(5000, { message: "Capture content must be under 5000 characters." }),
});

export type BrainDumpInput = z.infer<typeof brainDumpSchema>;

export type BrainDumpState =
  | {
      ok?: boolean;
      errors?: {
        content?: string[];
      };
      message?: string;
    }
  | undefined;
