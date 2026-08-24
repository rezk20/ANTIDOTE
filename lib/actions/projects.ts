"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import {
  createProjectSchema,
  updateProjectSchema,
  type ProjectState,
} from "@/lib/schemas/projects";
import type { ProjectStatus, Json } from "@/lib/supabase/types";

export async function createProject(
  _prevState: ProjectState | undefined,
  formData: FormData,
): Promise<ProjectState> {
  const user = await verifySession();
  const supabase = await createServerClient();

  const raw = {
    name: formData.get("name"),
    kind: formData.get("kind") || "client",
    brief: formData.get("brief") || undefined,
    requirements: formData.get("requirements") || undefined,
    status: formData.get("status") || "active",
    client_id: formData.get("client_id") || undefined,
    budget: formData.get("budget") || undefined,
    started_on: formData.get("started_on") || undefined,
    deadline: formData.get("deadline") || undefined,
  };

  const parsed = createProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the validation errors below.",
      ok: false,
    };
  }

  const { error } = await supabase.from("projects").insert({
    user_id: user.userId,
    name: parsed.data.name,
    kind: parsed.data.kind,
    brief: parsed.data.brief ?? null,
    requirements: parsed.data.requirements ?? null,
    status: parsed.data.status,
    client_id: parsed.data.client_id || null,
    budget: parsed.data.budget ?? null,
    started_on: parsed.data.started_on || null,
    deadline: parsed.data.deadline || null,
    meta: (parsed.data.meta ?? {}) as Json,
  });

  if (error) {
    console.error("[createProject] error:", error);
    return { message: error.message, ok: false };
  }

  revalidatePath("/projects");
  revalidatePath("/clients");
  revalidatePath("/tasks");
  revalidatePath("/home");
  return { ok: true };
}

export async function updateProject(
  id: string,
  _prevState: ProjectState | undefined,
  formData: FormData,
): Promise<ProjectState> {
  const user = await verifySession();
  const supabase = await createServerClient();

  const raw = {
    name: formData.get("name"),
    kind: formData.get("kind") || undefined,
    brief: formData.get("brief") || undefined,
    requirements: formData.get("requirements") || undefined,
    status: formData.get("status") || undefined,
    client_id: formData.get("client_id") || undefined,
    budget: formData.get("budget") || undefined,
    started_on: formData.get("started_on") || undefined,
    deadline: formData.get("deadline") || undefined,
  };

  const parsed = updateProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the validation errors below.",
      ok: false,
    };
  }

  const { error } = await supabase
    .from("projects")
    .update({
      name: parsed.data.name,
      kind: parsed.data.kind,
      brief: parsed.data.brief ?? null,
      requirements: parsed.data.requirements ?? null,
      status: parsed.data.status,
      client_id: parsed.data.client_id || null,
      budget: parsed.data.budget ?? null,
      started_on: parsed.data.started_on || null,
      deadline: parsed.data.deadline || null,
    })
    .eq("id", id)
    .eq("user_id", user.userId);

  if (error) {
    console.error("[updateProject] error:", error);
    return { message: error.message, ok: false };
  }

  revalidatePath("/projects");
  revalidatePath("/clients");
  revalidatePath("/tasks");
  revalidatePath("/home");
  return { ok: true };
}

export async function setProjectStatus(
  id: string,
  status: ProjectStatus,
): Promise<ProjectState> {
  const user = await verifySession();
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.userId);

  if (error) {
    console.error("[setProjectStatus] error:", error);
    return { message: error.message, ok: false };
  }

  revalidatePath("/projects");
  revalidatePath("/home");
  return { ok: true };
}

export async function deleteProject(id: string): Promise<ProjectState> {
  const user = await verifySession();
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.userId);

  if (error) {
    console.error("[deleteProject] error:", error);
    return { message: error.message, ok: false };
  }

  revalidatePath("/projects");
  revalidatePath("/tasks");
  revalidatePath("/home");
  return { ok: true };
}
