import { SupabaseAuthService } from './SupabaseAuthService';
import type { IAuthService } from './IAuthService';

/**
 * Service Factory for Authentication
 *
 * Routes to SupabaseAuthService.
 */
export const authService: IAuthService = new SupabaseAuthService();
