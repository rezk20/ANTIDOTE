/**
 * Enums and domain constants for LIFE OS.
 */

export const GOAL_LEVELS = ["vision", "year", "quarter", "month", "week"] as const;
export type GoalLevel = (typeof GOAL_LEVELS)[number];

export const GOAL_STATUSES = ["active", "achieved", "dropped", "paused"] as const;
export type GoalStatus = (typeof GOAL_STATUSES)[number];

export const TASK_TYPES = [
  "revenue",
  "career",
  "client",
  "learning",
  "product",
  "finance",
  "marriage",
  "relationship",
  "personal",
  "admin",
  "health_routine",
] as const;
export type TaskType = (typeof TASK_TYPES)[number];

export const TASK_PRIORITIES = ["critical", "high", "medium", "low"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = [
  "backlog",
  "planned",
  "in_progress",
  "done",
  "dropped",
  "someday",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_AREAS = [
  "work",
  "money",
  "relationship",
  "personal",
  "learning",
  "admin",
  "health",
] as const;
export type TaskArea = (typeof TASK_AREAS)[number];

export const BUCKET_KINDS = [
  "marriage",
  "emergency",
  "business",
  "personal",
  "hardware",
  "travel",
  "apartment",
  "other",
] as const;
export type BucketKind = (typeof BUCKET_KINDS)[number];

export const TRANSACTION_KINDS = ["income", "expense"] as const;
export type TransactionKind = (typeof TRANSACTION_KINDS)[number];

export const PROJECT_KINDS = ["client", "internal", "experimental", "learning"] as const;
export type ProjectKind = (typeof PROJECT_KINDS)[number];

export const PROJECT_STATUSES = ["idea", "active", "paused", "done", "killed"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const CLIENT_STATUSES = ["active", "past", "lost"] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const PAYMENT_STATUSES = ["none", "pending", "partial", "paid"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const TESTIMONIAL_STATUSES = ["none", "asked", "received", "declined"] as const;
export type TestimonialStatus = (typeof TESTIMONIAL_STATUSES)[number];

export const REFERRAL_STATUSES = ["none", "asked", "received", "declined"] as const;
export type ReferralStatus = (typeof REFERRAL_STATUSES)[number];

export const LEAD_STAGES = [
  "new",
  "qualified",
  "contacted",
  "proposal_sent",
  "follow_up",
  "call",
  "negotiation",
  "won",
  "in_progress",
  "delivered",
  "paid",
  "review_requested",
  "referral_requested",
  "lost",
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

export const LEAD_EVENT_TYPES = [
  "discovered",
  "outreach",
  "proposal_sent",
  "follow_up",
  "call",
  "negotiation",
  "won",
  "lost",
  "delivered",
  "invoiced",
  "paid",
  "review_requested",
  "referral_received",
  "note",
] as const;
export type LeadEventType = (typeof LEAD_EVENT_TYPES)[number];

export const MARRIAGE_EXPENSE_CATEGORIES = [
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
] as const;
export type MarriageExpenseCategory = (typeof MARRIAGE_EXPENSE_CATEGORIES)[number];

export const MARRIAGE_EXPENSE_STATUSES = [
  "planned",
  "in_progress",
  "paid",
  "dropped",
] as const;
export type MarriageExpenseStatus = (typeof MARRIAGE_EXPENSE_STATUSES)[number];

export const SERVICE_COMPLEXITIES = ["low", "medium", "high"] as const;
export type ServiceComplexity = (typeof SERVICE_COMPLEXITIES)[number];

export const OUTREACH_TEMPLATE_KINDS = [
  "cold_dm",
  "email",
  "proposal",
  "follow_up",
  "referral_request",
  "testimonial_request",
] as const;
export type OutreachTemplateKind = (typeof OUTREACH_TEMPLATE_KINDS)[number];

export const BRAIN_DUMP_STATUSES = ["inbox", "converted", "archived"] as const;
export type BrainDumpStatus = (typeof BRAIN_DUMP_STATUSES)[number];

export const REVIEW_TYPES = ["daily", "weekly", "monthly", "quarterly", "yearly"] as const;
export type ReviewType = (typeof REVIEW_TYPES)[number];

export const WEEKDAYS = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;
export type Weekday = (typeof WEEKDAYS)[number];
