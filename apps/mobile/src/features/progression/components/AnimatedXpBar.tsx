/**
 * src/features/progression/components/AnimatedXpBar.tsx
 *
 * A reusable XP progress bar with smooth Reanimated transitions.
 * Calculates its internal progress using the LevelEngine.
 */
import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, fontFamily } from '@theme';
import { LevelEngine } from '../engines/LevelEngine';

interface AnimatedXpBarProps {
  totalXp: number;
  level: number;
  showLabels?: boolean;
}

export function AnimatedXpBar({ totalXp, level, showLabels = true }: AnimatedXpBarProps) {
  // We compute the percentage 0.0 to 1.0
  const progressPercent = LevelEngine.calculateProgressPercentage(totalXp, level);
  const xpNeeded = LevelEngine.calculateXpForNextLevel(level);
  const currentXpInLevel = totalXp - LevelEngine.calculateTotalXpRequiredForLevel(level);

  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    animatedWidth.value = withSpring(progressPercent, {
      damping: 20,
      stiffness: 90,
      mass: 1,
    });
  }, [progressPercent, animatedWidth]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${Math.max(0, Math.min(100, animatedWidth.value * 100))}%`,
  }));

  return (
    <View style={styles.container}>
      {showLabels && (
        <View style={styles.header}>
          <Text style={styles.label}>XP</Text>
          <Text style={styles.value}>
            {Math.floor(currentXpInLevel)} / {xpNeeded}
          </Text>
        </View>
      )}
      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
        <View pointerEvents="none" style={styles.glow} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 16,
    color: colors.purple[300],
    letterSpacing: 1,
  },
  value: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  track: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.purple[500],
    borderRadius: 4,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.purple[400],
    opacity: 0.3,
  },
});
