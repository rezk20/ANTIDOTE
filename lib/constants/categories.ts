/**
 * Money categories tree (§9) for income, expenses, and savings goals.
 */

export const INCOME_CATEGORIES = [
  "income:freelance_mern",
  "income:discord_bots",
  "income:osrs_product",
  "income:fulltime_remote",
  "income:consulting",
  "income:other",
] as const;

export const EXPENSE_CATEGORIES = [
  "expense:living_basics",
  "expense:housing_rent",
  "expense:marriage_prep",
  "expense:hardware_tools",
  "expense:software_subscriptions",
  "expense:learning_courses",
  "expense:relationship_outings",
  "expense:family_support",
  "expense:transport",
  "expense:health_wellness",
  "expense:misc",
] as const;

export const ALL_MONEY_CATEGORIES = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type MoneyCategory = (typeof ALL_MONEY_CATEGORIES)[number];
