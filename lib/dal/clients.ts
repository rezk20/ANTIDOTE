import { cache } from "react";
import { createServerClient } from "@/lib/supabase/server";
import { verifySession } from "./auth";
import type { ClientRow, ProjectRow, LeadRow, ClientStatus } from "@/lib/supabase/types";

export interface ClientFilter {
  status?: string;
  search?: string;
}

export const getClients = cache(
  async (filter?: ClientFilter): Promise<ClientRow[]> => {
    const user = await verifySession();
    const supabase = await createServerClient();

    let query = supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.userId)
      .order("updated_at", { ascending: false });

    if (filter?.status && filter.status !== "all") {
      query = query.eq("status", filter.status as ClientStatus);
    }

    if (filter?.search) {
      query = query.ilike("name", `%${filter.search}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error("[DAL:getClients] error:", error);
      return [];
    }

    return (data ?? []) as ClientRow[];
  },
);

export const getClient = cache(async (id: string): Promise<ClientRow | null> => {
  const user = await verifySession();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.userId)
    .maybeSingle();

  if (error) {
    console.error("[DAL:getClient] error:", error);
    return null;
  }

  return (data as ClientRow) ?? null;
});

export const getClientWithProjectsAndLeads = cache(
  async (
    clientId: string,
  ): Promise<{ client: ClientRow | null; projects: ProjectRow[]; leads: LeadRow[] }> => {
    const user = await verifySession();
    const supabase = await createServerClient();

    const [clientRes, projectsRes, leadsRes] = await Promise.all([
      supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .eq("user_id", user.userId)
        .maybeSingle(),
      supabase
        .from("projects")
        .select("*")
        .eq("client_id", clientId)
        .eq("user_id", user.userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("leads")
        .select("*")
        .eq("client_id", clientId)
        .eq("user_id", user.userId)
        .order("created_at", { ascending: false }),
    ]);

    return {
      client: (clientRes.data as ClientRow) ?? null,
      projects: (projectsRes.data ?? []) as ProjectRow[],
      leads: (leadsRes.data ?? []) as LeadRow[],
    };
  },
);
