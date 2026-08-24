"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import {
  createLeadSchema,
  updateLeadSchema,
  moveLeadStageSchema,
  logLeadEventSchema,
  convertToClientSchema,
  recordLeadPaymentSchema,
  type LeadState,
} from "@/lib/schemas/leads";
import type { LeadEventType, LeadStage } from "@/lib/supabase/types";

export async function createLead(
  _prevState: LeadState | undefined,
  formData: FormData,
): Promise<LeadState> {
  const user = await verifySession();
  const supabase = await createServerClient();

  const raw = {
    title: formData.get("title"),
    source: formData.get("source") || undefined,
    url: formData.get("url") || undefined,
    stage: formData.get("stage") || "new",
    expected_value: formData.get("expected_value") || undefined,
    probability: formData.get("probability") || undefined,
    client_id: formData.get("client_id") || undefined,
    proposal_amount: formData.get("proposal_amount") || undefined,
    proposal_sent_at: formData.get("proposal_sent_at") || undefined,
    proposal_notes: formData.get("proposal_notes") || undefined,
    next_follow_up_at: formData.get("next_follow_up_at") || undefined,
    notes: formData.get("notes") || undefined,
  };

  const parsed = createLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the validation errors below.",
      ok: false,
    };
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      user_id: user.userId,
      title: parsed.data.title,
      source: parsed.data.source ?? null,
      url: parsed.data.url ?? null,
      stage: parsed.data.stage,
      expected_value: parsed.data.expected_value ?? null,
      probability: parsed.data.probability ?? null,
      client_id: parsed.data.client_id || null,
      proposal_amount: parsed.data.proposal_amount ?? null,
      proposal_sent_at: parsed.data.proposal_sent_at || null,
      proposal_notes: parsed.data.proposal_notes ?? null,
      next_follow_up_at: parsed.data.next_follow_up_at || null,
      notes: parsed.data.notes ?? null,
    })
    .select("id, stage")
    .single();

  if (error || !lead) {
    console.error("[createLead] error:", error);
    return {
      message: error?.message ?? "Failed to create lead.",
      ok: false,
    };
  }

  // Automatic Activity Log: Always record discovery
  await supabase.from("lead_events").insert({
    user_id: user.userId,
    lead_id: lead.id,
    event_type: "discovered",
    note: parsed.data.source ? `Discovered via ${parsed.data.source}` : "Lead discovered and created",
  });

  // If created at a non-new stage, record that activity as well
  if (lead.stage !== "new") {
    const matchingEventType = stageToEventType(lead.stage);
    if (matchingEventType) {
      await supabase.from("lead_events").insert({
        user_id: user.userId,
        lead_id: lead.id,
        event_type: matchingEventType,
        amount: parsed.data.proposal_amount ?? parsed.data.expected_value ?? null,
        note: `Initial status set to ${lead.stage}`,
      });
    }
  }

  revalidatePath("/freelance");
  revalidatePath("/home");
  return { ok: true };
}

export async function updateLead(
  id: string,
  _prevState: LeadState | undefined,
  formData: FormData,
): Promise<LeadState> {
  const user = await verifySession();
  const supabase = await createServerClient();

  const raw = {
    title: formData.get("title"),
    source: formData.get("source") || undefined,
    url: formData.get("url") || undefined,
    stage: formData.get("stage") || undefined,
    expected_value: formData.get("expected_value") || undefined,
    probability: formData.get("probability") || undefined,
    client_id: formData.get("client_id") || undefined,
    proposal_amount: formData.get("proposal_amount") || undefined,
    proposal_sent_at: formData.get("proposal_sent_at") || undefined,
    proposal_notes: formData.get("proposal_notes") || undefined,
    next_follow_up_at: formData.get("next_follow_up_at") || undefined,
    lost_reason: formData.get("lost_reason") || undefined,
    notes: formData.get("notes") || undefined,
  };

  const parsed = updateLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the validation errors below.",
      ok: false,
    };
  }

  const { error } = await supabase
    .from("leads")
    .update({
      title: parsed.data.title,
      source: parsed.data.source ?? null,
      url: parsed.data.url ?? null,
      stage: parsed.data.stage,
      expected_value: parsed.data.expected_value ?? null,
      probability: parsed.data.probability ?? null,
      client_id: parsed.data.client_id || null,
      proposal_amount: parsed.data.proposal_amount ?? null,
      proposal_sent_at: parsed.data.proposal_sent_at || null,
      proposal_notes: parsed.data.proposal_notes ?? null,
      next_follow_up_at: parsed.data.next_follow_up_at || null,
      lost_reason: parsed.data.lost_reason ?? null,
      notes: parsed.data.notes ?? null,
    })
    .eq("id", id)
    .eq("user_id", user.userId);

  if (error) {
    console.error("[updateLead] error:", error);
    return {
      message: error.message,
      ok: false,
    };
  }

  revalidatePath("/freelance");
  revalidatePath("/home");
  return { ok: true };
}

