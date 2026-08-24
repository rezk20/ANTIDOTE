/**
 * Recurring Rule Parser & Matcher.
 *
 * Supported formats:
 * - "daily"
 * - "weekdays"
 * - "weekly:mon,thu" / "weekly:saturday,monday"
 * - "monthly:1" / "monthly:15"
 */

const DAY_ABBR_MAP: Record<string, number> = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
};

export function isRecurringDueOnDate(rule: string | null | undefined, targetDate: Date | string): boolean {
  if (!rule) return false;

  const date = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon ...
  const dayOfMonth = date.getDate();

  const normalized = rule.trim().toLowerCase();

  if (normalized === "daily") {
    return true;
  }

  if (normalized === "weekdays") {
    // Mon (1) to Fri (5) or Sat (6) to Thu (4) based on workweek
    // Standard weekdays: Mon-Fri (1..5)
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  }

  if (normalized.startsWith("weekly:")) {
    const daysPart = normalized.replace("weekly:", "").trim();
    const days = daysPart.split(",").map((d) => d.trim());
    return days.some((day) => DAY_ABBR_MAP[day] === dayOfWeek);
  }

  if (normalized.startsWith("monthly:")) {
    const dayStr = normalized.replace("monthly:", "").trim();
    const expectedDay = parseInt(dayStr, 10);
    return dayOfMonth === expectedDay;
  }

  return false;
}

export function formatRecurringRule(rule: string | null | undefined): string {
  if (!rule) return "One-time task";

  const normalized = rule.trim().toLowerCase();
  if (normalized === "daily") return "Repeats Daily";
  if (normalized === "weekdays") return "Repeats on Weekdays";
  if (normalized.startsWith("weekly:")) {
    const days = normalized.replace("weekly:", "").toUpperCase();
    return `Repeats Weekly (${days})`;
  }
  if (normalized.startsWith("monthly:")) {
    const day = normalized.replace("monthly:", "");
    return `Repeats Monthly (Day ${day})`;
  }

  return `Repeats: ${rule}`;
}
