import { getDailyLogForDate, getRecentDailyLogs } from "@/lib/dal/daily-log";
import { getWeeklyTimeAnalytics } from "@/lib/dal/time-tracking";
import { getRoutines } from "@/lib/dal/routines";
import { getTodayMissionData } from "@/lib/dal/day-plan";
import { EnergyView } from "@/components/energy/energy-view";

export const dynamic = "force-dynamic";

export default async function EnergyPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const [dailyLogData, recentLogs, timeAnalytics, routines, todayData] =
    await Promise.all([
      getDailyLogForDate(date),
      getRecentDailyLogs(14),
      getWeeklyTimeAnalytics(),
      getRoutines(),
      getTodayMissionData(date),
    ]);

  return (
    <EnergyView
      dailyLog={dailyLogData.log}
      recentLogs={recentLogs}
      capacityAdvice={dailyLogData.advice}
      weeklyTimeDistribution={timeAnalytics.distribution}
      routines={routines}
      todayTasks={todayData.todayTasks}
      selectedDate={todayData.selectedDate}
    />
  );
}
