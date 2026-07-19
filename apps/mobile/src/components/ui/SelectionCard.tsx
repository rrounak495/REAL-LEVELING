/**
 * src/components/ui/SelectionCard.tsx
 *
 * Glassmorphism selection card for goal/skill selection screens.
 * Press to toggle selected state with spring scale + glow animation.
 */
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { colors, fontFamily, motionDuration, radius, springConfigs } from '@theme';

interface SelectionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  isSelected: boolean;
  onPress: () => void;
  isDisabled?: boolean;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SelectionCard({
  title,
  description,
  icon,
  isSelected,
  onPress,
  isDisabled = false,
  testID,
}: SelectionCardProps) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(isSelected ? 1 : 0);

  const handlePress = () => {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSequence(
      withSpring(0.95, springConfigs.stiff),
      withSpring(1, springConfigs.elastic),
    );
    // eslint-disable-next-line react-hooks/immutability
    glowOpacity.value = withTiming(isSelected ? 0 : 1, { duration: motionDuration.quick });

    if (!isDisabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected, disabled: isDisabled }}
      disabled={isDisabled}
      style={[
        animatedStyle,
        styles.card,
        isSelected ? styles.selectedCard : styles.defaultCard,
        isDisabled && !isSelected && styles.disabledCard,
      ]}
      testID={testID}
      onPress={handlePress}
    >
      {/* Selected indicator */}
      {isSelected && (
        <View style={styles.checkBadge}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      )}

      <View style={styles.row}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <View style={styles.textContainer}>
          <Text style={[styles.title, isSelected && styles.selectedTitle]}>{title}</Text>
          {description && (
            <Text numberOfLines={2} style={styles.description}>
              {description}
            </Text>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  defaultCard: {
    backgroundColor: colors.bg.surface,
    borderColor: 'rgba(139, 60, 247, 0.15)',
  },
  selectedCard: {
    backgroundColor: 'rgba(107, 47, 204, 0.2)',
    borderColor: colors.purple[400],
  },
  disabledCard: {
    opacity: 0.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.bg.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.text.secondary,
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 16,
    marginBottom: 2,
  },
  selectedTitle: {
    color: colors.purple[300],
  },
  description: {
    color: colors.text.muted,
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  checkBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: colors.purple[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: colors.text.primary,
    fontSize: 11,
    fontFamily: fontFamily.exo2.bold,
  },
});
