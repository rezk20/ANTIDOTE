import { getOrGenerateAgentApiKey } from "@/lib/dal/agent";
import { AgentView } from "@/components/agent/agent-view";

export const dynamic = "force-dynamic";

export default async function AgentPage() {
  const apiKey = await getOrGenerateAgentApiKey();

  return <AgentView initialApiKey={apiKey} />;
}
