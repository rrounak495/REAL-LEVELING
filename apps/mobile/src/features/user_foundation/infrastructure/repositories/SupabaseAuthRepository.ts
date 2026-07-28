import { type SupabaseClient } from '@supabase/supabase-js';
import { type IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { type AuthSession } from '../../domain/models/AuthSession';

/**
 * src/features/user_foundation/infrastructure/repositories/SupabaseAuthRepository.ts
 */
export class SupabaseAuthRepository implements IAuthRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  private mapSession(session: any): AuthSession {
    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at ?? 0,
      userId: session.user.id,
    };
  }

  async signIn(email: string, password?: string): Promise<AuthSession> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password: password || '', // Assuming password is required for Supabase
    });

    if (error) throw error;
    if (!data.session) throw new Error('No session returned from Supabase');

    return this.mapSession(data.session);
  }

  async signUp(email: string, password?: string): Promise<AuthSession> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password: password || '',
    });

    if (error) throw error;
    if (!data.session)
      throw new Error('No session returned on signup. User might need to confirm email.');

    return this.mapSession(data.session);
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async refreshSession(): Promise<AuthSession | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error || !data.session) return null;
    return this.mapSession(data.session);
  }

  onSessionChange(callback: (session: AuthSession | null) => void): { unsubscribe: () => void } {
    const { data } = this.supabase.auth.onAuthStateChange((event, session) => {
      callback(session ? this.mapSession(session) : null);
    });

    return {
      unsubscribe: () => {
        data.subscription.unsubscribe();
      },
    };
  }
}
