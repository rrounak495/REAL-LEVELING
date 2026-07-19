/**
 * app/(app)/(tabs)/_layout.tsx — Premium Floating Tab Navigator
 *
 * 5 tabs: Home, Tasks, Feed, Ranks, Profile
 * Uses the custom FloatingTabBar for a premium glass navigation experience.
 */
import { Tabs } from 'expo-router';
import { FloatingTabBar } from '@/components/navigation/FloatingTabBar';
import { colors } from '@theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none',
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
        },
      }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
      <Tabs.Screen name="ranks" options={{ title: 'Ranks' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
