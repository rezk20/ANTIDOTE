"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  transactionSchema,
  bucketSchema,
  marriageExpenseSchema,
  type TransactionState,
  type BucketState,
  type MarriageExpenseState,
} from "@/lib/schemas/finance";

// ============================================================
// TRANSACTIONS ACTIONS
// ============================================================

export async function createTransaction(
  prevState: TransactionState,
  formData: FormData,
): Promise<TransactionState> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const rawData = {
    amount: formData.get("amount"),
    kind: formData.get("kind"),
    category: formData.get("category"),
    occurred_on: formData.get("occurred_on"),
    source: formData.get("source"),
    project_id: formData.get("project_id"),
    lead_id: formData.get("lead_id"),
    bucket_id: formData.get("bucket_id"),
    note: formData.get("note"),
    is_recurring: formData.get("is_recurring") === "on" || formData.get("is_recurring") === "true",
    currency: formData.get("currency") || "EGP",
  };

  const parsed = transactionSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the validation errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("transactions").insert({
    user_id: session.userId,
    ...parsed.data,
  });

  if (error) {
    console.error("Error creating transaction:", error);
    return {
      ok: false,
      message: error.message || "Failed to record transaction.",
    };
  }

  revalidatePath("/finances");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateTransaction(
  id: string,
  prevState: TransactionState,
  formData: FormData,
): Promise<TransactionState> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const rawData = {
    amount: formData.get("amount"),
    kind: formData.get("kind"),
    category: formData.get("category"),
    occurred_on: formData.get("occurred_on"),
    source: formData.get("source"),
    project_id: formData.get("project_id"),
    lead_id: formData.get("lead_id"),
    bucket_id: formData.get("bucket_id"),
    note: formData.get("note"),
    is_recurring: formData.get("is_recurring") === "on" || formData.get("is_recurring") === "true",
    currency: formData.get("currency") || "EGP",
  };

  const parsed = transactionSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the validation errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("transactions")
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) {
    console.error(`Error updating transaction ${id}:`, error);
    return {
      ok: false,
      message: error.message || "Failed to update transaction.",
    };
  }

  revalidatePath("/finances");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteTransaction(id: string): Promise<boolean> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) {
    console.error(`Error deleting transaction ${id}:`, error);
    return false;
  }

  revalidatePath("/finances");
  revalidatePath("/dashboard");
  return true;
}

// ============================================================
// BUCKETS (WALLETS) ACTIONS
// ============================================================

export async function createBucket(
  prevState: BucketState,
  formData: FormData,
): Promise<BucketState> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const rawData = {
    name: formData.get("name"),
    kind: formData.get("kind"),
    starting_balance: formData.get("starting_balance") || 0,
    target_amount: formData.get("target_amount"),
    is_active: formData.get("is_active") !== "false",
  };

  const parsed = bucketSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the validation errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("buckets").insert({
    user_id: session.userId,
    ...parsed.data,
  });

  if (error) {
    console.error("Error creating bucket:", error);
    return {
      ok: false,
      message: error.message || "Failed to create savings bucket.",
    };
  }

  revalidatePath("/finances");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateBucket(
  id: string,
  prevState: BucketState,
  formData: FormData,
): Promise<BucketState> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const rawData = {
    name: formData.get("name"),
    kind: formData.get("kind"),
    starting_balance: formData.get("starting_balance") || 0,
    target_amount: formData.get("target_amount"),
    is_active: formData.get("is_active") !== "false",
  };

  const parsed = bucketSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the validation errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("buckets")
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) {
    console.error(`Error updating bucket ${id}:`, error);
    return {
      ok: false,
      message: error.message || "Failed to update savings bucket.",
    };
  }

  revalidatePath("/finances");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteBucket(id: string): Promise<{ ok: boolean; message?: string }> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  // Check if any transactions reference this bucket
  const { count, error: countError } = await supabase
    .from("transactions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", session.userId)
    .eq("bucket_id", id);

  if (countError) {
    console.error("Error checking bucket references:", countError);
  }

  if (count && count > 0) {
    // Cannot hard delete due to foreign key integrity; deactivate bucket instead
    const { error: deactError } = await supabase
      .from("buckets")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", session.userId);

    if (deactError) {
      return { ok: false, message: "Failed to archive bucket." };
    }

    revalidatePath("/finances");
    return {
      ok: true,
      message: "Bucket has historical transactions and was deactivated (archived).",
    };
  }

  // If no transactions reference it, hard delete safely
  const { error } = await supabase
    .from("buckets")
    .delete()
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) {
    console.error(`Error deleting bucket ${id}:`, error);
    return { ok: false, message: error.message };
  }

  revalidatePath("/finances");
  revalidatePath("/dashboard");
  return { ok: true };
}

