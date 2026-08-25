import { getTodayMissionData } from "@/lib/dal/day-plan";
import { getGoals } from "@/lib/dal/goals";
import { getProjects } from "@/lib/dal/projects";
import { getDailyLogForDate } from "@/lib/dal/daily-log";
import { getWeeklyTimeAnalytics } from "@/lib/dal/time-tracking";
import { TodayView } from "@/components/today/today-view";

export const dynamic = "force-dynamic";

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const [data, goals, projects, dailyLogData, timeAnalytics] =
    await Promise.all([
      getTodayMissionData(date),
      getGoals(),
      getProjects(),
      getDailyLogForDate(date),
      getWeeklyTimeAnalytics(),
    ]);

  return (
    <TodayView
      data={data}
      goals={goals}
      projects={projects}
      dailyLog={dailyLogData.log}
      capacityAdvice={dailyLogData.advice}
      weeklyTimeDistribution={timeAnalytics.distribution}
    />
  );
}
