/**
 * app/(app)/(tabs)/index.tsx — Home / Dashboard
 * Sprint 2: Navigation shell. Full dashboard built in Sprint 4.
 */
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 px-screen-h pt-6">
        <Text className="font-rajdhani text-display-lg text-text-primary">DASHBOARD</Text>
        <Text className="font-inter text-body-md text-text-secondary mt-1">Your stats await.</Text>
      </View>
    </SafeAreaView>
  );
}
