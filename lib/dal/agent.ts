import "server-only";
import { cache } from "react";
import crypto from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifySession } from "./auth";
import type { ProfileRow } from "@/lib/supabase/types";

export interface AgentAuthResult {
  isAuthenticated: boolean;
  userId: string | null;
  authMethod: "bearer_token" | null;
}

/**
 * Authenticate incoming API request for the Agent endpoint:
 * Strictly verifies the Bearer Token from the Authorization header.
 */
export async function authenticateAgentRequest(
  authHeader?: string | null,
): Promise<AgentAuthResult> {
  if (!authHeader) {
    return { isAuthenticated: false, userId: null, authMethod: null };
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "").trim()
    : authHeader.trim();

  if (!token) {
    return { isAuthenticated: false, userId: null, authMethod: null };
  }

  const adminClient = createSupabaseAdminClient();

  // 1. Try matching by agent_api_key column
  try {
    const { data: profile, error } = await adminClient
      .from("profiles")
      .select("id, agent_api_key, settings")
      .eq("agent_api_key", token)
      .maybeSingle();

    if (!error && profile) {
      return {
        isAuthenticated: true,
        userId: profile.id,
        authMethod: "bearer_token",
      };
    }
  } catch (err) {
    console.warn("Column agent_api_key query notice:", err);
  }

  // 2. Fallback: Try matching within settings JSON
  try {
    const { data: profiles, error: settingsError } = await adminClient
      .from("profiles")
      .select("id, settings");

    if (!settingsError && profiles) {
      const match = profiles.find((p) => {
        const s = p.settings as Record<string, unknown> | null;
        return s && s.agent_api_key === token;
      });

      if (match) {
        return {
          isAuthenticated: true,
          userId: match.id,
          authMethod: "bearer_token",
        };
      }
    }
  } catch (err) {
    console.error("Agent token fallback lookup error:", err);
  }

  return {
    isAuthenticated: false,
    userId: null,
    authMethod: null,
  };
}

/**
 * Retrieve or generate a secure agent API key for the authenticated user
 */
export const getOrGenerateAgentApiKey = cache(async (): Promise<string> => {
  const session = await verifySession();
  const adminClient = createSupabaseAdminClient();

  const { data: profile } = await adminClient
    .from("profiles")
    .select("agent_api_key, settings")
    .eq("id", session.userId)
    .maybeSingle();

  const existingKey =
    profile?.agent_api_key ||
    (profile?.settings as Record<string, unknown> | null)?.agent_api_key;

  if (typeof existingKey === "string" && existingKey.length > 0) {
    return existingKey;
  }

  // Generate new token prefixed with 'lsk_' (Life OS Secret Key)
  const newKey = `lsk_${crypto.randomBytes(24).toString("hex")}`;

  const currentSettings = (profile?.settings as Record<string, unknown>) || {};
  const updatedSettings = { ...currentSettings, agent_api_key: newKey };

  // Save to both column and settings for maximum durability
  try {
    await adminClient
      .from("profiles")
      .update({
        agent_api_key: newKey,
        settings: updatedSettings,
      })
      .eq("id", session.userId);
  } catch {
    await adminClient
      .from("profiles")
      .update({
        settings: updatedSettings,
      })
      .eq("id", session.userId);
  }

  return newKey;
});

/**
 * Regenerate / rotate the agent API key
 */
export async function rotateAgentApiKey(): Promise<string> {
  const session = await verifySession();
  const adminClient = createSupabaseAdminClient();

  const newKey = `lsk_${crypto.randomBytes(24).toString("hex")}`;

  const { data: profile } = await adminClient
    .from("profiles")
    .select("settings")
    .eq("id", session.userId)
    .maybeSingle();

  const currentSettings = (profile?.settings as Record<string, unknown>) || {};
  const updatedSettings = { ...currentSettings, agent_api_key: newKey };

  try {
    await adminClient
      .from("profiles")
      .update({
        agent_api_key: newKey,
        settings: updatedSettings,
      })
      .eq("id", session.userId);
  } catch {
    await adminClient
      .from("profiles")
      .update({
        settings: updatedSettings,
      })
      .eq("id", session.userId);
  }

  return newKey;
}

