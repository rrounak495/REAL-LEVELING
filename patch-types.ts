/**
 * patch-types.ts
 *
 * Idempotent post-processor for the Supabase-generated database.types.ts.
 * Safe to run multiple times — checks for existing patches before inserting.
 *
 * Adds columns that exist in the DB but are not yet reflected in the local
 * Supabase snapshot (e.g. columns added by recent migrations):
 *   profiles: available_daily_time, current_weight_kg, fitness_experience,
 *             goal_weight_kg, training_location
 *
 * Also adds manually-maintained tables:
 *   first_use_guides (graphql_public schema)
 */
import * as fs from 'fs';
import * as path from 'path';

const typesPath = path.join(
  process.cwd(),
  'apps',
  'mobile',
  'src',
  'types',
  'database.types.ts',
);

let content = fs.readFileSync(typesPath, 'utf8');

// ── Helper ────────────────────────────────────────────────────────────────────
/** Insert `insertion` before the first occurrence of `anchor` if the
 *  `insertion` string is not already present anywhere in the file. */
function insertBefore(anchor: string, insertion: string): void {
  if (content.includes(insertion.trim())) return; // already patched
  content = content.replace(anchor, insertion + anchor);
}

// ── profiles Row ─────────────────────────────────────────────────────────────
// The generated Row block typically looks like:
//   avatar_url: string | null
//   bio: string | null
//   country: string | null
//   created_at: string
//   display_name: string | null
//   fitness_goal: string
//   id: string
//   timezone: string | null
//   updated_at: string

// Patch 1: available_daily_time before avatar_url (Row)
insertBefore(
  '          avatar_url: string | null\n          bio: string | null',
  '          available_daily_time: number\n',
);

// Patch 2: current_weight_kg after country (Row)
insertBefore(
  '          created_at: string\n          display_name: string | null',
  '          current_weight_kg: number | null\n',
);

// Patch 3: fitness_experience, goal_weight_kg before/after fitness_goal (Row)
insertBefore(
  '          fitness_goal: string\n          id: string',
  '          fitness_experience: string\n          goal_weight_kg: number | null\n',
);

// Patch 4: training_location before updated_at (Row)
insertBefore(
  '          timezone: string | null\n          updated_at: string',
  '          training_location: string\n',
);

// ── profiles Insert ───────────────────────────────────────────────────────────
insertBefore(
  '          avatar_url?: string | null\n          bio?: string | null',
  '          available_daily_time?: number\n',
);

insertBefore(
  '          created_at?: string\n          display_name?: string | null',
  '          current_weight_kg?: number | null\n',
);

insertBefore(
  '          fitness_goal?: string\n          id: string',
  '          fitness_experience?: string\n          goal_weight_kg?: number | null\n',
);

insertBefore(
  '          timezone?: string | null\n          updated_at?: string',
  '          training_location?: string\n',
);

// ── profiles Update ───────────────────────────────────────────────────────────
// Update differs: id is optional (id?: string)
insertBefore(
  '          fitness_goal?: string\n          id?: string',
  '          fitness_experience?: string\n          goal_weight_kg?: number | null\n',
);

// ── first_use_guides table (graphql_public) ───────────────────────────────────
const firstUseGuidesBlock = `      first_use_guides: {
        Row: {
          completed_at: string
          guide_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          guide_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          guide_id?: string
          user_id?: string
        }
        Relationships: []
      }
`;

// Only inject inside graphql_public.Tables if not already there
if (!content.includes('first_use_guides')) {
  // Target the graphql_public Tables block's opening brace specifically
  content = content.replace(
    /graphql_public: \{\s*\n\s*Tables: \{\s*\n\s*\[_ in never\]: never/,
    `graphql_public: {\n    Tables: {\n${firstUseGuidesBlock}      [_ in never]: never`,
  );
}

// ── Write back ────────────────────────────────────────────────────────────────
// Remove BOM if Out-File added one (PowerShell UTF-8 writes a BOM)
if (content.charCodeAt(0) === 0xfeff) {
  content = content.slice(1);
}

fs.writeFileSync(typesPath, content, 'utf8');
console.log('Database types patched successfully.');
