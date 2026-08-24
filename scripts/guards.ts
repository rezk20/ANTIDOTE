/**
 * Shared guards for privileged scripts (seed / reset-dev).
 *
 * SECURITY: everything in scripts/ is the ONLY place the service-role key
 * may be used. Nothing under app/ or lib/ may import from scripts/.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Minimal .env / .env.local parser (no dependency needed). */
export function loadEnv(): void {
  const files = [".env", ".env.local"];
  for (const file of files) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    const content = readFileSync(path, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
}

export interface ScriptContext {
  admin: SupabaseClient;
  url: string;
}

/**
 * Build a service-role admin client with production safeguards:
 * - requires SEED_CONFIRM=yes
 * - refuses to run against the prod project unless --prod is passed
 */
export function createGuardedAdmin(): ScriptContext {
  loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const prodUrl = process.env.SUPABASE_PROD_URL;
  const wantsProd = process.argv.includes("--prod");

  if (!url || !serviceKey) {
    console.error(
      "✖ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
        "  Copy .env.example to .env.local and fill in the DEV project values.",
    );
    process.exit(1);
  }

  if (process.env.SEED_CONFIRM !== "yes") {
    console.error(
      "✖ Refusing to run: this script mutates the database with the service-role key.\n" +
        "  Run with SEED_CONFIRM=yes to confirm, e.g.:\n" +
        "    SEED_CONFIRM=yes npm run db:seed",
    );
    process.exit(1);
  }

  if (prodUrl && url === prodUrl && !wantsProd) {
    console.error(
      "✖ Refusing to run: NEXT_PUBLIC_SUPABASE_URL points at the PRODUCTION project.\n" +
        "  Pass --prod explicitly if you really intend to seed production.",
    );
    process.exit(1);
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return { admin, url };
}
