/**
 * LIFE OS — dev seed (Phase F1).
 *
 * Creates the owner account and the initial data set from the master prompt
 * (§132 snapshot + §133 first database seed).
 *
 * SAFETY (plan §8.9):
 *   - requires SEED_CONFIRM=yes
 *   - refuses to run against the prod project without --prod
 *   - service-role key is used HERE (scripts/) only, never in app/ or lib/
 *
 * Usage:
 *   SEED_CONFIRM=yes npm run db:seed
 */
import { createGuardedAdmin } from "./guards";
import type { SupabaseClient } from "@supabase/supabase-js";

const OWNER_SETTINGS = {
  work_hours_per_day: 8,
  preferred_start_time: "09:00",
  primary_stream: "MERN / Next.js Freelance",
  secondary_stream: "Discord Bots",
  marriage: {
    target_amount: 250000,
    target_months: 12,
    fallback_months: 24,
    housing_strategy: "Rent initially, buy later",
  },
  income_targets: { minimum: null, comfort: null, stretch: null },
  sales_targets: { proposals_per_week: 5, outreach_per_day: 3 },
  relationship: { shared_day: "friday", budget_preference: "low" },
  allocation: { primary_revenue: 50, sales: 25, learning: 15, product: 10 },
  quiet_hours: { start: "23:00", end: "08:00" },
  ai_enabled: false,
  ai_relationship_access: false,
};

