import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { type Rarity } from '@/types/inventory.types';
import { colors } from '@/theme/colors';
// import { BlurView } from 'expo-blur'; // Temporarily removed to prevent native crash
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface RarityBadgeProps {
  rarity: Rarity;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function RarityBadge({ rarity, size = 'md', animated = true }: RarityBadgeProps) {
  const getColors = () => {
    switch (rarity) {
      case 'Legendary':
        return {
          bg: 'rgba(200, 0, 255, 0.2)', // Neon Purple
          border: colors.purple.neon,
          text: colors.purple.neon,
          glow: colors.purple.neon,
        };
      case 'Epic':
        return {
          bg: 'rgba(139, 60, 247, 0.2)',
          border: colors.purple[400],
          text: colors.purple[300],
          glow: colors.purple[500],
        };
      case 'Rare':
        return {
          bg: 'rgba(59, 91, 246, 0.2)',
          border: colors.blue.neon,
          text: colors.blue.neon,
          glow: colors.blue.neon,
        };
      case 'Common':
      default:
        return {
          bg: colors.bg.elevated,
          border: colors.text.muted,
          text: colors.text.secondary,
          glow: 'transparent',
        };
    }
  };

  const theme = getColors();

  // Simple pulse animation for legendary/epic if animated is true
  const pulse = useSharedValue(1);
  React.useEffect(() => {
    if (animated && (rarity === 'Legendary' || rarity === 'Epic')) {
      pulse.value = withRepeat(
        withSequence(withTiming(1.2, { duration: 1500 }), withTiming(1, { duration: 1500 })),
        -1,
        true,
      );
    }
  }, [animated, rarity]);

  const animatedStyle = useAnimatedStyle(() => ({
    shadowColor: theme.glow,
    shadowOpacity: rarity === 'Legendary' ? 0.8 : 0.4,
    shadowRadius: rarity === 'Legendary' ? 10 * pulse.value : 5,
  }));

  const sizeStyles = {
    sm: { paddingHorizontal: 6, paddingVertical: 2, fontSize: 10 },
    md: { paddingHorizontal: 10, paddingVertical: 4, fontSize: 12 },
    lg: { paddingHorizontal: 14, paddingVertical: 6, fontSize: 14 },
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.bg,
          borderColor: theme.border,
          ...sizeStyles[size],
        },
        animatedStyle,
      ]}
    >
      <Text style={[styles.text, { color: theme.text, fontSize: sizeStyles[size].fontSize }]}>
        {rarity}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  text: {
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
