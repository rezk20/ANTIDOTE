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

      case "add_brain_dump": {
        const { data, error } = await supabase
          .from("brain_dumps")
          .insert({
            user_id: userId,
            content: `[${payload.category.toUpperCase()}] ${payload.content}`,
            status: payload.status || "inbox",
          })
          .select("id, content, status, created_at")
          .single();

        if (error) throw error;
        revalidatePath("/brain-dump");
        return { ok: true, data: { item: data, message: "Idea added to Brain Dump." } };
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
            is_top_three: payload.is_top_three || false,
            description: payload.description || null,
            status: "planned",
          })
          .select("id, title, priority, scheduled_date, is_top_three")
          .single();

        if (error) throw error;
        revalidatePath("/tasks");
        revalidatePath("/today");
        revalidatePath("/calendar");
        return { ok: true, data: { task: data, message: "Task created successfully." } };
      }

      case "update_task": {
        const updateData: {
          status?: "backlog" | "planned" | "in_progress" | "done" | "dropped" | "someday";
          priority?: "critical" | "high" | "medium" | "low";
          scheduled_date?: string | null;
          is_top_three?: boolean;
        } = {};

        if (payload.status) updateData.status = statusMap[payload.status] || "planned";
        if (payload.priority) updateData.priority = priorityMap[payload.priority] || "medium";
        if (payload.scheduled_date !== undefined) updateData.scheduled_date = payload.scheduled_date;
        if (payload.is_top_three !== undefined) updateData.is_top_three = payload.is_top_three;

        const { data, error } = await supabase
          .from("tasks")
          .update(updateData)
          .eq("id", payload.task_id)
          .eq("user_id", userId)
          .select("id, title, status, priority, is_top_three")
          .single();

        if (error) throw error;
        revalidatePath("/tasks");
        revalidatePath("/today");
        revalidatePath("/calendar");
        return { ok: true, data: { task: data, message: "Task updated." } };
      }

      case "set_day_plan": {
        const { data, error } = await supabase
          .from("day_plans")
          .upsert(
            {
              user_id: userId,
              plan_date: payload.plan_date,
              available_hours: payload.available_hours,
              energy: payload.energy,
              focus_question_answer: payload.focus_question_answer,
              notes: payload.notes || null,
              status: "active",
            },
            { onConflict: "user_id,plan_date" },
          )
          .select("*")
          .single();

        if (error) throw error;

        // If top three task IDs provided, update them
        if (payload.top_three_task_ids && payload.top_three_task_ids.length > 0) {
          // Reset existing top 3 for this day
          await supabase
            .from("tasks")
            .update({ is_top_three: false })
            .eq("user_id", userId)
            .eq("scheduled_date", payload.plan_date);

          // Mark selected ones
          await supabase
            .from("tasks")
            .update({ is_top_three: true, scheduled_date: payload.plan_date })
            .eq("user_id", userId)
            .in("id", payload.top_three_task_ids);
        }

        revalidatePath("/today");
        revalidatePath("/calendar");
        return { ok: true, data: { dayPlan: data, message: "Morning mission calibrated successfully." } };
      }

      case "orchestrate_day": {
        const results = {
          dayPlan: null as unknown,
          createdTasks: [] as unknown[],
          brainDumpItems: [] as unknown[],
          report: null as unknown,
        };

        // 1. Set / Upsert Day Plan
        const { data: dayPlanData, error: dayPlanErr } = await supabase
          .from("day_plans")
          .upsert(
            {
              user_id: userId,
              plan_date: payload.target_date,
              available_hours: payload.available_hours,
              energy: payload.energy,
              focus_question_answer: payload.focus_question_answer,
              notes: payload.executive_briefing,
              status: "active",
            },
            { onConflict: "user_id,plan_date" },
          )
          .select("*")
          .single();

        if (dayPlanErr) throw dayPlanErr;
        results.dayPlan = dayPlanData;

        // 2. Create any new tasks
        if (payload.new_tasks && payload.new_tasks.length > 0) {
          for (const t of payload.new_tasks) {
            const taskPriority = priorityMap[t.priority] || "medium";
            const { data: createdTask } = await supabase
              .from("tasks")
              .insert({
                user_id: userId,
                title: t.title,
                priority: taskPriority,
                task_type: t.task_type,
                scheduled_date: payload.target_date,
                duration_min: t.estimated_minutes || 60,
                is_top_three: t.is_top_three || false,
                description: t.description || null,
                status: "planned",
              })
              .select("id, title, priority, scheduled_date, is_top_three")
              .single();

            if (createdTask) results.createdTasks.push(createdTask);
          }
        }

        // 3. Mark Top 3 Tasks if specified
        if (payload.top_three_task_ids && payload.top_three_task_ids.length > 0) {
          await supabase
            .from("tasks")
            .update({ is_top_three: true, scheduled_date: payload.target_date })
            .eq("user_id", userId)
            .in("id", payload.top_three_task_ids);
        }

        // 4. Drop Brain Dump Suggestions
        if (payload.brain_dump_suggestions && payload.brain_dump_suggestions.length > 0) {
          for (const s of payload.brain_dump_suggestions) {
            const { data: dumpData } = await supabase
              .from("brain_dumps")
              .insert({
                user_id: userId,
                content: `[AI Suggestion] ${s}`,
                status: "inbox",
              })
              .select("id, content")
              .single();

            if (dumpData) results.brainDumpItems.push(dumpData);
          }
        }

        // 5. Automatically record an Executive Report in notes (folder: agent_reports)
        const reportContent = `### 📋 ملخص التخطيط اليومي للـ AI Orchestrator (${payload.target_date})

**🎯 الهدف الرئيسي لليوم (The One Thing):**
> ${payload.focus_question_answer}

**⏱️ الساعات المتاحة ومستوى الطاقة:**
- ساعات العمل المركزة: **${payload.available_hours} ساعات**
- تقييم الطاقة: **${payload.energy} / 5**

**⚡ التقرير التنفيذي:**
${payload.executive_briefing}

---
*تمت أتمتة هذه الجلسة تلقائياً بواسطة Hermes AI Engine بنجاح.*`;

        const { data: reportNote } = await supabase
          .from("notes")
          .insert({
            user_id: userId,
            title: `تقرير التخطيط اليومي - ${payload.target_date}`,
            content: reportContent,
            folder: "agent_reports",
            tags: ["ai_orchestration", "daily_plan", "hermes"],
            pinned: true,
          })
          .select("id, title, created_at")
          .single();

        results.report = reportNote;

        revalidatePath("/today");
        revalidatePath("/tasks");
        revalidatePath("/calendar");
        revalidatePath("/brain-dump");
        revalidatePath("/notes");
        revalidatePath("/agent");

        return {
          ok: true,
          data: {
            results,
            message: `Autonomous orchestration completed for ${payload.target_date}!`,
          },
        };
      }

      case "log_report": {
        const changesList = payload.changes_made.length > 0
          ? payload.changes_made.map((c) => `- ${c}`).join("\n")
          : "- لا توجد تعديلات إضافية.";

        const recsList = payload.strategic_recommendations.length > 0
          ? payload.strategic_recommendations.map((r) => `- ${r}`).join("\n")
          : "- الاستمرار على نفس الخطة الحالية.";

        const markdownContent = payload.full_markdown || `### 📊 ${payload.title}

**الملخص التنفيذي:**
${payload.summary}

### 🔄 التعديلات والمهام المنجزة:
${changesList}

### 💡 التوصيات الاستراتيجية للمرحلة القادمة:
${recsList}

---
*سجل بواسطة Hermes AI Copilot في ${new Date().toLocaleTimeString("ar-EG")}*`;

        const { data, error } = await supabase
          .from("notes")
          .insert({
            user_id: userId,
            title: payload.title,
            content: markdownContent,
            folder: "agent_reports",
            tags: ["agent_report", "audit_log", "briefing"],
            pinned: true,
          })
          .select("id, title, folder, created_at")
          .single();

        if (error) throw error;
        revalidatePath("/notes");
        revalidatePath("/agent");
        return { ok: true, data: { report: data, message: "Agent report logged successfully." } };
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
