import type { Session, AuthError, Subscription, User } from '@supabase/supabase-js';

export interface SignInCredentials {
  email: string;
  password?: string;
}

export interface SignUpCredentials {
  email: string;
  password?: string;
}

export interface AuthResponse {
  data: {
    session: Session | null;
  };
  error: AuthError | null;
}

export interface SessionResponse {
  data: {
    session: Session | null;
  };
  error: AuthError | null;
}

export interface IAuthService {
  /** Sign in with email and password */
  signInWithPassword(credentials: SignInCredentials): Promise<AuthResponse>;
  
  /** Sign up a new user */
  signUp(credentials: SignUpCredentials): Promise<AuthResponse>;
  
  /** Sign out the current user */
  signOut(): Promise<{ error: AuthError | null }>;
  
  /** Get the current session */
  getSession(): Promise<SessionResponse>;
  
  /** Update the current user */
  updateUser(attributes: { data: any }): Promise<{ data: { user: User | null }, error: AuthError | null }>;

  /** Listen for auth state changes */
  onAuthStateChange(
    callback: (event: string, session: Session | null) => void
  ): { data: { subscription: Subscription } };
}
