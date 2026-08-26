import { getTodayMissionData } from "@/lib/dal/day-plan";
import { getGoals } from "@/lib/dal/goals";
import { getProjects } from "@/lib/dal/projects";
import { TodayView } from "@/components/today/today-view";

export const dynamic = "force-dynamic";

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const [data, goals, projects] = await Promise.all([
    getTodayMissionData(date),
    getGoals(),
    getProjects(),
  ]);

  return <TodayView data={data} goals={goals} projects={projects} />;
}
