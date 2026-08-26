import { getOrGenerateAgentApiKey, getAgentReports } from "@/lib/dal/agent";
import { AgentView } from "@/components/agent/agent-view";

export const dynamic = "force-dynamic";

export default async function AgentPage() {
  const [apiKey, reports] = await Promise.all([
    getOrGenerateAgentApiKey(),
    getAgentReports(),
  ]);

  return <AgentView initialApiKey={apiKey} initialReports={reports} />;
}
