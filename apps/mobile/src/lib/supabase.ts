/**
 * lib/supabase.ts — Supabase Client
 *
 * WHY A SINGLETON CLIENT:
 * A single Supabase instance is shared across the entire app.
 * Multiple instances would cause duplicate auth listeners, connection pool
 * exhaustion, and inconsistent session state. Never instantiate
 * createClient() outside this file.
 *
 * TYPED WITH DATABASE SCHEMA:
 * The `Database` generic eliminates runtime type errors on all
 * Supabase queries. Types are auto-generated via `supabase gen types`.
 * See: docs/getting-started.md — "Generating Supabase Types"
 *
 * AUTH SESSION PERSISTENCE:
 * Session is stored in MMKV (not AsyncStorage) for performance.
 * The session persists across app restarts — users stay logged in.
 */
import { createClient } from '@supabase/supabase-js';
import { mmkvSupabaseStorage } from './storage';
import { validateEnv } from './env';
import type { Database } from '../types/database.types';

const { SUPABASE_URL, SUPABASE_ANON_KEY } = validateEnv();

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // MMKV-backed storage — synchronous, 30x faster than AsyncStorage
    storage: mmkvSupabaseStorage,
    // Auto-refresh JWT tokens before they expire
    autoRefreshToken: true,
    // Keep session alive across app restarts
    persistSession: true,
    // Disable URL-based session detection (not applicable in React Native)
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'x-app-version': '0.1.0',
    },
  },
});

/**
 * Helper: Get the current user's ID.
 * Returns null if not authenticated. Never throws.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}
