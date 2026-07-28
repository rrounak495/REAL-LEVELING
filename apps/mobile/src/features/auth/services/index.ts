import { DevelopmentAuthService } from './DevelopmentAuthService';
import { SupabaseAuthService } from './SupabaseAuthService';
import type { IAuthService } from './IAuthService';

/**
 * Service Factory for Authentication
 *
 * Automatically routes to DevelopmentAuthService during local development,
 * completely bypassing Supabase network calls and validations.
 *
 * Routes to SupabaseAuthService in production.
 */
export const authService: IAuthService = __DEV__
  ? new DevelopmentAuthService()
  : new SupabaseAuthService();
