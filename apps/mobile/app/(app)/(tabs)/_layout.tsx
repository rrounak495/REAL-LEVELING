/**
 * app/(app)/(tabs)/_layout.tsx — Bottom Tab Navigator
 *
 * Defines the 5 main tabs. Tab order is deliberate:
 * Home → Quests → [Center/Profile] → Friends → Shop
 *
 * Tab bar is styled with our void/glass design language.
 * Icons: Sprint 3 will replace text labels with Phosphor icons.
 */
import { Tabs } from 'expo-router';
import { colors } from '@theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg.elevated,
          borderTopColor: 'rgba(139, 60, 247, 0.20)',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.purple[400],
        tabBarInactiveTintColor: colors.text.muted,
        tabBarLabelStyle: {
          fontFamily: 'Exo2_600SemiBold',
          fontSize: 11,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="quests" options={{ title: 'Quests' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="friends" options={{ title: 'Friends' }} />
      <Tabs.Screen name="shop" options={{ title: 'Shop' }} />
    </Tabs>
  );
}