export async function moveLeadStage(
  leadId: string,
  newStage: string,
  additionalData?: {
    lost_reason?: string;
    proposal_amount?: number;
    next_follow_up_at?: string;
    note?: string;
  },
): Promise<LeadState> {
  const user = await verifySession();
  const supabase = await createServerClient();

  const parsed = moveLeadStageSchema.safeParse({
    lead_id: leadId,
    stage: newStage,
    lost_reason: additionalData?.lost_reason,
    proposal_amount: additionalData?.proposal_amount,
    next_follow_up_at: additionalData?.next_follow_up_at,
    note: additionalData?.note,
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Invalid stage data.",
      ok: false,
    };
  }

  const updatePayload: {
    stage: LeadStage;
    last_contact_at: string;
    lost_reason?: string | null;
    proposal_amount?: number | null;
    next_follow_up_at?: string | null;
  } = {
    stage: parsed.data.stage,
    last_contact_at: new Date().toISOString(),
  };

  if (parsed.data.lost_reason !== undefined) {
    updatePayload.lost_reason = parsed.data.lost_reason;
  }
  if (parsed.data.proposal_amount !== undefined) {
    updatePayload.proposal_amount = parsed.data.proposal_amount;
  }
  if (parsed.data.next_follow_up_at !== undefined) {
    updatePayload.next_follow_up_at = parsed.data.next_follow_up_at || null;
  }

  const { error } = await supabase
    .from("leads")
    .update(updatePayload)
    .eq("id", leadId)
    .eq("user_id", user.userId);

  if (error) {
    console.error("[moveLeadStage] update error:", error);
    return { message: error.message, ok: false };
  }

  // Automatic matching event logging
  const matchingEventType = stageToEventType(parsed.data.stage);
  if (matchingEventType) {
    await supabase.from("lead_events").insert({
      user_id: user.userId,
      lead_id: leadId,
      event_type: matchingEventType,
      amount: parsed.data.proposal_amount ?? null,
      note: parsed.data.note ?? (parsed.data.lost_reason ? `Reason: ${parsed.data.lost_reason}` : `Stage moved to ${parsed.data.stage}`),
    });
  }

  revalidatePath("/freelance");
  revalidatePath("/home");
  return { ok: true };
}

export async function logLeadEvent(
  leadId: string,
  eventType: LeadEventType,
  note?: string,
  amount?: number,
): Promise<LeadState> {
  const user = await verifySession();
  const supabase = await createServerClient();

  const parsed = logLeadEventSchema.safeParse({
    lead_id: leadId,
    event_type: eventType,
    note,
    amount,
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Invalid event data.",
      ok: false,
    };
  }

  const { error } = await supabase.from("lead_events").insert({
    user_id: user.userId,
    lead_id: leadId,
    event_type: parsed.data.event_type,
    note: parsed.data.note ?? null,
    amount: parsed.data.amount ?? null,
  });

  if (error) {
    console.error("[logLeadEvent] error:", error);
    return { message: error.message, ok: false };
  }

  // Touch the lead's last_contact_at
  await supabase
    .from("leads")
    .update({ last_contact_at: new Date().toISOString() })
    .eq("id", leadId)
    .eq("user_id", user.userId);

  revalidatePath("/freelance");
  return { ok: true };
}

