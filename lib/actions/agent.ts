"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { rotateAgentApiKey } from "@/lib/dal/agent";
import { agentActionSchema, type AgentActionPayload } from "@/lib/schemas/agent";

export type AgentActionResult = {
  ok: boolean;
  data?: unknown;
  error?: string;
};

/**
 * Server action to rotate the user's Agent API Key
 */
export async function regenerateAgentApiKeyAction(): Promise<AgentActionResult> {
  try {
    const newKey = await rotateAgentApiKey();
    revalidatePath("/agent");
    return { ok: true, data: { apiKey: newKey } };
  } catch (error) {
    console.error("regenerateAgentApiKeyAction error:", error);
    return { ok: false, error: "Failed to rotate API key." };
  }
}

/**
 * Execute an agent action on behalf of an authenticated user
 */
export async function executeAgentAction(
  userId: string,
  rawPayload: unknown,
): Promise<AgentActionResult> {
  const parseRes = agentActionSchema.safeParse(rawPayload);
  if (!parseRes.success) {
    return {
      ok: false,
      error: `Invalid payload: ${parseRes.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
    };
  }

  const payload: AgentActionPayload = parseRes.data;
  const supabase = createSupabaseAdminClient();

  const priorityMap: Record<string, "critical" | "high" | "medium" | "low"> = {
    P1: "critical",
    P2: "high",
    P3: "medium",
    P4: "low",
    critical: "critical",
    high: "high",
    medium: "medium",
    low: "low",
  };

  const statusMap: Record<string, "backlog" | "planned" | "in_progress" | "done" | "dropped" | "someday"> = {
    todo: "planned",
    backlog: "backlog",
    planned: "planned",
    in_progress: "in_progress",
    done: "done",
    dropped: "dropped",
    someday: "someday",
  };

  try {
    switch (payload.action) {
      case "capture_thought": {
        const { data, error } = await supabase
          .from("brain_dumps")
          .insert({
            user_id: userId,
            content: payload.text,
            status: "inbox",
          })
          .select("id, content, created_at")
          .single();

        if (error) throw error;
        revalidatePath("/brain-dump");
        revalidatePath("/today");
        return { ok: true, data: { item: data, message: "Thought captured to Brain Dump inbox." } };
      }

      case "create_task": {
        const taskPriority = priorityMap[payload.priority] || "medium";
        const { data, error } = await supabase
          .from("tasks")
          .insert({
            user_id: userId,
            title: payload.title,
            priority: taskPriority,
            task_type: payload.task_type,
            scheduled_date: payload.scheduled_date || null,
            deadline: payload.due_date || null,
            duration_min: payload.estimated_minutes || null,
            goal_id: payload.goal_id || null,
            project_id: payload.project_id || null,
            status: "planned",
          })
          .select("id, title, priority, scheduled_date")
          .single();

        if (error) throw error;
        revalidatePath("/tasks");
        revalidatePath("/today");
        return { ok: true, data: { task: data, message: "Task created successfully." } };
      }

      case "update_task": {
        const updateData: {
          status?: "backlog" | "planned" | "in_progress" | "done" | "dropped" | "someday";
          priority?: "critical" | "high" | "medium" | "low";
          scheduled_date?: string | null;
        } = {};

        if (payload.status) updateData.status = statusMap[payload.status] || "planned";
        if (payload.priority) updateData.priority = priorityMap[payload.priority] || "medium";
        if (payload.scheduled_date !== undefined) updateData.scheduled_date = payload.scheduled_date;

        const { data, error } = await supabase
          .from("tasks")
          .update(updateData)
          .eq("id", payload.task_id)
          .eq("user_id", userId)
          .select("id, title, status, priority")
          .single();

        if (error) throw error;
        revalidatePath("/tasks");
        revalidatePath("/today");
        return { ok: true, data: { task: data, message: "Task updated." } };
      }

      case "log_time_entry": {
        const startedAt = payload.started_at || new Date().toISOString();
        const { data, error } = await supabase
          .from("time_entries")
          .insert({
            user_id: userId,
            duration_min: payload.duration_min,
            kind: payload.kind,
            task_id: payload.task_id || null,
            project_id: payload.project_id || null,
            focus_rating: payload.focus_rating || null,
            note: payload.note || null,
            started_at: startedAt,
          })
          .select("id, duration_min, kind, started_at")
          .single();

        if (error) throw error;
        revalidatePath("/today");
        revalidatePath("/analytics");
        return { ok: true, data: { timeEntry: data, message: "Work session logged." } };
      }

      case "log_lead": {
        const { data, error } = await supabase
          .from("leads")
          .insert({
            user_id: userId,
            title: payload.title,
            source: payload.source || "agent",
            expected_value: payload.expected_value || null,
            stage: payload.stage,
            notes: payload.notes || null,
          })
          .select("id, title, stage, expected_value")
          .single();

        if (error) throw error;
        revalidatePath("/freelance");
        return { ok: true, data: { lead: data, message: "Freelance lead logged." } };
      }

      case "add_note": {
        const { data, error } = await supabase
          .from("notes")
          .insert({
            user_id: userId,
            title: payload.title,
            content: payload.content,
            folder: payload.folder || "general",
            tags: payload.tags || [],
          })
          .select("id, title, folder")
          .single();

        if (error) throw error;
        revalidatePath("/notes");
        return { ok: true, data: { note: data, message: "Knowledge note created." } };
      }

      case "create_decision": {
        const { data, error } = await supabase
          .from("decisions")
          .insert({
            user_id: userId,
            title: payload.title,
            why_now: payload.why_now || null,
            upside: payload.upside || null,
            downside: payload.downside || null,
            cost: payload.cost || null,
            risk: payload.risk,
            worst_case: payload.worst_case || null,
            best_case: payload.best_case || null,
            reversible: payload.reversible,
            status: "open",
          })
          .select("id, title, risk, reversible")
          .single();

        if (error) throw error;
        revalidatePath("/decisions");
        return { ok: true, data: { decision: data, message: "Decision canvas recorded." } };
      }

      case "save_debrief": {
        const { data, error } = await supabase
          .from("day_plans")
          .upsert(
            {
              user_id: userId,
              plan_date: payload.date,
              energy: payload.energy_rating,
              notes: payload.accomplishments
                ? `Wins: ${payload.accomplishments}\nObstacles: ${payload.obstacles || "None"}\nGratitude: ${payload.gratitude || "None"}\nFocus: ${payload.tomorrow_focus || "None"}`
                : null,
            },
            { onConflict: "user_id,plan_date" },
          )
          .select("id, plan_date, energy")
          .single();

        if (error) throw error;
        revalidatePath("/today");
        return { ok: true, data: { debrief: data, message: "Daily debrief saved." } };
      }
    }
  } catch (error) {
    console.error("executeAgentAction error:", error);
    return { ok: false, error: (error as Error).message || "Failed to execute agent action." };
  }
}

/**
 * Server action callable from the browser playground
 */
export async function runAgentPlaygroundAction(rawPayload: unknown): Promise<AgentActionResult> {
  const session = await verifySession();
  return executeAgentAction(session.userId, rawPayload);
}
