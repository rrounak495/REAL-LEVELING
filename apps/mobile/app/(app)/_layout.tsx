/**
 * app/(app)/_layout.tsx — Protected App Route Group Layout
 *
 * Guards all app routes — redirects unauthenticated users to login.
 * This is the authentication wall between the public and private app.
 */
import { Redirect, Stack } from 'expo-router';
import { useAuthStore, selectIsAuthenticated } from '@store';
import { View, ActivityIndicator } from 'react-native';

export default function AppLayout() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const user = useAuthStore((s) => s.user);

  // Block navigation until auth state is known
  if (!isInitialized) {
    return (
      <View
        style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator color="#00ff00" size="large" />
      </View>
    );
  }

  // Not logged in — redirect to welcome
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  const onboardingComplete = user?.user_metadata?.['onboarding_completed'] === true;
  if (!onboardingComplete) {
    return <Redirect href="/(onboarding)/username" />;
  }

  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
