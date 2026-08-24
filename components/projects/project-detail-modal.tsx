"use client";

import { EntityDetailModal, type DetailChip, type DetailSection } from "@/components/ui/entity-detail-modal";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/locale-provider";
import {
  FolderKanban,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  ListTodo,
} from "lucide-react";
import type { ProjectRow, ClientRow, TaskRow } from "@/lib/supabase/types";

export function ProjectDetailModal({
  isOpen,
  onClose,
  project,
  clients = [],
  tasks = [],
  onEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectRow | null;
  clients?: ClientRow[];
  tasks?: TaskRow[];
  onEdit?: () => void;
}) {
  const { t, isRtl } = useLocale();

  if (!isOpen || !project) return null;

  const linkedClient = clients.find((c) => c.id === project.client_id);
  const projectTasks = tasks.filter((t) => t.project_id === project.id);
  const completedTasks = projectTasks.filter((t) => t.status === "done");

  const chips: DetailChip[] = [
    {
      label: t.common.status,
      value: project.status.toUpperCase(),
      variant: project.status === "done" ? "emerald" : project.status === "active" ? "blue" : "default",
    },
    {
      label: t.projects.projectKind,
      value: project.kind.toUpperCase(),
      variant: "purple",
    },
    {
      label: t.projects.budget,
      value: project.budget != null ? `${project.budget.toLocaleString()} EGP` : (isRtl ? "بدون ميزانية" : "Unset"),
      variant: "emerald",
      icon: <DollarSign className="h-3 w-3" />,
    },
    {
      label: t.projects.startedOn,
      value: project.started_on || (isRtl ? "غير محدد" : "Unset"),
      icon: <Calendar className="h-3 w-3" />,
    },
    {
      label: t.projects.deadline,
      value: project.deadline || (isRtl ? "غير محدد" : "Unset"),
      variant: project.deadline ? "amber" : "default",
      icon: <Calendar className="h-3 w-3" />,
    },
    {
      label: isRtl ? "إنجاز المهام" : "Tasks Done",
      value: `${completedTasks.length} / ${projectTasks.length}`,
      variant: projectTasks.length > 0 && completedTasks.length === projectTasks.length ? "emerald" : "default",
    },
  ];

  const sections: DetailSection[] = [];

  if (project.brief) {
    sections.push({
      title: t.projects.brief,
      icon: <FileText className="h-3.5 w-3.5 text-blue-500" />,
      content: (
        <p className="whitespace-pre-wrap leading-relaxed">{project.brief}</p>
      ),
    });
  }

  if (project.requirements) {
    sections.push({
      title: t.projects.requirements,
      icon: <FileText className="h-3.5 w-3.5 text-purple-500" />,
      content: (
        <p className="whitespace-pre-wrap leading-relaxed">{project.requirements}</p>
      ),
    });
  }

  if (linkedClient) {
    sections.push({
      title: t.projects.client,
      icon: <Building2 className="h-3.5 w-3.5 text-emerald-500" />,
      content: (
        <div className="flex items-center justify-between">
          <span className="font-bold text-zinc-900 dark:text-zinc-100">{linkedClient.name}</span>
          {linkedClient.company && (
            <span className="text-zinc-400">({linkedClient.company})</span>
          )}
        </div>
      ),
    });
  }

  if (projectTasks.length > 0) {
    sections.push({
      title: t.projects.linkedTasks,
      icon: <ListTodo className="h-3.5 w-3.5 text-amber-500" />,
      content: (
        <div className="space-y-2">
          {projectTasks.map((task) => (
            <div
              key={task.id}
              className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 text-xs"
            >
              <span className={`font-bold truncate ${task.status === "done" ? "line-through text-zinc-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                {task.title}
              </span>
              <Badge variant={task.status === "done" ? "success" : "outline"} className="text-[10px] font-bold uppercase shrink-0">
                {task.status}
              </Badge>
            </div>
          ))}
        </div>
      ),
    });
  }

  return (
    <EntityDetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={project.name}
      subtitle={t.projects.projectDetails}
      icon={<FolderKanban className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
      badge={
        <Badge variant={project.status === "done" ? "success" : "default"} className="text-xs font-bold uppercase">
          {project.kind}
        </Badge>
      }
      chips={chips}
      sections={sections}
      onEdit={onEdit}
      editLabel={t.projects.editProject}
    />
  );
}
