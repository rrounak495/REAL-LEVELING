import { create } from 'zustand';
import { type AuthSession } from '../../domain/models/AuthSession';
import { type UserProfile } from '../../domain/models/UserProfile';

/**
 * src/features/user_foundation/application/store/useUserStore.ts
 *
 * Lightweight Zustand store specifically for the Current User Provider
 * to remain React-independent at the core while integrating seamlessly.
 */
interface UserState {
  session: AuthSession | null;
  profile: UserProfile | null;
  isInitialized: boolean;

  setSession: (session: AuthSession | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setInitialized: (initialized: boolean) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  session: null,
  profile: null,
  isInitialized: false,

  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  clear: () => set({ session: null, profile: null, isInitialized: true }),
}));
