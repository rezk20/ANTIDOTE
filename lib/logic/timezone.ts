/**
 * Timezone and Date helper utilities for Life OS.
 * Ensures consistent YYYY-MM-DD dates in user's configured timezone (defaults to Africa/Cairo).
 */

export const DEFAULT_TIMEZONE = "Africa/Cairo";

export function getLocalDateString(
  timeZone: string = DEFAULT_TIMEZONE,
  date: Date = new Date(),
): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timeZone || DEFAULT_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}

export function getTomorrowDateString(
  baseDateStr?: string,
  timeZone: string = DEFAULT_TIMEZONE,
): string {
  const base = baseDateStr || getLocalDateString(timeZone);
  const [y, m, d] = base.split("-").map(Number);
  const nextDate = new Date(Date.UTC(y, m - 1, d + 1));
  return nextDate.toISOString().split("T")[0];
}

export function parseDateSafeNoon(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  // Noon prevents daylight saving or UTC midnight shifts
  return new Date(y, m - 1, d, 12, 0, 0);
}
