import { cache } from "react";
import { createServerClient } from "@/lib/supabase/server";
import { verifySession } from "./auth";
import type { ProjectRow, TaskRow, ClientRow, ProjectStatus, ProjectKind } from "@/lib/supabase/types";

export interface ProjectFilter {
  status?: string;
  kind?: string;
  clientId?: string;
  search?: string;
}

export const getProjects = cache(
  async (filter?: ProjectFilter): Promise<ProjectRow[]> => {
    const user = await verifySession();
    const supabase = await createServerClient();

    let query = supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.userId)
      .order("updated_at", { ascending: false });

    if (filter?.status && filter.status !== "all") {
      query = query.eq("status", filter.status as ProjectStatus);
    }

    if (filter?.kind && filter.kind !== "all") {
      query = query.eq("kind", filter.kind as ProjectKind);
    }

    if (filter?.clientId) {
      query = query.eq("client_id", filter.clientId);
    }

    if (filter?.search) {
      query = query.ilike("name", `%${filter.search}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error("[DAL:getProjects] error:", error);
      return [];
    }

    return (data ?? []) as ProjectRow[];
  },
);

export const getProject = cache(async (id: string): Promise<ProjectRow | null> => {
  const user = await verifySession();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.userId)
    .maybeSingle();

  if (error) {
    console.error("[DAL:getProject] error:", error);
    return null;
  }

  return (data as ProjectRow) ?? null;
});

export const getProjectWithTasksAndClient = cache(
  async (
    projectId: string,
  ): Promise<{ project: ProjectRow | null; tasks: TaskRow[]; client: ClientRow | null }> => {
    const user = await verifySession();
    const supabase = await createServerClient();

    const projectRes = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.userId)
      .maybeSingle();

    const project = (projectRes.data as ProjectRow) ?? null;
    if (!project) {
      return { project: null, tasks: [], client: null };
    }

    const [tasksRes, clientRes] = await Promise.all([
      supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .eq("user_id", user.userId)
        .order("created_at", { ascending: false }),
      project.client_id
        ? supabase
            .from("clients")
            .select("*")
            .eq("id", project.client_id)
            .eq("user_id", user.userId)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    return {
      project,
      tasks: (tasksRes.data ?? []) as TaskRow[],
      client: (clientRes.data as ClientRow) ?? null,
    };
  },
);
