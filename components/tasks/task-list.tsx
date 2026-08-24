"use client";

import { useState } from "react";
import { TaskItem } from "./task-item";
import { TaskModal } from "./task-modal";
import { TaskDetailModal } from "./task-detail-modal";
import { sortTasksByPriority } from "@/lib/logic/priority";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";
import { CheckSquare, Plus } from "lucide-react";
import type { TaskRow, GoalRow, ProjectRow } from "@/lib/supabase/types";

export function TaskList({
  tasks,
  goals = [],
  projects = [],
}: {
  tasks: TaskRow[];
  goals?: GoalRow[];
  projects?: ProjectRow[];
}) {
  const { t } = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskRow | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null);

  const sortedTasks = sortTasksByPriority(tasks);

  function handleCreate() {
    setTaskToEdit(null);
    setIsModalOpen(true);
  }

  function handleEdit(task: TaskRow) {
    setTaskToEdit(task);
    setIsModalOpen(true);
  }

  function handleViewDetails(task: TaskRow) {
    setSelectedTask(task);
    setIsDetailOpen(true);
  }

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {t.tasks.actionItems} ({tasks.length})
        </span>

        <Button onClick={handleCreate} size="sm" className="gap-1.5 rounded-xl">
          <Plus className="h-4 w-4" />
          <span>{t.tasks.newTask}</span>
        </Button>
      </div>

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="h-6 w-6 text-blue-500" />}
          title={t.tasks.noTasksTitle}
          description={t.tasks.noTasksDesc}
          action={
            <Button onClick={handleCreate} size="sm" className="rounded-xl">
              {t.tasks.newTask}
            </Button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              goals={goals}
              projects={projects}
              onEdit={handleEdit}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
        goals={goals}
        projects={projects}
      />

      {/* Detail Peek Modal */}
      <TaskDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        task={selectedTask}
        goals={goals}
        projects={projects}
        onEdit={() => {
          if (selectedTask) handleEdit(selectedTask);
        }}
      />
    </div>
  );
}
