import { supabase } from '@lib/supabase';
import type {
  IAuthService,
  SignInCredentials,
  SignUpCredentials,
  AuthResponse,
  SessionResponse,
} from './IAuthService';
import type { Session, Subscription, User, AuthError } from '@supabase/supabase-js';

export class SupabaseAuthService implements IAuthService {
  async signInWithPassword(credentials: SignInCredentials): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password || '',
    });
    return { data: { session: data.session }, error };
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password || '',
    });
    return { data: { session: data.session }, error };
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async getSession(): Promise<SessionResponse> {
    const { data, error } = await supabase.auth.getSession();
    return { data: { session: data.session }, error };
  }

  async updateUser(attributes: {
    data: any;
  }): Promise<{ data: { user: User | null }; error: AuthError | null }> {
    const { data, error } = await supabase.auth.updateUser(attributes);
    return { data: { user: data.user }, error: error as AuthError | null };
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void): {
    data: { subscription: Subscription };
  } {
    const { data } = supabase.auth.onAuthStateChange(callback);
    return { data };
  }
}
