/**
 * LIFE OS — deterministic dev reset for E2E (Phase F1).
 *
 * Deletes ALL auth users in the target project (every app table cascades
 * from auth.users via user_id on delete cascade), then re-seeds the owner.
 *
 * Same safeguards as seed.ts: SEED_CONFIRM=yes, prod refused without --prod.
 *
 * Usage:
 *   SEED_CONFIRM=yes npm run db:reset-dev
 */
import { createGuardedAdmin } from "./guards";
import { seedOwner } from "./seed";

async function main() {
  const { admin, url } = createGuardedAdmin();

  console.log(`Resetting ${url} …`);

  let page = 1;
  let deleted = 0;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) {
      console.error("✖ Failed listing users:", error.message);
      process.exit(1);
    }
    const users = data?.users ?? [];
    if (users.length === 0) break;
    for (const user of users) {
      const { error: delError } = await admin.auth.admin.deleteUser(user.id);
      if (delError) {
        console.error(`✖ Failed deleting user ${user.id}:`, delError.message);
        process.exit(1);
      }
      deleted += 1;
    }
    if (users.length < 100) break;
    page += 1;
  }

  console.log(`• Deleted ${deleted} user(s) — all rows cascaded`);

  const ownerId = await seedOwner(admin);
  console.log(`✔ Dev reset complete. Owner: ${ownerId}`);
}

main().catch((err) => {
  console.error("✖ Dev reset failed:", err);
  process.exit(1);
});
