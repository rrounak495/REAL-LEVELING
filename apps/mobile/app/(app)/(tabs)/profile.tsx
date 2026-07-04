/**
 * app/(app)/(tabs)/profile.tsx — Player Profile
 * Sprint 2: Navigation shell. Profile + avatar built in Sprint 4.
 */
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 px-screen-h pt-6">
        <Text className="font-rajdhani text-display-lg text-text-primary">PROFILE</Text>
        <Text className="font-inter text-body-md text-text-secondary mt-1">Your legend.</Text>
      </View>
    </SafeAreaView>
  );
}
