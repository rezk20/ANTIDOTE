"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { noteSchema, type NoteState } from "@/lib/schemas/notes";

export async function createNote(
  prevState: NoteState,
  formData: FormData,
): Promise<NoteState> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const rawData = {
    title: formData.get("title"),
    content: formData.get("content") || "",
    folder: formData.get("folder") || "inbox",
    tags: formData.get("tags") || "[]",
    pinned: formData.get("pinned"),
    archived: formData.get("archived"),
  };

  const parsed = noteSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the validation errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: session.userId,
      title: parsed.data.title,
      content: parsed.data.content,
      folder: parsed.data.folder,
      tags: parsed.data.tags,
      pinned: parsed.data.pinned,
      archived: parsed.data.archived,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating note:", error);
    return {
      ok: false,
      message: error.message || "Failed to create note.",
    };
  }

  revalidatePath("/notes");
  return { ok: true, message: "Note created successfully.", noteId: data.id };
}

export async function updateNote(
  noteId: string,
  prevState: NoteState,
  formData: FormData,
): Promise<NoteState> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const rawData = {
    id: noteId,
    title: formData.get("title"),
    content: formData.get("content") || "",
    folder: formData.get("folder") || "inbox",
    tags: formData.get("tags") || "[]",
    pinned: formData.get("pinned"),
    archived: formData.get("archived"),
  };

  const parsed = noteSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the validation errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("notes")
    .update({
      title: parsed.data.title,
      content: parsed.data.content,
      folder: parsed.data.folder,
      tags: parsed.data.tags,
      pinned: parsed.data.pinned,
      archived: parsed.data.archived,
      updated_at: new Date().toISOString(),
    })
    .eq("id", noteId)
    .eq("user_id", session.userId);

  if (error) {
    console.error("Error updating note:", error);
    return {
      ok: false,
      message: error.message || "Failed to update note.",
    };
  }

  revalidatePath("/notes");
  return { ok: true, message: "Note updated successfully.", noteId };
}

export async function deleteNote(
  noteId: string,
): Promise<{ ok: boolean; message?: string }> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId)
    .eq("user_id", session.userId);

  if (error) {
    console.error("Error deleting note:", error);
    return { ok: false, message: error.message };
  }

  revalidatePath("/notes");
  return { ok: true, message: "Note deleted successfully." };
}

export async function togglePinNote(
  noteId: string,
  pinned: boolean,
): Promise<{ ok: boolean; message?: string }> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("notes")
    .update({
      pinned,
      updated_at: new Date().toISOString(),
    })
    .eq("id", noteId)
    .eq("user_id", session.userId);

  if (error) {
    console.error("Error pinning note:", error);
    return { ok: false, message: error.message };
  }

  revalidatePath("/notes");
  return { ok: true };
}

export async function toggleArchiveNote(
  noteId: string,
  archived: boolean,
): Promise<{ ok: boolean; message?: string }> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("notes")
    .update({
      archived,
      updated_at: new Date().toISOString(),
    })
    .eq("id", noteId)
    .eq("user_id", session.userId);

  if (error) {
    console.error("Error archiving note:", error);
    return { ok: false, message: error.message };
  }

  revalidatePath("/notes");
  return { ok: true };
}
