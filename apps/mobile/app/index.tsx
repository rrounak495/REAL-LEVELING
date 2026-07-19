import { Redirect } from 'expo-router';
import { useAuthStore } from '@store';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  console.log('[DEBUG] Index rendering');
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const session = useAuthStore((s) => s.session);
  const user = useAuthStore((s) => s.user);

  if (!isInitialized) {
    return (
      <View
        style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator color="#00ff00" size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/welcome" />;
  }

  const onboardingComplete = user?.user_metadata?.['onboarding_completed'] === true;

  if (!onboardingComplete) {
    return <Redirect href="/(onboarding)/username" />;
  }

  return <Redirect href="/(app)/(tabs)" />;
}
