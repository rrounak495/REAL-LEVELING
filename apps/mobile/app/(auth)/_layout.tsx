/**
 * app/(auth)/_layout.tsx — Auth Route Group Layout
 *
 * Guards auth screens:
 * - Shows welcome.tsx as the default screen
 * - Redirects authenticated users who have completed onboarding to (app)
 * - Redirects authenticated users who have NOT completed onboarding to (onboarding)
 */
import { Redirect, Stack } from 'expo-router';
import { useAuthStore, selectIsAuthenticated } from '@store';

export default function AuthLayout() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  // Wait for session check to complete — splash screen is still showing
  if (!isInitialized) return null;

  // Authenticated users should not see auth screens
  if (isAuthenticated) {
    // The onboarding guard in (onboarding)/_layout.tsx handles whether to show
    // onboarding or the main app. Always redirect to onboarding entry point;
    // it will self-redirect to (app) if onboarding is already complete.
    return <Redirect href="/(onboarding)/username" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="register" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="forgot-password" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
