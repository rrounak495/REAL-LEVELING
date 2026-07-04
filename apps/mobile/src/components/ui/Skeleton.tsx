/**
 * src/components/ui/Skeleton.tsx
 *
 * A reusable shimmering glassmorphism skeleton loader for async states.
 * Uses Reanimated to pulse opacity back and forth, giving a "breathing" effect.
 */
import { useEffect } from 'react';
import { StyleSheet, type ViewStyle, type DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { radius, motionDuration } from '@theme';

interface SkeletonProps {
  style?: ViewStyle;
  variant?: 'rectangular' | 'circular' | 'rounded';
  width?: DimensionValue;
  height?: DimensionValue;
}

export function Skeleton({
  style,
  variant = 'rounded',
  width = '100%',
  height = 20,
}: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: motionDuration.slow }),
        withTiming(0.3, { duration: motionDuration.slow }),
      ),
      -1, // infinite loop
      true, // reverse direction
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const borderRadius = variant === 'circular' ? 9999 : variant === 'rounded' ? radius.md : 0;

  return (
    <Animated.View
      style={[styles.skeleton, { width, height, borderRadius }, animatedStyle, style]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: 'rgba(139, 60, 247, 0.2)', // Subdued neon purple
    borderColor: 'rgba(139, 60, 247, 0.1)',
    borderWidth: 1,
  },
});
