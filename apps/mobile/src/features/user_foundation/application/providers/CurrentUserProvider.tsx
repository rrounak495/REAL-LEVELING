import React, { createContext, useContext, useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';
import { type IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { type IUserProfileRepository } from '../../domain/repositories/IUserProfileRepository';

/**
 * src/features/user_foundation/application/providers/CurrentUserProvider.tsx
 */
interface CurrentUserContextValue {
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export const CurrentUserProvider = ({
  children,
  authRepo,
  profileRepo,
}: {
  children: React.ReactNode;
  authRepo: IAuthRepository;
  profileRepo: IUserProfileRepository;
}) => {
  const { setSession, setProfile, setInitialized, session, clear } = useUserStore();

  useEffect(() => {
    // 1. Initial Fetch
    const init = async () => {
      try {
        const currentSession = await authRepo.refreshSession();
        setSession(currentSession);

        if (currentSession) {
          const profile = await profileRepo.getProfile(currentSession.userId);
          setProfile(profile);
        }
      } catch (err) {
        console.error('Auth initialization failed', err);
      } finally {
        setInitialized(true);
      }
    };

    init();

    // 2. Subscribe to auth changes
    const { unsubscribe } = authRepo.onSessionChange(async (newSession) => {
      setSession(newSession);
      if (newSession) {
        const profile = await profileRepo.getProfile(newSession.userId);
        setProfile(profile);
      } else {
        clear();
      }
    });

    return () => unsubscribe();
  }, [authRepo, profileRepo]);

  const signOut = async () => {
    await authRepo.signOut();
    clear();
  };

  const refreshProfile = async () => {
    if (session?.userId) {
      const profile = await profileRepo.getProfile(session.userId);
      setProfile(profile);
    }
  };

  return (
    <CurrentUserContext.Provider value={{ signOut, refreshProfile }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUserContext = () => {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) throw new Error('useCurrentUserContext must be used within CurrentUserProvider');
  return ctx;
};
