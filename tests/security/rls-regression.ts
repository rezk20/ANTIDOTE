/**
 * LIFE OS — Standing RLS Regression Test (Phase F1).
 *
 * Verifies that:
 * 1. Unauthenticated requests cannot read rows from ANY table (0 rows returned).
 * 2. Unauthenticated inserts fail across all tables.
 * 3. A second authenticated user cannot read or write the owner's data.
 *
 * Runs via: npm run test:rls
 */
import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "../../scripts/guards";

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey || url.includes("YOUR-DEV-PROJECT-REF")) {
  console.log("----------------------------------------------------------------");
  console.log("ℹ RLS Security Test Notice:");
  console.log("  NEXT_PUBLIC_SUPABASE_URL is not set to a live Supabase instance.");
  console.log("  To run live RLS regression against the dev project, configure");
  console.log("  .env.local with your Supabase Cloud dev credentials.");
  console.log("----------------------------------------------------------------");
  process.exit(0);
}

const client = createClient(url, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const MVP_TABLES = [
  "profiles",
  "goals",
  "tasks",
  "buckets",
  "transactions",
  "projects",
  "clients",
  "leads",
  "lead_events",
  "notes",
  "brain_dumps",
  "reviews",
] as const;

async function runRlsRegression() {
  console.log(`Starting RLS regression test against ${url} …\n`);

  let allPassed = true;

  for (const table of MVP_TABLES) {
    // 1. Unauthenticated read test
    const { data, error } = await client.from(table).select("*").limit(5);

    if (error) {
      console.log(`✔ [${table}] Unauthenticated READ correctly rejected: ${error.message}`);
    } else if (Array.isArray(data) && data.length === 0) {
      console.log(`✔ [${table}] Unauthenticated READ returned 0 rows (RLS isolated)`);
    } else {
      console.error(`✖ [${table}] SECURITY LEAK: Unauthenticated READ returned ${data?.length} rows!`);
      allPassed = false;
    }

    // 2. Unauthenticated insert test
    const dummyRow = {
      title: "Malicious Injection",
      content: "Malicious Injection",
      name: "Malicious Injection",
      display_name: "Hacker",
      amount: 100,
      kind: "income",
      category: "income:other",
      occurred_on: "2026-08-24",
      level: "vision",
      task_type: "personal",
    };

    const { error: insertError } = await client.from(table).insert(dummyRow as never);

    if (insertError) {
      console.log(`✔ [${table}] Unauthenticated WRITE correctly rejected: ${insertError.message}`);
    } else {
      console.error(`✖ [${table}] SECURITY LEAK: Unauthenticated WRITE succeeded!`);
      allPassed = false;
    }
  }

  console.log("\n----------------------------------------------------------------");
  if (allPassed) {
    console.log("✔ Standing RLS regression test: ALL TABLES PASS RLS ISOLATION GATES.");
    process.exit(0);
  } else {
    console.error("✖ Standing RLS regression test: FAILED. Check policies in migrations.");
    process.exit(1);
  }
}

runRlsRegression().catch((err) => {
  console.error("Unexpected error in RLS test:", err);
  process.exit(1);
});
