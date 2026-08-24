"use client";

import { useState } from "react";
import { ProjectCard } from "./project-card";
import { ProjectModal } from "./project-modal";
import { ProjectDetailModal } from "./project-detail-modal";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useLocale } from "@/components/providers/locale-provider";
import { FolderKanban, Plus } from "lucide-react";
import type { ProjectRow, ClientRow, TaskRow } from "@/lib/supabase/types";

export function ProjectList({
  projects,
  clients = [],
  tasks = [],
}: {
  projects: ProjectRow[];
  clients?: ClientRow[];
  tasks?: TaskRow[];
}) {
  const { t } = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ProjectRow | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectRow | null>(null);

  function handleCreate() {
    setProjectToEdit(null);
    setIsModalOpen(true);
  }

  function handleEdit(project: ProjectRow) {
    setProjectToEdit(project);
    setIsModalOpen(true);
  }

  function handleViewDetails(project: ProjectRow) {
    setSelectedProject(project);
    setIsDetailOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {t.projects.title} ({projects.length})
          </h2>
        </div>

        <Button onClick={handleCreate} size="sm" className="gap-1.5 rounded-xl">
          <Plus className="h-4 w-4" />
          <span>{t.projects.newProject}</span>
        </Button>
      </div>

      {/* Grid of Projects */}
      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-6 w-6 text-purple-500" />}
          title={t.projects.noProjectsTitle}
          description={t.projects.noProjectsDesc}
          action={
            <Button onClick={handleCreate} size="sm" className="rounded-xl">
              {t.projects.newProject}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              clients={clients}
              tasks={tasks}
              onEdit={handleEdit}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectToEdit={projectToEdit}
        clients={clients}
      />

      {/* Detail Peek Modal */}
      <ProjectDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        project={selectedProject}
        clients={clients}
        tasks={tasks}
        onEdit={() => {
          if (selectedProject) handleEdit(selectedProject);
        }}
      />
    </div>
  );
}
