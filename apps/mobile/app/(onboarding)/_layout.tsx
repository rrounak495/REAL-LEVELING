/**
 * app/(onboarding)/_layout.tsx — Onboarding Guard
 *
 * Guards the onboarding flow:
 * - Unauthenticated users → redirect to welcome
 * - Users who have already completed onboarding → redirect to main app
 * - Users in onboarding → show the flow
 *
 * onboarding_completed_at in the profile determines completion.
 * We read this from the auth store's user metadata (set after upsert).
 */
import { Redirect, Stack } from 'expo-router';
import { useAuthStore, selectIsAuthenticated } from '@store';

export default function OnboardingLayout() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const user = useAuthStore((s) => s.user);

  // Wait for auth to initialize
  if (!isInitialized) return null;

  // Not logged in — send back to auth
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // If user metadata indicates onboarding was already completed, skip to app
  // user_metadata.onboarding_completed is set after successful onboarding submission
  const onboardingComplete = user?.user_metadata?.['onboarding_completed'] === true;
  if (onboardingComplete) {
    return <Redirect href="/(app)/(tabs)/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="username" />
      <Stack.Screen name="avatar" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="experience" />
      <Stack.Screen name="logistics" />
      <Stack.Screen name="skills" />
      <Stack.Screen name="permissions" />
    </Stack>
  );
}
