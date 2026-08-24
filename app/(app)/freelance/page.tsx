import { verifySession, getProfile, getLeads, getAllLeadEvents, getClients } from "@/lib/dal";
import { LeadBoard } from "@/components/leads/lead-board";

export const dynamic = "force-dynamic";

export default async function FreelancePage() {
  await verifySession();

  const [profile, leads, events, clients] = await Promise.all([
    getProfile(),
    getLeads(),
    getAllLeadEvents(100),
    getClients(),
  ]);

  return (
    <div className="space-y-6">
      <LeadBoard
        leads={leads}
        events={events}
        clients={clients}
        profile={profile}
      />
    </div>
  );
}
