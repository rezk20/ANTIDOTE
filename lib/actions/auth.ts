"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema, type LoginState } from "@/lib/schemas/auth";

/**
 * Minimal in-memory login throttle (single-user app, single server instance).
 * 5 failed attempts per email → 5 minute lockout. Replaced by a durable
 * mechanism only if the app ever grows beyond one user.
 */
const attempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 5 * 60 * 1000;

function isLocked(email: string): boolean {
  const entry = attempts.get(email);
  if (!entry) return false;
  if (entry.lockedUntil > Date.now()) return true;
  if (entry.lockedUntil !== 0 && entry.lockedUntil <= Date.now()) {
    attempts.delete(email);
  }
  return false;
}

function recordFailure(email: string): void {
  const entry = attempts.get(email) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCK_MS;
    entry.count = 0;
  }
  attempts.set(email, entry);
}

function clearFailures(email: string): void {
  attempts.delete(email);
}

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const validated = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email, password } = validated.data;

  if (isLocked(email)) {
    return { message: "Too many failed attempts. Try again in a few minutes." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    recordFailure(email);
    // Do not reveal whether the email exists.
    return { message: "Invalid email or password." };
  }

  clearFailures(email);
  redirect("/home");
}

export async function logout(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
