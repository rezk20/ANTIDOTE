import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/supabase/types";

export interface SessionPayload {
  isAuth: boolean;
  userId: string;
  email: string | null;
}

export interface HomeSummary {
  goalsCount: number;
  tasksCount: number;
  bucketsCount: number;
  projectsCount: number;
  marriageBucketStartingBalance: number;
}

/**
 * Verify session server-side with Supabase auth.getUser().
 * Memoized per React render pass with cache().
 * Redirects to /login if unauthenticated.
 */
export const verifySession = cache(async (): Promise<SessionPayload> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return {
    isAuth: true,
    userId: user.id,
    email: user.email ?? null,
  };
});

/**
 * Safe version of verifySession that does not redirect.
 * Useful for public/conditional routes or checking auth state.
 */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      isAuth: true,
      userId: user.id,
      email: user.email ?? null,
    };
  } catch {
    return null;
  }
});

/**
 * Fetch profile for the authenticated owner.
 */
export const getProfile = cache(async (): Promise<ProfileRow | null> => {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.userId)
    .single();

  if (error) {
    console.error("Failed to fetch profile in DAL:", error.message);
    return null;
  }

  return data as ProfileRow;
});

/**
 * Fetch summary counts for the authenticated /home proof page.
 * Uses parallel queries (Promise.all) as required by plan §6.2.
 */
export const getHomeSummary = cache(async (): Promise<HomeSummary> => {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const [goalsRes, tasksRes, bucketsRes, projectsRes, marriageBucketRes] =
    await Promise.all([
      supabase
        .from("goals")
        .select("id", { count: "exact", head: true })
        .eq("user_id", session.userId),
      supabase
        .from("tasks")
        .select("id", { count: "exact", head: true })
        .eq("user_id", session.userId),
      supabase
        .from("buckets")
        .select("id", { count: "exact", head: true })
        .eq("user_id", session.userId),
      supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("user_id", session.userId),
      supabase
        .from("buckets")
        .select("starting_balance")
        .eq("user_id", session.userId)
        .eq("kind", "marriage")
        .maybeSingle(),
    ]);

  return {
    goalsCount: goalsRes.count ?? 0,
    tasksCount: tasksRes.count ?? 0,
    bucketsCount: bucketsRes.count ?? 0,
    projectsCount: projectsRes.count ?? 0,
    marriageBucketStartingBalance: Number(
      (marriageBucketRes.data as { starting_balance?: number } | null)
        ?.starting_balance ?? 0,
    ),
  };
});
