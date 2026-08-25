import type { HabitRow, HabitLogRow } from "@/lib/supabase/types";

export interface HabitWithStats extends HabitRow {
  completedToday: boolean;
  completedDaysThisWeek: number;
  weeklyProgressPercent: number;
  currentStreak: number;
  needsRestartToday: boolean;
  recentLogs: Record<string, boolean>; // dateString -> isCompleted
}

export const DEFAULT_HABITS_SEED = [
  {
    name: "جلسة عمل عميق بدون مشتتات (90 دقيقة)",
    description: "التركيز التام على المهمة الأساسية بدون فتح السوشيال ميديا أو ديسكورد",
    category: "deep_work" as const,
    target_per_week: 6,
    sort_order: 1,
  },
  {
    name: "متابعة المبيعات والعروض (Sales Outreach)",
    description: "إرسال مقترح، متابعة عميل محتمل، أو تحسين البورتفوليو",
    category: "revenue" as const,
    target_per_week: 5,
    sort_order: 2,
  },
  {
    name: "الانضباط بموعد النوم والاستيقاظ",
    description: "الحفاظ على إيقاع بيولوجي مستقر لحماية طاقة التركيز",
    category: "health_routine" as const,
    target_per_week: 7,
    sort_order: 3,
  },
  {
    name: "تسجيل المعاملات المالية ومصروفات الزواج",
    description: "تسجيل كل جنيه داخل أو خارج للحفاظ على وضوح التدفق النقدي",
    category: "finance" as const,
    target_per_week: 7,
    sort_order: 4,
  },
  {
    name: "القراءة والتعلم التقني اليومي (30 دقيقة)",
    description: "تطوير مهارات Fullstack / Architecture / MERN",
    category: "learning" as const,
    target_per_week: 5,
    sort_order: 5,
  },
  {
    name: "وقت نوعي واهتمام بشريكة الحياة",
    description: "تواصل حقيقي وهادئ وتطبيق قاعدة منع الفوضى والتشتت",
    category: "relationship" as const,
    target_per_week: 6,
    sort_order: 6,
  },
];

export function calculateHabitStats(params: {
  habit: HabitRow;
  logs: HabitLogRow[];
  weekDates: string[]; // 7 days of current week (YYYY-MM-DD)
  todayDate: string;
}): HabitWithStats {
  const { habit, logs, weekDates, todayDate } = params;

  const habitLogs = logs.filter((l) => l.habit_id === habit.id);
  const logMap: Record<string, boolean> = {};

  for (const l of habitLogs) {
    logMap[l.log_date] = true;
  }

  const completedToday = !!logMap[todayDate];

  let completedDaysThisWeek = 0;
  for (const d of weekDates) {
    if (logMap[d]) {
      completedDaysThisWeek++;
    }
  }

  const target = habit.target_per_week || 7;
  const weeklyProgressPercent = Math.min(100, Math.round((completedDaysThisWeek / target) * 100));

  // Streak Calculation (Anti-guilt)
  // Calculate consecutive days leading up to today or yesterday
  let currentStreak = 0;
  const cursor = new Date(todayDate);

  if (!completedToday) {
    // Check yesterday
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const dStr = cursor.toISOString().slice(0, 10);
    if (logMap[dStr]) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  const needsRestartToday = !completedToday && currentStreak === 0;

  return {
    ...habit,
    completedToday,
    completedDaysThisWeek,
    weeklyProgressPercent,
    currentStreak,
    needsRestartToday,
    recentLogs: logMap,
  };
}
