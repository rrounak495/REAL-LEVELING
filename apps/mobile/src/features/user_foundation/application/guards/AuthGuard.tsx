import React from 'react';
import { Redirect } from 'expo-router'; // Assuming Expo Router based on current tech stack
import { useUserStore } from '../store/useUserStore';

/**
 * src/features/user_foundation/application/guards/AuthGuard.tsx
 *
 * Protects routes requiring authentication. Redirects to /login if unauthenticated.
 */
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { session, isInitialized, profile } = useUserStore();

  // Wait for initial session fetch
  if (!isInitialized) {
    return null; // Or a Splash Screen component
  }

  // Not logged in -> Redirect to login
  if (!session) {
    return <Redirect href="/login" />;
  }

  // Logged in, but onboarding not finished -> Redirect to onboarding
  if (profile && profile.onboardingStatus !== 'COMPLETED') {
    return <Redirect href="/onboarding" />;
  }

  return <>{children}</>;
};
