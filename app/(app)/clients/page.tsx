import { verifySession, getClients, getProjects } from "@/lib/dal";
import { ClientList } from "@/components/clients/client-list";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  await verifySession();

  const [clients, projects] = await Promise.all([
    getClients(),
    getProjects(),
  ]);

  return (
    <div className="space-y-6">
      <ClientList clients={clients} projects={projects} />
    </div>
  );
}
