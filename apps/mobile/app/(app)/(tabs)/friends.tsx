/**
 * app/(app)/(tabs)/friends.tsx — Friends & Leaderboard
 * Sprint 2: Navigation shell. Friends system built in Sprint 5.
 */
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FriendsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 px-screen-h pt-6">
        <Text className="font-rajdhani text-display-lg text-text-primary">ALLIES</Text>
        <Text className="font-inter text-body-md text-text-secondary mt-1">Your party.</Text>
      </View>
    </SafeAreaView>
  );
}
