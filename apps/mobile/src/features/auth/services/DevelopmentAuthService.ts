import type {
  IAuthService,
  SignInCredentials,
  SignUpCredentials,
  AuthResponse,
  SessionResponse,
} from './IAuthService';
import type { Session, Subscription, User } from '@supabase/supabase-js';

/**
 * [DEVELOPMENT ONLY]
 * Generates a deterministic UUID based on the provided email string.
 * Ensures the same email always gets the same user ID locally.
 */
function generateDeterministicUUID(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash << 5) - hash + email.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  // Return a mock UUID format: xxxxxxxx-0000-0000-0000-000000000000
  return `${hex}-0000-0000-0000-000000000000`;
}

/**
 * [DEVELOPMENT ONLY]
 * Creates a mock Supabase session.
 * By default, onboarding_completed is false to force the onboarding flow.
 */
function createMockSession(email: string): Session {
  const userId = generateDeterministicUUID(email);

  const mockUser: User = {
    id: userId,
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {
      onboarding_completed: false, // Ensures we don't bypass onboarding
    },
    aud: 'authenticated',
    confirmation_sent_at: new Date().toISOString(),
    recovery_sent_at: '',
    email_change_sent_at: '',
    created_at: new Date().toISOString(),
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString(),
    email,
    phone: '',
    identities: [],
    factors: [],
  };

  return {
    access_token: 'mock-jwt-token-for-development-auth',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: mockUser,
  };
}

/**
 * [DEVELOPMENT ONLY]
 * This service bypasses Supabase entirely and mocks all authentication responses.
 * It must NOT be used in production.
 */
const globalAny = globalThis as any;

export class DevelopmentAuthService implements IAuthService {
  // We keep track of the session in memory to return in getSession()
  // Uses globalThis so it survives Metro Fast Refresh during development
  private get currentSession(): Session | null {
    return globalAny.__DEV_AUTH_SESSION || null;
  }
  private set currentSession(session: Session | null) {
    globalAny.__DEV_AUTH_SESSION = session;
  }

  private authStateCallbacks: ((event: string, session: Session | null) => void)[] = [];

  constructor() {
    console.log('[DEV AUTH] Initialized Development Authentication Mode');
  }

  async signInWithPassword(credentials: SignInCredentials): Promise<AuthResponse> {
    console.log(`[DEV AUTH] Sign In with mock credentials: ${credentials.email}`);

    // Accept ANY input
    this.currentSession = createMockSession(credentials.email || 'testhunter@real-leveling.dev');

    this.notifyListeners('SIGNED_IN', this.currentSession);
    return { data: { session: this.currentSession }, error: null };
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    console.log(`[DEV AUTH] Sign Up with mock credentials: ${credentials.email}`);

    // Accept ANY input
    this.currentSession = createMockSession(credentials.email || 'testhunter@real-leveling.dev');

    this.notifyListeners('SIGNED_IN', this.currentSession);
    return { data: { session: this.currentSession }, error: null };
  }

  async signOut(): Promise<{ error: null }> {
    console.log('[DEV AUTH] Sign Out');
    this.currentSession = null;
    this.notifyListeners('SIGNED_OUT', null);
    return { error: null };
  }

  async getSession(): Promise<SessionResponse> {
    // Return whatever is currently held in memory
    return { data: { session: this.currentSession }, error: null };
  }

  async updateUser(attributes: {
    data: any;
  }): Promise<{ data: { user: User | null }; error: null }> {
    console.log('[DEV AUTH] Update User:', attributes);
    if (this.currentSession?.user) {
      // Create deep clone of session and user to avoid read-only errors if frozen by state manager
      const newSession = { ...this.currentSession };
      newSession.user = { ...newSession.user };
      newSession.user.user_metadata = {
        ...newSession.user.user_metadata,
        ...attributes.data,
      };
      this.currentSession = newSession;
      this.notifyListeners('USER_UPDATED', this.currentSession);
    }
    return { data: { user: this.currentSession?.user || null }, error: null };
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void): {
    data: { subscription: Subscription };
  } {
    this.authStateCallbacks.push(callback);

    const subscription: Subscription = {
      id: Math.random().toString(36).substr(2, 9),
      callback: () => {},
      unsubscribe: () => {
        this.authStateCallbacks = this.authStateCallbacks.filter((cb) => cb !== callback);
      },
    };

    return { data: { subscription } };
  }

  private notifyListeners(event: string, session: Session | null) {
    this.authStateCallbacks.forEach((cb) => cb(event, session));
  }
}
