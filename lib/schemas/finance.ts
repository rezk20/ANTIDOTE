import { z } from "zod";

export const transactionKindEnum = z.enum(["income", "expense"]);
export const bucketKindEnum = z.enum([
  "marriage",
  "emergency",
  "business",
  "personal",
  "hardware",
  "travel",
  "apartment",
  "other",
]);

export const marriageExpenseCategoryEnum = z.enum([
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
]);

export const marriageExpenseStatusEnum = z.enum([
  "planned",
  "in_progress",
  "paid",
  "dropped",
]);

export const taskPriorityEnum = z.enum(["critical", "high", "medium", "low"]);

const emptyStringToNull = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? null : val;

export const transactionSchema = z.object({
  amount: z.coerce
    .number({ message: "Amount must be a valid number" })
    .positive("Amount must be greater than 0"),
  kind: transactionKindEnum,
  category: z.string().trim().min(1, "Category is required"),
  occurred_on: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  source: z.preprocess(
    emptyStringToNull,
    z.string().trim().optional().nullable(),
  ),
  project_id: z.preprocess(
    emptyStringToNull,
    z.string().uuid("Invalid project ID").optional().nullable(),
  ),
  lead_id: z.preprocess(
    emptyStringToNull,
    z.string().uuid("Invalid lead ID").optional().nullable(),
  ),
  bucket_id: z.preprocess(
    emptyStringToNull,
    z.string().uuid("Invalid bucket ID").optional().nullable(),
  ),
  note: z.preprocess(
    emptyStringToNull,
    z.string().trim().optional().nullable(),
  ),
  is_recurring: z.preprocess(
    (v) => v === "on" || v === "true" || v === true,
    z.boolean().default(false),
  ),
  currency: z.string().default("EGP"),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

export type TransactionState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<keyof TransactionInput | "_form", string[]>>;
};

export const bucketSchema = z.object({
  name: z.string().trim().min(1, "Bucket name is required").max(100),
  kind: bucketKindEnum,
  starting_balance: z.coerce
    .number()
    .min(0, "Starting balance cannot be negative")
    .default(0),
  target_amount: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
    z
      .number()
      .positive("Target amount must be positive")
      .optional()
      .nullable(),
  ),
  is_active: z.preprocess(
    (v) => v !== "false" && v !== false,
    z.boolean().default(true),
  ),
});

export type BucketInput = z.infer<typeof bucketSchema>;

export type BucketState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<keyof BucketInput | "_form", string[]>>;
};

export const marriageExpenseSchema = z.object({
  item: z.string().trim().min(1, "Item name is required").max(150),
  category: marriageExpenseCategoryEnum.default("misc"),
  estimated_cost: z.coerce
    .number()
    .min(0, "Estimated cost cannot be negative")
    .default(0),
  actual_cost: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
    z.number().min(0, "Actual cost cannot be negative").optional().nullable(),
  ),
  paid_amount: z.coerce
    .number()
    .min(0, "Paid amount cannot be negative")
    .default(0),
  deadline: z.preprocess(
    emptyStringToNull,
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Deadline must be in YYYY-MM-DD format")
      .optional()
      .nullable(),
  ),
  priority: taskPriorityEnum.default("medium"),
  status: marriageExpenseStatusEnum.default("planned"),
  notes: z.preprocess(
    emptyStringToNull,
    z.string().trim().optional().nullable(),
  ),
});

export type MarriageExpenseInput = z.infer<typeof marriageExpenseSchema>;

export type MarriageExpenseState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<keyof MarriageExpenseInput | "_form", string[]>>;
};

export const marriagePaymentSchema = z.object({
  payment_amount: z.coerce
    .number()
    .positive("Payment amount must be greater than 0"),
  bucket_id: z.preprocess(
    emptyStringToNull,
    z.string().uuid("Invalid bucket ID").optional().nullable(),
  ),
  occurred_on: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional()
    .default(() => new Date().toISOString().split("T")[0]),
  note: z.preprocess(
    emptyStringToNull,
    z.string().trim().optional().nullable(),
  ),
});

export type MarriagePaymentInput = z.infer<typeof marriagePaymentSchema>;
