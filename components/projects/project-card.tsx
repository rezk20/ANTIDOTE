"use client";

import { useTransition } from "react";
import { setProjectStatus, deleteProject } from "@/lib/actions/projects";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { CustomSelect } from "@/components/ui/select";
import {
  Edit2,
  Trash2,
  Clock,
  Building2,
  Eye,
} from "lucide-react";
import type { ProjectRow, ClientRow, TaskRow, ProjectStatus } from "@/lib/supabase/types";

export function ProjectCard({
  project,
  clients = [],
  tasks = [],
  onEdit,
  onViewDetails,
}: {
  project: ProjectRow;
  clients?: ClientRow[];
  tasks?: TaskRow[];
  onEdit: (project: ProjectRow) => void;
  onViewDetails?: (project: ProjectRow) => void;
}) {
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();

  const linkedClient = clients.find((c) => c.id === project.client_id);
  const projectTasks = tasks.filter((t) => t.project_id === project.id);
  const completedTasks = projectTasks.filter((t) => t.status === "done");

  const statusOptions = [
    { value: "idea", label: isRtl ? "فكرة / مسودة (Idea)" : "Idea" },
    { value: "active", label: isRtl ? "نشط وقيد التنفيذ (Active)" : "Active" },
    { value: "paused", label: isRtl ? "مؤقت (Paused)" : "Paused" },
    { value: "done", label: isRtl ? "مكتمل (Done)" : "Done" },
    { value: "killed", label: isRtl ? "ملغي (Killed)" : "Killed" },
  ];

  const kindBadge: Record<string, "default" | "secondary" | "success" | "accent" | "warning"> = {
    client: "success",
    internal: "accent",
    experimental: "warning",
    learning: "secondary",
  };

  return (
    <div className="group p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {project.name}
            </h3>
            <Badge variant={kindBadge[project.kind] || "outline"} className="text-[10px] py-0 px-2 font-bold uppercase">
              {project.kind}
            </Badge>
          </div>

          {linkedClient && (
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              <span>{linkedClient.name}</span>
            </p>
          )}
        </div>

        {project.budget != null && (
          <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0">
            {project.budget.toLocaleString()} EGP
          </div>
        )}
      </div>

      {project.brief && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {project.brief}
        </p>
      )}

      {/* Task completion meter */}
      {projectTasks.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
            <span>{isRtl ? "المهام المنجزة" : "Task Completion"}</span>
            <span>
              {completedTasks.length} / {projectTasks.length}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{
                width: `${Math.round((completedTasks.length / projectTasks.length) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Status Switcher & Deadline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
        <CustomSelect
          value={project.status}
          onChange={(val) => {
            startTransition(async () => {
              await setProjectStatus(project.id, val as ProjectStatus);
            });
          }}
          options={statusOptions}
          className="text-xs"
        />

        {project.deadline && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium justify-self-start sm:justify-self-end">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            <span>{project.deadline}</span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-1 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(project)}
            className="p-2 rounded-xl text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
            title={t.common.viewDetails}
          >
            <Eye className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={() => onEdit(project)}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title={t.common.edit}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>

        <button
          disabled={isPending}
          onClick={() => {
            if (confirm(`${t.common.confirmDelete} "${project.name}"? ${t.common.safeDeleteNotice}`)) {
              startTransition(async () => {
                await deleteProject(project.id);
              });
            }
          }}
          className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          title={t.common.delete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
