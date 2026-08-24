"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createProject, updateProject } from "@/lib/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import { useLocale } from "@/components/providers/locale-provider";
import { X, FolderKanban } from "lucide-react";
import type { ProjectRow, ClientRow } from "@/lib/supabase/types";
import type { ProjectState } from "@/lib/schemas/projects";

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="primary"
      size="md"
      isLoading={pending}
      className="min-w-[130px] rounded-xl"
    >
      {text}
    </Button>
  );
}

function ProjectModalInnerForm({
  projectToEdit,
  clients = [],
  onClose,
}: {
  projectToEdit?: ProjectRow | null;
  clients?: ClientRow[];
  onClose: () => void;
}) {
  const { t, isRtl } = useLocale();
  const isEditing = Boolean(projectToEdit);

  const actionWithId = isEditing
    ? updateProject.bind(null, projectToEdit!.id)
    : createProject;

  const [state, formAction] = useActionState<ProjectState, FormData>(
    actionWithId,
    { ok: false },
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      onClose();
    }
  }, [state?.ok, onClose]);

  const kindOptions = [
    { value: "client", label: isRtl ? "مشروع لعميل (Client Project)" : "Client Delivery", badge: "Revenue" },
    { value: "internal", label: isRtl ? "مشروع داخلي / منتج (Internal Product)" : "Internal Asset", badge: "Asset" },
    { value: "experimental", label: isRtl ? "تجريبي / هاكاثون (Experimental)" : "Experimental" },
    { value: "learning", label: isRtl ? "تعلم وتطوير مهارة (Learning)" : "Learning" },
  ];

  const statusOptions = [
    { value: "idea", label: isRtl ? "فكرة / مسودة (Idea)" : "Idea" },
    { value: "active", label: isRtl ? "نشط وقيد التنفيذ (Active)" : "Active" },
    { value: "paused", label: isRtl ? "مؤقت (Paused)" : "Paused" },
    { value: "done", label: isRtl ? "مكتمل (Done)" : "Done" },
    { value: "killed", label: isRtl ? "ملغي (Killed)" : "Killed" },
  ];

  const clientOptions = [
    { value: "", label: isRtl ? "بدون عميل مرتبط (مشروع داخلي)" : "No linked client (Internal)" },
    ...clients.map((c) => ({
      value: c.id,
      label: `${c.name} ${c.company ? `(${c.company})` : ""}`,
    })),
  ];

  return (
    <form ref={formRef} action={formAction} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
      {state?.message && !state.ok && (
        <div className="p-3.5 rounded-2xl text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          {state.message}
        </div>
      )}

      <div>
        <Label htmlFor="name" required>
          {t.projects.projectName}
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={projectToEdit?.name ?? ""}
          placeholder="e.g. E-Commerce Next.js App / Discord Bot Platform"
          error={state?.errors?.name?.[0]}
          autoFocus
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="kind" required>
            {t.projects.projectKind}
          </Label>
          <CustomSelect
            id="kind"
            name="kind"
            defaultValue={projectToEdit?.kind ?? "client"}
            options={kindOptions}
          />
        </div>

        <div>
          <Label htmlFor="status">
            {t.common.status}
          </Label>
          <CustomSelect
            id="status"
            name="status"
            defaultValue={projectToEdit?.status ?? "active"}
            options={statusOptions}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client_id">
            {t.projects.client}
          </Label>
          <CustomSelect
            id="client_id"
            name="client_id"
            defaultValue={projectToEdit?.client_id ?? ""}
            options={clientOptions}
          />
        </div>

        <div>
          <Label htmlFor="budget">
            {t.projects.budget} (EGP)
          </Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            defaultValue={projectToEdit?.budget ?? ""}
            placeholder="e.g. 25000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="started_on">
            {t.projects.startedOn}
          </Label>
          <Input
            id="started_on"
            name="started_on"
            type="date"
            defaultValue={projectToEdit?.started_on ?? ""}
          />
        </div>

        <div>
          <Label htmlFor="deadline">
            {t.projects.deadline}
          </Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            defaultValue={projectToEdit?.deadline ?? ""}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="brief">
          {t.projects.brief}
        </Label>
        <Input
          id="brief"
          name="brief"
          defaultValue={projectToEdit?.brief ?? ""}
          placeholder="One-line summary of project goals and deliverables"
        />
      </div>

      <div>
        <Label htmlFor="requirements">
          {t.projects.requirements}
        </Label>
        <Textarea
          id="requirements"
          name="requirements"
          defaultValue={projectToEdit?.requirements ?? ""}
          placeholder="Technical architecture, deliverables, milestone breakdown..."
          rows={3}
        />
      </div>

      {/* Modal Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Button type="button" variant="outline" size="md" onClick={onClose} className="rounded-xl">
          {t.common.cancel}
        </Button>
        <SubmitButton text={isEditing ? t.common.save : t.common.create} />
      </div>
    </form>
  );
}

export function ProjectModal({
  isOpen,
  onClose,
  projectToEdit,
  clients = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: ProjectRow | null;
  clients?: ClientRow[];
}) {
  const { t } = useLocale();
  const isEditing = Boolean(projectToEdit);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {isEditing ? t.projects.editProject : t.projects.newProject}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ProjectModalInnerForm
          key={projectToEdit?.id ?? "new"}
          projectToEdit={projectToEdit}
          clients={clients}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
