/**
 * src/components/ui/AnimatedXPBar.tsx
 *
 * A reusable animated XP bar for the dashboard and end-of-mission screens.
 */
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, radius } from '@theme';

interface AnimatedXPBarProps {
  currentXP: number;
  requiredXP: number;
  height?: number;
  barColor?: string;
  trackColor?: string;
}

export function AnimatedXPBar({
  currentXP,
  requiredXP,
  height = 12,
  barColor = colors.semantic.success,
  trackColor = 'rgba(255,255,255,0.1)',
}: AnimatedXPBarProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    // Calculate percentage (0 to 1)
    const targetProgress = requiredXP > 0 ? Math.min(Math.max(currentXP / requiredXP, 0), 1) : 0;

    // Animate smoothly to the new progress
    progress.value = withSpring(targetProgress, {
      damping: 20,
      stiffness: 90,
      mass: 1,
    });
  }, [currentXP, requiredXP, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View style={[styles.track, { height, backgroundColor: trackColor }]}>
      <Animated.View style={[styles.bar, { backgroundColor: barColor }, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: radius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: radius.full,
  },
});
