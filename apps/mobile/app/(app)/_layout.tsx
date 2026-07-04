/**
 * app/(app)/_layout.tsx — Protected App Route Group Layout
 *
 * Guards all app routes — redirects unauthenticated users to login.
 * This is the authentication wall between the public and private app.
 */
import { Redirect, Stack } from 'expo-router';
import { useAuthStore, selectIsAuthenticated } from '@store';

export default function AppLayout() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  // Block navigation until auth state is known
  if (!isInitialized) return null;

  // Not logged in — redirect to login
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