export async function convertToClient(
  leadId: string,
  clientData: {
    client_name: string;
    company?: string;
    contact?: string;
    create_project?: boolean;
    project_name?: string;
    project_budget?: number;
  },
): Promise<LeadState> {
  const user = await verifySession();
  const supabase = await createServerClient();

  const parsed = convertToClientSchema.safeParse({
    lead_id: leadId,
    ...clientData,
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation failed for client conversion.",
      ok: false,
    };
  }

  // 1. Insert new client
  const { data: client, error: clientErr } = await supabase
    .from("clients")
    .insert({
      user_id: user.userId,
      name: parsed.data.client_name,
      company: parsed.data.company ?? null,
      contact: parsed.data.contact ?? null,
      status: "active",
    })
    .select("id")
    .single();

  if (clientErr || !client) {
    console.error("[convertToClient] client insert error:", clientErr);
    return { message: clientErr?.message ?? "Failed to create client record.", ok: false };
  }

  // 2. Link lead to client and mark as won
  await supabase
    .from("leads")
    .update({
      client_id: client.id,
      stage: "won",
      last_contact_at: new Date().toISOString(),
    })
    .eq("id", leadId)
    .eq("user_id", user.userId);

  // 3. Log won event
  await supabase.from("lead_events").insert({
    user_id: user.userId,
    lead_id: leadId,
    event_type: "won",
    note: `Converted to client: ${parsed.data.client_name}`,
  });

  // 4. Optionally create project
  if (parsed.data.create_project && parsed.data.project_name) {
    await supabase.from("projects").insert({
      user_id: user.userId,
      name: parsed.data.project_name,
      client_id: client.id,
      kind: "client",
      status: "active",
      budget: parsed.data.project_budget ?? null,
    });
  }

  revalidatePath("/freelance");
  revalidatePath("/clients");
  revalidatePath("/projects");
  revalidatePath("/home");
  return { ok: true };
}

export async function recordLeadPayment(
  leadId: string,
  amount: number,
  occurredOn: string,
  note?: string,
): Promise<LeadState> {
  const user = await verifySession();
  const supabase = await createServerClient();

  const parsed = recordLeadPaymentSchema.safeParse({
    lead_id: leadId,
    amount,
    occurred_on: occurredOn,
    note,
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Invalid payment data.",
      ok: false,
    };
  }

  // 1. Create income transaction
  const { data: tx, error: txErr } = await supabase
    .from("transactions")
    .insert({
      user_id: user.userId,
      amount: parsed.data.amount,
      kind: "income",
      category: "Freelance",
      occurred_on: parsed.data.occurred_on,
      lead_id: leadId,
      note: parsed.data.note ?? "Lead payment received",
      currency: "EGP",
    })
    .select("id")
    .single();

  if (txErr) {
    console.error("[recordLeadPayment] transaction insert error:", txErr);
  }

  // 2. Log paid event
  await supabase.from("lead_events").insert({
    user_id: user.userId,
    lead_id: leadId,
    event_type: "paid",
    amount: parsed.data.amount,
    transaction_id: tx?.id ?? null,
    note: parsed.data.note ?? "Payment received",
  });

  // 3. Update lead stage to paid
  await supabase
    .from("leads")
    .update({ stage: "paid" })
    .eq("id", leadId)
    .eq("user_id", user.userId);

  revalidatePath("/freelance");
  revalidatePath("/finances");
  revalidatePath("/home");
  return { ok: true };
}

export async function deleteLead(id: string): Promise<LeadState> {
  const user = await verifySession();
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("user_id", user.userId);

  if (error) {
    console.error("[deleteLead] error:", error);
    return { message: error.message, ok: false };
  }

  revalidatePath("/freelance");
  revalidatePath("/home");
  return { ok: true };
}

function stageToEventType(stage: string): LeadEventType | null {
  const map: Record<string, LeadEventType> = {
    contacted: "outreach",
    proposal_sent: "proposal_sent",
    follow_up: "follow_up",
    call: "call",
    negotiation: "negotiation",
    won: "won",
    lost: "lost",
    delivered: "delivered",
    paid: "paid",
    review_requested: "review_requested",
    referral_requested: "referral_received",
  };
  return map[stage] ?? null;
}