/**
 * Aggregate rich live context for the AI agent
 */
export async function getAgentContext(userId: string) {
  const adminClient = createSupabaseAdminClient();
  const todayStr = new Date().toISOString().split("T")[0];

  const [
    profileRes,
    tasksRes,
    dayPlanRes,
    goalsRes,
    leadsRes,
    projectsRes,
    marriageExpensesRes,
    recentNotesRes,
    openDecisionsRes,
  ] = await Promise.all([
    adminClient.from("profiles").select("*").eq("id", userId).single(),
    adminClient
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .or(`scheduled_date.eq.${todayStr},status.eq.in_progress`)
      .order("priority", { ascending: true })
      .limit(15),
    adminClient
      .from("day_plans")
      .select("*")
      .eq("user_id", userId)
      .eq("plan_date", todayStr)
      .maybeSingle(),
    adminClient
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .limit(10),
    adminClient
      .from("leads")
      .select("*")
      .eq("user_id", userId)
      .not("stage", "in", '("won","lost","delivered")')
      .order("expected_value", { ascending: false })
      .limit(10),
    adminClient
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .limit(8),
    adminClient.from("marriage_expenses").select("*").eq("user_id", userId),
    adminClient
      .from("notes")
      .select("id, title, folder, tags, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(6),
    adminClient
      .from("decisions")
      .select("id, title, risk, why_now, reversible, status")
      .eq("user_id", userId)
      .eq("status", "open")
      .limit(5),
  ]);

  const profile = profileRes.data as ProfileRow | null;

  // Marriage calculations
  const marriageExpenses = marriageExpensesRes.data || [];
  const marriageTarget = 250000;
  const marriageTotalPaid = marriageExpenses.reduce(
    (acc: number, curr: { paid_amount?: number | null }) => acc + Number(curr.paid_amount || 0),
    0,
  );
  const marriageRemainingGap = Math.max(0, marriageTarget - marriageTotalPaid);
  const marriageProgressPercent = Math.min(
    100,
    Math.round((marriageTotalPaid / marriageTarget) * 100),
  );

  return {
    timestamp: new Date().toISOString(),
    system: "LIFE OS (ANTIDOTE)",
    user: {
      id: userId,
      displayName: profile?.display_name || "Owner",
      timezone: profile?.timezone || "UTC",
      currency: profile?.currency || "EGP",
    },
    today: {
      date: todayStr,
      dayPlan: dayPlanRes.data || null,
      activeTasks: tasksRes.data || [],
    },
    strategicGoals: goalsRes.data || [],
    marriageMission: {
      targetGoal: marriageTarget,
      totalPaid: marriageTotalPaid,
      remainingGap: marriageRemainingGap,
      progressPercent: marriageProgressPercent,
      categoriesCount: marriageExpenses.length,
    },
    freelancePipeline: {
      activeLeadsCount: leadsRes.data?.length || 0,
      leads: leadsRes.data || [],
    },
    activeProjects: projectsRes.data || [],
    recentNotes: recentNotesRes.data || [],
    openDecisions: openDecisionsRes.data || [],
  };
}

/**
 * Fetch all AI agent activity reports and audit logs for the user
 */
export const getAgentReports = cache(
  async (userId?: string): Promise<{ id: string; title: string; content: string; created_at: string; tags: string[] }[]> => {
    let resolvedUserId = userId;
    if (!resolvedUserId) {
      const session = await verifySession();
      resolvedUserId = session.userId;
    }

    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("notes")
      .select("id, title, content, created_at, tags")
      .eq("user_id", resolvedUserId)
      .eq("folder", "agent_reports")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching agent reports:", error);
      return [];
    }

    return (data || []) as { id: string; title: string; content: string; created_at: string; tags: string[] }[];
  },
);
