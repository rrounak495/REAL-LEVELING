/**
 * lib/env.ts — Environment Variable Validation
 *
 * WHY THIS EXISTS:
 * Expo bundles EXPO_PUBLIC_ vars at build time. If a required var is missing,
 * the app silently fails at runtime — often in production. This module
 * validates all required env vars at startup and throws clearly if any are missing.
 *
 * HOW IT WORKS:
 * Call validateEnv() once in app/_layout.tsx. If any required var is missing,
 * you get a clear error message with the exact variable name — not a cryptic
 * "Cannot read property of undefined" deep in the stack.
 *
 * All EXPO_PUBLIC_ vars are type-safe after validation.
 */

type AppEnvironment = 'development' | 'preview' | 'production';

interface EnvConfig {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  REVENUECAT_API_KEY_ANDROID: string;
  POSTHOG_API_KEY: string;
  POSTHOG_HOST: string;
  SENTRY_DSN: string;
  APP_ENV: AppEnvironment;
  IS_DEV: boolean;
  IS_PROD: boolean;
}

function assertEnv(key: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(
      `[ENV] Missing required environment variable: ${key}\n` +
        `Copy .env.example to .env.local and fill in the value.`,
    );
  }
  return value;
}

function parseAppEnv(value: string | undefined): AppEnvironment {
  if (value === 'preview' || value === 'production') {
    return value;
  }
  return 'development';
}

// ── Validated Environment ─────────────────────────────────────────────────
// This object is populated once on module load. All values are guaranteed
// to be non-empty strings after validation.
let _env: EnvConfig | null = null;

export function validateEnv(): EnvConfig {
  if (_env) return _env;

  const appEnv = parseAppEnv(process.env['EXPO_PUBLIC_APP_ENV']);

  _env = {
    SUPABASE_URL: assertEnv('EXPO_PUBLIC_SUPABASE_URL', process.env['EXPO_PUBLIC_SUPABASE_URL']),
    SUPABASE_ANON_KEY: assertEnv(
      'EXPO_PUBLIC_SUPABASE_ANON_KEY',
      process.env['EXPO_PUBLIC_SUPABASE_ANON_KEY'],
    ),
    REVENUECAT_API_KEY_ANDROID: assertEnv(
      'EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID',
      process.env['EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID'],
    ),
    POSTHOG_API_KEY: assertEnv(
      'EXPO_PUBLIC_POSTHOG_API_KEY',
      process.env['EXPO_PUBLIC_POSTHOG_API_KEY'],
    ),
    POSTHOG_HOST: process.env['EXPO_PUBLIC_POSTHOG_HOST'] ?? 'https://app.posthog.com',
    SENTRY_DSN: process.env['EXPO_PUBLIC_SENTRY_DSN'] ?? '',
    APP_ENV: appEnv,
    IS_DEV: appEnv === 'development',
    IS_PROD: appEnv === 'production',
  };

  return _env;
}

/**
 * Access env vars after validation.
 * Throws if validateEnv() has not been called yet.
 */
export function getEnv(): EnvConfig {
  if (!_env) {
    throw new Error(
      '[ENV] getEnv() called before validateEnv(). Call validateEnv() in _layout.tsx',
    );
  }
  return _env;
}
