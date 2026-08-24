import "server-only";
import { createServerClient as createSsrServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/types";

/**
 * Supabase client for Server Components, Server Actions, Route Handlers and
 * the DAL. Connects with the user's session cookie, so Row Level Security
 * applies to every query.
 *
 * Create a fresh client per request — never share across requests.
 * The service-role key is intentionally NOT reachable from this module;
 * it exists only inside scripts/ (seed / reset-dev).
 */
export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Copy .env.example to .env.local and fill in the dev project values.",
    );
  }

  const cookieStore = await cookies();

  return createSsrServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component where cookies cannot be set.
          // Session refresh is handled by proxy.ts, so this is safe to
          // ignore as long as the DAL verifies sessions server-side.
        }
      },
    },
  });
}

export const createServerClient = createSupabaseServerClient;
