import { getTasks, getStaleTasks } from "@/lib/dal/tasks";
import { getGoals } from "@/lib/dal/goals";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { StaleTasksBanner } from "@/components/tasks/stale-tasks-banner";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskList } from "@/components/tasks/task-list";
import type { TaskStatus, TaskType, ProjectRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    task_type?: string;
    goal_id?: string;
    project_id?: string;
    top_three?: string;
  }>;
}) {
  const session = await verifySession();
  const params = await searchParams;

  const statusFilter = params.status as TaskStatus | "all" | "active" | undefined;
  const typeFilter = params.task_type as TaskType | "all" | undefined;
  const isTopThreeFilter = params.top_three === "true" ? true : undefined;

  const supabase = await createSupabaseServerClient();

  const [tasks, staleTasks, goals, projectsRes] = await Promise.all([
    getTasks({
      status: statusFilter ?? "active",
      task_type: typeFilter,
      goal_id: params.goal_id,
      project_id: params.project_id,
      is_top_three: isTopThreeFilter,
    }),
    getStaleTasks(),
    getGoals(),
    supabase
      .from("projects")
      .select("*")
      .eq("user_id", session.userId)
      .order("name", { ascending: true }),
  ]);

  const projects = (projectsRes.data ?? []) as ProjectRow[];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Task Engine & Priorities"
        description="Daily execution command: Multi-factor priority scoring, Build vs Revenue work tracking, and stale task guards."
        badge={<Badge variant="accent">{tasks.length} Action Items</Badge>}
      />

      {/* Stale tasks banner */}
      <StaleTasksBanner staleTasks={staleTasks} />

      {/* Filter Bar */}
      <TaskFilters />

      {/* Main Prioritized List */}
      <TaskList
        tasks={tasks}
        goals={goals}
        projects={projects}
      />
    </div>
  );
}
