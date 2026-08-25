import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "./auth";
import { NOTE_FOLDERS } from "@/lib/schemas/notes";
import type { NoteRow } from "@/lib/supabase/types";

export interface NoteFilterOptions {
  folder?: string | null;
  tag?: string | null;
  search?: string | null;
  archived?: boolean;
}

export const getNotes = cache(
  async (filters: NoteFilterOptions = {}): Promise<NoteRow[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    let query = supabase
      .from("notes")
      .select("*")
      .eq("user_id", session.userId);

    if (filters.archived !== undefined) {
      query = query.eq("archived", filters.archived);
    }

    if (filters.folder && filters.folder !== "all") {
      query = query.eq("folder", filters.folder);
    }

    if (filters.tag) {
      query = query.contains("tags", [filters.tag]);
    }

    if (filters.search && filters.search.trim()) {
      const s = `%${filters.search.trim()}%`;
      query = query.or(`title.ilike.${s},content.ilike.${s}`);
    }

    // Sort: Pinned first, then updated_at descending
    query = query
      .order("pinned", { ascending: false })
      .order("updated_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching notes:", error);
      return [];
    }

    return (data ?? []) as NoteRow[];
  },
);

export const getNoteById = cache(
  async (id: string): Promise<NoteRow | null> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching note by id:", error);
      return null;
    }

    return data as NoteRow | null;
  },
);

export interface FolderCount {
  folder: string;
  count: number;
}

export const getNoteFoldersWithCounts = cache(
  async (): Promise<FolderCount[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("notes")
      .select("folder, archived")
      .eq("user_id", session.userId);

    if (error) {
      console.error("Error fetching folder counts:", error);
      return NOTE_FOLDERS.map((f) => ({ folder: f, count: 0 }));
    }

    const counts: Record<string, number> = {};
    for (const f of NOTE_FOLDERS) {
      counts[f] = 0;
    }

    for (const row of data ?? []) {
      if (row.archived) {
        counts["archive"] = (counts["archive"] || 0) + 1;
      } else {
        const folder = row.folder || "inbox";
        counts[folder] = (counts[folder] || 0) + 1;
      }
    }

    return Object.entries(counts).map(([folder, count]) => ({
      folder,
      count,
    }));
  },
);

export interface TagCount {
  tag: string;
  count: number;
}

export const getNoteTagsWithCounts = cache(
  async (): Promise<TagCount[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("notes")
      .select("tags")
      .eq("user_id", session.userId)
      .eq("archived", false);

    if (error) {
      console.error("Error fetching tag counts:", error);
      return [];
    }

    const counts: Record<string, number> = {};

    for (const row of data ?? []) {
      const tags = (row.tags as string[]) || [];
      for (const t of tags) {
        if (t && t.trim()) {
          const tag = t.trim();
          counts[tag] = (counts[tag] || 0) + 1;
        }
      }
    }

    return Object.entries(counts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  },
);
