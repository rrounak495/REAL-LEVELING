import { type AuthSession } from '../models/AuthSession';

/**
 * src/features/user_foundation/domain/repositories/IAuthRepository.ts
 */
export interface IAuthRepository {
  signIn(email: string, password?: string): Promise<AuthSession>;
  signUp(email: string, password?: string): Promise<AuthSession>;
  signOut(): Promise<void>;
  refreshSession(): Promise<AuthSession | null>;

  /** Subscribes to backend auth events (e.g. Supabase onAuthStateChange) */
  onSessionChange(callback: (session: AuthSession | null) => void): { unsubscribe: () => void };
}
