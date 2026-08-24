import { cache } from "react";
import { createServerClient } from "@/lib/supabase/server";
import { verifySession } from "./auth";
import type { LeadRow, LeadEventRow, LeadStage } from "@/lib/supabase/types";

export interface LeadFilter {
  stage?: string;
  search?: string;
  clientId?: string;
}

export const getLeads = cache(
  async (filter?: LeadFilter): Promise<LeadRow[]> => {
    const user = await verifySession();
    const supabase = await createServerClient();

    let query = supabase
      .from("leads")
      .select("*")
      .eq("user_id", user.userId)
      .order("updated_at", { ascending: false });

    if (filter?.stage && filter.stage !== "all") {
      query = query.eq("stage", filter.stage as LeadStage);
    }

    if (filter?.clientId) {
      query = query.eq("client_id", filter.clientId);
    }

    if (filter?.search) {
      query = query.ilike("title", `%${filter.search}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error("[DAL:getLeads] error:", error);
      return [];
    }

    return (data ?? []) as LeadRow[];
  },
);

export const getLead = cache(async (id: string): Promise<LeadRow | null> => {
  const user = await verifySession();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.userId)
    .maybeSingle();

  if (error) {
    console.error("[DAL:getLead] error:", error);
    return null;
  }

  return (data as LeadRow) ?? null;
});

export const getLeadEvents = cache(
  async (leadId: string): Promise<LeadEventRow[]> => {
    const user = await verifySession();
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("lead_events")
      .select("*")
      .eq("lead_id", leadId)
      .eq("user_id", user.userId)
      .order("occurred_at", { ascending: false });

    if (error) {
      console.error("[DAL:getLeadEvents] error:", error);
      return [];
    }

    return (data ?? []) as LeadEventRow[];
  },
);

export const getAllLeadEvents = cache(
  async (limit = 50): Promise<LeadEventRow[]> => {
    const user = await verifySession();
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("lead_events")
      .select("*")
      .eq("user_id", user.userId)
      .order("occurred_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[DAL:getAllLeadEvents] error:", error);
      return [];
    }

    return (data ?? []) as LeadEventRow[];
  },
);

export const getFollowUpQueue = cache(async (): Promise<LeadRow[]> => {
  const user = await verifySession();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user.userId)
    .not("next_follow_up_at", "is", null)
    .not("stage", "in", '("won","lost","paid")')
    .order("next_follow_up_at", { ascending: true })
    .limit(10);

  if (error) {
    console.error("[DAL:getFollowUpQueue] error:", error);
    return [];
  }

  return (data ?? []) as LeadRow[];
});
