"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import {
  createClientSchema,
  updateClientSchema,
  type ClientState,
} from "@/lib/schemas/clients";

export async function createClient(
  _prevState: ClientState | undefined,
  formData: FormData,
): Promise<ClientState> {
  const user = await verifySession();
  const supabase = await createServerClient();

  const raw = {
    name: formData.get("name"),
    company: formData.get("company") || undefined,
    contact: formData.get("contact") || undefined,
    source: formData.get("source") || undefined,
    status: formData.get("status") || "active",
    started_on: formData.get("started_on") || undefined,
    deadline: formData.get("deadline") || undefined,
    payment_status: formData.get("payment_status") || undefined,
    notes: formData.get("notes") || undefined,
    next_action: formData.get("next_action") || undefined,
    follow_up_date: formData.get("follow_up_date") || undefined,
  };

  const parsed = createClientSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the validation errors below.",
      ok: false,
    };
  }

  const { error } = await supabase.from("clients").insert({
    user_id: user.userId,
    name: parsed.data.name,
    company: parsed.data.company ?? null,
    contact: parsed.data.contact ?? null,
    source: parsed.data.source ?? null,
    status: parsed.data.status,
    started_on: parsed.data.started_on || null,
    deadline: parsed.data.deadline || null,
    payment_status: parsed.data.payment_status ?? null,
    notes: parsed.data.notes ?? null,
    next_action: parsed.data.next_action ?? null,
    follow_up_date: parsed.data.follow_up_date || null,
    testimonial_status: parsed.data.testimonial_status,
    referral_status: parsed.data.referral_status,
  });

  if (error) {
    console.error("[createClient] error:", error);
    return { message: error.message, ok: false };
  }

  revalidatePath("/clients");
  revalidatePath("/freelance");
  revalidatePath("/home");
  return { ok: true };
}

export async function updateClient(
  id: string,
  _prevState: ClientState | undefined,
  formData: FormData,
): Promise<ClientState> {
  const user = await verifySession();
  const supabase = await createServerClient();

  const raw = {
    name: formData.get("name"),
    company: formData.get("company") || undefined,
    contact: formData.get("contact") || undefined,
    source: formData.get("source") || undefined,
    status: formData.get("status") || undefined,
    started_on: formData.get("started_on") || undefined,
    deadline: formData.get("deadline") || undefined,
    payment_status: formData.get("payment_status") || undefined,
    notes: formData.get("notes") || undefined,
    next_action: formData.get("next_action") || undefined,
    follow_up_date: formData.get("follow_up_date") || undefined,
    testimonial_status: formData.get("testimonial_status") || undefined,
    referral_status: formData.get("referral_status") || undefined,
  };

  const parsed = updateClientSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the validation errors below.",
      ok: false,
    };
  }

  const { error } = await supabase
    .from("clients")
    .update({
      name: parsed.data.name,
      company: parsed.data.company ?? null,
      contact: parsed.data.contact ?? null,
      source: parsed.data.source ?? null,
      status: parsed.data.status,
      started_on: parsed.data.started_on || null,
      deadline: parsed.data.deadline || null,
      payment_status: parsed.data.payment_status ?? null,
      notes: parsed.data.notes ?? null,
      next_action: parsed.data.next_action ?? null,
      follow_up_date: parsed.data.follow_up_date || null,
      testimonial_status: parsed.data.testimonial_status,
      referral_status: parsed.data.referral_status,
    })
    .eq("id", id)
    .eq("user_id", user.userId);

  if (error) {
    console.error("[updateClient] error:", error);
    return { message: error.message, ok: false };
  }

  revalidatePath("/clients");
  revalidatePath("/freelance");
  revalidatePath("/home");
  return { ok: true };
}

export async function deleteClient(id: string): Promise<ClientState> {
  const user = await verifySession();
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("user_id", user.userId);

  if (error) {
    console.error("[deleteClient] error:", error);
    return { message: error.message, ok: false };
  }

  revalidatePath("/clients");
  revalidatePath("/freelance");
  revalidatePath("/projects");
  revalidatePath("/home");
  return { ok: true };
}
