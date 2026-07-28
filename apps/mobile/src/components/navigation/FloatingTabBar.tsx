/**
 * src/components/navigation/FloatingTabBar.tsx
 *
 * Premium floating glass tab bar for the Solo Leveling Fitness RPG.
 * Rendered as an absolute-positioned capsule at the bottom of the screen.
 *
 * Compatible with expo-router's Tabs `tabBar` prop.
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import { colors, fontFamily } from '@theme';

const TAB_CONFIG: Record<string, { icon: string; label: string }> = {
  index: { icon: '⚔️', label: 'Home' },
  tasks: { icon: '📋', label: 'Tasks' },
  feed: { icon: '📰', label: 'Feed' },
  ranks: { icon: '🏆', label: 'Ranks' },
  profile: { icon: '👤', label: 'Profile' },
};

function TabItem({
  routeName,
  routeKey,
  isFocused,
  onPress,
  onLongPress,
}: {
  routeName: string;
  routeKey: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const config = TAB_CONFIG[routeName] || { icon: '?', label: routeName };
  const scale = useSharedValue(1);
  const dotOpacity = useSharedValue(isFocused ? 1 : 0);
  const dotScale = useSharedValue(isFocused ? 1 : 0);

  React.useEffect(() => {
    dotOpacity.value = withSpring(isFocused ? 1 : 0, { damping: 15, stiffness: 200 });
    dotScale.value = withSpring(isFocused ? 1 : 0, { damping: 12, stiffness: 180 });
  }, [isFocused, dotOpacity, dotScale]);

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dotAnimStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
    transform: [{ scale: dotScale.value }],
  }));

  const handlePress = () => {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSequence(withSpring(0.85, { damping: 10 }), withSpring(1, { damping: 8 }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={styles.tabItem}
      onLongPress={onLongPress}
      onPress={handlePress}
    >
      <Animated.View style={iconAnimStyle}>
        <Text style={styles.tabIcon}>{config.icon}</Text>
      </Animated.View>
      <Text
        style={[styles.tabLabel, { color: isFocused ? colors.purple[400] : colors.text.muted }]}
      >
        {config.label}
      </Text>
      <Animated.View style={[styles.activeDot, dotAnimStyle]} />
    </Pressable>
  );
}

/**
 * The props are typed inline to avoid importing from @react-navigation/bottom-tabs
 * which may not be installed as a direct dependency.
 * expo-router passes the same shape when using `tabBar={(props) => ...}`.
 */
export function FloatingTabBar({ state, navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabItem
              key={route.key}
              isFocused={isFocused}
              routeKey={route.key}
              routeName={route.name}
              onLongPress={onLongPress}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'android' ? 12 : 24,
    paddingHorizontal: 16,
    pointerEvents: 'box-none',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(14, 14, 28, 0.92)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.3)',
    height: 68,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.purple[500],
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 2,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  tabLabel: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.purple.neon,
    marginTop: 2,
    shadowColor: colors.purple.neon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
});
