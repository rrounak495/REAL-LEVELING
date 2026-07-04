/**
 * store/auth.store.ts — Authentication State
 *
 * WHY ZUSTAND FOR AUTH STATE:
 * Auth state (session, user) is read by almost every component.
 * Zustand's selector-based subscriptions ensure components only
 * re-render when their specific slice changes — not on every auth event.
 *
 * PERSISTENCE STRATEGY:
 * Only `session` and `user` are persisted to MMKV.
 * `isLoading` and `isInitialized` are always derived fresh on app start.
 * This prevents stale loading states from persisting across restarts.
 *
 * USAGE:
 *   // Read a single value (minimal re-renders):
 *   const session = useAuthStore((s) => s.session);
 *
 *   // Read multiple values:
 *   const { session, user } = useAuthStore();
 *
 *   // Call an action:
 *   const signOut = useAuthStore((s) => s.signOut);
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Session, User } from '@supabase/supabase-js';
import { mmkvZustandStorage } from '@lib/storage';

// ── State Shape ───────────────────────────────────────────────────────────
interface AuthState {
  /** The current Supabase session. Null if unauthenticated. */
  session: Session | null;
  /** The current authenticated user. Null if unauthenticated. */
  user: User | null;
  /**
   * True during async auth operations (sign-in, sign-up, refresh).
   * NOT persisted — always starts false on app launch.
   */
  isLoading: boolean;
  /**
   * True once the initial session check (getSession()) completes.
   * Used to block routing until we know if the user is logged in.
   * NOT persisted — always starts false on app launch.
   */
  isInitialized: boolean;
}

// ── Actions Shape ─────────────────────────────────────────────────────────
interface AuthActions {
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  signOut: () => void;
}

type AuthStore = AuthState & AuthActions;

// ── Store ─────────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set) => ({
      // Initial state
      session: null,
      user: null,
      isLoading: false,
      isInitialized: false,

      // ── Actions ─────────────────────────────────────────────────────
      setSession: (session) => {
        set((state) => {
          state.session = session;
          state.user = session?.user ?? null;
        });
      },

      setLoading: (isLoading) => {
        set((state) => {
          state.isLoading = isLoading;
        });
      },

      setInitialized: (isInitialized) => {
        set((state) => {
          state.isInitialized = isInitialized;
        });
      },

      signOut: () => {
        set((state) => {
          state.session = null;
          state.user = null;
          state.isLoading = false;
        });
      },
    })),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => mmkvZustandStorage),
      // Only persist the session — not transient loading/init state
      partialize: (state) => ({
        session: state.session,
        user: state.user,
      }),
    },
  ),
);

// ── Selectors ─────────────────────────────────────────────────────────────
// Pre-built selectors for common access patterns.
// Using selectors prevents object creation on every render.
export const selectIsAuthenticated = (state: AuthStore): boolean => state.session !== null;
export const selectUserId = (state: AuthStore): string | undefined => state.user?.id;
export const selectUserEmail = (state: AuthStore): string | undefined => state.user?.email;
