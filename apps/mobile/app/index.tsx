import { Redirect } from 'expo-router';
import { useAuthStore } from '@store';

export default function Index() {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const session = useAuthStore((s) => s.session);

  if (!isInitialized) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // TODO: Add onboarding check here when implemented
  return <Redirect href="/(app)/(tabs)" />;
}
