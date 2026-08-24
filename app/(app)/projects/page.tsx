import { verifySession, getProjects, getClients, getTasks } from "@/lib/dal";
import { ProjectList } from "@/components/projects/project-list";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  await verifySession();

  const [projects, clients, tasks] = await Promise.all([
    getProjects(),
    getClients(),
    getTasks(),
  ]);

  return (
    <div className="space-y-6">
      <ProjectList projects={projects} clients={clients} tasks={tasks} />
    </div>
  );
}
