"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { convertDumpSchema, type ConvertDumpState } from "@/lib/schemas/conversions";

export async function convertBrainDump(
  prevState: ConvertDumpState,
  formData: FormData,
): Promise<ConvertDumpState> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const rawData = {
    dump_id: formData.get("dump_id"),
    target_type: formData.get("target_type"),

    // Task
    task_title: formData.get("task_title"),
    task_area: formData.get("task_area"),
    task_priority: formData.get("task_priority"),
    task_type: formData.get("task_type"),
    task_scheduled_date: formData.get("task_scheduled_date"),
    task_is_top_three: formData.get("task_is_top_three"),

    // Note
    note_title: formData.get("note_title"),
    note_folder: formData.get("note_folder") || "inbox",
    note_content: formData.get("note_content"),
    note_tags: formData.get("note_tags") || "[]",

    // Goal
    goal_title: formData.get("goal_title"),
    goal_level: formData.get("goal_level") || "quarter",
    goal_target_value: formData.get("goal_target_value"),
    goal_unit: formData.get("goal_unit") || "EGP",
    goal_description: formData.get("goal_description"),

    // Lead
    lead_title: formData.get("lead_title"),
    lead_stage: formData.get("lead_stage") || "proposal_sent",
    lead_expected_value: formData.get("lead_expected_value"),
    lead_notes: formData.get("lead_notes"),
  };

  const parsed = convertDumpSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please review the conversion fields below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { dump_id, target_type } = parsed.data;
  let newEntityId: string | null = null;

  try {
    // 1. Create Target Entity
    if (target_type === "task") {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          user_id: session.userId,
          title: parsed.data.task_title || "Untitled Task",
          area: parsed.data.task_area,
          priority: parsed.data.task_priority,
          task_type: parsed.data.task_type,
          scheduled_date: parsed.data.task_scheduled_date || null,
          is_top_three: parsed.data.task_is_top_three,
          status: "planned",
        })
        .select("id")
        .single();

      if (error) throw error;
      newEntityId = data.id;
    } else if (target_type === "note") {
      const { data, error } = await supabase
        .from("notes")
        .insert({
          user_id: session.userId,
          title: parsed.data.note_title || "Untitled Note",
          folder: parsed.data.note_folder,
          content: parsed.data.note_content || "",
          tags: parsed.data.note_tags,
        })
        .select("id")
        .single();

      if (error) throw error;
      newEntityId = data.id;
    } else if (target_type === "goal") {
      const { data, error } = await supabase
        .from("goals")
        .insert({
          user_id: session.userId,
          title: parsed.data.goal_title || "Untitled Goal",
          level: parsed.data.goal_level,
          target_value: parsed.data.goal_target_value ?? null,
          unit: parsed.data.goal_unit || null,
          description: parsed.data.goal_description || null,
          status: "active",
        })
        .select("id")
        .single();

      if (error) throw error;
      newEntityId = data.id;
    } else if (target_type === "lead") {
      const { data, error } = await supabase
        .from("leads")
        .insert({
          user_id: session.userId,
          title: parsed.data.lead_title || "Untitled Lead",
          stage: parsed.data.lead_stage,
          expected_value: parsed.data.lead_expected_value ?? null,
          notes: parsed.data.lead_notes || null,
        })
        .select("id")
        .single();

      if (error) throw error;
      newEntityId = data.id;
    }

    if (!newEntityId) {
      return { ok: false, message: "Failed to create target entity." };
    }

    // 2. Update Brain Dump Record with Backlink & Converted Status
    const { error: dumpUpdateError } = await supabase
      .from("brain_dumps")
      .update({
        status: "converted",
        converted_type: target_type,
        converted_id: newEntityId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", dump_id)
      .eq("user_id", session.userId);

    if (dumpUpdateError) {
      console.warn("Could not set dump converted backlinks:", dumpUpdateError);
    }

    // 3. Revalidate Paths
    revalidatePath("/brain-dump");
    revalidatePath("/tasks");
    revalidatePath("/notes");
    revalidatePath("/goals");
    revalidatePath("/freelance");
    revalidatePath("/home");

    return {
      ok: true,
      message: "Successfully converted and linked capture.",
      convertedType: target_type,
      convertedId: newEntityId,
    };
  } catch (err: unknown) {
    console.error("Conversion failed:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to convert capture.";
    return {
      ok: false,
      message: errorMessage,
    };
  }
}
