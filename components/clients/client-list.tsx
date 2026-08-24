"use client";

import { useState } from "react";
import { ClientCard } from "./client-card";
import { ClientModal } from "./client-modal";
import { ClientDetailModal } from "./client-detail-modal";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useLocale } from "@/components/providers/locale-provider";
import { Users2, Plus } from "lucide-react";
import type { ClientRow, ProjectRow } from "@/lib/supabase/types";

export function ClientList({
  clients,
  projects = [],
}: {
  clients: ClientRow[];
  projects?: ProjectRow[];
}) {
  const { t } = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<ClientRow | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientRow | null>(null);

  function handleCreate() {
    setClientToEdit(null);
    setIsModalOpen(true);
  }

  function handleEdit(client: ClientRow) {
    setClientToEdit(client);
    setIsModalOpen(true);
  }

  function handleViewDetails(client: ClientRow) {
    setSelectedClient(client);
    setIsDetailOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header with counts and New Client action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {t.clients.title} ({clients.length})
          </h2>
        </div>

        <Button onClick={handleCreate} size="sm" className="gap-1.5 rounded-xl">
          <Plus className="h-4 w-4" />
          <span>{t.clients.newClient}</span>
        </Button>
      </div>

      {/* Grid of Clients */}
      {clients.length === 0 ? (
        <EmptyState
          icon={<Users2 className="h-6 w-6 text-blue-500" />}
          title={t.clients.noClientsTitle}
          description={t.clients.noClientsDesc}
          action={
            <Button onClick={handleCreate} size="sm" className="rounded-xl">
              {t.clients.newClient}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              projects={projects}
              onEdit={handleEdit}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clientToEdit={clientToEdit}
      />

      {/* Detail Peek Modal */}
      <ClientDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        client={selectedClient}
        projects={projects}
        onEdit={() => {
          if (selectedClient) handleEdit(selectedClient);
        }}
      />
    </div>
  );
}
