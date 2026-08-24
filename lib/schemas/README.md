# JSONB Governance Guidelines

Every `jsonb` column in the LIFE OS database schema (`profiles.settings`, `reviews.answers`, `reviews.scores`, `projects.meta`, `week_plans.allocation`, `routines.items`, `notifications.meta`) adheres to the following rules (§7.8):

1. **Zod Schema Single Source of Truth**:
   - Each JSONB field must have a corresponding Zod schema in `lib/schemas/` with sensible default values.
   - All server reads parse database JSON through the Zod schema with `.strip()` to discard unknown/deprecated keys.

2. **Partial Updates**:
   - Updates must use `.partial()` schemas or explicit merge operations to ensure existing fields are never accidentally overwritten or wiped.

3. **Schema Versioning**:
   - Whenever the shape of a JSONB column changes, document the version bump in this file and maintain backwards compatibility with default fallbacks in the Zod parser.

### Registered JSONB Columns

| Table | Column | Schema File | Current Version | Description |
|---|---|---|---|---|
| `profiles` | `settings` | `lib/schemas/settings.ts` | v1.0 | User work hours, income targets, sales targets, marriage targets, quiet hours |
| `reviews` | `answers` | `lib/schemas/reviews.ts` | v1.0 | Answers to reflection questions per review cadence |
| `reviews` | `scores` | `lib/schemas/reviews.ts` | v1.0 | Multi-dimensional scoring for reviews |
| `projects` | `meta` | `lib/schemas/projects.ts` | v1.0 | Experimental product hypothesis, risk scores, kill criteria |
| `week_plans` | `allocation` | `lib/schemas/week-plan.ts` | v1.0 | Target vs actual weekly time allocation |
| `routines` | `items` | `lib/schemas/routines.ts` | v1.0 | Ordered list of habit/routine checklist items |
