"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import { brainDumpSchema, type BrainDumpState } from "@/lib/schemas/brain-dump";

export async function createDump(
  _prevState: BrainDumpState,
  formData: FormData,
): Promise<BrainDumpState> {
  const session = await verifySession();

  const validated = brainDumpSchema.safeParse({
    content: formData.get("content"),
  });

  if (!validated.success) {
    return {
      ok: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("brain_dumps").insert({
    user_id: session.userId,
    content: validated.data.content,
    status: "inbox" as const,
  });

  if (error) {
    console.error("Failed to create brain dump:", error.message);
    return {
      ok: false,
      message: "Failed to save capture. Please try again.",
    };
  }

  revalidatePath("/brain-dump");
  revalidatePath("/home");
  revalidatePath("/dashboard");

  return {
    ok: true,
    message: "Captured to inbox.",
  };
}

export async function deleteDump(id: string): Promise<{ ok: boolean; message?: string }> {
  const session = await verifySession();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("brain_dumps")
    .delete()
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) {
    console.error("Failed to delete brain dump:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/brain-dump");
  return { ok: true };
}

export async function archiveDump(id: string): Promise<{ ok: boolean; message?: string }> {
  const session = await verifySession();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("brain_dumps")
    .update({ status: "archived" as const })
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) {
    console.error("Failed to archive brain dump:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/brain-dump");
  return { ok: true };
}