export async function seedOwner(admin: SupabaseClient): Promise<string> {
  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;
  if (!email || !password || password === "change-me-strong-password") {
    console.error(
      "✖ Set OWNER_EMAIL and a real OWNER_PASSWORD in .env.local before seeding.",
    );
    process.exit(1);
  }

  // 1. Owner auth user (idempotent: reuse if it already exists).
  let ownerId: string;
  const { data: listed } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  const existing = listed?.users.find((u) => u.email === email);
  if (existing) {
    ownerId = existing.id;
    console.log(`• Owner already exists (${email}) — reusing ${ownerId}`);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // single owner, no email loop (plan §8.1)
      user_metadata: { display_name: "Razook" },
    });
    if (error || !data.user) {
      console.error("✖ Failed to create owner user:", error?.message);
      process.exit(1);
    }
    ownerId = data.user.id;
    console.log(`• Created owner user ${email} (${ownerId})`);
  }

  // 2. Deterministic re-seed: wipe this user's rows (all tables cascade
  //    from auth.users via user_id on delete cascade).
  const tables = [
    "lead_events",
    "reviews",
    "brain_dumps",
    "notes",
    "transactions",
    "tasks",
    "leads",
    "projects",
    "clients",
    "buckets",
    "goals",
  ];
  for (const table of tables) {
    const { error } = await admin.from(table).delete().eq("user_id", ownerId);
    if (error) {
      console.error(`✖ Failed wiping ${table}:`, error.message);
      process.exit(1);
    }
  }
  console.log("• Wiped previous seed rows (deterministic re-seed)");

  // 3. Profile (created by trigger; update with snapshot values).
  const { error: profileError } = await admin
    .from("profiles")
    .update({
      display_name: "Razook",
      timezone: "Africa/Cairo",
      currency: "EGP",
      weekly_off_day: "friday",
      settings: OWNER_SETTINGS,
    })
    .eq("id", ownerId);
  if (profileError) {
    console.error("✖ Failed updating profile:", profileError.message);
    process.exit(1);
  }
  console.log("• Profile updated from §132 snapshot");

  // 4. Goal hierarchy: Vision → Year → 5 seeded goals (§133).
  const { data: vision, error: visionError } = await admin
    .from("goals")
    .insert({
      user_id: ownerId,
      level: "vision",
      title: "Build a stable life with my future wife",
      description:
        "Build Financial Stability + Career + Marriage Readiness (§2 mission).",
      sort_order: 0,
    })
    .select("id")
    .single();
  if (visionError || !vision) {
    console.error("✖ Failed inserting vision goal:", visionError?.message);
    process.exit(1);
  }

  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const yearEnd = new Date(new Date().getFullYear(), 11, 31);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const { data: yearGoal, error: yearError } = await admin
    .from("goals")
    .insert({
      user_id: ownerId,
      level: "year",
      parent_id: vision.id,
      title: "Reach financial readiness for marriage",
      description:
        "Mission: Build Financial Stability + Career + Marriage Readiness.",
      period_start: iso(yearStart),
      period_end: iso(yearEnd),
      target_value: 250000,
      unit: "EGP",
      sort_order: 0,
    })
    .select("id")
    .single();
  if (yearError || !yearGoal) {
    console.error("✖ Failed inserting year goal:", yearError?.message);
    process.exit(1);
  }

  const seededGoals = [
    { title: "Marriage Fund", target_value: 250000, unit: "EGP" },
    { title: "Stable Monthly Income", target_value: null, unit: "EGP/month" },
    { title: "Freelance Client #1", target_value: 1, unit: "clients" },
    { title: "Remote Opportunity", target_value: null, unit: null },
    { title: "Portfolio Upgrade", target_value: null, unit: null },
  ];
  const { error: goalsError } = await admin.from("goals").insert(
    seededGoals.map((g, i) => ({
      user_id: ownerId,
      level: "year" as const,
      parent_id: yearGoal.id,
      title: g.title,
      target_value: g.target_value,
      unit: g.unit,
      sort_order: i + 1,
    })),
  );
  if (goalsError) {
    console.error("✖ Failed inserting goals:", goalsError.message);
    process.exit(1);
  }
  console.log(
    `• Seeded goal hierarchy (vision + year + ${seededGoals.length} goals)`,
  );

  // 5. Projects (§133).
  const seededProjects = [
    { name: "MERN Freelance Pipeline", kind: "internal" as const },
    { name: "Discord Bot Services", kind: "internal" as const },
    { name: "Experimental Product", kind: "experimental" as const },
    { name: "LIFE OS", kind: "internal" as const },
  ];
  const { error: projectsError } = await admin
    .from("projects")
    .insert(seededProjects.map((p) => ({ user_id: ownerId, ...p })));
  if (projectsError) {
    console.error("✖ Failed inserting projects:", projectsError.message);
    process.exit(1);
  }
  console.log(`• Seeded ${seededProjects.length} projects`);

  // 6. Weekly recurring tasks (§133 + §105 default week template).
  const seededTasks = [
    {
      title: "Outreach",
      task_type: "revenue" as const,
      recurring_rule: "weekly:sat,sun,mon,tue,wed,thu",
    },
    {
      title: "Proposal sending",
      task_type: "revenue" as const,
      recurring_rule: "weekly:sat,mon,wed",
    },
    {
      title: "Portfolio improvement",
      task_type: "career" as const,
      recurring_rule: "weekly:sun",
    },
    {
      title: "Finance update",
      task_type: "finance" as const,
      recurring_rule: "weekly:thu",
    },
    {
      title: "Relationship time",
      task_type: "relationship" as const,
      recurring_rule: "weekly:fri",
    },
    {
      title: "Weekly review",
      task_type: "admin" as const,
      recurring_rule: "weekly:fri",
    },
  ];
  const { error: tasksError } = await admin
    .from("tasks")
    .insert(seededTasks.map((t) => ({ user_id: ownerId, ...t })));
  if (tasksError) {
    console.error("✖ Failed inserting recurring tasks:", tasksError.message);
    process.exit(1);
  }
  console.log(`• Seeded ${seededTasks.length} weekly recurring tasks`);

  // 7. Buckets (§132: 18,000 EGP starting savings → marriage bucket).
  const seededBuckets = [
    {
      name: "Marriage",
      kind: "marriage" as const,
      starting_balance: 18000,
      target_amount: 250000,
    },
    {
      name: "Emergency",
      kind: "emergency" as const,
      starting_balance: 0,
      target_amount: null,
    },
    {
      name: "Business",
      kind: "business" as const,
      starting_balance: 0,
      target_amount: null,
    },
    {
      name: "Personal",
      kind: "personal" as const,
      starting_balance: 0,
      target_amount: null,
    },
  ];
  const { error: bucketsError } = await admin
    .from("buckets")
    .insert(seededBuckets.map((b) => ({ user_id: ownerId, ...b })));
  if (bucketsError) {
    console.error("✖ Failed inserting buckets:", bucketsError.message);
    process.exit(1);
  }
  console.log(
    `• Seeded ${seededBuckets.length} buckets (Marriage starts at 18,000 EGP)`,
  );

  return ownerId;
}

async function main() {
  const { admin, url } = createGuardedAdmin();
  console.log(`Seeding ${url} …`);
  const ownerId = await seedOwner(admin);
  console.log(`✔ Seed complete for owner ${ownerId}`);
}

main().catch((err) => {
  console.error("✖ Seed script failed:", err);
  process.exit(1);
});