// ============================================================
// MARRIAGE EXPENSES ACTIONS
// ============================================================

export async function createMarriageExpense(
  prevState: MarriageExpenseState,
  formData: FormData,
): Promise<MarriageExpenseState> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const rawData = {
    item: formData.get("item"),
    category: formData.get("category"),
    estimated_cost: formData.get("estimated_cost") || 0,
    actual_cost: formData.get("actual_cost"),
    paid_amount: formData.get("paid_amount") || 0,
    deadline: formData.get("deadline"),
    priority: formData.get("priority") || "medium",
    status: formData.get("status") || "planned",
    notes: formData.get("notes"),
  };

  const parsed = marriageExpenseSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the validation errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("marriage_expenses").insert({
    user_id: session.userId,
    ...parsed.data,
  });

  if (error) {
    console.error("Error creating marriage expense:", error);
    return {
      ok: false,
      message: error.message || "Failed to create marriage expense item.",
    };
  }

  revalidatePath("/finances");
  revalidatePath("/marriage");
  return { ok: true };
}

export async function updateMarriageExpense(
  id: string,
  prevState: MarriageExpenseState,
  formData: FormData,
): Promise<MarriageExpenseState> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const rawData = {
    item: formData.get("item"),
    category: formData.get("category"),
    estimated_cost: formData.get("estimated_cost") || 0,
    actual_cost: formData.get("actual_cost"),
    paid_amount: formData.get("paid_amount") || 0,
    deadline: formData.get("deadline"),
    priority: formData.get("priority") || "medium",
    status: formData.get("status") || "planned",
    notes: formData.get("notes"),
  };

  const parsed = marriageExpenseSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the validation errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("marriage_expenses")
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) {
    console.error(`Error updating marriage expense ${id}:`, error);
    return {
      ok: false,
      message: error.message || "Failed to update marriage expense item.",
    };
  }

  revalidatePath("/finances");
  revalidatePath("/marriage");
  return { ok: true };
}

export async function deleteMarriageExpense(id: string): Promise<boolean> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("marriage_expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) {
    console.error(`Error deleting marriage expense ${id}:`, error);
    return false;
  }

  revalidatePath("/finances");
  revalidatePath("/marriage");
  return true;
}

export async function recordMarriageExpensePayment(
  expenseId: string,
  paymentAmount: number,
  bucketId?: string | null,
  occurredOn?: string,
  note?: string,
): Promise<{ ok: boolean; message?: string }> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  if (!paymentAmount || paymentAmount <= 0) {
    return { ok: false, message: "Payment amount must be greater than 0." };
  }

  // 1. Get current expense
  const { data: expense, error: fetchError } = await supabase
    .from("marriage_expenses")
    .select("*")
    .eq("id", expenseId)
    .eq("user_id", session.userId)
    .single();

  if (fetchError || !expense) {
    return { ok: false, message: "Marriage expense not found." };
  }

  const newPaidAmount = (Number(expense.paid_amount) || 0) + paymentAmount;
  const targetCost =
    expense.actual_cost != null
      ? Number(expense.actual_cost)
      : Number(expense.estimated_cost);

  const newStatus =
    newPaidAmount >= targetCost ? "paid" : "in_progress";

  // 2. Update marriage expense
  const { error: updateError } = await supabase
    .from("marriage_expenses")
    .update({
      paid_amount: newPaidAmount,
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", expenseId)
    .eq("user_id", session.userId);

  if (updateError) {
    console.error("Error updating marriage expense payment:", updateError);
    return { ok: false, message: "Failed to update paid amount." };
  }

  // 3. Record linked transaction in ledger
  const dateStr = occurredOn || new Date().toISOString().split("T")[0];
  const { error: txError } = await supabase.from("transactions").insert({
    user_id: session.userId,
    amount: paymentAmount,
    kind: "expense",
    category: "marriage",
    occurred_on: dateStr,
    bucket_id: bucketId || null,
    source: "Marriage Checklist Payment",
    note: note || `Payment for wedding item: ${expense.item}`,
    is_recurring: false,
    currency: "EGP",
  });

  if (txError) {
    console.warn("Warning: Could not create linked transaction:", txError);
  }

  revalidatePath("/finances");
  revalidatePath("/marriage");
  return { ok: true };
}
