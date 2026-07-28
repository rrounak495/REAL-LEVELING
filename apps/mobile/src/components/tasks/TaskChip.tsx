/**
 * TaskChip.tsx — Premium Selectable Chip
 *
 * Sprint 2: Bottom Sheet UI
 * Single selectable chip with animated selection state.
 * Used inside TimeChipGroup and RepeatChipGroup.
 */
import React, { memo } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { colors, fontFamily, radius } from '@theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TaskChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export const TaskChip = memo(function TaskChip({ label, isSelected, onPress }: TaskChipProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      style={[animStyle, styles.chip, isSelected && styles.chipSelected]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.93, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
    >
      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{label}</Text>
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.bg.elevated,
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.15)',
  },
  chipSelected: {
    backgroundColor: colors.purple[600],
    borderColor: colors.purple[400],
    shadowColor: colors.purple[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  chipText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 13,
    color: colors.text.muted,
    letterSpacing: 0.2,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});
