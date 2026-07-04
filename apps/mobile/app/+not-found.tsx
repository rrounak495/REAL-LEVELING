/**
 * app/+not-found.tsx — 404 Screen
 *
 * Shown when a route doesn't exist.
 * Styled to match the void aesthetic — even error states feel premium.
 */
import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '404', headerShown: false }} />
      <SafeAreaView className="flex-1 bg-bg-void">
        <View className="flex-1 items-center justify-center px-screen-h gap-4">
          <Text className="font-jp text-[64px] text-purple-500">？</Text>
          <Text className="font-rajdhani text-display-lg text-text-primary text-center">
            UNKNOWN TERRITORY
          </Text>
          <Text className="font-inter text-body-md text-text-secondary text-center">
            This route does not exist in your quest log.
          </Text>
          <Link href="/(app)/(tabs)/">
            <Text className="font-exo-2 text-heading-sm text-purple-400 mt-4">
              ← Return to Base
            </Text>
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}
